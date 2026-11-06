/** The upgrade per-file plan — Flyway x Rails conflict law:
 * target missing -> create; byte-identical -> unchanged (no-op);
 * differs -> the bundled bytes land side-by-side as `<path>.new` and the
 * user's file is never overwritten. Applying is create-only: existing
 * record files are written by no step of an upgrade. */
import { join } from "node:path";
import { readText, writeText } from "../fsx.ts";

export type PlanAction = "create" | "unchanged" | "conflict";

export interface PlanEntry {
  path: string; // repo-root-relative
  action: PlanAction;
}

/** Compare the target files against the repo; sorted, conflicts flagged. */
export function computePlan(target: Record<string, string>, repoRoot: string): PlanEntry[] {
  return Object.keys(target)
    .sort()
    .map((path) => {
      const existing = readText(join(repoRoot, path));
      const action: PlanAction = existing === null ? "create" : existing === target[path] ? "unchanged" : "conflict";
      return { path, action };
    });
}

/** Execute the plan create-only. Returns one human line per touched file. */
export function applyPlan(target: Record<string, string>, entries: PlanEntry[], repoRoot: string): string[] {
  const done: string[] = [];
  for (const e of entries) {
    const body = target[e.path] as string; // entries are derived from target's own keys
    if (e.action === "create") {
      writeText(join(repoRoot, e.path), body);
      done.push(`created ${e.path}`);
    } else if (e.action === "conflict") {
      writeText(join(repoRoot, `${e.path}.new`), body);
      done.push(`conflict ${e.path} — your copy kept, bundled version planted as ${e.path}.new`);
    } else {
      done.push(`unchanged ${e.path}`);
    }
  }
  return done;
}

/** One-screen plan rendering; conflicts highlighted. */
export function renderPlan(entries: PlanEntry[]): string {
  return entries
    .map((e) => {
      const mark = e.action === "conflict" ? "! CONFLICT" : e.action === "create" ? "+ create  " : "  unchanged";
      return `  ${mark}  ${e.path}${e.action === "conflict" ? "  (yours kept; bundled copy -> .new)" : ""}`;
    })
    .join("\n");
}
