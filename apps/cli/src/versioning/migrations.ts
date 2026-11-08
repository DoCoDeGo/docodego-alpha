/** The migration engine's data: ordered, version-keyed, NEVER consolidated,
 * never deleted — a consumer who skipped versions needs every step between.
 * Steps are create-only: they may add paths to a record, never edit or
 * remove user-owned content. Each step is idempotent (it checks before it
 * writes) so an interrupted upgrade resumes cleanly. */
import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { readText, writeText } from "../fsx.ts";
import { emptyLock, writeLock, LOCK_REL } from "../skills/lock.ts";
import { DELIVERY_LOG_TEMPLATE, INTENT_TEMPLATE, CYCLES_TEMPLATE, specVersion, recordFiles, agentsMd } from "../bundled/index.ts";
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
];

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

/** The statutes mirror exactly as record v8 shipped it. A mirror carrying
 * these bytes is engine property, not user content — v9 replaces it in
 * place. Anything else is the adopter's own words and is never touched. */
const V8_STATUTES = `# the sixteen statutes

Source: docodego.com, "Sixteen principles. Four pillars. One discipline."
Recorded verbatim, 2026-11-06. The site's own enforcement claim: each
principle is violable in a specific way; each violation is observable.

## DO — document · the Author (statutes 1–4)
1. Intent Is Absolute — binds 01-discover, 03-validate
2. The Spec Is the Contract — binds 04-spec, 03-validate
3. Quality Through Context — binds 02-research
4. Simplicity of Spec — binds 04-spec

## CO — compose · the Architect (statutes 5–8)
5. Code Is Regenerable — binds 02-develop, 04-maintain
6. Resilience Over Robustness — binds 03-enhance, 04-maintain
7. Architecture Before Generation — binds 01-grill
8. Comprehension Is Non-Negotiable — binds 01-grill

## DE — demonstrate · the Gatekeeper (statutes 9–12)
9. Zero-Latency Evolution — binds 03-deploy
10. Feedback Closes the Loop — binds 01-demo
11. Observability Is Non-Negotiable — binds 04-scale, 02-e2e
12. Atomic Delivery — binds 02-e2e, 03-deploy

## GO — govern · the Governor (statutes 13–16)
13. The Human as Governor — binds 03-decide, 04-handover
14. Transparent Reasoning — binds 02-retrospect, 03-decide
15. Security by Design — binds 01-observe (and the grill's threat floor)
16. Alignment Before Demonstration — binds 01-observe, 03-decide

Companion doctrine, verbatim from the site: the DoCoDeGo Axiom — "Intent is
the primary artefact. Implementation is a compiled derivative. Governance is
earned through the loop." IRAF — Intent → Reasoning → Action → Feedback —
replaces the sprint and the release.
`;

/** v8 -> v9: the statutes mirror recompiled from the spec (arc Appendix B
 * stream bindings, † completions). Shipped-v8 bytes are recognized and
 * refreshed in place; genuinely edited mirrors are kept — the bundled copy
 * rides the plan as `.new` for the adopter to reconcile. */
function refreshStatutesMirror(root: string): string {
  const rel = ".standard/statutes.md";
  const fresh = recordFiles()[rel];
  const current = readText(join(root, rel));
  if (current === null) return "kept statutes mirror (absent)";
  if (fresh === undefined) return "kept statutes mirror (bundled copy unavailable)";
  if (current === fresh) return "kept statutes mirror (already current)";
  if (current !== V8_STATUTES) {
    return "kept statutes mirror (your edits preserved; bundled copy rides the plan as .new)";
  }
  writeText(join(root, rel), fresh);
  const stray = join(root, `${rel}.new`);
  if (existsSync(stray)) {
    // the plan planted this side-by-side copy before the migration ran;
    // with the mirror refreshed in place it is the engine's own duplicate
    rmSync(stray);
  }
  return "refreshed statutes mirror in place (shipped v8 bytes recognized)";
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

/** Create-only step: the file appears if absent, otherwise untouched. */
function createOnly(root: string, rel: string, body: string): string {
  const abs = join(root, rel);
  if (existsSync(abs)) return `kept ${rel} (already present)`;
  writeText(abs, body);
  return `created ${rel}`;
}
