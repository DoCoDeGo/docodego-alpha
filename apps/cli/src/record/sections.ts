/** Sections — the semantic view of a parsed file: headings with their bodies. */
import type { Span } from "../types.ts";
import type { FileAst } from "./markdown.ts";

export interface Section {
  title: string; // lowercased heading text
  level: number;
  text: string; // paragraph/fence/table text under the heading
  items: string[]; // list items under the heading
  span: Span;
}

/** Group the AST into sections. Content before the first heading is dropped. */
export function sectionsOf(file: FileAst): Section[] {
  const out: Section[] = [];
  let cur: { title: string; level: number; body: string[]; items: string[]; span: Span } | null = null;
  const flush = (): void => {
    if (cur !== null) {
      out.push({ title: cur.title, level: cur.level, text: cur.body.join("\n"), items: cur.items, span: cur.span });
    }
  };
  for (const node of file.nodes) {
    if (node.kind === "heading") {
      flush();
      cur = { title: node.text.toLowerCase(), level: node.level, body: [], items: [], span: node.span };
      continue;
    }
    if (cur === null) continue;
    if (node.kind === "item") cur.items.push(node.text);
    else if (node.kind === "para") cur.body.push(node.text);
    else if (node.kind === "table-row") cur.body.push(node.cells.join(" | "));
    else if (node.kind === "fence") cur.body.push(node.text);
  }
  flush();
  return out;
}

/** Case-insensitive lookup by heading title (exact match preferred). */
export function findSection(file: FileAst, title: string): Section | undefined {
  const t = title.toLowerCase();
  const secs = sectionsOf(file);
  return secs.find((s) => s.title === t) ?? secs.find((s) => s.title.startsWith(t));
}

/** The acceptance criteria: list items under an `acceptance` heading. */
export function acceptance(file: FileAst): string[] {
  return findSection(file, "acceptance")?.items ?? [];
}

/** Word count of a section body, ignoring list bullets. */
export function words(s: Section): number {
  return s.text.split(/\s+/).filter((w) => w.length > 0).length;
}
