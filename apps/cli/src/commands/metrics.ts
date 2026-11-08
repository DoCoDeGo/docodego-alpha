/** `metrics report|gate` — the surgical gate (the founder's cycle-6
 * directive, recorded verbatim in the record's cycles log): measure
 * code, structure, file and size; run before and after each cycle; and
 * gate new code — adding passes a check first, while code written to
 * retire code earns retirement credit against the balance. The stock is
 * baselined, the flow is gated: existing size never fails retroactively
 * — the gate refuses growth, not history. The measures are deterministic
 * proxies stated in the help body (top-level declarations and their
 * spans for function shape, indent depth for nesting): honest about what
 * they count, reproducible byte for byte, no timestamps, no
 * dependencies beyond node stdlib. The tool reads and reports; it never
 * edits. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, sep } from "node:path";
import type { Args, Io } from "../types.ts";
import { complain } from "./resolve.ts";
import { emitJson } from "../emit/json.ts";

const SOURCE_EXTS = new Set([".ts", ".tsx", ".js", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git"]);
const SCHEMA = "docodego/metrics/v1";
const DEFAULT_MAX_GROWTH = 40;
const NEW_CEILING_FLOOR = 100;
const NEW_CEILING_ROUND = 25;

type FileMetrics = { path: string; lines: number; codeLines: number; decls: number; longestFn: number; maxDepth: number };
type DirMetrics = { dir: string; files: number; lines: number };
type Report = { schema: string; root: string; files: FileMetrics[]; dirs: DirMetrics[]; summary: { files: number; lines: number; codeLines: number } };

const DECL_RE = /^(export\s+)?(default\s+)?(async\s+)?function\s|^(export\s+)?(const|let)\s+\w+\s*=\s*(async\s*)?\(|^(export\s+)?(interface|type)\s+\w/;

function measureFile(abs: string, rel: string): FileMetrics {
  const raw = readFileSync(abs, "utf8");
  const lines = raw.split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  let codeLines = 0;
  let decls = 0;
  let longestFn = 0;
  let lastDecl = -1;
  let maxDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();
    if (trimmed !== "") codeLines++;
    if (DECL_RE.test(line)) {
      decls++;
      if (lastDecl >= 0) longestFn = Math.max(longestFn, i - lastDecl);
      lastDecl = i;
    }
    let indent = 0;
    for (const ch of line) {
      if (ch === " ") indent++;
      else if (ch === "\t") indent += 4;
      else break;
    }
    if (trimmed !== "") maxDepth = Math.max(maxDepth, Math.ceil(indent / 2));
  }
  if (decls <= 1) longestFn = Math.max(longestFn, codeLines);
  else longestFn = Math.max(longestFn, lines.length - 1 - lastDecl);
  return { path: rel.split(sep).join("/"), lines: lines.length, codeLines, decls, longestFn, maxDepth };
}

function walk(root: string, dir: string = "", acc: { files: FileMetrics[]; dirs: Map<string, { files: number; lines: number }> } = { files: [], dirs: new Map() }): { files: FileMetrics[]; dirs: Map<string, { files: number; lines: number }> } {
  const abs = dir === "" ? root : join(root, dir);
  for (const e of readdirSync(abs).sort()) {
    if (SKIP_DIRS.has(e)) continue;
    const childAbs = join(abs, e);
    const childRel = dir === "" ? e : `${dir}/${e}`;
    if (statSync(childAbs).isDirectory()) {
      walk(root, childRel, acc);
    } else if (SOURCE_EXTS.has(extname(e))) {
      const m = measureFile(childAbs, childRel);
      acc.files.push(m);
      const d = m.path.includes("/") ? m.path.slice(0, m.path.lastIndexOf("/")) : ".";
      const cur = acc.dirs.get(d) ?? { files: 0, lines: 0 };
      cur.files++;
      cur.lines += m.lines;
      acc.dirs.set(d, cur);
    }
  }
  return acc;
}

export function buildReport(root: string): Report {
  const { files, dirs } = walk(root);
  files.sort((a, b) => a.path.localeCompare(b.path));
  const dirList: DirMetrics[] = [...dirs.entries()].map(([dir, v]) => ({ dir, files: v.files, lines: v.lines })).sort((a, b) => b.lines - a.lines);
  return {
    schema: SCHEMA,
    root,
    files,
    dirs: dirList,
    summary: { files: files.length, lines: files.reduce((s, f) => s + f.lines, 0), codeLines: files.reduce((s, f) => s + f.codeLines, 0) },
  };
}

/** The default new-file ceiling, derived from the baseline's own stock:
 * the 90th-percentile file size rounded up to the ceiling round — the
 * measured world sets the bar, and the flag overrides it. */
function derivedNewCeiling(base: Report): number {
  const sizes = base.files.map((f) => f.lines).sort((a, b) => a - b);
  if (sizes.length === 0) return NEW_CEILING_FLOOR;
  const p90 = sizes[Math.floor(0.9 * (sizes.length - 1))] ?? NEW_CEILING_FLOOR;
  return Math.max(NEW_CEILING_FLOOR, Math.ceil(p90 / NEW_CEILING_ROUND) * NEW_CEILING_ROUND);
}

const fmtR = (r: Report): string => {
  const out = [`metrics report — ${r.summary.files} file(s), ${r.summary.lines} line(s) (${r.summary.codeLines} code) · root ${r.root}`];
  out.push("  structure (dirs by lines): " + r.dirs.slice(0, 12).map((d) => `${d.dir} ${d.files}f/${d.lines}L`).join(" · "));
  const top = [...r.files].sort((a, b) => b.lines - a.lines).slice(0, 12);
  out.push("  largest files:");
  for (const f of top) out.push(`    ${String(f.lines).padStart(5)}  ${f.path}  (${f.decls} decls, longest span ${f.longestFn}, depth ${f.maxDepth})`);
  return out.join("\n");
};

export function run(args: Args, io: Io): number {
  const mode = args.pos[0];
  if (mode !== "report" && mode !== "gate") {
    return complain(args.json, io, { severity: "error", code: "DG-U122", message: "usage: docodego metrics report [--root <dir>] | gate --baseline <snapshot.json> [--max-new N] [--max-growth N] [--retires p1,p2]" }, 2, "usage");
  }
  const root = typeof args.root === "string" && args.root !== "" ? args.root : "apps";

  if (mode === "report") {
    const report = buildReport(root);
    if (args.json) emitJson(io, "metrics", report);
    else io.out(fmtR(report));
    return 0;
  }

  // gate: the surgical refusal — growth is gated, history is not.
  const baselinePath = args.baseline;
  if (typeof baselinePath !== "string" || baselinePath === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U122", message: "usage: docodego metrics gate --baseline <snapshot.json> (a report --json over the tree at cycle open)" }, 2, "usage");
  }
  let base: Report;
  try {
    const parsed = JSON.parse(readFileSync(baselinePath, "utf8")) as Report & { data?: Report };
    const candidate = (parsed.data ?? parsed) as Report;
    if (candidate.schema !== SCHEMA || !Array.isArray(candidate.files)) throw new Error("not a metrics snapshot");
    base = candidate;
  } catch {
    return complain(args.json, io, { severity: "error", code: "DG-U122", message: `the baseline at '${baselinePath}' is not a metrics snapshot — generate one: docodego metrics report --root <dir> --json` }, 2, "usage");
  }
  const cur = buildReport(root);
  const maxNew = typeof args.maxNew === "string" && args.maxNew !== "" ? Number(args.maxNew) : derivedNewCeiling(base);
  const maxGrowth = typeof args.maxGrowth === "string" && args.maxGrowth !== "" ? Number(args.maxGrowth) : DEFAULT_MAX_GROWTH;
  const retires = typeof args.retires === "string" && args.retires !== "" ? args.retires.split(",").map((s) => s.trim()).filter((s) => s !== "") : [];

  const baseMap = new Map(base.files.map((f) => [f.path, f.lines]));
  const curMap = new Map(cur.files.map((f) => [f.path, f.lines]));

  let added = 0;
  let retired = 0;
  const newFiles: string[] = [];
  for (const f of cur.files) {
    const before = baseMap.get(f.path);
    if (before === undefined) {
      newFiles.push(f.path);
      added += f.lines;
      if (f.lines > maxNew) {
        return complain(args.json, io, { severity: "error", code: "DG-U119", message: `${f.path} is ${f.lines} lines — the new-file ceiling is ${maxNew} (new code passes the gate first: split it, shrink it, or retire to earn the space)` }, 1, "metrics-refused");
      }
    } else {
      const delta = f.lines - before;
      if (delta > 0) added += delta;
      if (delta > maxGrowth) {
        return complain(args.json, io, { severity: "error", code: "DG-U120", message: `${f.path} grew +${delta} lines — the growth ceiling is ${maxGrowth} (surgical changes: extract, split, or cover the addition with --retires)` }, 1, "metrics-refused");
      }
    }
  }
  for (const p of retires) {
    const before = baseMap.get(p);
    if (before === undefined) continue;
    const after = curMap.get(p);
    retired += Math.max(0, before - (after ?? 0));
  }
  if (added > retired) {
    return complain(args.json, io, { severity: "error", code: "DG-U121", message: `net +${added - retired} line(s) uncovered — the set adds ${added} and retires ${retired}: declare --retires <paths> for what this change retires, or shrink the change (sometimes new code retires old code — that is the balance, not the exception)` }, 1, "metrics-refused");
  }

  const line = `METRICS GATE PASS — +${added} added / −${retired} retired (credit ${Math.min(retired, added)}) · ${cur.summary.files} file(s), ${newFiles.length} new · ceiling new≤${maxNew} growth≤${maxGrowth}`;
  if (args.json) emitJson(io, "metrics-gate", { ok: true, added, retired, newFiles, maxNew, maxGrowth, baseline: baselinePath });
  else io.out(line);
  return 0;
}
