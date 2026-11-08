/** The upgrade per-file plan — Flyway x Rails conflict law:
 * target absent from disk -> create or restore, told apart by the
 * payload's introduction map: a path the record's version has already
 * seen (introducedIn <= record version) is one the record HAD and lost —
 * restore; it re-appears only as `<path>.new` (owed a merge — the same
 * twin law AGENTS.md follows), never silently in place, because deletion
 * may have been deliberate. A path new to this upgrade (introduced later,
 * or unknown) is create: nothing to merge over, planted create-only.
 * byte-identical -> unchanged (no-op); differs -> the bundled bytes land
 * side-by-side as `<path>.new` and the user's file is never overwritten.
 * Applying is create-only: existing record files are written by no step
 * of an upgrade. */
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

/** Execute the plan create-only. Returns one human line per touched file.
 * A restore writes the twin, not the file: the record's owner deleted
 * something the engine owns — they owe a merge, or owe the twin a delete. */
export function applyPlan(target: Record<string, string>, entries: PlanEntry[], repoRoot: string): string[] {
  const done: string[] = [];
  for (const e of entries) {
    const body = target[e.path] as string; // entries are derived from target's own keys
    if (e.action === "create") {
      writeText(join(repoRoot, e.path), body);
      done.push(`created ${e.path}`);
    } else if (e.action === "restore") {
      writeText(join(repoRoot, `${e.path}.new`), body);
      done.push(`restore ${e.path} — absent on disk; the bundled copy waits as ${e.path}.new (owed a merge — delete the twin if the deletion was deliberate)`);
    } else if (e.action === "conflict") {
      writeText(join(repoRoot, `${e.path}.new`), body);
      done.push(`conflict ${e.path} — your copy kept, bundled version planted as ${e.path}.new`);
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
          ? "  (yours kept; bundled copy -> .new)"
          : e.action === "restore"
            ? "  (absent — bundled copy -> .new, owed a merge)"
            : "";
      return `  ${mark}  ${e.path}${note}`;
    })
    .join("\n");
}
