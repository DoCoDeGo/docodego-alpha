/** Tracker, delivery log, and spec status writes — the sanctioned metadata updates. */
import { join } from "node:path";
import { appendText, readText, today, writeText } from "../fsx.ts";
import { DELIVERY_LOG_TEMPLATE, SIGNATURES_TEMPLATE, TRACKER_TEMPLATE } from "../bundled/index.ts";
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
