/** Check pass — record integrity: delivered units must carry proofs that exist,
 * status claims must match the markers on disk, links must resolve.
 * Pure apart from fs existence probes on proof paths. */
import { join } from "node:path";
import type { Diagnostic } from "../types.ts";
import { field } from "../record/frontmatter.ts";
import { isDir, isFile, readText } from "../fsx.ts";
import { parseMarkdown, type FileAst } from "../record/markdown.ts";
import { unitStatus, type RecordAst, type UnitAst } from "../record/load.ts";

export function checkPass(rec: RecordAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  for (const unit of rec.units) out.push(...checkUnit(rec, unit));
  for (const sketch of rec.sketches) out.push(...sketch.file.diags);
  return out;
}

function checkUnit(rec: RecordAst, unit: UnitAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  if (unit.spec !== null) out.push(...unit.spec.diags);
  const status = unitStatus(unit);
  const claimsGrill = status === "grilled" || status === "scored" || status === "delivered";
  const claimsScore = status === "scored" || status === "delivered";

  if (claimsGrill && unit.markers.grill === null) {
    out.push({ severity: "error", code: "DG-C003", message: `status '${status}' claims a grilling but grill.md is missing`, file: `${unit.dir}/grill.md` });
  }
  if (claimsScore && unit.markers.score === null) {
    out.push({ severity: "error", code: "DG-C003", message: `status '${status}' claims a score but score.md is missing`, file: `${unit.dir}/score.md` });
  }
  if (status === "delivered") {
    if (unit.markers.delivered === null) {
      out.push({ severity: "error", code: "DG-C004", message: "status 'delivered' but delivered.md is missing", file: `${unit.dir}/delivered.md` });
    }
    out.push(...checkProofs(rec, unit));
  }
  if (unit.markers.grill !== null) {
    const raw = readText(join(rec.root, unit.markers.grill)) ?? "";
    if (!/\bverdict:\s*(pass|fail)\b/i.test(raw)) {
      out.push({ severity: "warning", code: "DG-C007", message: "grill.md holds no readable verdict line", file: unit.markers.grill });
    }
  }
  for (const linkKey of ["epic", "story"] as const) {
    const link = field(unit.spec?.front ?? null, linkKey);
    if (link === undefined) continue;
    const target = rec.units.find((u) => u.name === link);
    if (target === undefined) {
      out.push({ severity: "warning", code: "DG-C006", message: `broken link: ${linkKey} '${link}' names no unit in the record`, file: unit.dir });
    }
  }
  return out;
}

function checkProofs(rec: RecordAst, unit: UnitAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  if (unit.markers.proofs === null) {
    out.push({ severity: "error", code: "DG-C001", message: `delivered unit '${unit.name}' has no proofs.md`, file: `${unit.dir}/proofs.md` });
    return out;
  }
  const raw = readText(join(rec.root, unit.markers.proofs));
  if (raw === null) {
    out.push({ severity: "error", code: "DG-C001", message: `proofs.md exists but cannot be read`, file: unit.markers.proofs });
    return out;
  }
  const proofs = parseMarkdown(unit.markers.proofs, raw);
  const paths = proofPaths(proofs);
  if (paths.length === 0) {
    out.push({ severity: "error", code: "DG-C001", message: "proofs.md holds no path entries", file: unit.markers.proofs });
    return out;
  }
  for (const p of paths) {
    if (!proofResolves(rec, unit, p)) {
      out.push({ severity: "error", code: "DG-C002", message: `proof path does not exist: ${p}`, file: unit.markers.proofs });
    }
  }
  return out;
}

/** First path-like token of every list item in a parsed proofs.md. */
export function proofPaths(proofs: FileAst): string[] {
  const out: string[] = [];
  for (const node of proofs.nodes) {
    if (node.kind !== "item") continue;
    const token = node.text.replace(/`/g, "").trim().split(/\s+/)[0] ?? "";
    if (token !== "") out.push(token);
  }
  return out;
}

/** A proof path may sit relative to the working dir, the record root, or the unit. */
export function proofResolves(rec: RecordAst, unit: UnitAst, p: string): boolean {
  return (
    isFile(join(rec.cwd, p)) ||
    isDir(join(rec.cwd, p)) ||
    isFile(join(rec.root, p)) ||
    isFile(join(rec.root, unit.dir, p))
  );
}
