/** The record language: a hand-rolled, error-recovering markdown/frontmatter parser.
 *
 * This is the lexer+parser of the pattern. It never throws and never crashes on
 * a broken file: every problem becomes a positioned diagnostic and the parse
 * continues, so passes always have an AST to walk.
 */
import type { Diagnostic, Pos, Span } from "../types.ts";
import { parseFrontmatter, type Frontmatter } from "./frontmatter.ts";

export type MdNode =
  | { kind: "heading"; level: number; text: string; span: Span }
  | { kind: "para"; text: string; span: Span }
  | { kind: "item"; text: string; span: Span }
  | { kind: "table-row"; cells: string[]; span: Span }
  | { kind: "fence"; lang: string; text: string; span: Span };

/** One parsed record file — the AST other modules consume. */
export interface FileAst {
  path: string; // relative to the record root, e.g. 01-document/01-discover/auth/spec.md
  front: Frontmatter | null;
  nodes: MdNode[];
  diags: Diagnostic[];
}

const HEADING = /^(#{1,6})\s+(.*)$/;
const ITEM = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/;
const FENCE = /^\s*(```|~~~)\s*(\S*)\s*$/;
const ROW = /^\s*\|(.*)\|\s*$/;
const SEPARATOR = /^:?-{3,}:?$/;

const pos = (line: number, col = 1): Pos => ({ line, col });

export function parseMarkdown(path: string, src: string): FileAst {
  const lines = src.split(/\r?\n/);
  const diags: Diagnostic[] = [];
  const nodes: MdNode[] = [];
  let front: Frontmatter | null = null;
  let i = 0;

  if ((lines[0] ?? "").trim() === "---") {
    let close = -1;
    for (let j = 1; j < lines.length; j++) {
      if ((lines[j] ?? "").trim() === "---") {
        close = j;
        break;
      }
    }
    if (close < 0) {
      diags.push({
        severity: "error",
        code: "DG-P003",
        message: "frontmatter never closes — body parsed without it",
        file: path,
        span: { start: pos(1), end: pos(1, 4) },
      });
      i = 1;
    } else {
      front = parseFrontmatter(path, lines.slice(1, close), 2);
      i = close + 1;
    }
  }

  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.trim();
    if (line === "") {
      i += 1;
      continue;
    }
    // span over the lines [i, i + count)
    const at = (count: number): Span => ({
      start: pos(i + 1),
      end: pos(i + count, (lines[i + count - 1] ?? "").length + 1),
    });

    const fm = FENCE.exec(raw);
    if (fm !== null) {
      const marker = fm[1] ?? "```";
      const lang = fm[2] ?? "";
      const body: string[] = [];
      let j = i + 1;
      let closed = false;
      while (j < lines.length) {
        if ((lines[j] ?? "").trim().startsWith(marker)) {
          closed = true;
          break;
        }
        body.push(lines[j] ?? "");
        j += 1;
      }
      if (!closed) {
        diags.push({
          severity: "error",
          code: "DG-P004",
          message: `fence opened but never closed — rest of file taken as one block`,
          file: path,
          span: at(1),
        });
      }
      nodes.push({ kind: "fence", lang, text: body.join("\n"), span: at(j - i + 1) });
      i = j + 1;
      continue;
    }

    const hm = HEADING.exec(line);
    if (hm !== null) {
      nodes.push({
        kind: "heading",
        level: (hm[1] ?? "#").length,
        text: (hm[2] ?? "").trim(),
        span: at(1),
      });
      i += 1;
      continue;
    }

    const im = ITEM.exec(raw);
    if (im !== null) {
      const text = [(im[2] ?? "").trim()];
      let j = i + 1;
      while (j < lines.length) {
        const nxt = lines[j] ?? "";
        const nt = nxt.trim();
        if (nt === "" || HEADING.test(nt) || ITEM.test(nxt) || FENCE.test(nxt) || ROW.test(nxt)) break;
        if (/^\s{2,}/.test(nxt)) {
          text.push(nt);
          j += 1;
          continue;
        }
        break;
      }
      nodes.push({ kind: "item", text: text.join(" "), span: at(j - i) });
      i = j;
      continue;
    }

    const rm = ROW.exec(raw);
    if (rm !== null) {
      const cells = (rm[1] ?? "")
        .split("|")
        .map((c) => c.trim());
      const isSeparator = cells.length > 0 && cells.every((c) => SEPARATOR.test(c));
      if (!isSeparator) nodes.push({ kind: "table-row", cells, span: at(1) });
      i += 1;
      continue;
    }

    const para: string[] = [];
    let j = i;
    while (j < lines.length) {
      const nxt = lines[j] ?? "";
      const nt = nxt.trim();
      if (nt === "" || HEADING.test(nt) || ITEM.test(nxt) || FENCE.test(nxt) || ROW.test(nxt)) break;
      para.push(nt);
      j += 1;
    }
    nodes.push({ kind: "para", text: para.join(" "), span: at(j - i) });
    i = j;
  }

  return { path, front, nodes, diags };
}
