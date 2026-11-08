/** Tracker, delivery log, and spec status writes — the sanctioned metadata updates. */
import { join } from "node:path";
import { appendText, readText, today, writeText } from "../fsx.ts";
import { COMPOSE_LOG_TEMPLATE, DEMO_HOWTO_TEMPLATE, DELIVERY_LOG_TEMPLATE, PROOFS_TEMPLATE, SIGNATURES_TEMPLATE, TRACKER_TEMPLATE } from "../bundled/index.ts";
import { TRACKER_REL, type RecordAst } from "./load.ts";

/** The delivery log lives beside the tracker at the govern root: one row per
 * delivered unit, appended by the gate itself, so the loop's last movement
 * always holds the landing record. */
export const DELIVERY_LOG_REL = "04-govern/delivery-log.md";

/** Append one tracker line; creates the tracker (with its header) if absent. */
export function appendTracker(rec: RecordAst, unit: string, event: string, evidence: string): string {
  const abs = join(rec.root, TRACKER_REL);
  if (readText(abs) === null) writeText(abs, TRACKER_TEMPLATE);
  const line = `| ${today()} | ${unit} | ${event} | ${evidence} |\n`;
  appendText(abs, line);
  return line.trim();
}

/** Append one delivery-log row; creates the log (with its header) if absent. */
export function appendDeliveryLog(rec: RecordAst, unit: string, gates: string, proof: string): string {
  const abs = join(rec.root, DELIVERY_LOG_REL);
  if (readText(abs) === null) writeText(abs, DELIVERY_LOG_TEMPLATE);
  const line = `| ${today()} | ${unit} | ${gates} | ${proof} |\n`;
  appendText(abs, line);
  return line.trim();
}

/** The signatures ledger lives beside the delivery log: one row per signed
 * act, appended by the sign gate itself. */
export const SIGNATURES_REL = "04-govern/signatures.md";

/** Append one signature-ledger row; creates the ledger (with its header) if
 * absent. `by` is recorded verbatim — the receipt quotes the signer. */
export function appendSignature(rec: RecordAst, unit: string, by: string, role: string, act: string): string {
  const abs = join(rec.root, SIGNATURES_REL);
  if (readText(abs) === null) writeText(abs, SIGNATURES_TEMPLATE);
  const line = `| ${today()} | ${unit} | ${by} | ${role} | ${act} |\n`;
  appendText(abs, line);
  return line.trim();
}

/** The compose log lives at the compose root: one row per delivered unit,
 * appended by the deliver gate itself — the integrity map's compose
 * artifact (IMP-15). Engine-owned: planted from COMPOSE_LOG_TEMPLATE, so
 * the live file may grow rows without touching the shipped bytes. */
export const COMPOSE_LOG_REL = "02-compose/compose-log.md";

/** Append one compose-log row; creates the log (with its header) if absent.
 * `specSha` is the delivered spec's recomputed hash — the same binding G2
 * holds. `deviations` is the unit's frontmatter declaration, quoted
 * verbatim; pipes are escaped so the row stays a row (mechanical encoding,
 * not paraphrase), and an absent declaration lands as `none recorded`. */
export function appendComposeLog(rec: RecordAst, unit: string, specSha: string, deviations: string | undefined): string {
  const abs = join(rec.root, COMPOSE_LOG_REL);
  if (readText(abs) === null) writeText(abs, COMPOSE_LOG_TEMPLATE);
  const declared = (deviations ?? "none recorded").replace(/\|/g, "\\|");
  const line = `| ${today()} | ${unit} | ${specSha} | ${declared} |\n`;
  appendText(abs, line);
  return line.trim();
}

/** The demo room: each delivered unit's bundle lives at
 * `03-demonstrate/demo/<unit>/`, scaffolded by the deliver gate, filled
 * by the agent before launch (IMP-15). Engine-owned templates — the
 * folders are user state and never a boundary row. */
export const DEMO_DIR_REL = "03-demonstrate/demo";
export const DEMO_HOWTO_NAME = "how-to-run.md";

/** Absolute path of a unit's demo scaffold inside the record. */
export function demoHowToPath(rec: RecordAst, unit: string): string {
  return join(rec.root, DEMO_DIR_REL, unit, DEMO_HOWTO_NAME);
}

/** Write the unit's demo scaffold — create-only: a bundle the agent
 * already filled (or scaffolded earlier) is never rewritten. */
export function scaffoldDemoHowTo(rec: RecordAst, unit: string): boolean {
  const abs = demoHowToPath(rec, unit);
  if (readText(abs) !== null) return false;
  writeText(abs, DEMO_HOWTO_TEMPLATE);
  return true;
}

/** Write the unit's proofs scaffold — create-only, planted beside
 * the deliver gate's G4 refusal (560): the grammar travels with the
 * refusal instead of living only in --help. */
export function scaffoldProofs(rec: RecordAst, unitDir: string): boolean {
  const abs = join(rec.root, unitDir, "proofs.md");
  if (readText(abs) !== null) return false;
  writeText(abs, PROOFS_TEMPLATE);
  return true;
}

/** The status machine — the transitions the writers may mint. Forward moves
 * follow the vocabulary's order; re-grilling a scored unit may drop it back
 * to `grilled` (audible note, re-score before deliver); re-scoring a scored
 * unit appends a fresh block. Delivered-class is terminal: only grill's FAIL
 * verdict may demote it, and that demotion writes a `demoted` tracker row —
 * it never rides a bare setStatus. One writer, one refusal, the fix named. */
const TRANSITIONS: Record<string, string[]> = {
  draft: ["grilled", "scored"],
  grilled: ["grilled", "scored"],
  scored: ["grilled", "scored", "delivered"],
  delivered: ["launch-passed"],
  "launch-passed": ["founder-signed"],
  "founder-signed": [],
};

/** Null when `from → to` is a legal move; otherwise the refusal message,
 * naming the state, the move, and the one door out of a terminal state. */
export function assertTransition(unit: string, from: string, to: string): string | null {
  if ((TRANSITIONS[from] ?? []).includes(to)) return null;
  const why = ["delivered", "launch-passed", "founder-signed"].includes(from)
    ? `${unit} is '${from}' — a landing is terminal: the status machine refuses '${from}' → '${to}' (only a grill FAIL verdict demotes, with a tracker row)`
    : `${unit} is '${from}' — the status machine refuses '${from}' → '${to}' (legal moves: ${(TRANSITIONS[from] ?? []).join(", ") || "none — terminal"})`;
  return why;
}

/**
 * Update `status:` in a spec's frontmatter, preserving every other byte of the
 * file. Returns false (writing nothing) when there is no frontmatter to patch.
 */
export function setStatus(specAbsPath: string, status: string): boolean {
  const src = readText(specAbsPath);
  if (src === null) return false;
  const lines = src.split(/\r?\n/);
  if ((lines[0] ?? "").trim() !== "---") return false;
  let close = -1;
  for (let i = 1; i < lines.length; i++) {
    if ((lines[i] ?? "").trim() === "---") {
      close = i;
      break;
    }
  }
  if (close < 0) return false;
  let patched = false;
  for (let i = 1; i < close; i++) {
    if (/^status\s*:/.test(lines[i] ?? "")) {
      lines[i] = `status: ${status}`;
      patched = true;
      break;
    }
  }
  if (!patched) lines.splice(close, 0, `status: ${status}`);
  writeText(specAbsPath, lines.join("\n"));
  return true;
}
