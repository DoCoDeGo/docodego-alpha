/** The law loader — walk spec/laws/, parse each file once, and carry the
 * frontmatter as data. Also the two version readers: SPEC.md's semver and
 * the amendment log's last row. Loader findings are diagnostics, never
 * fatal: a broken law file is judged, not unrunnable. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { field, parseFrontmatter } from "./frontmatter.ts";
import { SPEC_ROOT_MISSING } from "./errors.ts";
import type { Diagnostic } from "./types.ts";
export interface Law {
  id: string;
  title: string;
  pillar: string;
  /** Statutes carry the arc stream they govern (ST-1 → validate); engine
   * laws leave it empty. Doctor's payload-mirror check reads it. */
  stream: string;
  severity: string;
  enforcedBy: string;
  introducedIn: string;
  status: string;
  /** Path relative to the spec root — how diagnostics and receipts cite it. */
  file: string;
}

export interface SpecRead {
  laws: Law[];
  /** Parse and loader findings; the gates' own findings ride on top. */
  diagnostics: Diagnostic[];
  specVersion?: string;
  lastAmendmentVersion?: string;
}

const LAW_FILE = /^(\d{2})-[a-z0-9-]+\.md$/;
const SPEC_VERSION = /\*\*Version:\*\*\s*([0-9]+\.[0-9]+\.[0-9]+)/;
const AMENDMENT_ROW = /^\|\s*([0-9]+\.[0-9]+\.[0-9]+)\s*\|\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*\|/;

function readLines(path: string): string[] {
  return readFileSync(path, "utf8").split(/\r?\n/);
}

/** Parse one law file's frontmatter block into a Law (fields may be absent —
 * the gates judge completeness; the loader only refuses what it cannot read). */
function readLaw(file: string, abs: string, diags: Diagnostic[]): Law {
  const lines = readLines(abs);
  let law: Law = {
    id: "", title: "", pillar: "", stream: "", severity: "", enforcedBy: "", introducedIn: "", status: "", file,
  };
  if (lines[0]?.trim() !== "---") return law; // no frontmatter: lint reports it, loader moves on
  const close = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (close === -1) {
    diags.push({
      severity: "error", code: "SP-P002",
      message: "frontmatter opened but never closed — no second '---' found",
      file, span: { start: { line: 1, col: 1 }, end: { line: 1, col: 4 } },
    });
    return law;
  }
  const fm = parseFrontmatter(file, lines.slice(1, close), 2);
  diags.push(...fm.errors);
  law = {
    id: field(fm, "id") ?? "",
    title: field(fm, "title") ?? "",
    pillar: field(fm, "pillar") ?? "",
    stream: field(fm, "stream") ?? "",
    severity: field(fm, "severity") ?? "",
    enforcedBy: field(fm, "enforced-by") ?? "",
    introducedIn: field(fm, "introduced-in") ?? "",
    status: field(fm, "status") ?? "",
    file,
  };
  return law;
}

/** Read the whole spec tree once: laws, SPEC.md's version, the log's tail. */
export function loadSpec(root: string): SpecRead {
  let entries: string[];
  try {
    entries = readdirSync(join(root, "laws"));
  } catch {
    throw SPEC_ROOT_MISSING(root);
  }
  const diags: Diagnostic[] = [];
  const laws: Law[] = [];
  for (const name of entries.sort()) {
    const m = LAW_FILE.exec(name);
    if (m === null) continue; // README and friends are not law files
    laws.push(readLaw(`laws/${name}`, join(root, "laws", name), diags));
  }

  let specVersion: string | undefined;
  try {
    const spec = readLines(join(root, "SPEC.md")).join("\n");
    specVersion = SPEC_VERSION.exec(spec)?.[1];
  } catch {
    specVersion = undefined; // a missing front door is verify's finding, not the loader's
  }

  let lastAmendmentVersion: string | undefined;
  try {
    const rows = readLines(join(root, "amendments", "log.md"));
    for (const line of rows) {
      const hit = AMENDMENT_ROW.exec(line);
      if (hit !== null) lastAmendmentVersion = hit[1];
    }
  } catch {
    lastAmendmentVersion = undefined; // same: verify judges the missing trail
  }

  return { laws, diagnostics: diags, specVersion, lastAmendmentVersion };
}

/** Compare two semver triples; -1 a<b, 0 equal, 1 a>b. Shared by build
 * (version sanity) and amend (the scaffold's proposed version). */
export function cmpVersion(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number(n) || 0);
  const pb = b.split(".").map((n) => Number(n) || 0);
  for (let i = 0; i < 3; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

/** A clause has a lead when it is written `lead — detail`. Leads split on
 * commas (`check, lint — rewrite detection` names two enforcers). Shared by
 * verify (known-lead check) and coverage (classification). */
export function enforcerLeads(enforcedBy: string): string[] {
  const leads: string[] = [];
  for (const clause of enforcedBy.split(";")) {
    const dash = clause.indexOf(" — ");
    if (dash === -1) continue;
    for (const piece of clause.slice(0, dash).split(",")) {
      const lead = piece.trim();
      if (lead !== "") leads.push(lead);
    }
  }
  return leads;
}

/** Every .md file under a root, as sorted paths relative to it. Shared by
 * lint (structure rules) and verify (link/anchor walks). */
export function walkMd(root: string): string[] {
  const out: string[] = [];
  const walk = (rel: string): void => {
    for (const name of readdirSync(join(root, rel), { withFileTypes: true })) {
      const r = rel === "" ? name.name : `${rel}/${name.name}`;
      if (name.isDirectory()) walk(r);
      else if (name.name.endsWith(".md")) out.push(r);
    }
  };
  walk("");
  return out.sort();
}
