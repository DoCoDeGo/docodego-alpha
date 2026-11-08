/** `lint` — the rule tree over the record: structure, frontmatter, naming.
 * `--self-check` validates the rule registry itself before it judges anything. */
import type { Args, Io } from "../types.ts";
import { loadRecord } from "../record/load.ts";
import { frontmatterPass, namingPass, RULES, selfCheck, structurePass } from "../passes/index.ts";
import { renderDiagnostics } from "../emit/diagnostics.ts";
import { exitFor } from "../emit/exit.ts";
import { emitJson } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  if (args.selfCheck) {
    const findings = selfCheck();
    const code = exitFor(findings);
    if (args.json) {
      emitJson(io, "lint", { selfCheck: { rules: RULES.length, findings } }, code === 0);
    } else {
      io.out(findings.length === 0 ? `self-check: rule registry holds together (${RULES.length} rules).` : renderDiagnostics(findings));
    }
    return code;
  }
  const rec = loadRecord(process.cwd());
  const findings = [
    ...rec.loadDiags,
    ...structurePass(rec),
    ...frontmatterPass(rec),
    ...namingPass(rec),
    ...rec.units.flatMap((u) => u.spec?.diags ?? []),
    ...rec.sketches.flatMap((s) => s.file.diags),
  ];
  const code = exitFor(findings);
  if (args.json) {
    emitJson(io, "lint", { findings }, code === 0);
  } else {
    io.out(findings.length === 0 ? "lint: nothing to report." : renderDiagnostics(findings));
    io.err(code === 0 ? "exit 0" : "exit 1 — findings name file + rule id");
  }
  return code;
}
