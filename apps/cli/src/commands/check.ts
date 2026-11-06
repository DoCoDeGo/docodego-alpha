/** `check` — record integrity as a pass over the whole-record AST:
 * delivered units must have proofs that exist, status claims must match the
 * markers earned, epic/story links must resolve. Exit 1 on any error. */
import type { Args, Io } from "../types.ts";
import { loadRecord } from "../record/load.ts";
import { checkPass } from "../passes/index.ts";
import { renderDiagnostics } from "../emit/diagnostics.ts";
import { exitFor } from "../emit/exit.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const findings = [...rec.loadDiags, ...checkPass(rec)];
  const code = exitFor(findings);
  if (args.json) {
    io.out(JSON.stringify(envelope("check", { findings }, code === 0), null, 2));
  } else {
    io.out(findings.length === 0 ? "check: record holds together." : renderDiagnostics(findings));
    io.err(code === 0 ? "exit 0" : "exit 1 — errors above name the files");
  }
  return code;
}
