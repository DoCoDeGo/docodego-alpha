/** Frontmatter — the typed header of a law file, parsed per line, never
 * fatal. Vendored from apps/cli/src/record/frontmatter.ts (same parser
 * shape, canon's SP-P code family); contract drift between the two is what
 * canon verify exists to catch, so this copy stays deliberately small. */
import type { Diagnostic, Span } from "./types.ts";

export interface FmField {
  key: string;
  value: string;
  span: Span;
}

export interface Frontmatter {
  fields: FmField[];
  /** Recovered problems: the bad line is skipped, the rest of the file parses. */
  errors: Diagnostic[];
}

/** Read one field's value; empty or absent yields undefined. */
export function field(fm: Frontmatter | null, key: string): string | undefined {
  const hit = fm?.fields.find((f) => f.key === key);
  return hit && hit.value !== "" ? hit.value : undefined;
}

const FIELD = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/;

const at = (line: number): Span => ({
  start: { line, col: 1 },
  end: { line, col: 120 },
});

/**
 * Parse frontmatter body lines (the `---` fences are the caller's job).
 * Error-recovering: a malformed line becomes a positioned diagnostic and
 * parsing continues — one bad line never blinds the whole check.
 */
export function parseFrontmatter(file: string, lines: string[], baseLine: number): Frontmatter {
  const fields: FmField[] = [];
  const errors: Diagnostic[] = [];
  lines.forEach((raw, idx) => {
    const text = raw.trim();
    if (text === "" || text.startsWith("#")) return;
    const lineNo = baseLine + idx;
    const m = FIELD.exec(text);
    if (m === null) {
      errors.push({
        severity: "error",
        code: "SP-P001",
        message: `malformed frontmatter line skipped — expected 'key: value', found: ${text.slice(0, 60)}`,
        file,
        span: at(lineNo),
      });
      return;
    }
    let value = (m[2] ?? "").trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length >= 2) value = value.slice(1, -1);
    fields.push({ key: m[1] ?? "", value, span: at(lineNo) });
  });
  return { fields, errors };
}
