/** `check` — record integrity as a pass over the whole-record AST:
 * delivered units must have proofs that exist, status claims must match the
 * markers earned, epic/story links must resolve — plus the tree pass, the
 * rules layer's mechanical half (rules floor, stack scan, untracked-source
 * scan — warnings with file evidence). Exit 1 on any error. */
import type { Args, Io } from "../types.ts";
import { loadRecord } from "../record/load.ts";
import { checkPass } from "../passes/index.ts";
import { governanceFindings } from "../passes/governance.ts";
import { treeFindings } from "../passes/tree.ts";
import { renderDiagnostics } from "../emit/diagnostics.ts";
import { exitFor } from "../emit/exit.ts";
import { emitJson } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const findings = [...rec.loadDiags, ...checkPass(rec), ...governanceFindings(rec), ...treeFindings(process.cwd())];
  const code = exitFor(findings);
  if (args.json) {
    emitJson(io, "check", { findings }, code === 0);
  } else {
    io.out(findings.length === 0 ? "check: record holds together." : renderDiagnostics(findings));
    io.err(code === 0 ? "exit 0" : "exit 1 — errors above name the files");
  }
  return code;
}
