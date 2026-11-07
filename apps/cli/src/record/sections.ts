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

/** The acceptance criteria: list items under an `acceptance` heading.
 * A criterion struck through (`~~…~~`) is superseded — the append law keeps
 * it visible while retired, so the grill must not question dead text. */
export function acceptance(file: FileAst): string[] {
  return (findSection(file, "acceptance")?.items ?? []).filter((item) => !isStruck(item));
}

/** An item is struck when its substantive text is wrapped in `~~` pairs. */
function isStruck(item: string): boolean {
  return (item.match(/~~/g)?.length ?? 0) >= 2;
}

/** Word count of a section body, prose and list items alike (bullets ignored). */
export function words(s: Section): number {
  return `${s.text}\n${s.items.join("\n")}`
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}
