/** lint — document-standard conformance over the spec tree
 * (spec/meta/document-standard.md). Rules check only what the standard
 * declares mechanical: one H1 naming the thing, a purpose paragraph,
 * frontmatter schema, enums, id/filename agreement. Prose quality is never
 * scored by the tool — a lint that judges prose breeds resentment, and a
 * resented lint is evaded (the law behind this is EL-30's test). */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadSpec, walkMd } from "../laws.ts";
import { PILLARS, SEVERITIES, STATUS_ACTIVE, STATUS_LATER } from "../registry.ts";
import { exitFor, emit } from "../errors.ts";
import { countsOf } from "../emit.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/lint/v1";

const LAW_FILE = /^laws\/(\d{2})-[a-z0-9-]+\.md$/;
const DECORATIVE = /^##\s+(overview|details|misc|other|introduction)\s*$/i;
const NORMATIVE = /\b(?:MUST|NEVER|REQUIRED|SHALL)\b/;
const REQUIRED_KEYS = ["id", "title", "pillar", "severity", "enforced-by", "introduced-in", "status"];

const at = (line: number) => ({ start: { line, col: 1 }, end: { line, col: 120 } });

const isLawFile = (file: string): RegExpExecArray | null => LAW_FILE.exec(file);

/** Document standard, mechanical subset: an H1 naming the thing, then a
 * purpose paragraph before the first section. */
function checkTitleAndPurpose(lines: string[], file: string, diags: Diagnostic[]): void {
  const h1 = lines.findIndex((l) => /^#\s+\S/.test(l));
  if (h1 === -1) {
    diags.push({
      severity: "error", code: "SP-L001",
      message: "no H1 title — the document standard wants one title, naming the thing",
      file, span: at(1),
    });
    return;
  }
  const firstH2 = lines.findIndex((l, i) => i > h1 && /^##\s/.test(l));
  const purpose = lines.findIndex(
    (l, i) => i > h1 && l.trim() !== "" && !l.startsWith("#") && (firstH2 === -1 || i < firstH2),
  );
  if (purpose === -1) {
    diags.push({
      severity: "error", code: "SP-L002",
      message: "no purpose paragraph between the title and the first section — a reader should be able to stop there",
      file, span: at(h1 + 1),
    });
  }
}

export function run(args: Args, io: Io): number {
  const root = args.root ?? "spec";
  const read = loadSpec(root);
  const diags: Diagnostic[] = [...read.diagnostics];
  const seenIds = new Map<string, string>(); // id -> first file carrying it

  const files = walkMd(root);
  for (const file of files) {
    const lines = readFileSync(join(root, file), "utf8").split(/\r?\n/);
    checkTitleAndPurpose(lines, file, diags);
    for (const [idx, line] of lines.entries()) {
      if (DECORATIVE.test(line.trim())) {
        diags.push({
          severity: "warning", code: "SP-L008",
          message: `decorative heading — a heading that could sit over any document is not a heading: "${line.trim()}"`,
          file, span: at(idx + 1),
        });
      }
    }

    // law files carry the full frontmatter schema
    const m = isLawFile(file);
    if (m === null) continue;
    const law = read.laws.find((l) => l.file === file);
    if (law === undefined) continue;

    const missing = REQUIRED_KEYS.filter((k) => lawValue(law, k) === "");
    if (missing.length > 0) {
      diags.push({
        severity: "error", code: "SP-L003",
        message: `frontmatter missing required key(s): ${missing.join(", ")}`,
        file, span: at(1),
      });
    }
    if (law.pillar !== "" && !PILLARS.includes(law.pillar)) {
      diags.push({
        severity: "error", code: "SP-L004",
        message: `pillar '${law.pillar}' is not one of ${PILLARS.join(" | ")}`,
        file, span: at(4),
      });
    }
    if (law.severity !== "" && !SEVERITIES.includes(law.severity)) {
      diags.push({
        severity: "error", code: "SP-L004",
        message: `severity '${law.severity}' is not one of ${SEVERITIES.join(" | ")}`,
        file, span: at(6),
      });
    }
    if (law.status !== "" && law.status !== STATUS_ACTIVE && !STATUS_LATER.test(law.status)) {
      diags.push({
        severity: "error", code: "SP-L004",
        message: `status '${law.status}' is not active or amended-in-<version>/withdrawn-in-<version>`,
        file, span: at(9),
      });
    }

    // ReSpec's rule, adopted: normative keywords without an enforcer escalate
    const body = lines.join("\n");
    if (law.enforcedBy === "" && NORMATIVE.test(body)) {
      diags.push({
        severity: "error", code: "SP-L005",
        message: "law uses normative keywords (MUST/NEVER/REQUIRED/SHALL) but names no enforcer — enforced-by is required",
        file, span: at(1),
      });
    }

    // the anchor and the filename agree: laws/NN-*.md carries law NN
    const fileNum = Number(m[1] ?? 0);
    const idNum = /^([SE][TL])-(\d+)$/.exec(law.id);
    if (law.id !== "" && idNum !== null) {
      const n = Number(idNum[2] ?? 0);
      const isStatute = (idNum[1] ?? "") === "ST";
      const inRange = isStatute ? n >= 1 && n <= 16 : n >= 17;
      if (n !== fileNum || !inRange) {
        diags.push({
          severity: "error", code: "SP-L006",
          message: `anchor and filename disagree — laws/${m[1]}-*.md must carry ${isStatute ? "ST" : "EL"}-${m[1]}`,
          file, span: at(2),
        });
      }
    }
    if (law.id !== "") {
      const first = seenIds.get(law.id);
      if (first !== undefined) {
        diags.push({
          severity: "error", code: "SP-L007",
          message: `duplicate law id '${law.id}' — first carried by ${first}; anchors are forever, ids are unique`,
          file, span: at(2),
        });
      } else {
        seenIds.set(law.id, file);
      }
    }
  }

  const counts = countsOf(diags);
  emit(io, args.json, SCHEMA, { root, files: files.length, laws: read.laws.length, diagnostics: diags });
  if (!args.json) {
    io.out(renderAll(diags));
    io.out(`canon lint · ${files.length} file(s) · ${read.laws.length} law(s) · ${counts.errors} error(s), ${counts.warnings} warning(s)`);
  }
  return exitFor(diags);
}

function lawValue(law: { id: string; title: string; pillar: string; severity: string; enforcedBy: string; introducedIn: string; status: string }, key: string): string {
  switch (key) {
    case "id": return law.id;
    case "title": return law.title;
    case "pillar": return law.pillar;
    case "severity": return law.severity;
    case "enforced-by": return law.enforcedBy;
    case "introduced-in": return law.introducedIn;
    case "status": return law.status;
    default: return "";
  }
}

function renderAll(diags: Diagnostic[]): string {
  if (diags.length === 0) return "nothing to report";
  return diags
    .map((d) => {
      const head = `spec ${d.severity}[${d.code}]: ${d.message}`;
      const loc = d.file !== undefined
        ? (d.span !== undefined ? `\n  --> ${d.file}:${d.span.start.line}:${d.span.start.col}` : `\n  --> ${d.file}`)
        : "";
      return `${head}${loc}`;
    })
    .join("\n");
}
