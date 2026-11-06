/** Exit codes: 0 ok · 1 gate/check/lint/grill failure · 2 usage · 3 record missing/corrupt. */
export type ExitCode = 0 | 1 | 2 | 3;

/** Gate-style commands: any error diagnostic means failure (exit 1). */
export const exitFor = (diags: { severity: string }[]): ExitCode =>
  diags.some((d) => d.severity === "error") ? 1 : 0;
