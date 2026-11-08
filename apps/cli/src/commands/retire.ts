/** `retire <unit>` — done is a place. A delivered unit leaves the stream
 * and becomes a named `a-<behavior>` under `system/behavioral/`: the
 * living record of what the system does now. The move is read-back
 * verified (every file copied, read back, byte-compared before the source
 * is removed); the tomb's spec gains `retired_on:` and `was:`; proofs and
 * delivered citations inside the tomb are re-addressed to the new home;
 * the tracker and delivery log each gain a follow-up row. A second retire
 * of the same behavior is refused — the tomb is final. `--dry-run` prints
 * the plan and touches nothing. */
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { readText, today, writeText } from "../fsx.ts";
import { loadRecord, unitStatus, type RecordAst } from "../record/load.ts";
import { appendTracker, appendDeliveryLog } from "../record/record-write.ts";
import { parseMarkdown } from "../record/markdown.ts";
import { isKebab } from "../passes/registry.ts";
import { proofPaths, proofResolves } from "../passes/check.ts";
import { complain, resolveUnitOrComplain } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

/** The second home for delivered units, record-root relative. */
export const BEHAVIORAL_REL = "system/behavioral";

/** A retired unit's tomb, found by name (the `NNN-` prefix strips the
 * same way it did at retire time). Null when the name has no tomb. */
export interface Tomb {
  name: string; // the original unit name, e.g. 110-spec7-naming
  behavior: string; // e.g. spec7-naming
  rel: string; // system/behavioral/a-spec7-naming
  retiredOn: string | null;
}

export function findRetired(rec: RecordAst, name: string): Tomb | null {
  const identity = name.replace(/^\d{3}-/, "");
  const dir = join(rec.root, BEHAVIORAL_REL, `a-${identity}`);
  const spec = join(dir, "spec.md");
  if (!existsSync(spec)) return null;
  const front = readFront(readText(spec) ?? "");
  return {
    name: (front !== null && front["was"] !== undefined ? front["was"] : identity) ?? identity,
    behavior: identity,
    rel: `${BEHAVIORAL_REL}/a-${identity}`,
    retiredOn: front !== null && front["retired_on"] !== undefined ? (front["retired_on"] ?? null) : null,
  };
}

/** How many behaviors the second home holds — the status tombstone. */
export function retiredCount(rec: RecordAst): number {
  const dir = join(rec.root, BEHAVIORAL_REL);
  if (!existsSync(dir)) return 0;
  return readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && /^a-/.test(e.name)).length;
}

/** Everything recorded about a retired unit, replayed by trace: the tomb's
 * own files stand in for the stream markers that no longer resolve. */
export function tombFiles(rec: RecordAst, tomb: Tomb): { spec: string | null; grill: string | null; score: string | null; proofs: string | null; delivered: string | null } {
  const dir = join(rec.root, tomb.rel);
  const read = (f: string): string | null => (existsSync(join(dir, f)) ? readText(join(dir, f)) : null);
  return { spec: read("spec.md"), grill: read("grill.md"), score: read("score.md"), proofs: read("proofs.md"), delivered: read("delivered.md") };
}

function readFront(raw: string): Record<string, string> | null {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (m === null) return null;
  const front: Record<string, string> = {};
  for (const line of (m[1] ?? "").split(/\r?\n/)) {
    const kv = /^([A-Za-z_-]+):\s*(.*)$/.exec(line);
    if (kv !== null) front[kv[1] ?? ""] = kv[2] ?? "";
  }
  return front;
}

/** Relative file paths under a directory, recursive, sorted. */
function collect(dir: string, base = ""): string[] {
  const out: string[] = [];
  for (const e of readdirSync(join(dir, base), { withFileTypes: true })) {
    const rel = base === "" ? e.name : `${base}/${e.name}`;
    if (e.isDirectory()) out.push(...collect(dir, rel));
    else out.push(rel);
  }
  return out.sort();
}

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U100", message: "usage: docodego retire <unit> [--as <behavior>] [--dry-run] [--json]" }, 2, "usage");
  }
  if (args.as !== undefined && !isKebab(args.as)) {
    return complain(args.json, io, { severity: "error", code: "DG-U103", message: `'${args.as}' is not kebab-case — behaviors are named like units, minus the number (--as <kebab-name>)` }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const behavior = args.as ?? name.replace(/^\d{3}-/, "");
  const tombRel = `${BEHAVIORAL_REL}/a-${behavior}`;
  if (existsSync(join(rec.root, tombRel))) {
    return complain(args.json, io, { severity: "error", code: "DG-U104", message: `${tombRel}/ already exists — a tomb is final; retire under a different --as name` }, 1, "retire");
  }
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;
  if (unitStatus(unit) !== "delivered") {
    return complain(args.json, io, { severity: "error", code: "DG-U101", message: `'${unit.name}' is not delivered — only delivered units retire; the stream is for open work` }, 2, "retire");
  }
  if (unit.markers.proofs === null) {
    return complain(args.json, io, { severity: "error", code: "DG-U102", message: `'${unit.name}' has no proofs.md — no proof, no tomb` }, 2, "retire");
  }
  const proofsRaw = readText(join(rec.root, unit.markers.proofs)) ?? "";
  const proofs = parseMarkdown(unit.markers.proofs, proofsRaw);
  // The spec's law: refuse a unit whose proofs.md names NO resolvable
  // path — evidence must exist before the move. Extra tokens that name
  // fixture trees or envelope schemas are prose, not gates.
  const paths = proofPaths(proofs);
  const resolving = paths.filter((p) => proofResolves(rec, unit, p));
  if (paths.length === 0 || resolving.length === 0) {
    return complain(args.json, io, { severity: "error", code: "DG-U102", message: `'${unit.name}' names no resolvable proof path — evidence must exist before the move; no proof, no tomb` }, 2, "retire");
  }

  const srcDir = join(rec.root, unit.dir);
  const tombDir = join(rec.root, tombRel);
  const files = collect(srcDir);
  const readdress: string[] = [];
  for (const f of ["proofs.md", "delivered.md"]) {
    const raw = readText(join(srcDir, f));
    if (raw !== null && raw.includes(unit.dir)) readdress.push(f);
  }

  if (args.dryRun === true) {
    const plan = {
      unit: unit.name,
      dryRun: true,
      from: unit.dir,
      to: tombRel,
      files: files.length,
      readdress: readdress,
    };
    if (args.json) {
      io.out(JSON.stringify(envelope("retire", plan), null, 2));
    } else {
      io.out([
        `retire ${unit.name} (dry run — nothing moved)`,
        `from: ${unit.dir}`,
        `to:   ${tombRel}`,
        `files: ${files.length}${readdress.length > 0 ? ` · citations re-addressed in ${readdress.join(" + ")}` : ""}`,
        `rows: tracker + delivery-log follow-up`,
      ].join("\n"));
    }
    return 0;
  }

  // The read-back-verified move: copy every file, read each back and
  // byte-compare, and only then remove the source. Any mismatch aborts
  // with the tomb removed and the source untouched.
  mkdirSync(tombDir, { recursive: true });
  for (const f of files) {
    const src = readText(join(srcDir, f));
    if (src === null) {
      rmSync(tombDir, { recursive: true, force: true });
      return complain(args.json, io, { severity: "error", code: "DG-U100", message: `could not read ${unit.dir}/${f} — retire aborted, nothing moved` }, 2, "retire");
    }
    writeText(join(tombDir, f), src);
    if ((readText(join(tombDir, f)) ?? "") !== src) {
      rmSync(tombDir, { recursive: true, force: true });
      return complain(args.json, io, { severity: "error", code: "DG-U100", message: `read-back verification failed for ${f} — retire aborted, tomb removed, source untouched` }, 2, "retire");
    }
  }
  rmSync(srcDir, { recursive: true, force: true });

  // The tombstone frontmatter: when it retired, what it was.
  const specAbs = join(tombDir, "spec.md");
  const specRaw = readText(specAbs) ?? "";
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(specRaw);
  if (fm !== null) {
    const rest = specRaw.slice(fm.index + fm[0].length);
    writeText(specAbs, `---\n${fm[1] ?? ""}\nretired_on: ${today()}\nwas: ${unit.name}\n---${rest}`);
  }

  // Re-address proof and delivered citations to the new home.
  const corrected: string[] = [];
  for (const f of ["proofs.md", "delivered.md"]) {
    const abs = join(tombDir, f);
    const raw = readText(abs);
    if (raw === null || !raw.includes(unit.dir)) continue;
    writeText(abs, raw.split(unit.dir).join(tombRel));
    corrected.push(f);
  }

  const tombName = tombRel.split("/").pop() ?? unit.name;
  const trackerLine = appendTracker(rec, tombName, `retired from ${unit.stream}/ to ${tombRel}/ (was: ${unit.name})`, tombRel);
  appendDeliveryLog(rec, tombName, "retired", tombRel);

  if (args.json) {
    io.out(JSON.stringify(envelope("retire", { unit: unit.name, from: unit.dir, to: tombRel, behavior, files: files.length, readdressed: corrected, tracker: trackerLine }), null, 2));
  } else {
    io.out(`${unit.dir} → ${tombRel} (${files.length} files${corrected.length > 0 ? `, re-addressed ${corrected.join(" + ")}` : ""})`);
    io.err(`tracker: ${trackerLine}`);
    io.err(`trace follows: docodego trace ${unit.name}`);
  }
  return 0;
}
