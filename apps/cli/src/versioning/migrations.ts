/** The migration engine's data: ordered, version-keyed, NEVER consolidated,
 * never deleted — a consumer who skipped versions needs every step between.
 * Steps are create-only: they may add paths to a record, never edit or
 * remove user-owned content. Each step is idempotent (it checks before it
 * writes) so an interrupted upgrade resumes cleanly. */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readText, writeText } from "../fsx.ts";
import { emptyLock, writeLock, LOCK_REL } from "../skills/lock.ts";
import { specVersion } from "../bundled/index.ts";
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
];

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

/** The migrations to run to move `from` -> target, in order, any skip-distance. */
export function migrationsFor(from: number, target: number): Migration[] {
  return MIGRATIONS.filter((m) => m.from >= from && m.to <= target);
}

/** Create-only step: the file appears if absent, otherwise untouched. */
function createOnly(root: string, rel: string, body: string): string {
  const abs = join(root, rel);
  if (existsSync(abs)) return `kept ${rel} (already present)`;
  writeText(abs, body);
  return `created ${rel}`;
}
