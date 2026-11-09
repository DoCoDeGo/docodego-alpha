/** The skill index runtime: lockfile IO, folder digests, install law.
 * Digest algorithm mirrors scripts/bundle.ts exactly (relpath + NUL + bytes,
 * sorted) — conformance's skill-flow checks hold the two together.
 * Install law: create-only per file; a skill whose installed files differ is
 * never silently overwritten — the incoming copy lands side-by-side as
 * `<file>.new` unless --force names explicit human intent. */
import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { appendText, isDir, readText, today, writeText } from "../fsx.ts";
import { agentPresets, skillFiles, skillsIndex, TRACKER_TEMPLATE } from "../bundled/index.ts";
import { TRACKER_REL } from "../record/load.ts";
import type { SkillLockEntry, SkillsLock } from "../types.ts";

export const LOCK_REL = "skills-lock.json";
export const AGENTS_DIR = ".agents";

/** The shape of a skill name — one character class, no separators, no
 * traversal. Enforced at the CLI boundary and re-checked at the filesystem
 * boundary (plantSkill), so no path can wear a skill's clothes. */
export const SKILL_NAME_OK = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

/** The skills root for a record, resolved — the boundary every install and
 * verify path stays inside. */
export const skillsBase = (recordRoot: string): string => resolve(recordRoot, "..", AGENTS_DIR, "skills");

const readdirSorted = (p: string): string[] => {
  try {
    return readdirSync(p).sort();
  } catch {
    return [];
  }
};

/** sha256 over a skill folder on disk — same recipe as the bundler:
 * for each file in sorted order, hash relpath + NUL + bytes. Symlinks are
 * skipped, never followed, so the digest covers exactly what a remote tree
 * actually contains — and what gets planted — never a link's target. */
export function digestSkillDir(absDir: string): string {
  const h = createHash("sha256");
  const visit = (dir: string, base: string): void => {
    for (const e of readdirSorted(dir)) {
      const abs = join(dir, e);
      const st = lstatSync(abs, { throwIfNoEntry: false });
      if (st === undefined || st.isSymbolicLink()) continue;
      const rel = base === "" ? e : `${base}/${e}`;
      if (st.isDirectory()) visit(abs, rel);
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

/** sha256 over an in-memory file map — the SAME recipe (sorted per level,
 * relpath + NUL + bytes) without the second read. The install law this
 * closes (enhancement 15): a remote tree is read once into a map, and the
 * digest is computed over that map — the exact bytes the install plants —
 * never over a re-read of the folder after the fact. A tree that shifts
 * between two reads used to earn a lockfile digest over bytes nobody
 * planted; now the recorded digest is bound to the planted bytes by
 * construction. The tree walk mirrors digestSkillDir: nested maps sorted
 * per level, because a flat sort of full paths walks in a different order
 * than a directory walk ("a.txt" sorts before "a/b", but walks after it). */
export function digestFiles(files: Record<string, string>): string {
  type Node = Map<string, Node | string>;
  const root: Node = new Map();
  for (const [rel, body] of Object.entries(files)) {
    const parts = rel.split("/");
    let node = root;
    for (const part of parts.slice(0, -1)) {
      const next = node.get(part);
      if (next === undefined || typeof next === "string") {
        const branch: Node = new Map();
        node.set(part, branch);
        node = branch;
      } else node = next;
    }
    node.set(parts[parts.length - 1] ?? "", body);
  }
  const h = createHash("sha256");
  const visit = (node: Node, base: string): void => {
    for (const key of [...node.keys()].sort()) {
      const rel = base === "" ? key : `${base}/${key}`;
      const value = node.get(key);
      if (value === undefined) continue;
      if (typeof value === "string") {
        h.update(rel);
        h.update("\0");
        h.update(value, "utf8");
      } else visit(value, rel);
    }
  };
  visit(root, "");
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

/** Re-verify every installed skill's folder digest against the lockfile.
 * An entry whose name escapes the skills directory verifies as false — a
 * poisoned lockfile cannot bless out-of-tree content. */
export function verifyInstalled(recordRoot: string, lock: SkillsLock): { name: string; ok: boolean }[] {
  const base = skillsBase(recordRoot);
  return lock.installed.map((e) => {
    if (!SKILL_NAME_OK.test(e.name)) return { name: e.name, ok: false };
    const dir = resolve(base, e.name);
    if (!dir.startsWith(base + sep)) return { name: e.name, ok: false };
    return { name: e.name, ok: isDir(dir) && digestSkillDir(dir) === e.integrity };
  });
}

/** Plant one skill's files create-only; returns per-file actions. A differing
 * existing file is preserved — the new bytes land as `<file>.new` beside it.
 * The name is re-checked here at the filesystem boundary so a future caller
 * that forgets the CLI guard still cannot plant outside the skills dir. */
export function plantSkill(recordRoot: string, name: string, files: Record<string, string>, force: boolean): string[] {
  if (!SKILL_NAME_OK.test(name)) throw new Error(`skill name '${name}' is not installable — names match letters/digits/./_/- only`);
  const actions: string[] = [];
  const base = skillsBase(recordRoot);
  const target = resolve(base, name);
  if (!target.startsWith(base + sep)) throw new Error(`skill name '${name}' escapes the skills directory`);
  for (const [rel, body] of Object.entries(files)) {
    const abs = join(target, rel);
    const existing = readText(abs);
    if (existing === null || (force && existing !== body)) {
      writeText(abs, body);
      actions.push(existing === null ? `wrote skills/${name}/${rel}` : `force-updated skills/${name}/${rel}`);
    } else if (existing !== body) {
      // ADR 0013: the refresh goes live; the operator's previous copy is
      // preserved byte-exact beside it as <file>.old — never lost, never
      // hidden. The review deletes the .old or restores it to revert.
      writeText(`${abs}.old`, existing);
      writeText(abs, body);
      actions.push(`refreshed skills/${name}/${rel} — the bundled update went live; your previous copy is preserved as skills/${name}/${rel}.old (review the diff, then delete the .old or restore it to revert)`);
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
  const line = `| ${today()} | ${unit} | ${event} | ${evidence} |\n`;
  appendText(abs, line);
  return line.trim();
}
