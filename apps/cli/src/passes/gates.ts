/** The deliver gate — four pure checks over the parsed record.
 * Gate decisions happen here; the command only writes when every gate passes. */
import { join } from "node:path";
import { SCORE_FLOOR } from "../types.ts";
import { field } from "../record/frontmatter.ts";
import { readText, sha16 } from "../fsx.ts";
import { acceptance, findSection } from "../record/sections.ts";
import { lastVerdict } from "./grillq.ts";
import { proofPaths, proofResolves, checkPass } from "./check.ts";
import { scoreSpec } from "./score.ts";
import { DEMO_HOWTO_TEMPLATE } from "../bundled/index.ts";
import { demoHowToPath, DEMO_DIR_REL, DEMO_HOWTO_NAME } from "../record/record-write.ts";
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
  return [receiptGate(unit), proofsStillGate(rec, unit), checkCleanGate(rec), deliveryRowsGate(rec, unit), demoBundleGate(rec, unit)];
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

/** L5 — the demo bundle is filled (IMP-15): the founder's "show me it
 * working" has a home at demo/<unit>/, scaffolded at deliver, and this
 * gate refuses the unfilled form — bytes still identical to the template
 * mean nobody has said how to see the unit work. The pass stays pure:
 * the scaffold for a missing bundle is written by the launch command
 * before the gates run (repair forward), never by this pass. */
function demoBundleGate(rec: RecordAst, unit: UnitAst): Gate {
  const raw = readText(demoHowToPath(rec, unit.name));
  if (raw === null) return { id: "L5", label: "demo bundle filled", passed: false, detail: `no demo bundle at ${DEMO_DIR_REL}/${unit.name}/ — the scaffold should be beside this refusal; fill how-to-run.md (one honest line suffices) and re-run launch` };
  if (raw === DEMO_HOWTO_TEMPLATE) return { id: "L5", label: "demo bundle filled", passed: false, detail: `${DEMO_DIR_REL}/${unit.name}/${DEMO_HOWTO_NAME} is still the unfilled scaffold — say how to see it work (one honest line suffices), then re-run launch` };
  return { id: "L5", label: "demo bundle filled", passed: true, detail: "how-to-run.md filled — the show exists" };
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
  // the last block wins: scores append, so the final total:/spec-sha: lines
  // are the live verdict and earlier blocks are history
  const totals = [...raw.matchAll(/^total:\s*(\d+)\s*(?:\/\s*100)?\s*$/gim)];
  const totalLine = totals[totals.length - 1];
  const total = totalLine === undefined ? Number.NaN : Number.parseInt(totalLine[1] ?? "", 10);
  if (Number.isNaN(total)) return { id: "G2", label: `score >= ${SCORE_FLOOR}`, passed: false, detail: "score.md holds no 'total: n/100' line" };
  // the gate recomputes instead of trusting prose (cli-law 10/20a): a spec
  // edited after scoring fails stale by sha; a hand-edited total fails the
  // recompute — neither borrows a verdict the spec no longer earns
  const shas = [...raw.matchAll(/^spec-sha:\s*([0-9a-f]{16})\s*$/gim)];
  const sha = shas.length === 0 ? null : shas[shas.length - 1]?.[1] ?? null;
  const current = sha16(readText(join(rec.root, unit.dir, "spec.md")) ?? "");
  if (sha === null) return { id: "G2", label: `score >= ${SCORE_FLOOR}`, passed: false, detail: "the score block carries no spec-sha — re-run 'docodego score' (a score must bind the spec it scored)" };
  if (sha !== current) return { id: "G2", label: `score >= ${SCORE_FLOOR}`, passed: false, detail: `the score is stale — it binds spec sha ${sha}, the spec is now ${current}; re-run 'docodego score'` };
  const recomputed = scoreSpec(unit).total;
  if (total !== recomputed) return { id: "G2", label: `score >= ${SCORE_FLOOR}`, passed: false, detail: `score.md says ${total}/100 but the spec scores ${recomputed}/100 — the recorded total does not recompute; re-run 'docodego score'` };
  return {
    id: "G2",
    label: `score >= ${SCORE_FLOOR}`,
    passed: total >= SCORE_FLOOR,
    detail: `recomputed ${recomputed}/100 — matches the recorded block (spec-sha ${current})`,
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
  if (existing.length > 0) {
    const dead = paths.filter((p) => !proofResolves(rec, unit, p));
    const warn = dead.length === 0 ? "" : ` · warning: ${dead.length} path-like span(s) do not resolve (${dead.slice(0, 3).join(", ")}) — launch will refuse if they are proof paths`;
    return { id: "G4", label: "at least one existing proof path", passed: true, detail: `proof: ${existing[0]}${warn}` };
  }
  const shown = paths.slice(0, 4).join(", ");
  const more = paths.length > 4 ? ` +${paths.length - 4} more` : "";
  return {
    id: "G4",
    label: "at least one existing proof path",
    passed: false,
    detail: `no proof path exists on disk — looked for: ${shown}${more} (paths resolve against the repo, the record root, and the unit folder)`,
  };
}
