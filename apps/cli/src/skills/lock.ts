/** The skill index runtime: lockfile IO, folder digests, install law.
 * Digest algorithm mirrors scripts/bundle.ts exactly (relpath + NUL + bytes,
 * sorted) — conformance's skill-flow checks hold the two together.
 * Install law: create-only per file; a skill whose installed files differ is
 * never silently overwritten — the incoming copy lands side-by-side as
 * `<file>.new` unless --force names explicit human intent. */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { appendText, isDir, readText, writeText } from "../fsx.ts";
import { agentPresets, skillFiles, skillsIndex, TRACKER_TEMPLATE } from "../bundled/index.ts";
import { TRACKER_REL } from "../record/load.ts";
import type { SkillLockEntry, SkillsLock } from "../types.ts";

export const LOCK_REL = "skills-lock.json";
export const AGENTS_DIR = ".agents";

const readdirSorted = (p: string): string[] => {
  try {
    return readdirSync(p).sort();
  } catch {
    return [];
  }
};

/** sha256 over a skill folder on disk — same recipe as the bundler:
 * for each file in sorted order, hash relpath + NUL + bytes. */
export function digestSkillDir(absDir: string): string {
  const h = createHash("sha256");
  const visit = (dir: string, base: string): void => {
    for (const e of readdirSorted(dir)) {
      const abs = join(dir, e);
      const rel = base === "" ? e : `${base}/${e}`;
      if (isDir(abs)) visit(abs, rel);
      else {
        h.update(rel);
        h.update("\0");
        h.update(readFileSync(abs));
      }
    }
  };
  visit(absDir, "");
  return `sha256:${h.digest("hex")}`;
}

export function readLock(recordRoot: string): SkillsLock | null {
  const raw = readText(join(recordRoot, LOCK_REL));
  if (raw === null) return null;
  return JSON.parse(raw) as SkillsLock;
}

export function writeLock(recordRoot: string, lock: SkillsLock): void {
  writeText(join(recordRoot, LOCK_REL), `${JSON.stringify(lock, null, 2)}\n`);
}

export const emptyLock = (recordSpecVersion: number): SkillsLock => ({ version: 1, recordSpecVersion, installed: [] });

/** Re-verify every installed skill's folder digest against the lockfile. */
export function verifyInstalled(recordRoot: string, lock: SkillsLock): { name: string; ok: boolean }[] {
  return lock.installed.map((e) => {
    const dir = join(recordRoot, "..", AGENTS_DIR, "skills", e.name);
    return { name: e.name, ok: isDir(dir) && digestSkillDir(dir) === e.integrity };
  });
}

/** Plant one skill's files create-only; returns per-file actions. A differing
 * existing file is preserved — the new bytes land as `<file>.new` beside it. */
export function plantSkill(recordRoot: string, name: string, files: Record<string, string>, force: boolean): string[] {
  const actions: string[] = [];
  const base = join(recordRoot, "..", AGENTS_DIR, "skills", name);
  for (const [rel, body] of Object.entries(files)) {
    const abs = join(base, rel);
    const existing = readText(abs);
    if (existing === null || (force && existing !== body)) {
      writeText(abs, body);
      actions.push(existing === null ? `wrote skills/${name}/${rel}` : `force-updated skills/${name}/${rel}`);
    } else if (existing !== body) {
      writeText(`${abs}.new`, body);
      actions.push(`conflict skills/${name}/${rel} -> planted .new (your copy kept)`);
    } else {
      actions.push(`unchanged skills/${name}/${rel}`);
    }
  }
  return actions;
}

/** Install a bundled skill by index entry; returns the lockfile row. */
export function installBundledSkill(recordRoot: string, name: string, force: boolean): { actions: string[]; entry: SkillLockEntry } | null {
  const entry = skillsIndex().find((s) => s.name === name);
  if (entry === undefined) return null;
  const actions = plantSkill(recordRoot, name, skillFiles(name), force);
  return { actions, entry: { name: entry.name, version: entry.version, source: "bundled", integrity: entry.integrity } };
}

/** Plant the agent presets create-only (init + upgrade share this). */
export function plantAgentPresets(recordRoot: string): string[] {
  const actions: string[] = [];
  for (const [rel, body] of Object.entries(agentPresets())) {
    const abs = join(recordRoot, "..", AGENTS_DIR, "agents", rel);
    if (readText(abs) === null) {
      writeText(abs, body);
      actions.push(`.agents/agents/${rel}`);
    }
  }
  return actions;
}

/** Tracker append that works without a loaded record (upgrade resumability):
 * creates the tracker from the template when absent, then appends one line. */
export function appendTrackerLine(recordRoot: string, unit: string, event: string, evidence: string): string {
  const abs = join(recordRoot, TRACKER_REL);
  if (readText(abs) === null) writeText(abs, TRACKER_TEMPLATE);
  const line = `| ${isoToday()} | ${unit} | ${event} | ${evidence} |\n`;
  appendText(abs, line);
  return line.trim();
}

const isoToday = (): string => new Date().toISOString().slice(0, 10);
