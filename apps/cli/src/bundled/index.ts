/** The bundled record — the CLI's own body, generated at build time by
 * apps/cli/scripts/bundle.ts from the LIVE folders (.docodego/, AGENTS.md,
 * .agents/). Nothing here is hand-written record content: init and upgrade
 * plant from PAYLOAD, so the CLI ships exactly what the repo lives.
 * The tracker is the one exception — it is planted fresh from a constant
 * below, because our history is not their history. */
import { PAYLOAD, type Payload, type SkillIndexEntry } from "./payload.ts";

export type { Payload, SkillIndexEntry };
export { PAYLOAD };

export const specVersion = (): number => PAYLOAD.specVersion;
export const cliVersion = (): string => PAYLOAD.cliVersion;
export const structureHash = (): string => PAYLOAD.structureHash;

/** The bundled record files, relative to the record root (no `.docodego/`
 * prefix), exclusions already applied at bundle time. */
export function recordFiles(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [p, body] of Object.entries(PAYLOAD.files)) {
    if (p.startsWith(".docodego/")) out[p.slice(".docodego/".length)] = body;
  }
  return out;
}

/** The bundled law file, planted at the user's repo root. */
export const agentsMd = (): string => PAYLOAD.files["AGENTS.md"] ?? "";

/** Agent topology presets, relative to `.agents/`. */
export function agentPresets(): Record<string, string> {
  return filesUnder(".agents/agents/");
}

/** The files of one bundled skill, relative to `.agents/skills/<name>/`. */
export function skillFiles(name: string): Record<string, string> {
  return filesUnder(`.agents/skills/${name}/`);
}

function filesUnder(prefix: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [p, body] of Object.entries(PAYLOAD.files)) {
    if (p.startsWith(prefix)) out[p.slice(prefix.length)] = body;
  }
  return out;
}

export const skillsIndex = (): SkillIndexEntry[] => PAYLOAD.skills;
export const profiles = (): Record<string, string[]> => PAYLOAD.profiles;
export const PROFILES = Object.keys(PAYLOAD.profiles).sort();
export const DEFAULT_PROFILE = PROFILES.includes("product-team") ? "product-team" : (PROFILES[0] ?? "product-team");
/** All bundled skill files as `.agents/skills/<name>/<file>` -> body. */
export function allSkillFiles(): Record<string, string> {
  return filesUnder(".agents/skills/");
}

/** The tracker header planted into fresh records (and recreated when a
 * command needs to append and the tracker is absent). Append-only after that. */
export const TRACKER_TEMPLATE = `# Tracker

Appended, never rewritten. Every claim carries a path to its evidence.

| date | unit | event | evidence |
|---|---|---|---|
`;
