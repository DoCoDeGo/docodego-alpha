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
import { DELIVERY_LOG_TEMPLATE, INTENT_TEMPLATE, CYCLES_TEMPLATE, specVersion, recordFiles, agentsMd, statutesShippedHashes } from "../bundled/index.ts";
import { DELIVERY_LOG_REL } from "../record/record-write.ts";
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

export function teachEventOrder(root: string): string {
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("repaired forward, never rewritten")) return "kept AGENTS.md (event-order law already present)";
  if (!raw.includes(EVENT_ORDER_ANCHOR)) {
    return "kept AGENTS.md (anchor sentence not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)";
  }
  const taught = raw.replace(EVENT_ORDER_ANCHOR, `no implementation before a scored spec, no delivery without a proof that\n${EVENT_ORDER_TEXT}`);
  writeText(abs, taught);
  let note = "updated AGENTS.md (event-order sentences inserted after the order line)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
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
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("Gate rows ride")) return "kept AGENTS.md (gate-rows law already present)";
  if (!raw.includes(GATE_ROWS_ANCHOR)) {
    return "kept AGENTS.md (anchor line not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)";
  }
  const taught = raw.replace(GATE_ROWS_ANCHOR, `${GATE_ROWS_ANCHOR}\n${GATE_ROWS_BULLET}`);
  writeText(abs, taught);
  let note = "updated AGENTS.md (gate-rows bullet inserted after the failure-is-evidence bullet)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
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
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("`NNN-<name>`")) return "kept AGENTS.md (naming law already present)";
  if (!raw.includes(NAMING_ANCHOR)) {
    return "kept AGENTS.md (anchor line not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)";
  }
  const taught = raw.replace(NAMING_ANCHOR, `${NAMING_ANCHOR}\n${NAMING_PARAGRAPH}`);
  writeText(abs, taught);
  let note = "updated AGENTS.md (naming paragraph inserted after the movements list)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
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
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("`docodego retire")) return "kept AGENTS.md (retire verb already present)";
  if (!raw.includes(RETIRE_ANCHOR)) {
    return "kept AGENTS.md (anchor sentence not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)";
  }
  const taught = raw.replace(RETIRE_ANCHOR, RETIRE_TAUGHT);
  writeText(abs, taught);
  let note = "updated AGENTS.md (retire verb inserted into the growth paragraph)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
}

/** v12 -> v13: teach the launch tiers. AGENTS.md's command list gains the
 * two new verbs beside deliver — the launch gate (the evidence re-audited)
 * and the sign gate (a named person's attestation). Same conservative
 * contract as its sibling teachers: the anchor sentence must be present in
 * a shipped-shaped copy, else the refreshed scaffold rides as .new. */
function teachLaunchSign(root: string): string {
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("`docodego launch")) return "kept AGENTS.md (launch verbs already present)";
  const anchor = "- `docodego deliver <unit>` — the gate: four checks, then delivered.md + tracker + delivery-log rows.\n";
  if (!raw.includes(anchor)) {
    return "kept AGENTS.md (anchor line not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)";
  }
  const additions = "- `docodego launch <unit>` — the launch gate: the delivered unit's evidence re-audited (proofs still resolve, record check clean) — status launch-passed.\n- `docodego sign <unit> --by \"<legal name>\"` — the last tier: a named person's attestation, recorded as an act receipt — status founder-signed.\n";
  const taught = raw.replace(anchor, anchor + additions);
  writeText(abs, taught);
  let note = "updated AGENTS.md (launch and sign verbs inserted after deliver)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
}

/** v13 -> v14: teach AGENTS.md the rules layer — the section that names
 * the five invariant rules, the furniture doctrine, and check's tree
 * scans. Same conservative contract as every AGENTS.md teach: a copy
 * still shaped like the shipped scaffold gains the section in place;
 * anything else is kept, the refreshed copy riding the plan as .new. */
function teachShelfAndRules(root: string): string {
  const repoRoot = dirname(root);
  const abs = join(repoRoot, "AGENTS.md");
  if (!existsSync(abs)) return "kept AGENTS.md (absent — nothing to teach)";
  const raw = readText(abs) ?? "";
  if (raw.includes("## The rules")) return "kept AGENTS.md (the rules layer already present)";
  const anchor = "## Growing the record";
  if (!raw.includes(anchor)) {
    return "kept AGENTS.md (anchor heading not found — your copy is customized; the refreshed scaffold rides as AGENTS.md.new)";
  }
  const section = "## The rules\n\n`.agents/rules/` holds the five invariant rules, each rule file naming\nwho reads it, what failure it prevents, and what holds it\n(`enforced-by`). A rule whose enforced-by names nothing live is\nfurniture: `docodego check` lists it, and deletion is human-confirmed —\nrules are law, and auto-deleting law is an interruption-safety\nviolation. The two mechanical rules run as check warnings (the stack\nscan, the untracked-source scan); the practice rules hold by their\nnamed instruments. The map: `.agents/rules/README.md`.\n\n";
  const taught = raw.replace(anchor, section + anchor);
  writeText(abs, taught);
  let note = "updated AGENTS.md (the rules section inserted before Growing the record)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
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
  writeText(abs, taught);
  let note = "updated AGENTS.md (decorative frontmatter version line dropped — the record manifest is the version)";
  const twin = join(repoRoot, "AGENTS.md.new");
  if (existsSync(twin) && (readText(twin) ?? "") === taught) {
    rmSync(twin);
    note += " — AGENTS.md.new removed (now identical to the refreshed file)";
  }
  return note;
}

/** Create-only step: the file appears if absent, otherwise untouched. */
function createOnly(root: string, rel: string, body: string): string {
  const abs = join(root, rel);
  if (existsSync(abs)) return `kept ${rel} (already present)`;
  writeText(abs, body);
  return `created ${rel}`;
}
