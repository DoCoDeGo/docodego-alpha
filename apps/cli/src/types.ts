/** Shared vocabulary for the whole CLI: positions, diagnostics, manifest. */

/** 1-based source position (line, column) inside a record file. */
export interface Pos {
  line: number;
  col: number;
}

/** A region of a file; diagnostics point here so findings are checkable. */
export interface Span {
  start: Pos;
  end: Pos;
}

export type Severity = "error" | "warning" | "note";

/** A compiler-style finding: positioned, coded, severitied. */
export interface Diagnostic {
  severity: Severity;
  code: string; // DG-<R|P|S|F|N|C|X>nnn — see passes/registry.ts
  message: string;
  file?: string;
  span?: Span;
  /** IMP-14: the triage class of a warning — drift (a real gap) or prose
   * (cosmetic wording). Unclassified warnings read as drift: the safe
   * assumption. Errors need no class. */
  class?: "drift" | "prose";
}

export type Mode = "auto" | "review" | "guided" | "hands-on";
export const MODES: Mode[] = ["auto", "review", "guided", "hands-on"];

export type CodeState = "new" | "growing" | "mature";

/** The mode contract — `.docodego/.standard/manifest.json`. */
export interface Manifest {
  mode: Mode;
  codeState: CodeState;
  pattern: string;
  ring: string;
  recordVersion: number;
  detect: { gitDepth: number; tests: boolean; ci: boolean };
  /** The vocabulary pack whose words this record was born with (record
   * spec 5). Absent = the canonical voice. The name only ever resolves
   * against the CLI's bundled packs; paths, ids, and codes never change. */
  vocabulary?: string;
}

/** One installed skill, as recorded in the lockfile. */
export interface SkillLockEntry {
  name: string;
  version: string;
  source: string; // "bundled" or the git URL it came from
  integrity: string; // sha256:<hex> of the skill folder
}

/** `.docodego/skills-lock.json` — what is actually installed, committed so
 * installs are reviewable and diffable. */
export interface SkillsLock {
  version: 1;
  recordSpecVersion: number;
  installed: SkillLockEntry[];
}

/** `deliver` refuses any unit scoring below this. */
export const SCORE_FLOOR = 60;

export const STATUS_VALUES = ["draft", "grilled", "scored", "delivered", "launch-passed", "founder-signed"] as const;
export type Status = (typeof STATUS_VALUES)[number];

/** Document types: units are the leaf work; epics and stories are containers-as-documents
 * (an epic lives in 01-discover, a story in 02-refine — never a folder). */
export const DOC_TYPES = ["unit", "epic", "story"] as const;
export type DocType = (typeof DOC_TYPES)[number];

/** Parsed command line, shared by every command module. */
export interface Args {
  cmd: string;
  pos: string[];
  json: boolean;
  force: boolean;
  selfCheck: boolean;
  apply: boolean;
  help: boolean;
  list: boolean;
  version: boolean;
  allSkills: boolean;
  branch: boolean;
  mode?: Mode;
  answers?: string;
  scaffold?: string;
  rotate?: boolean;
  respond?: string;
  epic?: string;
  story?: string;
  type?: DocType;
  stream?: string;
  fromSketch?: string;
  profile?: string;
  from?: string;
  vocabulary?: string;
  as?: string;
  quote?: string | boolean;
  dryRun?: boolean;
  by?: string | boolean;
  role?: string | boolean;
}

/** Where a command writes. Commands stay pure-ish by taking this in. */
export interface Io {
  out(s: string): void;
  err(s: string): void;
}

import type { VocabularyPack } from "./record/vocabulary.ts";

/** The payload's skill-index row — one bundled skill's contract, declared
 * here because it is shared vocabulary: bundle.ts builds it, the generated
 * payload.ts re-exports it, bundled/index.ts consumes it. */
export interface SkillIndexEntry {
  name: string;
  description: string;
  version: string;
  source: "bundled";
  integrity: string;
  defaultFor: string[];
  /** auto-add skills ship in the payload but join no profile: they plant
   * on their trigger or an explicit `skill add`, never by default. */
  autoAdd?: true;
}

/** The generated payload's shape — declared ONCE. bundle.ts imports it to
 * build and emits the import into payload.ts; before this the types lived
 * twice (bundle.ts and its own template string), hand-synced, unwatched —
 * the quiet rot enhancement 9 named. Now the compiler is the gate: one
 * declaration, so any shape drift is a type error, never a silent fork. */
export interface Payload {
  specVersion: number;
  cliVersion: string;
  structureHash: string;
  allowlistVersion: number;
  files: Record<string, string>;
  hashes: Record<string, string>;
  introducedIn: Record<string, number>;
  statutesShippedHashes: string[];
  skills: SkillIndexEntry[];
  profiles: Record<string, string[]>;
  vocabularies: VocabularyPack[];
}
