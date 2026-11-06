/** Answers — the parser behind `grill --answers`. Agents generate answers
 * programmatically, so the format must be multi-line-safe: one file carries
 * one format, detected by content. "lines" is the legacy shape — one answer
 * per line in question order, a trailing empty line is not an answer;
 * "structured" is a GQ-keyed mapping whose values are quoted single lines or
 * literal block scalars (`|` / `|-`). Not a YAML library: exactly this
 * shape, nothing more. Pure and error-recovering: problems land in `errors`
 * as plain English; parsing never throws. */

export interface ParsedAnswers {
  /** One answer per question id, in order; an unanswered question is "" —
   * which fails the verdict downstream, exactly as it always has. */
  answers: string[];
  format: "lines" | "structured";
  /** Problems found in a structured file; always empty for "lines". */
  errors: string[];
}

/** A mapping line: the question id, a colon, then the rest of the line. */
const GQ_KEY = /^(GQ-[A-Za-z0-9-]+)[ \t]*:[ \t]*(.*)$/;
/** Detection: any non-empty line shaped like a mapping makes the whole file structured. */
const GQ_LINE = /^GQ-[A-Za-z0-9-]+[ \t]*:/;

const isBlockMark = (rest: string): boolean => rest === "|" || rest === "|-";

const indentOf = (line: string): number => line.length - line.replace(/^[ \t]+/, "").length;

/** Strip one layer of matching quotes — the frontmatter convention. */
function unquote(v: string): string {
  const quoted =
    (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"));
  return quoted && v.length >= 2 ? v.slice(1, -1) : v;
}

/**
 * Parse an answers file against the unit's question ids. Detection picks the
 * format for the whole file: a single GQ-mapping line switches it to
 * structured; anything else parses as legacy lines, unchanged.
 */
export function parseAnswers(raw: string, questionIds: string[]): ParsedAnswers {
  const lines = raw.split(/\r?\n/);
  const structured = lines.some((l) => l.trim() !== "" && GQ_LINE.test(l));
  return structured ? parseStructured(lines, questionIds) : parseLines(raw, questionIds);
}

/** The legacy format, semantics identical to the inline logic it replaces:
 * trim every line, drop only a trailing empty line, ignore lines beyond the
 * question count, pad short files with "" (an empty answer fails). */
function parseLines(raw: string, questionIds: string[]): ParsedAnswers {
  const split = raw.split(/\r?\n/).map((l) => l.trim());
  const kept = split.filter((l, i, all) => !(l === "" && i === all.length - 1));
  return { answers: questionIds.map((_, i) => kept[i] ?? ""), format: "lines", errors: [] };
}

/**
 * The structured format: `GQ-<id>: value` per question. A value may be a
 * quoted single line or a block-scalar mark (`|` / `|-`) whose more-indented
 * following lines are the answer. The first answer for an id wins; a repeat
 * and an id the unit does not ask are errors, not fatal. A structured file
 * that yields no valid answer at all is an error too.
 */
function parseStructured(lines: string[], questionIds: string[]): ParsedAnswers {
  const errors: string[] = [];
  const byId = new Map<string, string>();
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    i += 1;
    if (line.trim() === "") continue;
    const m = GQ_KEY.exec(line);
    if (m === null) continue; // not a mapping line — not this format's concern
    const id = m[1] ?? "";
    const rest = (m[2] ?? "").trim();
    let value: string;
    if (isBlockMark(rest)) {
      const block = readBlock(lines, i, indentOf(line), rest !== "|-");
      value = block.value;
      i = block.next;
    } else {
      value = unquote(rest);
    }
    if (!questionIds.includes(id)) {
      errors.push(`unknown question id '${id}'`);
      continue;
    }
    if (byId.has(id)) {
      errors.push(`'${id}' answered twice — the first answer wins`);
      continue;
    }
    byId.set(id, value);
  }
  if (byId.size === 0) {
    errors.push("no valid answers found — expected at least one 'GQ-<id>: answer' line");
  }
  return { answers: questionIds.map((q) => byId.get(q) ?? ""), format: "structured", errors };
}

/**
 * A literal block scalar, parsed by hand: from `start`, every line that is
 * blank or indented deeper than the key line belongs to the block; the first
 * non-blank line at or left of the key's indent ends it. The common leading
 * indentation is stripped (each non-blank line gives up its own share of it);
 * blank lines inside act as separators; blank lines at the end are dropped.
 * `|` keeps one trailing newline; `|-` drops it.
 */
function readBlock(
  lines: string[],
  start: number,
  keyIndent: number,
  keepNewline: boolean,
): { value: string; next: number } {
  const body: string[] = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim() !== "" && indentOf(line) <= keyIndent) break;
    body.push(line);
    i += 1;
  }
  while (body.length > 0 && (body[body.length - 1] ?? "").trim() === "") body.pop();
  let pad = -1;
  for (const l of body) {
    if (l.trim() === "") continue;
    const ind = indentOf(l);
    pad = pad === -1 ? ind : Math.min(pad, ind);
  }
  const text = body.map((l) => (l.trim() === "" ? "" : l.slice(Math.max(pad, 0)))).join("\n");
  return { value: keepNewline ? text + "\n" : text, next: i };
}
