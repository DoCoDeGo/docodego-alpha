/** Human diagnostic rendering, rustc-style — vendored shape from
 * apps/cli/src/emit/diagnostics.ts: severity[code]: message, then the
 * position window. Findings are pointed, so they are checkable. */
import type { Diagnostic } from "./types.ts";

export function renderDiagnostic(d: Diagnostic): string {
  const head = `spec ${d.severity}[${d.code}]: ${d.message}`;
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

export function countsOf(diags: Diagnostic[]): { errors: number; warnings: number } {
  return {
    errors: diags.filter((d) => d.severity === "error").length,
    warnings: diags.filter((d) => d.severity === "warning").length,
  };
}
