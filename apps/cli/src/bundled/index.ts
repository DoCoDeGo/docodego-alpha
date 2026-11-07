/** The bundled record — the CLI's own body, generated at build time by
 * apps/cli/scripts/bundle.ts from the LIVE folders (.docodego/, AGENTS.md,
 * .agents/). Nothing here is hand-written record content: init and upgrade
 * plant from PAYLOAD, so the CLI ships exactly what the repo lives.
 * The tracker is the one exception — it is planted fresh from a constant
 * below, because our history is not their history. */
import { PAYLOAD, type Payload, type SkillIndexEntry } from "./payload.ts";
import type { VocabularyPack } from "../record/vocabulary.ts";

export type { Payload, SkillIndexEntry, VocabularyPack };
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

/** The bundled vocabulary packs (sorted by name) and the lookup init and
 * grill use. An unknown or absent name yields undefined — canonical voice. */
export const vocabularies = (): VocabularyPack[] => PAYLOAD.vocabularies;
export const VOCABULARY_NAMES = PAYLOAD.vocabularies.map((v) => v.name).sort();
export function vocabularyPack(name: string | undefined): VocabularyPack | undefined {
  if (name === undefined) return undefined;
  return PAYLOAD.vocabularies.find((v) => v.name === name);
}
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

/** The delivery log: one row per delivered unit, appended by the gate itself.
 * Structured columns stay cheap; the proof column carries the path that was
 * verified — the narrative of what was learned belongs in the unit's own
 * records. */
export const DELIVERY_LOG_TEMPLATE = `# Delivery log

One row per delivered unit, appended at the gate — newest last. The landing
is recorded here; what was learned lives in the unit's own records.

| date | unit | gates | proof |
|---|---|---|---|
`;

/** The founding-intent record: the founder's brief, verbatim. The reader
 * contract is the point — anything quoted here may be cited as the
 * founder's words exactly as given. */
export const INTENT_TEMPLATE = `# Intent — the founding brief

Verbatim record. Nothing here is paraphrased: any passage in this file may
be quoted as the founder's words exactly as given. Superseded intent is
struck, never deleted.

## the brief

<the founder's ask, in their words — what to build, for whom, and why now>

## the becoming

<who this work makes of the people doing it — one honest sentence>
`;

/** The cycle log: numbered, dated, append-only — one entry per unit of
 * research or work, so the record can replay how the present was reached. */
export const CYCLES_TEMPLATE = `# Cycles

Numbered, append-only, newest last. One entry per unit of research or work:
what was asked, what was found, what it changes. Archiving moves old cycles
to \`cycles-archive-N.md\` beside this file and never deletes them.

<!-- template:
## Cycle <n> — <one-line name> (<date>)

- asked: <the question>
- found: <the evidence, each fact with its source path>
- so: <what this changes or confirms>
-->
`;

