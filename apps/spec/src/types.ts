/** Shared vocabulary for canon: positions, diagnostics, io, args. Mirrors
 * apps/cli/src/types.ts — one shape across the two binaries, so findings are
 * checkable the same way everywhere. */

/** 1-based source position (line, column) inside a spec file. */
export interface Pos {
  line: number;
  col: number;
}

/** A region of a file; diagnostics point here so findings are checkable. */
export interface Span {
  start: Pos;
  end: Pos;
}

export type Severity = "error" | "warning" | "note";

/** A compiler-style finding: positioned, coded, severitied. Canon's family
 * is SP-<L|V|P|B>nnn — L lint, V verify, P parse, B build (later unit). */
export interface Diagnostic {
  severity: Severity;
  code: string;
  message: string;
  file?: string;
  span?: Span;
}

/** Where a command writes. Commands stay pure-ish by taking this in. */
export interface Io {
  out(s: string): void;
  err(s: string): void;
}

/** Parsed command line, shared by every command module. */
export interface Args {
  cmd: string;
  pos: string[];
  json: boolean;
  root?: string;
  cli?: string;
  dist?: string;
  record?: string;
  impact?: string;
  as?: string;
  payload?: string;
  site?: string;
  help: boolean;
}
