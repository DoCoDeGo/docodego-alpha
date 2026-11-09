/** The upgrade per-file plan — Flyway x Rails conflict law, flipped by
 * ADR 0013 (founder ruling, 2026-11-10): upgrades apply live and hide
 * nothing from version control. target absent from disk -> create or
 * restore, told apart by the payload's introduction map: a path the
 * record's version has already seen (introducedIn <= record version) is
 * one the record HAD and lost — restore, in place; deletion may have
 * been deliberate, and the refresh says so to the operator's face (the
 * PR review and the notes file are where it gets un-done). A path new
 * to this upgrade is create: planted create-only. byte-identical ->
 * unchanged (no-op); differs -> the bundled bytes go live at the
 * canonical path and the operator's previous copy is preserved beside
 * it as `<path>.old` — byte-exact, the portable undo; git history is
 * the second net. Nothing from the upgrade is gitignored: the review
 * sees every change, then deletes the .old (keep the refresh) or
 * restores it (revert). */
import { join } from "node:path";
import { readText, writeText } from "../fsx.ts";

export type PlanAction = "create" | "restore" | "unchanged" | "conflict";

export interface PlanEntry {
  path: string; // repo-root-relative
  action: PlanAction;
}

/** Compare the target files against the repo; sorted, conflicts flagged.
 * `introductions` maps target paths to the payload version they first
 * shipped; `recordVersion` is the version the record walks from. */
export function computePlan(target: Record<string, string>, repoRoot: string, introductions: Record<string, number> = {}, recordVersion = 0): PlanEntry[] {
  return Object.keys(target)
    .sort()
    .map((path) => {
      const existing = readText(join(repoRoot, path));
      if (existing === null) {
        const seen = introductions[path] !== undefined && introductions[path] <= recordVersion;
        return { path, action: seen ? "restore" : "create" };
      }
      const action: PlanAction = existing === target[path] ? "unchanged" : "conflict";
      return { path, action };
    });
}

/** Execute the plan. Returns one human line per touched file. A restore
 * writes the engine-owned file back in place — the operator deleted
 * something the engine owns, and the refresh says so on the record;
 * a conflict goes live and preserves the operator's words as `<path>.old`:
 * the words are never lost (byte-exact) and never hidden (nothing is
 * ignored — the PR diff shows both copies). */
export function applyPlan(target: Record<string, string>, entries: PlanEntry[], repoRoot: string): string[] {
  const done: string[] = [];
  for (const e of entries) {
    const body = target[e.path] as string; // entries are derived from target's own keys
    if (e.action === "create") {
      writeText(join(repoRoot, e.path), body);
      done.push(`created ${e.path}`);
    } else if (e.action === "restore") {
      writeText(join(repoRoot, e.path), body);
      done.push(`restored ${e.path} — absent on disk; the bundled copy is back (delete it again if the deletion was deliberate — it stays deleted until the next upgrade)`);
    } else if (e.action === "conflict") {
      const current = readText(join(repoRoot, e.path));
      if (current === body) {
        // 670's lesson, kept under the new law: the plan was printed against
        // the disk as it stood — a migration may have brought this file
        // current inside the same walk. Report the end state, plant nothing.
        done.push(`resolved in place: ${e.path} — a migration brought it current; nothing to preserve`);
      } else {
        if (current !== null) writeText(join(repoRoot, `${e.path}.old`), current);
        writeText(join(repoRoot, e.path), body);
        done.push(`refreshed ${e.path} — the bundled update went live; your previous copy is preserved as ${e.path}.old (review the diff, then delete the .old or restore it to revert)`);
      }
    } else {
      done.push(`unchanged ${e.path}`);
    }
  }
  return done;
}

/** One-screen plan rendering; conflicts and restores highlighted. */
export function renderPlan(entries: PlanEntry[]): string {
  return entries
    .map((e) => {
      const mark = e.action === "conflict" ? "! CONFLICT" : e.action === "restore" ? "R restore " : e.action === "create" ? "+ create  " : "  unchanged";
      const note =
        e.action === "conflict"
          ? "  (bundled update goes live; your copy preserved as .old)"
          : e.action === "restore"
            ? "  (absent — restored in place)"
            : "";
      return `  ${mark}  ${e.path}${note}`;
    })
    .join("\n");
}
