/** Human diagnostic rendering, rustc-style: severity[code]: message, then the
 * position window. Findings are pointed, so they are checkable. */
import type { Diagnostic } from "../types.ts";

export function renderDiagnostic(d: Diagnostic): string {
  const sev = d.severity === "warning" ? `warning (${d.class ?? "drift"})` : d.severity;
  const head = `${sev}[${d.code}]: ${d.message}`;
  const hint = `  help: docodego explain ${d.code}`;
  if (d.file === undefined) return `${head}\n${hint}`;
  const loc = d.span !== undefined ? `${d.file}:${d.span.start.line}:${d.span.start.col}` : d.file;
  return `${head}\n  --> ${loc}\n${hint}`;
}

export function renderDiagnostics(diags: Diagnostic[]): string {
  const body = diags.map(renderDiagnostic).join("\n");
  const c = countsOf(diags);
  const tail = `${c.errors} error(s), ${c.warnings} warning(s)`;
  return body === "" ? tail : `${body}\n\n${tail}`;
}

export function countsOf(diags: Diagnostic[]): { errors: number; warnings: number; notes: number } {
  const counts = { errors: 0, warnings: 0, notes: 0 };
  for (const d of diags) {
    if (d.severity === "error") counts.errors += 1;
    else if (d.severity === "warning") counts.warnings += 1;
    else counts.notes += 1;
  }
  return counts;
}
