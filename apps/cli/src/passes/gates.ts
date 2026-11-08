/** The deliver gate — four pure checks over the parsed record.
 * Gate decisions happen here; the command only writes when every gate passes. */
import { join } from "node:path";
import { SCORE_FLOOR } from "../types.ts";
import { field } from "../record/frontmatter.ts";
import { readText } from "../fsx.ts";
import { acceptance, findSection } from "../record/sections.ts";
import { lastVerdict } from "./grillq.ts";
import { proofPaths, proofResolves, checkPass } from "./check.ts";
import { parseMarkdown } from "../record/markdown.ts";
import type { RecordAst, UnitAst } from "../record/load.ts";
import { TRACKER_REL } from "../record/load.ts";
import { DELIVERY_LOG_REL } from "../record/record-write.ts";

export interface Gate {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export function deliverGates(rec: RecordAst, unit: UnitAst): Gate[] {
  return [specGate(unit), scoreGate(rec, unit), grillGate(rec, unit), proofsGate(rec, unit)];
}

/** The launch gate — the post-delivery tiers. Delivery is the loop
 * accepting its own work; launch-passed is the record surviving a fresh
 * audit of reality, founder-signed is a named person's attestation. Four
 * checks: the delivered receipt exists, every proof path still resolves,
 * the record's own check pass is error-clean, and the delivery rows are
 * on file. */
export function launchGates(rec: RecordAst, unit: UnitAst): Gate[] {
  return [receiptGate(unit), proofsStillGate(rec, unit), checkCleanGate(rec), deliveryRowsGate(rec, unit)];
}

function receiptGate(unit: UnitAst): Gate {
  const ok = unit.markers.delivered !== null;
  return { id: "L1", label: "delivered receipt on file", passed: ok, detail: ok ? `${unit.markers.delivered} present` : "no delivered.md — the launch tiers start from a delivered unit (docodego deliver)" };
}

function proofsStillGate(rec: RecordAst, unit: UnitAst): Gate {
  const raw = unit.markers.proofs === null ? null : readText(join(rec.root, unit.markers.proofs));
  if (raw === null) return { id: "L2", label: "every proof path still resolving", passed: false, detail: "no proofs.md — the delivered unit's evidence vanished entirely" };
  const paths = proofPaths(parseMarkdown(unit.markers.proofs ?? "", raw));
  const dead = paths.filter((p) => !proofResolves(rec, unit, p));
  if (dead.length === 0) return { id: "L2", label: "every proof path still resolving", passed: true, detail: `${paths.length} proof path(s), all present` };
  const shown = dead.slice(0, 4).join(", ");
  const more = dead.length > 4 ? ` +${dead.length - 4} more` : "";
  return { id: "L2", label: "every proof path still resolving", passed: false, detail: `proof path(s) vanished since delivery: ${shown}${more} — evidence that no longer exists proves nothing` };
}

function checkCleanGate(rec: RecordAst): Gate {
  const errors = checkPass(rec).filter((d) => d.severity === "error");
  return {
    id: "L3",
    label: "record check clean (no errors)",
    passed: errors.length === 0,
    detail: errors.length === 0 ? "check pass: 0 errors" : `${errors.length} check error(s), first: ${errors[0]?.code} — ${errors[0]?.file}`,
  };
}

function deliveryRowsGate(rec: RecordAst, unit: UnitAst): Gate {
  const tracker = readText(join(rec.root, TRACKER_REL)) ?? "";
  const log = readText(join(rec.root, DELIVERY_LOG_REL)) ?? "";
  const inTracker = tracker.split("\n").some((l) => l.includes(`| ${unit.name} |`));
  const inLog = log.split("\n").some((l) => l.includes(unit.name));
  const ok = inTracker && inLog;
  return {
    id: "L4",
    label: "tracker + delivery-log rows on file",
    passed: ok,
    detail: ok ? "both rows present" : `missing: ${inTracker ? "" : "tracker row "}${inLog ? "" : "delivery-log row"} — a delivery the record cannot reconstruct did not happen`,
  };
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
  if (paths.length === 0)
    return {
      id: "G4",
      label: "at least one existing proof path",
      passed: false,
      detail: "proofs.md holds no path entries — write list items like: - path/to/proof.txt — what ran",
    };
  const existing = paths.filter((p) => proofResolves(rec, unit, p));
  if (existing.length > 0) return { id: "G4", label: "at least one existing proof path", passed: true, detail: `proof: ${existing[0]}` };
  const shown = paths.slice(0, 4).join(", ");
  const more = paths.length > 4 ? ` +${paths.length - 4} more` : "";
  return {
    id: "G4",
    label: "at least one existing proof path",
    passed: false,
    detail: `no proof path exists on disk — looked for: ${shown}${more} (paths resolve against the repo, the record root, and the unit folder)`,
  };
}
