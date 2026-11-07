/** The vendored contract — one exit law and one fatal shape across both
 * binaries. Exit law mirrors apps/cli/src/emit/exit.ts verbatim in meaning:
 * 0 ok · 1 gate/lint/verify failure · 2 usage · 3 spec missing or corrupt.
 * Errors carry a remediation and a doc pointer, never just a code (the
 * teach-with-the-fix rule: a check is loved when the error teaches). */
import type { Diagnostic, Io } from "./types.ts";

export type ExitCode = 0 | 1 | 2 | 3;

/** Gate-style commands: any error diagnostic means failure (exit 1). */
export const exitFor = (diags: { severity: string }[]): ExitCode =>
  diags.some((d) => d.severity === "error") ? 1 : 0;

/** A fatal problem with the spec tree itself: canon cannot judge it. */
export class SpecFatal extends Error {
  readonly errCode: string;
  readonly remediation: string;
  readonly doc: string;
  constructor(errCode: string, message: string, remediation: string, doc: string) {
    super(message);
    this.errCode = errCode;
    this.remediation = remediation;
    this.doc = doc;
  }
}

/** The error envelope — `ok: false` goes to standard error, like the CLI's. */
export function errorEnvelope(schema: string, fatal: SpecFatal): string {
  return JSON.stringify({
    schema,
    ok: false,
    error: { code: fatal.errCode, message: fatal.message, remediation: fatal.remediation, doc: fatal.doc },
  });
}

/** Human rendering of a fatal: message, then how to fix it, then where to read. */
export function renderFatal(fatal: SpecFatal): string {
  return `canon: ${fatal.message}\n  remediation: ${fatal.remediation}\n  doc: ${fatal.doc}`;
}

export const SPEC_ROOT_MISSING = (root: string): SpecFatal =>
  new SpecFatal(
    "SP-B000",
    `spec root not found at '${root}'`,
    "run from the repository root, or pass --root <dir> (the folder holding SPEC.md and laws/)",
    "spec/SPEC.md",
  );

/** Envelope emit helper: data to stdout, errors to stderr. */
export function emit(io: Io, json: boolean, schema: string, data: unknown): void {
  if (json) io.out(JSON.stringify({ schema, ok: true, data }));
}
