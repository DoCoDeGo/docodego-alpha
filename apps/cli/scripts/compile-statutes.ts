/** compile-statutes — generate the planted statutes reference page from
 * the canon. The spec tree (canon/laws, ST-1…16) is the single source of
 * truth: titles, arc streams, published words, and † completions are read
 * from the law files; `.docodego/.standard/statutes.md` is emitted
 * deterministically — never hand-maintained beside the spec it mirrors.
 * Modes: (default) write the page; --check recompute and compare, exit 1
 * on drift. Run: node --experimental-strip-types scripts/compile-statutes.ts [--check]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..", "..", "..");
const LAWS_DIR = join(ROOT, "canon", "laws");
const OUT = join(ROOT, ".docodego", ".standard", "statutes.md");

const LAW_FILE = /^(\d{2})-[a-z0-9-]+\.md$/;
const PILLAR_SECTIONS: Record<string, string> = {
  document: "## DO — document · the Author",
  compose: "## CO — compose · the Architect",
  demonstrate: "## DE — demonstrate · the Gatekeeper",
  govern: "## GO — govern · the Recorder",
};

interface Statute {
  n: number;
  title: string;
  stream: string;
  pillar: string;
  published?: string;
  completion?: string;
  gloss: boolean;
}

function field(fm: string[], key: string): string {
  const hit = fm.find((l) => l.startsWith(`${key}:`));
  return hit === undefined ? "" : hit.slice(key.length + 1).trim();
}

/** Collect a double-quoted string starting on the marker line, joined
 * across continuation lines until the closing quote. */
function quotedAfter(lines: string[], marker: RegExp): string | undefined {
  const i = lines.findIndex((l) => marker.test(l));
  if (i === -1) return undefined;
  let buf = "";
  for (let j = i; j < lines.length; j++) {
    const piece = lines[j]?.trim() ?? "";
    buf += (buf === "" ? "" : " ") + piece;
    const open = buf.indexOf('"');
    if (open !== -1) {
      const close = buf.lastIndexOf('"');
      if (close > open) return buf.slice(open + 1, close);
    }
  }
  return undefined;
}

function readStatute(file: string): Statute | undefined {
  const raw = readFileSync(join(LAWS_DIR, file), "utf8");
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return undefined;
  const close = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (close === -1) return undefined;
  const fm = lines.slice(1, close);
  const id = field(fm, "id");
  const m = /^ST-(\d+)$/.exec(id);
  if (m === null) return undefined; // engine laws are not statutes
  const lawStart = lines.findIndex((l) => l.trim() === "## The law");
  const lawEnd = lines.findIndex((l, i) => i > lawStart && l.startsWith("## "));
  const law = lines.slice(lawStart + 1, lawEnd === -1 ? lines.length : lawEnd);
  return {
    n: Number(m[1]),
    title: field(fm, "title"),
    stream: field(fm, "stream"),
    pillar: field(fm, "pillar"),
    published: quotedAfter(law, /^Published:/),
    completion: quotedAfter(law, /^Completion †/),
    gloss: law.some((l) => l.includes("read with a gloss")),
  };
}

const wrap = (text: string, indent: string, first: string): string => {
  // fold a long line to ~78 columns, continuation lines indented
  const words = text.split(" ");
  const out: string[] = [];
  let line = first;
  for (const w of words) {
    if ((line + w).length > 78 && line.trim() !== "") {
      out.push(line.trimEnd());
      line = indent + w + " ";
    } else {
      line += w + " ";
    }
  }
  if (line.trim() !== "") out.push(line.trimEnd());
  return out.join("\n");
};

export function compile(): string {
  const statutes: Statute[] = [];
  for (const file of readdirSync(LAWS_DIR).sort()) {
    const m = LAW_FILE.exec(file);
    if (m === null) continue;
    const s = readStatute(file);
    if (s !== undefined) statutes.push(s);
  }
  statutes.sort((a, b) => a.n - b.n);

  const glosses = statutes.filter((s) => s.gloss).map((s) => s.n);
  const glossNote =
    glosses.length === 0
      ? ""
      : wrap(
          `Statutes ${glosses.join(" and ")} are complete as published, read with a gloss.`,
          "    ",
          "\n",
        );
  const head = [
    "# the sixteen statutes",
    "",
    "Source: docodego.com, \"Sixteen principles. Four pillars. One discipline.\"",
    "Recorded verbatim, 2026-11-06. The site's own enforcement claim: each",
    "principle is violable in a specific way; each violation is observable.",
    "Compiled from the DoCoDeGo Specification (canon/laws, ST-1…16): each",
    "statute binds one stream of the loop, per the arc's Appendix B. Lines",
    "marked † are docodego's completions, recorded honestly beside the",
    `published words.${glossNote}`,
    "",
    "",
  ].join("\n");

  let body = "";
  for (const [pillar, header] of Object.entries(PILLAR_SECTIONS)) {
    const group = statutes.filter((s) => s.pillar === pillar);
    if (group.length === 0) continue;
    const first = group[0]?.n ?? 0;
    const last = group[group.length - 1]?.n ?? 0;
    body += `${header} (statutes ${first}–${last})\n`;
    for (const s of group) {
      body += `${s.n}. ${s.title} — binds ${s.stream}\n`;
      if (s.completion !== undefined) body += `${wrap(`† ${s.completion}`, "   ", "   ")}\n`;
    }
    body += "\n";
  }
  const doctrine = [
    "Companion doctrine, verbatim from the site: the DoCoDeGo Axiom — \"Intent is",
    "the primary artefact. Implementation is a compiled derivative. Governance is",
    "earned through the loop.\" IRAF — Intent → Reasoning → Action → Feedback —",
    "replaces the sprint and the release.",
  ].join("\n");
  return head + body + doctrine + "\n";
}

const check = process.argv.includes("--check");
const compiled = compile();
if (check) {
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {
    current = "";
  }
  if (current === compiled) {
    console.log("statutes page matches the canon");
    process.exit(0);
  }
  console.error(`statutes page drifted from the canon — run: node --experimental-strip-types scripts/compile-statutes.ts`);
  process.exit(1);
}
writeFileSync(OUT, compiled);
console.log(`statutes page compiled → ${join(".docodego", ".standard", "statutes.md")}`);
