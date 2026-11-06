/** Tracker + spec status writes — the two sanctioned metadata updates. */
import { join } from "node:path";
import { appendText, readText, today, writeText } from "../fsx.ts";
import { TRACKER_TEMPLATE } from "../bundled/index.ts";
import { TRACKER_REL, type RecordAst } from "./load.ts";

/** Append one tracker line; creates the tracker (with its header) if absent. */
export function appendTracker(rec: RecordAst, unit: string, event: string, evidence: string): string {
  const abs = join(rec.root, TRACKER_REL);
  if (readText(abs) === null) writeText(abs, TRACKER_TEMPLATE);
  const line = `| ${today()} | ${unit} | ${event} | ${evidence} |\n`;
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
