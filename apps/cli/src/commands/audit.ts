/** `audit` — the standing sweep. One command over the slow failure modes
 * the delivery gate never sees: status claims contradicting verdicts,
 * ledgers past their published bounds, bloated comment blocks. Five stable
 * check ids append to the checklist ledger (`04-govern/01-monitor/
 * checklist.md`, planted on first run) and one tracker row records the
 * run. Exit law: 0 all checks pass (warnings inform, never fail) · 1 any
 * error-tier finding or a failed rotation verification · 2 usage · 3
 * record fatal. `--rotate` moves the oldest tracker/delivery-log rows to
 * archive files byte-identical under the cycle-log archive law — archived,
 * never deleted — leaving a tombstone row; trace scans archives, so
 * retired rows keep their coverage. */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { checkPass, frontmatterPass, namingPass, structurePass } from "../passes/index.ts";
import { TRACKER_REL, loadRecord, RecordFatal, type RecordAst } from "../record/load.ts";
import { DELIVERY_LOG_REL, appendTracker } from "../record/record-write.ts";
import { CHECKLIST_TEMPLATE } from "../bundled/index.ts";
import { appendText, isDir, readText, today, walkFiles, writeText } from "../fsx.ts";
import { envelope } from "../emit/json.ts";

const CHECKLIST_REL = "04-govern/01-monitor/checklist.md";
const MONITOR_DIR = "04-govern/01-monitor";
const BOUNDS: Array<[string, number]> = [
  [TRACKER_REL, 600 * 1024],
  [DELIVERY_LOG_REL, 200 * 1024],
];
const GRILL_BOUND = 100 * 1024;
const COMMENT_LIMIT = 400;
const ROTATE_AT_ROWS = 500;
const ROTATE_KEEP_ROWS = 200;

interface Finding {
  tier: "error" | "warn";
  detail: string;
}

interface CheckResult {
  id: string;
  name: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

const err = (detail: string): Finding => ({ tier: "error", detail });
const warn = (detail: string): Finding => ({ tier: "warn", detail });

/** The sweep calls the same passes lint and check use — one grammar, two
 * front doors, no drift. */
function lintFindings(rec: RecordAst): Finding[] {
  return [...structurePass(rec), ...frontmatterPass(rec), ...namingPass(rec)]
    .filter((d) => d.severity === "error")
    .map((d) => err(d.message));
}

function checkFindings(rec: RecordAst): Finding[] {
  return checkPass(rec)
    .filter((d) => d.severity === "error")
    .map((d) => err(d.message));
}

/** GOV-003 — status verdict coherence: a delivered unit's latest grill
 * verdict must be pass. A fail after delivery, or no verdict at all, is
 * the record claiming more than its evidence holds. */
function svcFindings(rec: RecordAst): Finding[] {
  const out: Finding[] = [];
  for (const unit of rec.units) {
    const raw = readText(join(rec.root, unit.dir, "spec.md")) ?? "";
    if (!/^status:\s*delivered\s*$/m.test(raw)) continue;
    const grillRel = unit.markers.grill;
    if (grillRel === null) {
      out.push(err(`unit '${unit.name}' is delivered but has no grill record — a delivery without a verdict is a claim without evidence`));
      continue;
    }
    const grill = readText(join(rec.root, grillRel)) ?? "";
    const verdicts = [...grill.matchAll(/^verdict:\s*(\w+)\s*$/gm)].map((m) => m[1]);
    const latest = verdicts[verdicts.length - 1];
    if (latest === undefined) out.push(err(`unit '${unit.name}' is delivered but its grill record holds no verdict`));
    else if (latest !== "pass") out.push(err(`unit '${unit.name}' is delivered but its latest grill verdict is '${latest}' — status contradicts evidence`));
  }
  return out;
}

/** GOV-004 — bounded size: ledgers stay under the bounds EL-29 publishes
 * (tracker ~600KB, grill ~100KB; delivery-log declared here at 200KB).
 * Warn-tier: the bound names the split point, --rotate does the split. */
function bsgFindings(rec: RecordAst): Finding[] {
  const out: Finding[] = [];
  for (const [rel, bound] of BOUNDS) {
    const abs = join(rec.root, rel);
    if (!existsSync(abs)) continue;
    const kb = statSync(abs).size / 1024;
    if (kb > bound / 1024) out.push(warn(`${rel} is ${kb.toFixed(0)}KB, over its ${(bound / 1024).toFixed(0)}KB bound — run 'docodego audit --rotate' to split it`));
  }
  for (const unit of rec.units) {
    if (unit.markers.grill === null) continue;
    const kb = statSync(join(rec.root, unit.markers.grill)).size / 1024;
    if (kb > GRILL_BOUND / 1024) out.push(warn(`${unit.markers.grill} is ${kb.toFixed(0)}KB, over its ${(GRILL_BOUND / 1024).toFixed(0)}KB bound — archive the closed grill sessions`));
  }
  return out;
}

/** GOV-005 — comment hygiene: HTML comment blocks over the limit in
 * record files, warn-only, judging the file never the author. */
function chsFindings(rec: RecordAst): Finding[] {
  const out: Finding[] = [];
  for (const abs of walkFiles(rec.root, new Set())) {
    if (!abs.endsWith(".md")) continue;
    const raw = readText(abs) ?? "";
    for (const m of raw.matchAll(/<!--([\s\S]*?)-->/g)) {
      if (m[1].length > COMMENT_LIMIT) {
        out.push(warn(`${abs.slice(rec.root.length + 1)} carries a comment block of ${m[1].length} chars (limit ${COMMENT_LIMIT}) — say it once, in prose`));
        break;
      }
    }
  }
  return out;
}

const TABLE_SEP = /^\|[-\s|]+\|$/;
const TABLE_ROW = /^\s*\|.+\|\s*$/;

/** Split a ledger into header lines (through the table separator) and
 * data-row line indexes. */
function splitLedger(raw: string): { head: string[]; rows: number[] } | null {
  const lines = raw.split(/\r?\n/);
  const sep = lines.findIndex((l) => TABLE_SEP.test(l.trim()));
  if (sep === -1) return null;
  const rows: number[] = [];
  for (let i = sep + 1; i < lines.length; i++) {
    if (TABLE_ROW.test(lines[i])) rows.push(i);
  }
  return { head: lines.slice(0, sep + 1), rows };
}

/** Rotation under the cycle-log archive law: whole rows, byte-identical,
 * archived never deleted, tombstone in the live file. The archive is
 * verified by exact read-back BEFORE the live file changes; a mismatch
 * removes the archive and touches nothing else. */
function rotateLedger(rec: RecordAst, rel: string, base: string, dir: string): string {
  const abs = join(rec.root, rel);
  const raw = readText(abs) ?? "";
  const ledger = splitLedger(raw);
  if (ledger === null) return `${rel}: no table found — nothing to rotate`;
  if (ledger.rows.length <= ROTATE_AT_ROWS) {
    return `${rel}: ${ledger.rows.length} rows, within the ${ROTATE_AT_ROWS}-row bound — no rotation needed`;
  }
  const moveIdx = ledger.rows.slice(0, ledger.rows.length - ROTATE_KEEP_ROWS);
  const lines = raw.split(/\r?\n/);
  // the archive carries the table header too: a header-less table is
  // invisible to the parsers (trace must see what it archives)
  const headTail = ledger.head.slice(-2);
  const moveText = headTail.concat(moveIdx.map((i) => lines[i])).join("\n") + "\n";
  const existing = readdirSync(join(rec.root, dir)).filter((f) => f.startsWith(`${base}-archive-`) && f.endsWith(".md")).sort();
  const archiveRel = `${dir}/${base}-archive-${existing.length + 1}.md`;
  const preamble = `# ${base} archive ${existing.length + 1}\n\nRows moved verbatim (byte-identical) from ${rel} on ${today()} under\nthe append-only law: archived, never deleted. Trace scans archives.\n\n`;
  const full = preamble + moveText;
  writeText(join(rec.root, archiveRel), full);
  const readBack = readText(join(rec.root, archiveRel)) ?? "";
  if (readBack !== full) {
    rmSync(join(rec.root, archiveRel));
    return `${rel}: rotation ABORTED — archive read-back mismatch (archive removed, live file untouched)`;
  }
  const keepIdx = ledger.rows.slice(ledger.rows.length - ROTATE_KEEP_ROWS);
  // unconditional single trailing newline — a ledger row glued onto its
  // neighbor corrupts the table grammar
  const live = ledger.head.concat(keepIdx.map((i) => lines[i])).join("\n") + "\n";
  writeText(abs, live);
  const hash = createHash("sha256").update(moveText).digest("hex").slice(0, 12);
  const tomb = `| ${today()} | ${base} | archived ${moveIdx.length} rows to ${archiveRel} (byte-identical, sha256:${hash}) | ${archiveRel} |\n`;
  appendText(abs, tomb);
  return `${rel}: moved ${moveIdx.length} oldest rows to ${archiveRel} (sha256:${hash} verified), ${ROTATE_KEEP_ROWS} newest stay live, tombstone appended`;
}

export function run(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const families: Array<[string, string, () => Finding[]]> = [
    ["GOV-001", "lint", () => lintFindings(rec)],
    ["GOV-002", "check", () => checkFindings(rec)],
    ["GOV-003", "status-verdict coherence", () => svcFindings(rec)],
    ["GOV-004", "bounded size", () => bsgFindings(rec)],
    ["GOV-005", "comment hygiene", () => chsFindings(rec)],
  ];
  const results: CheckResult[] = [];
  for (const [id, name, fn] of families) {
    const found = fn();
    const errors = found.filter((f) => f.tier === "error");
    const warns = found.filter((f) => f.tier === "warn");
    results.push({
      id,
      name,
      status: errors.length > 0 ? "fail" : warns.length > 0 ? "warn" : "pass",
      detail: found.map((f) => (f.tier === "warn" ? "warn: " : "") + f.detail).join("\n  "),
    });
  }
  const checklistAbs = join(rec.root, CHECKLIST_REL);
  if (readText(checklistAbs) === null) writeText(checklistAbs, CHECKLIST_TEMPLATE);
  const checklistRows = results.map((r) => `| ${today()} | ${r.id} ${r.name} | us | ${r.status} | ${r.status === "pass" ? "clean" : r.detail.split("\n")[0]} |`);
  appendText(checklistAbs, checklistRows.join("\n") + "\n");
  const fails = results.filter((r) => r.status === "fail").length;
  const warns = results.filter((r) => r.status === "warn").length;
  appendTracker(rec, "record", `audit: ${fails} failing check${fails === 1 ? "" : "s"}, ${warns} with warnings — checklist updated`, CHECKLIST_REL);
  const rotated: string[] = [];
  if (args.rotate === true) {
    rotated.push(rotateLedger(rec, TRACKER_REL, "tracker", MONITOR_DIR));
    rotated.push(rotateLedger(rec, DELIVERY_LOG_REL, "delivery-log", "04-govern"));
  }
  if (args.json) {
    io.out(JSON.stringify(envelope("audit", { results, rotated, checklist: `.docodego/${CHECKLIST_REL}`, ok: fails === 0 }), null, 2));
  } else {
    for (const r of results) {
      const mark = r.status === "pass" ? "pass" : r.status === "warn" ? "warn" : "FAIL";
      io.out(`${mark}  ${r.id} ${r.name}${r.status === "pass" ? " — clean" : `\n  ${r.detail}`}`);
    }
    for (const line of rotated) io.out(`rotate: ${line}`);
    io.out(`checklist: .docodego/${CHECKLIST_REL} — ${results.length} rows appended`);
  }
  return fails > 0 ? 1 : 0;
}

/** A broken record is a failed sweep, not a crash — the sweep must stay
 * on its feet to be useful in CI. */
export function auditSafe(args: Args, io: Io): number {
  try {
    return run(args, io);
  } catch (e) {
    if (e instanceof RecordFatal) {
      if (args.json) io.out(JSON.stringify(envelope("audit", { ok: false, fatal: String(e.message) }), null, 2));
      else io.err(`error: ${String(e.message)}`);
      return 1;
    }
    throw e;
  }
}
