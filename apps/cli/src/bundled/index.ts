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
/** The payload version each shipped path first appeared — upgrade reads it
 * to tell a record that never saw a file (create) from one that lost it
 * (restore). Paths absent from the map stamp at the current version. */
export const introductions = (): Record<string, number> => PAYLOAD.introducedIn ?? {};
/** Every statutes.md generation the payload chain ever shipped — the
 * mirror-refresh migration recognizes engine-owned bytes by membership,
 * never by a hand-copied constant. */
export const statutesShippedHashes = (): string[] => PAYLOAD.statutesShippedHashes ?? [];

/** Agent topology presets, relative to `.agents/`. */
export function agentPresets(): Record<string, string> {
  return filesUnder(".agents/agents/");
}

/** The rules layer, relative to `.agents/rules/`. */
export function ruleFiles(): Record<string, string> {
  return filesUnder(".agents/rules/");
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
/** The checklist: the standing sweep's ledger. One row per check per run,
 * stable ids, newest last — the record checking itself, on a schedule
 * anyone can read. Hand findings append with the same grammar. */
export const CHECKLIST_TEMPLATE = `# Checklist

The standing sweep, appended. One row per check per \`docodego audit\` run:
\`| date | check | owner | status | evidence |\`. Checks carry stable ids —
GOV-001 lint · GOV-002 check · GOV-003 status-verdict coherence · GOV-004
bounded size · GOV-005 comment hygiene · GOV-006 setback recurrence. Hand
findings take the next GOV-NNN. Status changes append new rows — this
ledger is append-only, newest last, rotated like every ledger
(checklist-archive-N.md, byte-identical moves, never deleted).

| date | check | owner | status | evidence |
|---|---|---|---|---|
`;

/** The setback ledger: the failure-capture surface. One row per bite of a
 * class, appended at failure time; counts are machine-written and survive
 * rotation (the audit scans archives). The audit's GOV-006 reads this
 * ledger — warn at two bites, fail at three, naming the owed work. */
export const SETBACKS_TEMPLATE = `# Setbacks

The failure ledger, appended at failure time. One row per bite of a class:
\`| date | class | count | text |\`. Classes are stable kebab ids minted at
first occurrence; \`count\` is machine-written — recurrences since the
class's last count-0 response row, archive files scanned. A response row
(\`docodego setback <class> --respond "<what you opened>"\`) resets the
class to 0. The audit's GOV-006 reads this ledger: warn at two bites, fail
at three, naming the owed plan or research. Append-only, newest last,
rotated like every ledger (setbacks-archive-N.md, byte-identical moves,
never deleted).

| date | class | count | text |
|---|---|---|---|
`;

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

/** The compose log: the compose room's gate-written artifact (IMP-15). One
 * row per delivered unit, appended by the deliver gate itself — the unit,
 * the spec hash it delivered against, and the declared spec-vs-built
 * deviations. Readers are named in the header: the handoff agent and the
 * build-honesty auditor. Engine-owned like the delivery log: planted fresh
 * from this constant, never a boundary row — a log that grows at every
 * delivery would drift an embedded copy on day one. */
export const COMPOSE_LOG_TEMPLATE = `# Compose log

One row per delivered unit, appended by the deliver gate — newest last.
What the compose room built, and where built diverged from spec. Readers:
the handoff agent (start here to learn what exists and why it is shaped
as it is) and the build-honesty auditor (compare each row's spec hash and
deviation declaration against the unit's own records). A unit declares
deviations with a \`deviations:\` line in its spec frontmatter, quoted
verbatim; silence lands as \`none recorded\`. Empty log: nothing has been
delivered through this room yet.

| date | unit | spec | deviations |
|---|---|---|---|
`;

/** The demo room anchor: the demonstrate room's integrity artifact is the
 * per-unit bundle (`demo/<unit>/`), and this README is the room's door —
 * planted at init so an empty room truthfully means "not there yet".
 * Engine-owned like the compose log: the folders inside are user state. */
export const DEMO_README_TEMPLATE = `# demo — the demonstrate room's bundles

One folder per delivered unit: \`demo/<unit>/\`, scaffolded by the
deliver gate, filled by the agent — \`how-to-run.md\` (the commands a
cold reader runs, the output to expect), run output, visual evidence
(screenshots, recordings — paths, per the honesty law). Readers: the
founder's "show me it working", and the launch auditor — a bundle whose
how-to-run.md is still the unfilled scaffold refuses the launch gate,
because an unfilled form shows nothing. An empty demo/ truthfully means
"not there yet": units delivered before the bundles existed, or nothing
shown yet. Filling is allowed to be one honest line — "the suite is the
demo; run it thus" — what the gate refuses is silence.
`;

/** The per-unit demo scaffold: written create-only by the deliver gate,
 * filled by the agent before launch. The launch auditor compares bytes —
 * a copy still identical to this template is an unfilled form. */
export const DEMO_HOWTO_TEMPLATE = `# how to run

Filled by the agent at demonstration time; read by the founder's
"show me it working" and the launch auditor (an unfilled scaffold
refuses the launch gate). Write how a cold reader sees this unit work.
Scratch captures live in var/ or here as paths — the honesty law
recognizes paths, not pasted binaries. One honest line is a valid fill:
"the suite is the demo" is a show.

## see it work

(fill: the commands, in order, and what each should show)

## run output

(fill: pasted output or the path to the capture)

## visual evidence

(fill: screenshot/recording paths, or "none — the suite is the demo".
A path may declare its kind — \`[evidence: screenshot]\`,
\`[evidence: session-recording]\` — from the registry: suite-run,
test-transcript, screenshot, session-recording; the types are
described, never ranked.)
`;

/** The proofs.md scaffold — planted beside the deliver gate's G4
 * refusal (the v27 test round's find: proofs was the one artifact
 * with no scaffold, and every cold walker paid one avoidable red
 * gate to learn the grammar). Create-only, like every scaffold: a
 * proofs the agent already wrote is never rewritten. The grammar is
 * the point: backticked existing paths are proof paths; prose,
 * numbers, and version strings are not. */
export const PROOFS_TEMPLATE = `# proofs — <unit name>

The deliver gate reads this file for proof paths: a proof path is a
backticked span that names a file on disk (relative to the product
root), or the first bare token of a list item. Prose, expected
outputs, and version strings are not paths — write them without
backticks. One honest line is a valid fill.

## the evidence

(fill: list items like "AC1 — the suite ran: src/thing.test.ts
[evidence: suite-run]" — backtick the real path so the gate can
resolve it)
`;

/** The evidence ladder (IMP-20): what a path can claim to show, declared
 * at the claim — `[evidence: <type>]` beside the path in proofs.md or a
 * demo bundle. The types are described, never ranked: the substitution
 * judgment (a screenshot vs a test transcript) stays the reader's, which
 * is the audit's own boundary. Undeclared paths keep the base law — a
 * path that exists; declaring is how a claim says what kind of seeing
 * it offers, and only declared types are validated (DG-C019). */
export const EVIDENCE_TYPES: Record<string, string> = {
  "suite-run": "deterministic — the recorded green of the project's own suite",
  "test-transcript": "deterministic — a recorded run of a named test or command",
  "screenshot": "visual-only — what the UI showed at one moment; no behavior",
  "session-recording": "interactive — a recorded browser session; behavior shown, not asserted",
};

/** The signatures ledger: one appended row per signed act. A signature is
 * an attestation by command execution — this ledger witnesses who claimed
 * the act, when, over what evidence; it does not (and claims not to)
 * cryptographically prove the human's identity. The per-unit receipt with
 * the evidence hashes lives beside the unit's records. */
export const SIGNATURES_TEMPLATE = `# Signatures

One row per signed act, appended by the sign gate — newest last. A row
witnesses an attestation: the named person ran the signing command over
the named evidence. The evidence hashes live in the unit's own
signature.md.

Reading the signed-by column: a typed identifier appears verbatim — a
human typed it, that is the consent. A value of the form
enc:v1:<base64> is a versioned reversible encoding of a derived
environment identity (git or system): the same encoded value in two
rows of this ledger means the same environment signed both acts. It is
concealment from the casual read, not cryptography — the CLI reveals
it on demand (docodego whoami --decode <value>), and one step of
curiosity does the same without the CLI. A value of the older form
fp:v1:<hex> (records signed before the encoding rethink of
2026-11-09) is a keyed one-way fingerprint: not reversible by design,
standing as recorded.

| date | unit | signed by | role | act |
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

