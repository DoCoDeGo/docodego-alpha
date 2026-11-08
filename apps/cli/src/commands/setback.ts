/** `setback <class> <text>` — the failure ledger. One row per bite of a
 * class, appended at failure time; `--respond` records the owed response
 * (naming what was opened) and resets the class's counter; `--list` is
 * the standing index. Counts are machine-written and scan archive files,
 * so history survives rotation. The audit's GOV-006 reads the same
 * ledger and shares this module's counting and escalation text — one
 * grammar, two doors, no drift. */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, readText, today, writeText } from "../fsx.ts";
import { loadRecord, type RecordAst } from "../record/load.ts";
import { appendTracker } from "../record/record-write.ts";
import { isKebab } from "../passes/registry.ts";
import { SETBACKS_TEMPLATE } from "../bundled/index.ts";
import { complain } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export const SETBACKS_REL = "04-govern/01-monitor/setbacks.md";
export const MONITOR_DIR = "04-govern/01-monitor";

/** One ledger row, parsed. */
export interface Row {
  date: string;
  cls: string;
  count: number;
  text: string;
}

export interface ClassStat {
  lifetime: number;
  sinceResponse: number;
  lastResponse: string | null;
}

const ROW = /^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*$/;
const ARCHIVE = /^setbacks-archive-(\d+)\.md$/;

function parseRows(raw: string): Row[] {
  const out: Row[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const m = ROW.exec(line);
    if (m) out.push({ date: m[1] ?? "", cls: m[2] ?? "", count: Number(m[3]), text: m[4] ?? "" });
  }
  return out;
}

/** Every row, oldest first: archives (numbered oldest-first) then live.
 * Rotation moves whole rows byte-identically, so this ordering is the
 * true occurrence order even across splits. */
export function ledgerRows(rec: RecordAst): Row[] {
  const dir = join(rec.root, MONITOR_DIR);
  const archives: string[] = [];
  if (existsSync(dir)) {
    for (const f of readdirSync(dir)) {
      if (ARCHIVE.test(f)) archives.push(f);
    }
  }
  archives.sort((a, b) => Number((ARCHIVE.exec(a))?.[1]) - Number((ARCHIVE.exec(b))?.[1]));
  const rows: Row[] = [];
  for (const f of archives) rows.push(...parseRows(readText(join(dir, f)) ?? ""));
  rows.push(...parseRows(readText(join(rec.root, SETBACKS_REL)) ?? ""));
  return rows;
}

/** Per-class stats over the ordered rows. A count-0 row is the response:
 * it resets the recurrence count and names what was opened. */
export function classStats(rec: RecordAst): Map<string, ClassStat> {
  const map = new Map<string, ClassStat>();
  for (const r of ledgerRows(rec)) {
    const s = map.get(r.cls) ?? { lifetime: 0, sinceResponse: 0, lastResponse: null };
    if (r.count > 0) {
      s.lifetime += 1;
      s.sinceResponse += 1;
    } else {
      s.sinceResponse = 0;
      s.lastResponse = r.text;
    }
    map.set(r.cls, s);
  }
  return map;
}

/** The owed-work text — the audit's GOV-006 fail finding and the
 * command's escalation hint carry the same words (one text, two doors). */
export function escalationHint(cls: string): string {
  return `owed: a research cycle or a mitigation unit. Open one: append '## Cycle N — ${cls} mitigation' to 01-document/01-discover/cycles.md, or: docodego sketch ${cls}-mitigation, then docodego new <unit> --from-sketch ${cls}-mitigation. Then: docodego setback ${cls} --respond "<what you opened>"`;
}

/** Does the response text name a path that resolves? The response must
 * name what was opened — a cycle or a unit. No path, no claim (EL-18
 * applied where it matters most). */
export function responseResolves(rec: RecordAst, text: string): boolean {
  const tokens = text
    .split(/\s+/)
    .map((t) => t.replace(/[.,;:'")\]]+$/, ""))
    .filter((t) => t.includes("/") || t.endsWith(".md"));
  if (tokens.length === 0) return false;
  const homes = ["", "..", "01-document/01-discover/", "02-compose/01-build/", "04-govern/01-monitor/"];
  return tokens.some((t) => homes.some((h) => existsSync(join(rec.root, h, t))));
}

/** The ledger file, planted lazily — engine-owned template, no init
 * change, no record bump (the checklist went in exactly this way). */
function ensureLedger(rec: RecordAst): string {
  const abs = join(rec.root, SETBACKS_REL);
  const raw = readText(abs);
  if (raw === null) {
    writeText(abs, SETBACKS_TEMPLATE);
    return SETBACKS_TEMPLATE;
  }
  return raw;
}

export function run(args: Args, io: Io): number {
  if (args.list === true) return listClasses(args, io);
  const cls = args.pos[0];
  const respond = args.respond;
  const bite = respond === undefined ? args.pos[1] : undefined;
  if (cls === undefined || cls === "" || (respond === undefined && (bite === undefined || bite === "")) || (respond !== undefined && respond === "")) {
    return complain(args.json, io, { severity: "error", code: "DG-U090", message: "usage: docodego setback <class> <text> | setback <class> --respond <text> | setback --list" }, 2, "usage");
  }
  if (!isKebab(cls)) {
    return complain(args.json, io, { severity: "error", code: "DG-U091", message: `setback class '${cls}' must be kebab-case — classes are stable ids counted forever` }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  ensureLedger(rec);
  const stats = classStats(rec);
  const stat = stats.get(cls) ?? { lifetime: 0, sinceResponse: 0, lastResponse: null };
  const isRespond = respond !== undefined;
  const count = isRespond ? 0 : stat.sinceResponse + 1;
  // the usage gate above guarantees respond XOR bite is a non-empty string
  const text = (respond ?? bite ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  const abs = join(rec.root, SETBACKS_REL);
  appendText(abs, `| ${today()} | ${cls} | ${count} | ${text} |\n`);
  const trackerLine = appendTracker(rec, `setback-${cls}`, isRespond ? `response: ${text}` : `bite ${count}: ${text}`, SETBACKS_REL);
  if (args.json) {
    io.out(JSON.stringify(envelope("setback", { class: cls, count, response: isRespond, ledger: `.docodego/${SETBACKS_REL}`, tracker: trackerLine }), null, 2));
  } else {
    io.out(`.docodego/${SETBACKS_REL} — ${cls} ${isRespond ? "response recorded, count reset" : `bite ${count} recorded`}`);
    io.err(`tracker: ${trackerLine}`);
    if (!isRespond && count >= 2) io.err(escalationHint(cls));
  }
  return 0;
}

function listClasses(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const stats = classStats(rec);
  const names = [...stats.keys()].sort();
  if (args.json) {
    const classes = names.map((cls) => ({ class: cls, ...stats.get(cls) }));
    io.out(JSON.stringify(envelope("setback", { ledger: `.docodego/${SETBACKS_REL}`, classes }), null, 2));
    return 0;
  }
  if (names.length === 0) io.out(`.docodego/${SETBACKS_REL} — no setbacks recorded`);
  for (const cls of names) {
    const s = stats.get(cls)!;
    io.out(`${cls}: lifetime ${s.lifetime} · since-response ${s.sinceResponse} · last response ${s.lastResponse ?? "none"}`);
    if (s.sinceResponse >= 2) io.err(escalationHint(cls));
  }
  return 0;
}
