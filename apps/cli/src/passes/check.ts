/** Check pass — record integrity: delivered units must carry proofs that exist,
 * status claims must match the markers on disk, links must resolve.
 * Pure apart from fs existence probes on proof paths. */
import { join, isAbsolute } from "node:path";
import { STATUS_VALUES, type Diagnostic } from "../types.ts";
import { vocabularyPack, VOCABULARY_NAMES } from "../bundled/index.ts";
import { field } from "../record/frontmatter.ts";
import { isDir, isFile, readText } from "../fsx.ts";
import { parseMarkdown, type FileAst } from "../record/markdown.ts";
import { unitStatus, type RecordAst, type UnitAst } from "../record/load.ts";

export function checkPass(rec: RecordAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  // the silent downgrade (enhancement 14): a manifest naming a pack this
  // CLI does not bundle reads canonical English and nothing says so — the
  // record's dialect vanished without a word. One detector, both surfaces:
  // doctor's record-check tally reads this same pass.
  const asked = rec.manifest.vocabulary;
  if (asked !== undefined && vocabularyPack(asked) === undefined) {
    out.push({ severity: "error", code: "DG-C016", message: `manifest.vocabulary names '${asked}' but this CLI bundles no such pack (bundled: ${VOCABULARY_NAMES.join(", ")}) — a downgrade or a typo; the record's dialect is not speaking. Fix the manifest's vocabulary field or run this record with a CLI that bundles the pack`, file: "manifest.json" });
  }
  for (const unit of rec.units) out.push(...checkUnit(rec, unit));
  for (const sketch of rec.sketches) out.push(...sketch.file.diags);
  return out;
}

function checkUnit(rec: RecordAst, unit: UnitAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  if (unit.spec !== null) out.push(...unit.spec.diags);
  const status = unitStatus(unit);
  // the vocabulary is the machine (cli-law 2): a status the machine cannot
  // parse is a status no command, board, or gate can place — lint condemns
  // it at the spec surface; check condemns it in the living record
  if (unit.spec !== null && !(STATUS_VALUES as readonly string[]).includes(status)) {
    out.push({ severity: "error", code: "DG-C015", message: `status '${status}' is not in the vocabulary (${STATUS_VALUES.join(", ")}) — fix the status: line in the spec's frontmatter`, file: `${unit.dir}/spec.md` });
  }
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
  } else if (unit.markers.proofs !== null) {
    // a proofs.md that names only dead paths means the deliver gate WILL
    // refuse — check and the gate must never disagree about that
    out.push(...checkProofsAhead(rec, unit));
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
  // the gate's own law, enforced here: at least one proof path must exist —
  // a delivered unit whose every proof has vanished is an unevidenced claim.
  // Dead EXTRA paths are warnings, not errors: an honest proofs.md narrates
  // its history (tried variants, retired proofs), and narration is not a
  // broken claim.
  const absolute = paths.filter((p) => isAbsolute(p));
  if (absolute.length > 0) {
    const listed = absolute.slice(0, 3).join(", ") + (absolute.length > 3 ? ` +${absolute.length - 3} more` : "");
    out.push({ severity: "warning", code: "DG-C002", message: `absolute proof path(s) never resolve — proofs are record-root relative: write the path as it sits under the record root, never from the machine's own filesystem (${listed})`, file: unit.markers.proofs });
  }
  const dead = paths.filter((p) => !proofResolves(rec, unit, p));
  if (dead.length === paths.length) {
    const listed = dead.slice(0, 3).join(", ") + (dead.length > 3 ? ` +${dead.length - 3} more` : "");
    out.push({ severity: "error", code: "DG-C002", message: `no proof path in proofs.md exists on disk — the delivery claim is unevidenced (looked for: ${listed})`, file: unit.markers.proofs });
  } else if (dead.length > 0) {
    const listed = dead.slice(0, 3).join(", ") + (dead.length > 3 ? ` +${dead.length - 3} more` : "");
    out.push({ severity: "warning", code: "DG-C002", message: `proof path(s) not on disk (quoted variants or stale entries): ${listed}`, file: unit.markers.proofs });
  }
  return out;
}

/** Pre-delivery proofs check: the gate's own resolution logic, run by `check`,
 * so health and delivery can never disagree. Some dead paths warn; a proofs.md
 * where NOTHING resolves is the exact shape `deliver` refuses, and says so. */
function checkProofsAhead(rec: RecordAst, unit: UnitAst): Diagnostic[] {
  const out: Diagnostic[] = [];
  const raw = readText(join(rec.root, unit.markers.proofs ?? ""));
  if (raw === null) return out;
  const proofs = parseMarkdown(unit.markers.proofs ?? "", raw);
  const paths = proofPaths(proofs);
  if (paths.length === 0) return out;
  const absolute = paths.filter((p) => isAbsolute(p));
  if (absolute.length > 0) {
    const listed = absolute.slice(0, 3).join(", ") + (absolute.length > 3 ? ` +${absolute.length - 3} more` : "");
    out.push({ severity: "warning", code: "DG-C002", message: `absolute proof path(s) never resolve — proofs are record-root relative: write the path as it sits under the record root (${listed})`, file: unit.markers.proofs ?? "" });
  }
  const dead = paths.filter((p) => !proofResolves(rec, unit, p));
  if (dead.length === 0) return out;
  const listed = dead.slice(0, 3).join(", ") + (dead.length > 3 ? ` +${dead.length - 3} more` : "");
  if (dead.length === paths.length) {
    out.push({ severity: "error", code: "DG-C002", message: `no proof path in proofs.md exists on disk — deliver will refuse (looked for: ${listed})`, file: unit.markers.proofs ?? "" });
  } else {
    out.push({ severity: "warning", code: "DG-C002", message: `proof path(s) not on disk yet: ${listed}`, file: unit.markers.proofs ?? "" });
  }
  return out;
}

/** The path-like tokens in a proofs.md, in order, deduplicated.
 *
 * The grammar, documented because it is law: from every list item, take
 * each backticked span and the item's first bare token; keep a candidate
 * when it looks like a path — it carries a `/` or ends in a short file
 * extension — after trailing punctuation is stripped. Candidates with
 * inner whitespace are prose (a command, a sentence), never a path. An
 * item that names no path contributes nothing: narration in a proofs.md
 * is history, not evidence.
 *
 * Works for every honest writing shape:
 *   - proof.txt — the unit test output          (bare first token)
 *   - `01-document/x/proofs/run.txt`            (backticked span)
 *   - AC1 — the suite ran: `01-document/x/run.txt`  (label first, path later)
 */
export function proofPaths(proofs: FileAst): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const node of proofs.nodes) {
    if (node.kind !== "item") continue;
    for (const candidate of candidatesOf(node.text)) {
      const token = candidate.replace(/[.,;:)]+$/, "");
      if (token === "" || seen.has(token) || !PATH_LIKE.test(token)) continue;
      if (ENVELOPE_SCHEMA.test(token)) continue;
      if (token.endsWith("/")) continue; // a bare directory token (proofs/, skills/) names a convention in prose, never a proof file
      seen.add(token);
      out.push(token);
    }
  }
  return out;
}

/** A path carries a separator or ends in a short file extension. */
const PATH_LIKE = /[/\\]|\.[A-Za-z0-9]{1,8}$/;

/** Envelope schema identifiers (docodego/<command>/v1) ride proofs.md
 * as documentation of the emitted envelope — they name no file on disk, and
 * reading them as paths made every envelope-citing proofs.md warn. The shape
 * needs exactly three segments; no real proof file looks like this. */
const ENVELOPE_SCHEMA = /^docodego\/[a-z-]+\/v\d+$/;

/** Backticked spans without inner whitespace, plus the item's first bare token. */
function candidatesOf(item: string): string[] {
  const out: string[] = [];
  for (const m of item.matchAll(/`([^`]+)`/g)) {
    const span = (m[1] ?? "").trim();
    if (span !== "" && !/\s/.test(span)) out.push(span);
  }
  const bare = item.replace(/`/g, "").trim().split(/\s+/)[0] ?? "";
  if (bare !== "") out.push(bare);
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
