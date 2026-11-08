/** The migration engine's data: ordered, version-keyed, NEVER consolidated,
 * never deleted — a consumer who skipped versions needs every step between.
 * Steps are create-only: they may add paths to a record, never edit or
 * remove user-owned content. Each step is idempotent (it checks before it
 * writes) so an interrupted upgrade resumes cleanly. */
import { existsSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { readText, writeText } from "../fsx.ts";
import { emptyLock, writeLock, LOCK_REL } from "../skills/lock.ts";
import { COMPOSE_LOG_TEMPLATE, DEMO_README_TEMPLATE, DELIVERY_LOG_TEMPLATE, INTENT_TEMPLATE, CYCLES_TEMPLATE, specVersion, recordFiles, agentsMd, statutesShippedHashes } from "../bundled/index.ts";
import { COMPOSE_LOG_REL, DEMO_DIR_REL, DELIVERY_LOG_REL } from "../record/record-write.ts";
import { V1_README, V1_STATUTES, V1_TECH_RADAR, V1_TRACKER } from "./v1-scaffold.ts";

export interface Migration {
  from: number;
  to: number;
  notes: string[];
  steps: ((root: string) => string)[];
}

export const MIGRATIONS: Migration[] = [
  {
    from: 0,
    to: 1,
    notes: [
      "add .standard/ (statutes.md, tech-radar.md) and the record front door README.md",
      "add 04-govern/01-monitor/tracker.md (append-only)",
      "manifest.json gains mode, codeState, pattern, ring, detect — additive only",
    ],
    steps: [
      (root) => createOnly(root, "README.md", V1_README),
      (root) => createOnly(root, ".standard/statutes.md", V1_STATUTES),
      (root) => createOnly(root, ".standard/tech-radar.md", V1_TECH_RADAR),
      (root) => createOnly(root, "04-govern/01-monitor/tracker.md", V1_TRACKER),
    ],
  },
  {
    from: 1,
    to: 2,
    notes: [
      "skills index + lockfile introduced",
      "profiles introduced",
      "record contract gains skills-lock.json",
    ],
    steps: [
      (root) => {
        if (existsSync(join(root, LOCK_REL))) return `kept ${LOCK_REL} (already present)`;
        writeLock(root, emptyLock(specVersion()));
        return `created ${LOCK_REL} (empty installed set)`;
      },
    ],
  },
  {
    from: 2,
    to: 3,
    notes: [
      "AGENTS.md now documents the explain command (diagnostic code pages)",
      "no record paths change; the scaffold refresh is create-only, as always",
    ],
    steps: [],
  },
  {
    from: 3,
    to: 4,
    notes: [
      "AGENTS.md now documents the trace, doctor, and completions commands",
      "the three lines are appended after the explain line — additive, idempotent",
      "no record paths change",
    ],
    steps: [appendTraceDoctorCompletions],
  },
  {
    from: 4,
    to: 5,
    notes: [
      "the record front door is replaced by the record index (read order, shape, law, tracker pointer)",
      "the manifest may carry an optional `vocabulary` — the dialect a record was born speaking (init --vocabulary)",
      "no record paths change; your words are yours — a documented no-op, the scaffold refresh stays create-only",
    ],
    steps: [],
  },
  {
    from: 5,
    to: 6,
    notes: [
      "the honesty layer is planted, create-only: 01-document/01-discover/intent.md (the founding brief, verbatim)",
      "01-document/01-discover/cycles.md — the numbered, append-only cycle log",
      "04-govern/delivery-log.md — one row per delivered unit, appended by the gate itself",
      "the deliver gate now records refused attempts in the tracker; proof paths may sit anywhere in a list item",
      "your words are never touched: every step is create-only and idempotent",
    ],
    steps: [
      (root) => createOnly(root, "01-document/01-discover/intent.md", INTENT_TEMPLATE),
      (root) => createOnly(root, "01-document/01-discover/cycles.md", CYCLES_TEMPLATE),
      (root) => createOnly(root, DELIVERY_LOG_REL, DELIVERY_LOG_TEMPLATE),
    ],
  },
  {
    from: 6,
    to: 7,
    notes: [
      "the visual-proof skill joins the bundled shelf; the delta rode the upgrade plan's create-only copy",
      "no record-file transforms were required — this entry exists so no version is ever skipped silently",
    ],
    steps: [],
  },
  {
    from: 7,
    to: 8,
    notes: [
      "the visual-proof driver's self-test fixes ship in the bundled skill; deltas rode the plan's skill refresh",
      "no record-file transforms were required — the registry never consolidates",
    ],
    steps: [],
  },
  {
    from: 8,
    to: 9,
    notes: [
      "the statutes mirror is recompiled from the spec — arc Appendix B stream bindings and † completions (canon upkeep, patch class)",
      "a mirror still carrying the shipped v8 bytes refreshes in place; your own edits are kept, the bundled copy rides the plan as .new",
    ],
    steps: [refreshStatutesMirror],
  },
  {
    from: 9,
    to: 10,
    notes: [
      "AGENTS.md teaches the naming law: unit folders carry their NNN- sequence prefix — names carry order (spec7-naming)",
      "a record whose AGENTS.md still matches the shipped v9 scaffold gains the paragraph in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new",
    ],
    steps: [teachNamingLaw],
  },
  {
    from: 10,
    to: 11,
    notes: [
      "AGENTS.md teaches the retire verb: delivered units leave the stream via 'docodego retire <unit>' and become named a-* behaviors under system/behavioral/ (spec7-retire)",
      "a record whose AGENTS.md still matches the shipped v10 scaffold gains the sentence in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new",
    ],
    steps: [teachRetirement],
  },
  {
    from: 11,
    to: 12,
    notes: [
      "AGENTS.md drops the decorative frontmatter version line: it implied a binding no reader could check (it never moved across shipped versions); the record manifest is the version a reader can verify (spec7-bundling)",
      "upgrade's plan tells create from restore by the payload's introducedIn map: a path the record's version already saw but that is absent on disk re-appears only as <path>.new — owed a merge, never silently re-created in place",
      "the statutes mirror refresh recognizes engine-owned bytes by the payload's accumulated shipped-hash set (derived from the committed chain, seeded once from git history) — the hand-copied byte constant is gone",
    ],
    steps: [dropAgentsVersion],
  },
  {
    from: 12,
    to: 13,
    notes: [
      "AGENTS.md teaches the launch tiers: 'docodego launch <unit>' re-audits the delivered unit's evidence (status launch-passed); 'docodego sign <unit> --by \"<legal name>\"' records a named person's attestation as an act receipt (status founder-signed) (spec7-launch-gate)",
      "a record whose AGENTS.md still matches the shipped scaffold gains the lines in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new",
    ],
    steps: [teachLaunchSign],
  },
  {
    from: 13,
    to: 14,
    notes: [
      "the nine-skill shelf joins the index: six bundled (security-baseline-for-ai-code, destructive-action-guard, reward-hacking-detection, supply-chain-evidence, incident-record-writing, docs-publishing) and three auto-add (tech-stack, docodego-payments, research-verify) (spec7-shelf-and-stack)",
      "the rules layer plants create-only: .agents/rules/ — five invariant rules + the README map, each rule naming reader, fails-when, enforced-by",
      "check gains the tree scans: the rules floor (furniture listing, DG-C010), the stack scan (DG-C008), the untracked-source scan (DG-C009) — warnings with file evidence, never errors",
      "installed skills refresh per the lockfile as always; nothing new installs without 'skill add' or its trigger",
    ],
    steps: [teachShelfAndRules],
  },
  {
    from: 14,
    to: 15,
    notes: [
      "the planted prose sweep: dead references fixed at their sources — questions.md no longer names a .framework tree that never ships; the visual-proof skill (bumped to 1.0.1) runs its driver at the planted path, and the sweep itself is a gate (conformance reads every planted row every run) (020-canon-debts/290)",
      "no record-file transforms were required — this entry exists so no version is ever skipped silently",
      "installed skills whose bytes changed fail the lockfile audit (DG-K001) by design; 'skill add --force' re-plants and re-stamps them",
    ],
    steps: [],
  },
  {
    from: 15,
    to: 16,
    notes: [
      "AGENTS.md teaches the gate-rows law: the tracker and delivery-log lines a gate writes ride the unit's own commit — a delivered unit whose rows sit uncommitted is a broken record (020-canon-debts/300)",
      "a record whose AGENTS.md still matches the shipped v15 scaffold gains the bullet in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new",
    ],
    steps: [teachGateRowsHome],
  },
  {
    from: 16,
    to: 17,
    notes: [
      "AGENTS.md teaches the event order and the repair rule: a unit's status events run new -> grill -> score -> deliver, and a refused gate records the attempt in the tracker and re-enters at the refused step — the record repaired forward, never rewritten (020-canon-debts/310)",
      "a record whose AGENTS.md still matches the shipped v16 scaffold gains the sentences in place; a customized AGENTS.md is kept, the refreshed copy riding the plan as .new",
    ],
    steps: [teachEventOrder],
  },
  {
    from: 17,
    to: 18,
    notes: [
      "research is a first-class non-unit: the checker ignores a folder named research directly in 01-discover (grounding notes never impersonate units again), and the 01-discover README names the home (020-canon-debts/330)",
      "no migration steps: stream READMEs are the record's birth words (pack-voiced copies are excluded from the plan's conflict scan), so the README line rides birth copies and customized READMEs keep their words — the checker's exemption carries the law",
    ],
    steps: [],
  },
  {
    from: 18,
    to: 19,
    notes: [
      "the record plants .docodego/.gitignore: var/ is the record's scratch home and *.new is the upgrade plan's conflict copies — machine artifacts never enter git (020-canon-debts/370)",
      "no migration steps: a new boundary row rides the plan's create-only copy — a record with its own .docodego/.gitignore keeps it, the bundled copy riding as .new",
    ],
    steps: [],
  },
  {
    from: 19,
    to: 20,
    notes: [
      "the compose room gets its gate-written artifact: .docodego/02-compose/compose-log.md, one row per delivered unit (date, unit, delivered spec hash, declared deviations), appended by the deliver gate — readers named in the header: the handoff agent and the build-honesty auditor (020-canon-debts/380)",
      "one create-only step plants the log: engine-owned like the delivery log (a file that grows at every delivery would drift an embedded copy), so it is a migration step, not a boundary row — a record that already keeps its own compose-log.md keeps it",
    ],
    steps: [(root) => createOnly(root, COMPOSE_LOG_REL, COMPOSE_LOG_TEMPLATE)],
  },
  {
    from: 20,
    to: 21,
    notes: [
      "the demonstrate room gets its gate-written artifact class: demo/<unit>/ bundles — how-to-run.md scaffolded create-only at deliver, filled by the agent before launch; the launch gate refuses the unfilled scaffold (L5), because the founder's 'show me it working' is never answered with an unfilled form (020-canon-debts/010-demo-bundles)",
      "one create-only step plants the room's anchor (demo/README.md, naming both readers and the not-there-yet truth); the per-unit scaffolds are written by the gates themselves — a delivered unit from before the bundles scaffolds at its next launch attempt, the repair always forward",
    ],
    steps: [(root) => createOnly(root, `${DEMO_DIR_REL}/README.md`, DEMO_README_TEMPLATE)],
  },
  {
    from: 21,
    to: 22,
    notes: [
      "the evidence ladder ships (IMP-20): a proof or demo-bundle path may declare its kind — [evidence: screenshot | test-transcript | session-recording | suite-run] — the registry described, never ranked; the checker refuses declarations outside the registry (DG-C019, drift), because an unintelligible declaration is worse than none (020-canon-debts/390)",
      "AGENTS.md's evidence bullet gains the declaration sentence, taught in place by the v21->v22 migration: shipped-v21 bytes gain it, customized copies keep their words, the refreshed scaffold riding the plan as .new",
    ],
    steps: [teachEvidenceLadder],
  },
  {
    from: 22,
    to: 23,
    notes: [
      "the register split lands (IMP-11, accepted by the founder 2026-11-08): the honesty law's rules carry one of two marks — invariants (verbatim intent, append-only, records-before-claims, earned statuses, real proof paths, honored refusals) and guidance (unit home, artifact layout, ADR pattern, phases' depth, score as a checklist) — with guidance deviations on one recorded line: deviations: <what> — <why> in the unit spec's frontmatter, carried verbatim into the compose log at deliver (020-canon-debts/410)",
      "AGENTS.md gains the two-registers section before the commands, taught in place by the v22->v23 migration: shipped-v22 bytes gain it, customized copies keep their words, the refreshed scaffold riding the plan as .new; no line is removed — a payload rule line removed would be a MAJOR bump, and this teach is pure insertion",
    ],
    steps: [teachRegisters],
  },
];

/** v16 -> v17: teach AGENTS.md the event order and the repair rule.
 * Same conservative contract as teachGateRowsHome: shipped-v16 bytes
 * gain the sentences in place; anything else is kept untouched, the
 * refreshed copy riding the plan as .new. Exported for the conformance
 * fixture that holds the teach contract in place. */
const EVENT_ORDER_ANCHOR = "no implementation before a scored spec, no delivery without a proof that\nexists.";
const EVENT_ORDER_TEXT = [
  "exists. The events a unit's status line records run in one order —",
  "`new` → `grill` → `score` → `deliver` — and a refused gate records the",
  "attempt in the tracker and re-enters at the refused step: re-score",
  "re-binds the spec hash, re-deliver re-runs the checks. The record is",
  "repaired forward, never rewritten.",
].join("\n");

/** The conservative teach contract, shared by every AGENTS.md teacher: a
 * shipped-shaped copy gains the law in place; an already-taught copy is
 * kept with a reason; a customized copy is kept untouched, the refreshed
 * scaffold riding as AGENTS.md.new; and a stale .new twin beside a
 * now-identical live file is removed. The strings are fixture-pinned —
 * never reword them here. */
interface TeachPlan {
  present: { sentinel: string; label: string };
  anchor: string;
  anchorLabel: string;
  teach: (raw: string) => string;
  note: string;
}

/** The shared skeleton behind every anchor-form teacher. */
function teachAnchor(root: string, plan: TeachPlan): string {
  const abs = join(dirname(root), "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes(plan.present.sentinel)) return `kept AGENTS.md (${plan.present.label} already present)`;
  if (!raw.includes(plan.anchor)) {
    return `kept AGENTS.md (${plan.anchorLabel} not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)`;
  }
  return finishTeach(abs, plan.teach(raw), plan.note);
}

/** Land the taught bytes in place and sweep the .new twin once the live
 * file matches it — the twin only exists to carry the refreshed scaffold
 * to a customized copy, and a matching twin is the engine's own duplicate. */
function finishTeach(abs: string, taught: string, note: string): string {
  writeText(abs, taught);
  let out = note;
  const twin = `${abs}.new`;
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    out += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return out;
}

export function teachEventOrder(root: string): string {
  return teachAnchor(root, {
    present: { sentinel: "repaired forward, never rewritten", label: "event-order law" },
    anchor: EVENT_ORDER_ANCHOR,
    anchorLabel: "anchor sentence",
    teach: (raw) => raw.replace(EVENT_ORDER_ANCHOR, `no implementation before a scored spec, no delivery without a proof that\n${EVENT_ORDER_TEXT}`),
    note: "updated AGENTS.md (event-order sentences inserted after the order line)",
  });
}

/** v21 -> v22: teach AGENTS.md the evidence declaration — the evidence
 * ladder's grammar. Same conservative contract as the prior teaches:
 * shipped-v21 bytes gain the sentence in place; anything else is kept
 * untouched, the refreshed copy riding the plan as .new. Exported for
 * the conformance fixture that holds the teach contract in place. */
const EVIDENCE_LADDER_ANCHOR = "- **Evidence is a path that exists.** No path, no claim. A proofs.md entry\n  names a real file; `verified: false` recorded honestly is worth more than\n  a claim that was never checked.";
const EVIDENCE_LADDER_TEXT = " A claim may declare the kind of seeing it\n  offers — `[evidence: screenshot]`, `[evidence: test-transcript]`,\n  `[evidence: session-recording]`, `[evidence: suite-run]` — the registry's\n  types, described never ranked; the declaration rides the path, and the\n  reader judges the substitution.";

export function teachEvidenceLadder(root: string): string {
  return teachAnchor(root, {
    present: { sentinel: "described never ranked", label: "evidence-ladder law" },
    anchor: EVIDENCE_LADDER_ANCHOR,
    anchorLabel: "anchor sentence",
    teach: (raw) => raw.replace(EVIDENCE_LADDER_ANCHOR, `${EVIDENCE_LADDER_ANCHOR}${EVIDENCE_LADDER_TEXT}`),
    note: "updated AGENTS.md (evidence declaration sentence added to the evidence bullet)",
  });
}

/** v22 -> v23: teach AGENTS.md the two registers — the honesty law's
 * rules marked invariants or guidance, guidance deviations on one
 * recorded line. Same conservative contract as the prior teaches:
 * shipped-v22 bytes gain the section in place (pure insertion — a
 * payload rule line removed would be a MAJOR bump); anything else is
 * kept untouched, the refreshed copy riding the plan as .new. Exported
 * for the conformance fixture that holds the teach contract in place. */
const REGISTERS_ANCHOR = "## The commands";
const REGISTERS_SECTION = [
  "## The two registers",
  "",
  "The law's rules carry one of two marks. **Invariants** — the record's",
  "spine, never bargained: verbatim intent, append-only records, records",
  "before claims, statuses earned at gates, real proof paths, honored",
  "refusals. **Guidance** — the conventions that keep units legible: the",
  "unit home, artifact layout, the ADR pattern, the phases' depth, the",
  "score as a checklist. Guidance bends when the work demands it, on one",
  "recorded line — `deviations: <what> — <why>` in the unit spec's",
  "frontmatter, carried verbatim into the compose log at deliver. An",
  "invariant has no one-line form: it holds, or the work stops and says",
  "why on the record.",
  "",
  "",
].join("\n");

export function teachRegisters(root: string): string {
  return teachAnchor(root, {
    present: { sentinel: "## The two registers", label: "registers" },
    anchor: REGISTERS_ANCHOR,
    anchorLabel: "anchor heading",
    teach: (raw) => raw.replace(REGISTERS_ANCHOR, REGISTERS_SECTION + REGISTERS_ANCHOR),
    note: "updated AGENTS.md (the two registers inserted before the commands)",
  });
}

/** v15 -> v16: teach AGENTS.md the gate-rows law — a delivery carries its
 * evidence rows. Same conservative contract as teachNamingLaw:
 * shipped-v15 bytes gain the bullet in place; anything else is kept
 * untouched, the refreshed copy riding the plan as .new. */
const GATE_ROWS_ANCHOR = "  did not, for this repository's purposes, happen.";
const GATE_ROWS_BULLET = [
  "- **Gate rows ride the unit's commit.** The tracker and delivery-log",
  "  lines a gate writes are part of the delivery itself: a commit that",
  "  lands a unit carries its evidence rows. A delivered unit whose rows",
  "  sit uncommitted is a broken record — commit them home, or the",
  "  delivery never happened.",
].join("\n");

export function teachGateRowsHome(root: string): string {
  return teachAnchor(root, {
    present: { sentinel: "Gate rows ride", label: "gate-rows law" },
    anchor: GATE_ROWS_ANCHOR,
    anchorLabel: "anchor line",
    teach: (raw) => raw.replace(GATE_ROWS_ANCHOR, `${GATE_ROWS_ANCHOR}\n${GATE_ROWS_BULLET}`),
    note: "updated AGENTS.md (gate-rows bullet inserted after the failure-is-evidence bullet)",
  });
}

/** The registry must cover [0..target] contiguously — Terraform's ladder
 * check, Angular's never-consolidate law. A behind record walking the chain
 * must find every step between where it is and where it is going; a gap
 * would let it silently upgrade with zero transforms and get stamped
 * current (H2's second versioning finding, enforced by the bundle guard). */
export function assertContiguous(target: number): void {
  let expected = 0;
  for (const m of MIGRATIONS) {
    if (m.from !== expected) {
      throw new Error(`migration registry has a gap: expected an entry from v${expected}, found from v${m.from} — never consolidate, never skip`);
    }
    expected = m.to;
  }
  if (expected !== target) {
    throw new Error(`migration registry ends at v${expected} but the declared record version is v${target} — add the honest entries before shipping`);
  }
}

/** v3 -> v4: teach AGENTS.md the three commands the CLI grew in 0.4.0.
 * AGENTS.md is engine-owned scaffold, not user content, but the edit is
 * still strictly additive — three bullets inserted after the explain line,
 * nothing removed. Idempotent: a file that already names `trace` is kept. */
function appendTraceDoctorCompletions(root: string): string {
  // `root` is the record dir (.docodego); AGENTS.md lives at the repo root.
  const abs = join(dirname(root), "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("`docodego trace <unit>`")) return "kept AGENTS.md (commands already current)";
  const anchor = "- `docodego explain <code>` — the page for a diagnostic code: what it means, the law behind it, how to fix it.\n";
  if (!raw.includes(anchor)) return "kept AGENTS.md (explain line not found — refresh with 'docodego init --force')";
  const additions = "- `docodego trace <unit>` — everything recorded about one unit, replayed on one timeline (read-only).\n- `docodego doctor` — support triage: environment, record health, lockfile, version axes.\n- `docodego completions <bash|zsh|fish>` — shell completion scripts generated from the help registry.\n";
  writeText(abs, raw.replace(anchor, anchor + additions));
  return "updated AGENTS.md (trace, doctor, completions appended after explain)";
}

/** v8 -> v9: the statutes mirror recompiled from the spec (arc Appendix B
 * stream bindings, † completions). A mirror whose bytes hash to any
 * generation the payload ever shipped is engine property, not user
 * content — recognized and refreshed in place. Anything else is the
 * adopter's own words and is never touched; the bundled copy rides the
 * plan as `.new`. The shipped generations come from the payload's own
 * accumulated `statutesShippedHashes` (seeded from git archaeology,
 * self-maintaining thereafter) — the pairing is derived, never a
 * hand-copied constant to remember. */
function refreshStatutesMirror(root: string): string {
  const rel = ".standard/statutes.md";
  const fresh = recordFiles()[rel];
  const current = readText(join(root, rel));
  if (current === null) return "kept statutes mirror (absent)";
  if (fresh === undefined) return "kept statutes mirror (bundled copy unavailable)";
  if (current === fresh) return "kept statutes mirror (already current)";
  const prior = createHash("sha256").update(current).digest("hex");
  if (!statutesShippedHashes().includes(prior)) {
    return "kept statutes mirror (your edits preserved; bundled copy rides the plan as .new)";
  }
  writeText(join(root, rel), fresh);
  const stray = join(root, `${rel}.new`);
  if (existsSync(stray)) {
    // the plan planted this side-by-side copy before the migration ran;
    // with the mirror refreshed in place it is the engine's own duplicate
    rmSync(stray);
  }
  return "refreshed statutes mirror in place (shipped bytes recognized)";
}

/** The migrations to run to move `from` -> target, in order, any skip-distance. */
const NAMING_ANCHOR = "4. `.docodego/04-govern/` — the loop closed: tracker, delivery log, improvement (GO)";
const NAMING_PARAGRAPH = [
  "",
  "Units carry the same discipline: every unit folder is `NNN-<name>` — its build",
  "order in the listing, step of ten (010-, 020-, …), so a cold reader sees the",
  "order of work without reading the tracker. `docodego new` assigns the next",
  "number automatically.",
].join("\n");

/** v9 -> v10: teach AGENTS.md the naming law. Engine-owned scaffold, not user
 * content — but the edit is conservative: a shipped-v9 copy gains the
 * paragraph in place; anything else is kept untouched, the refreshed copy
 * riding the plan as .new. Cleans up the matching .new once the live file is
 * current. */
function teachNamingLaw(root: string): string {
  return teachAnchor(root, {
    present: { sentinel: "`NNN-<name>`", label: "naming law" },
    anchor: NAMING_ANCHOR,
    anchorLabel: "anchor line",
    teach: (raw) => raw.replace(NAMING_ANCHOR, `${NAMING_ANCHOR}\n${NAMING_PARAGRAPH}`),
    note: "updated AGENTS.md (naming paragraph inserted after the movements list)",
  });
}

export function migrationsFor(from: number, target: number): Migration[] {
  return MIGRATIONS.filter((m) => m.from >= from && m.to <= target);
}

/** v10 -> v11: teach AGENTS.md the retire verb — done is a place. Same
 * conservative contract as teachNamingLaw: shipped-v10 bytes gain the
 * sentence in place; anything else is kept untouched, the refreshed copy
 * riding the plan as .new. */
const RETIRE_ANCHOR = [
  "retiring there as named `a-*` behaviors, the living record of what the",
  "system does now.",
].join("\n");
const RETIRE_TAUGHT = [
  "retiring there as named `a-*` behaviors via `docodego retire <unit>`,",
  "the living record of what the system does now.",
].join("\n");

function teachRetirement(root: string): string {
  return teachAnchor(root, {
    present: { sentinel: "`docodego retire", label: "retire verb" },
    anchor: RETIRE_ANCHOR,
    anchorLabel: "anchor sentence",
    teach: (raw) => raw.replace(RETIRE_ANCHOR, RETIRE_TAUGHT),
    note: "updated AGENTS.md (retire verb inserted into the growth paragraph)",
  });
}

/** v12 -> v13: teach the launch tiers. AGENTS.md's command list gains the
 * two new verbs beside deliver — the launch gate (the evidence re-audited)
 * and the sign gate (a named person's attestation). Same conservative
 * contract as its sibling teachers: the anchor sentence must be present in
 * a shipped-shaped copy, else the refreshed scaffold rides as .new. */
function teachLaunchSign(root: string): string {
  const anchor = "- `docodego deliver <unit>` — the gate: four checks, then delivered.md + tracker + delivery-log rows.\n";
  const additions = "- `docodego launch <unit>` — the launch gate: the delivered unit's evidence re-audited (proofs still resolve, record check clean) — status launch-passed.\n- `docodego sign <unit> --by \"<legal name>\"` — the last tier: a named person's attestation, recorded as an act receipt — status founder-signed.\n";
  return teachAnchor(root, {
    present: { sentinel: "`docodego launch", label: "launch verbs" },
    anchor,
    anchorLabel: "anchor line",
    teach: (raw) => raw.replace(anchor, anchor + additions),
    note: "updated AGENTS.md (launch and sign verbs inserted after deliver)",
  });
}

/** v13 -> v14: teach AGENTS.md the rules layer — the section that names
 * the five invariant rules, the furniture doctrine, and check's tree
 * scans. Same conservative contract as every AGENTS.md teach: a copy
 * still shaped like the shipped scaffold gains the section in place;
 * anything else is kept, the refreshed copy riding the plan as .new. */
function teachShelfAndRules(root: string): string {
  const anchor = "## Growing the record";
  const section = "## The rules\n\n`.agents/rules/` holds the five invariant rules, each rule file naming\nwho reads it, what failure it prevents, and what holds it\n(`enforced-by`). A rule whose enforced-by names nothing live is\nfurniture: `docodego check` lists it, and deletion is human-confirmed —\nrules are law, and auto-deleting law is an interruption-safety\nviolation. The two mechanical rules run as check warnings (the stack\nscan, the untracked-source scan); the practice rules hold by their\nnamed instruments. The map: `.agents/rules/README.md`.\n\n";
  return teachAnchor(root, {
    present: { sentinel: "## The rules", label: "the rules layer" },
    anchor,
    anchorLabel: "anchor heading",
    teach: (raw) => raw.replace(anchor, section + anchor),
    note: "updated AGENTS.md (the rules section inserted before Growing the record)",
  });
}

/** v11 -> v12: drop the decorative frontmatter `version:` line from
 * AGENTS.md — it implies a binding no reader can check (it has drifted
 * across every shipped version); the record manifest is the version a
 * reader can verify. Same conservative contract: a copy still carrying
 * the line in a shipped-shaped frontmatter loses it in place; anything
 * else is kept, the refreshed copy riding the plan as .new. */
function dropAgentsVersion(root: string): string {
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to drop)";
  const raw = readText(abs) ?? "";
  if (!raw.startsWith("---")) return "kept AGENTS.md (no frontmatter — nothing to drop)";
  if (!/^version:\s*\S+.*\n/m.test(raw.slice(0, raw.indexOf("---", 3)))) {
    return "kept AGENTS.md (frontmatter carries no version line)";
  }
  const head = raw.slice(0, raw.indexOf("---", 3));
  const dropped = head.replace(/^version:\s*\S+.*\n/m, "");
  const taught = dropped + raw.slice(raw.indexOf("---", 3));
  return finishTeach(abs, taught, "updated AGENTS.md (decorative frontmatter version line dropped — the record manifest is the version)");
}

/** Create-only step: the file appears if absent, otherwise untouched. */
function createOnly(root: string, rel: string, body: string): string {
  const abs = join(root, rel);
  if (existsSync(abs)) return `kept ${rel} (already present)`;
  writeText(abs, body);
  return `created ${rel}`;
}
