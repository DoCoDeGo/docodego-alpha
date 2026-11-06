/** The deliver gate — four pure checks over the parsed record.
 * Gate decisions happen here; the command only writes when every gate passes. */
import { join } from "node:path";
import { SCORE_FLOOR } from "../types.ts";
import { field } from "../record/frontmatter.ts";
import { readText } from "../fsx.ts";
import { acceptance, findSection } from "../record/sections.ts";
import { lastVerdict } from "./grillq.ts";
import { proofPaths, proofResolves } from "./check.ts";
import { parseMarkdown } from "../record/markdown.ts";
import type { RecordAst, UnitAst } from "../record/load.ts";

export interface Gate {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export function deliverGates(rec: RecordAst, unit: UnitAst): Gate[] {
  return [specGate(unit), scoreGate(rec, unit), grillGate(rec, unit), proofsGate(rec, unit)];
}

function specGate(unit: UnitAst): Gate {
  const spec = unit.spec;
  const fm = spec?.front ?? null;
  const name = field(fm, "name");
  const type = field(fm, "type");
  const intent = spec !== null ? findSection(spec, "intent") : undefined;
  const criteria = spec !== null ? acceptance(spec) : [];
  const problems: string[] = [];
  if (spec === null || fm === null) problems.push("no parseable spec.md");
  if (name !== unit.name) problems.push(`name field is '${name ?? "none"}'`);
  if (type === undefined || !["unit", "epic", "story"].includes(type)) problems.push(`type field is '${type ?? "none"}'`);
  if (intent === undefined || intent.text.trim() === "") problems.push("intent section missing or empty");
  if (criteria.length === 0) problems.push("no acceptance criteria");
  return {
    id: "G1",
    label: "spec complete (frontmatter, intent, acceptance)",
    passed: problems.length === 0,
    detail: problems.length === 0 ? "frontmatter, intent and acceptance in place" : problems.join("; "),
  };
}

function scoreGate(rec: RecordAst, unit: UnitAst): Gate {
  const raw = unit.markers.score === null ? null : readText(join(rec.root, unit.markers.score));
  if (raw === null) return { id: "G2", label: `score >= ${SCORE_FLOOR}`, passed: false, detail: "no score.md — run docodego score" };
  const m = /(^|\n)\s*total:\s*(\d+)\s*(?:\/\s*100)?/i.exec(raw);
  const total = m === null ? Number.NaN : Number.parseInt(m[2] ?? "", 10);
  if (Number.isNaN(total)) return { id: "G2", label: `score >= ${SCORE_FLOOR}`, passed: false, detail: "score.md holds no 'total: n/100' line" };
  return {
    id: "G2",
    label: `score >= ${SCORE_FLOOR}`,
    passed: total >= SCORE_FLOOR,
    detail: `total ${total}/100`,
  };
}

function grillGate(rec: RecordAst, unit: UnitAst): Gate {
  const raw = unit.markers.grill === null ? null : readText(join(rec.root, unit.markers.grill));
  if (raw === null) return { id: "G3", label: "grill verdict pass", passed: false, detail: "no grill.md — run docodego grill" };
  const verdict = lastVerdict(raw);
  return { id: "G3", label: "grill verdict pass", passed: verdict === "pass", detail: `latest verdict: ${verdict}` };
}

function proofsGate(rec: RecordAst, unit: UnitAst): Gate {
  const raw = unit.markers.proofs === null ? null : readText(join(rec.root, unit.markers.proofs));
  if (raw === null) return { id: "G4", label: "at least one existing proof path", passed: false, detail: "no proofs.md" };
  const paths = proofPaths(parseMarkdown(unit.markers.proofs ?? "", raw));
  if (paths.length === 0) return { id: "G4", label: "at least one existing proof path", passed: false, detail: "proofs.md holds no path entries" };
  const existing = paths.filter((p) => proofResolves(rec, unit, p));
  return {
    id: "G4",
    label: "at least one existing proof path",
    passed: existing.length > 0,
    detail: existing.length > 0 ? `proof: ${existing[0]}` : `none of ${paths.length} path(s) exist on disk`,
  };
}
