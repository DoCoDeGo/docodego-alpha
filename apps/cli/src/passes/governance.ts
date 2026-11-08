/** The governance pass — the record graded as a whole, not file by file.
 * Shape checks (the rest of the passes) read one unit at a time; this
 * pass reads the ledgers against the units: a delivered unit's tracker
 * row, its delivery-log row, and its latest grill verdict. The verdict
 * detector is the one source of truth shared with `audit`, whose GOV-003
 * keeps the error severity from the same facts check reports as
 * warnings. Errors here mean the ledgers and the units disagree — the
 * record claiming more than its evidence holds. */
import { join } from "node:path";
import type { Diagnostic } from "../types.ts";
import { readText } from "../fsx.ts";
import { TRACKER_REL, unitStatus, type RecordAst } from "../record/load.ts";
import { DELIVERY_LOG_REL } from "../record/record-write.ts";

const DELIVERED_CLASS = new Set(["delivered", "launch-passed", "founder-signed"]);

const cell = (name: string): RegExp => new RegExp(`^\\|\\s*20\\d\\d-\\d\\d-\\d\\d\\s*\\|[^|]*\\b${name.replace(/[-]/g, "\\-")}\\b`, "m");

/** The names a unit answers to: its own, plus the tomb's `was:` chain —
 * a retired unit's landing rows carry the name it landed under. */
function identityNames(rec: RecordAst, unitName: string): string[] {
  const out = [unitName];
  const unit = rec.units.find((u) => u.name === unitName);
  const spec = unit === undefined ? null : readText(join(rec.root, unit.dir, "spec.md"));
  const was = spec === null ? null : /^was:\s*(\S+)\s*$/m.exec(spec)?.[1];
  if (was !== undefined && was !== null && was !== unitName) out.push(was);
  return out;
}

/** Every delivered-class unit paired with its latest grill verdict —
 * the facts both instruments report. */
export function verdictIncoherence(rec: RecordAst): Array<{ unit: string; detail: string }> {
  const out: Array<{ unit: string; detail: string }> = [];
  for (const unit of rec.units) {
    if (!DELIVERED_CLASS.has(unitStatus(unit))) continue;
    const grillRel = unit.markers.grill;
    if (grillRel === null) {
      out.push({ unit: unit.name, detail: "has no grill record — a delivery without a verdict is a claim without evidence" });
      continue;
    }
    const grill = readText(join(rec.root, grillRel)) ?? "";
    const verdicts = [...grill.matchAll(/^verdict:\s*(\w+)\s*$/gm)].map((m) => m[1]);
    const latest = verdicts[verdicts.length - 1];
    if (latest === undefined) out.push({ unit: unit.name, detail: "is delivered but its grill record holds no verdict" });
    else if (latest !== "pass") out.push({ unit: unit.name, detail: `is delivered but its latest grill verdict is '${latest}' — status contradicts evidence` });
  }
  return out;
}

export function governanceFindings(rec: RecordAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  const tracker = readText(join(rec.root, TRACKER_REL)) ?? "";
  const log = readText(join(rec.root, DELIVERY_LOG_REL)) ?? "";
  for (const unit of rec.units) {
    if (!DELIVERED_CLASS.has(unitStatus(unit))) continue;
    const identity = identityNames(rec, unit.name);
    if (!identity.some((n) => cell(n).test(tracker))) {
      out.push({ severity: "error", code: "DG-C011", message: `unit '${unit.name}' is delivered but the tracker holds no row naming it — the ledger and the units disagree`, file: TRACKER_REL });
    }
    if (!identity.some((n) => cell(n).test(log))) {
      out.push({ severity: "error", code: "DG-C012", message: `unit '${unit.name}' is delivered but the delivery log holds no row naming it — the landing is not recorded`, file: DELIVERY_LOG_REL });
    }
  }
  const names = new Set(rec.units.map((u) => u.name));
  for (const m of log.matchAll(/^\|\s*20\d\d-\d\d-\d\d\s*\|\s*([^|]+?)\s*\|/gm)) {
    const row = m[1] ?? "";
    // a name no unit carries AND no tracker row ever carried is a ghost —
    // retired units keep their tracker rows, so history stays honest
    if (!names.has(row) && !cell(row).test(tracker)) {
      out.push({ severity: "warning", class: "drift", code: "DG-C013", message: `the delivery log names '${row}' — no such unit in the record`, file: DELIVERY_LOG_REL });
    }
  }
  for (const v of verdictIncoherence(rec)) {
    out.push({ severity: "warning", class: "drift", code: "DG-C014", message: `unit '${v.unit}' ${v.detail}`, file: join(v.unit, "spec.md") });
  }
  return out;
}
