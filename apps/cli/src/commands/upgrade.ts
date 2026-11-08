/** `upgrade [--apply] [--branch]` — move a record forward to the bundled
 * spec version, Flyway x Rails x Terraform:
 *   plain      plan only — versions, migration notes, per-file plan, conflicts
 *   --apply    create-only copy of bundled files + agent presets, refresh of
 *              already-installed skills (an upgrade never silently adds
 *              skills — it prints the profile suggestion instead), then the
 *              ordered migrations, tracker evidence per step, a validation
 *              re-read + check pass, and the version stamp
 *   --branch   do all of that on docodego-upgrade-vX-to-vY and commit
 * Forward-compat: a record newer than this CLI is refused politely (exit 0,
 * nothing changed). Failure mid-apply stops with exit 1 and stays resumable —
 * every step is idempotent and leaves tracker evidence. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { Args, Io, Manifest } from "../types.ts";
import { loadRecord, MANIFEST_REL, RECORD_DIR, type RecordAst } from "../record/load.ts";
import { checkPass } from "../passes/index.ts";
import { renderDiagnostics } from "../emit/diagnostics.ts";
import { migrationsFor } from "../versioning/migrations.ts";
import { applyPlan, computePlan, renderPlan, type PlanEntry } from "../versioning/plan.ts";
import { agentsMd, agentPresets, introductions, recordFiles, skillFiles, skillsIndex, specVersion, DEFAULT_PROFILE, profiles as profileMap, vocabularyPack } from "../bundled/index.ts";
import { appendTrackerLine, plantSkill, readLock } from "../skills/lock.ts";
import { readText, writeText } from "../fsx.ts";
import { envelope } from "../emit/json.ts";

/** The files an upgrade may plant, repo-root-relative. The engine-owned
 * manifest and lockfile are written by the engine, never copied. When the
 * record was born with a vocabulary pack, the pack-voiced stream READMEs
 * are the record's birth words — excluded from the target so an upgrade
 * never conflicts them against canonical bytes as .new spam (H2's third
 * versioning finding; only migrations touch a record's words, and they
 * don't). */
function bundledFiles(rec: RecordAst): Record<string, string> {
  const out: Record<string, string> = { "AGENTS.md": agentsMd() };
  const pack = rec.manifest.vocabulary !== undefined ? vocabularyPack(rec.manifest.vocabulary) : undefined;
  const voiced = new Set<string>(
    pack === undefined ? [] : Object.keys(pack.streams).map((id) => `${RECORD_DIR}/${id}/README.md`),
  );
  for (const [rel, body] of Object.entries(recordFiles())) {
    if (rel === MANIFEST_REL || voiced.has(`${RECORD_DIR}/${rel}`)) continue;
    out[`${RECORD_DIR}/${rel}`] = body;
  }
  for (const [rel, body] of Object.entries(agentPresets())) out[`.agents/agents/${rel}`] = body;
  return out;
}

export function run(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const current = rec.manifest.recordVersion;
  const target = specVersion();
  if (current > target) {
    say(io, args.json, { current, target, notes: ["record is newer than this CLI — upgrade the CLI"], applied: [] }, `record v${current} is newer than this CLI's spec v${target} — upgrade the CLI; nothing was changed.`);
    return 0;
  }
  const migrations = migrationsFor(current, target);
  const notes = migrations.flatMap((m) => m.notes.map((n) => `v${m.from}->v${m.to}: ${n}`));
  const plan = computePlan(bundledFiles(rec), process.cwd(), introductions(), current);
  const conflicts = plan.filter((e) => e.action === "conflict").length;
  if (!args.apply) {
    const planText = `plan: record v${current} -> bundled spec v${target}\n${notes.map((n) => `  migration: ${n}`).join("\n") || "  migration: none"}\nfiles:\n${renderPlan(plan)}\nskills: ${skillSummary(rec.root)}`;
    say(io, args.json, { current, target, notes, plan: plan.map((p) => p.path), conflicts }, planText);
    io.err("dry run — pass --apply to perform the upgrade");
    return 0;
  }
  return apply(args, io, rec, current, target, plan);
}

function apply(args: Args, io: Io, rec: RecordAst, current: number, target: number, plan: PlanEntry[]): number {
  const repoRoot = process.cwd();
  const root = rec.root;
  const from = current;
  if (args.branch && !makeBranch(repoRoot, from, target, io)) return 1;
  const applied: string[] = applyPlan(bundledFiles(rec), plan, repoRoot);
  // skills: refresh what the lockfile already names — never add new ones
  const lock = readLock(root);
  if (lock !== null) {
    for (const entry of lock.installed) {
      const idx = skillsIndex().find((s) => s.name === entry.name);
      if (idx === undefined || entry.source !== "bundled") continue;
      applied.push(...plantSkill(root, entry.name, skillFiles(entry.name), false));
    }
  }
  suggestion(io, root, lock);
  // migrations in order, one tracker line per step (the resumability ledger)
  for (const m of migrationsFor(current, target)) {
    for (const step of m.steps) {
      const outcome = step(root);
      appendTrackerLine(root, "upgrade", `v${m.from}->v${m.to}: ${outcome}`, `${RECORD_DIR}/04-govern/01-monitor/tracker.md`);
      applied.push(outcome);
    }
  }
  // validate before stamping: re-read the record, run the check pass
  const reloaded = loadRecord(repoRoot);
  const findings = [...reloaded.loadDiags, ...checkPass(reloaded)];
  const errors = findings.filter((f) => f.severity === "error");
  if (errors.length > 0) {
    io.err(`upgrade stopped — the record fails its check pass; fix and re-run (every step is idempotent):\n${renderDiagnostics(errors)}`);
    return 1;
  }
  stampVersion(root, target);
  appendTrackerLine(root, "upgrade", `record upgraded v${from} -> v${target}`, `${RECORD_DIR}/${MANIFEST_REL}`);
  applied.push(`manifest.recordVersion -> ${target}`);
  if (args.branch) commit(repoRoot, from, target, io);
  say(io, args.json, { from: current, target, notes: [], applied }, applied.join("\n"));
  return 0;
}

/** Lockfile skills vs the profiles: an upgrade adds nothing; it suggests. */
function suggestion(io: Io, root: string, lock: ReturnType<typeof readLock>): void {
  if (lock !== null && lock.installed.length > 0) return;
  const have = new Set(lock?.installed.map((e) => e.name) ?? []);
  const wanted = (profileMap()[DEFAULT_PROFILE] ?? []).filter((s) => !have.has(s));
  if (wanted.length > 0) {
    io.err(`profile suggestion: this record carries no profile — consider '${DEFAULT_PROFILE}': docodego skill add ${wanted.join(" | docodego skill add ")}`);
  }
}

function skillSummary(root: string): string {
  const lock = readLock(root);
  if (lock === null) return "no lockfile (created by --apply's migrations if absent)";
  return `${lock.installed.length} installed (per skills-lock.json)`;
}

/** Stamp recordVersion into the manifest, preserving every other key. */
function stampVersion(root: string, target: number): void {
  const abs = join(root, MANIFEST_REL);
  const raw = readText(abs);
  if (raw === null) return;
  const manifest = { ...(JSON.parse(raw) as Partial<Manifest>), recordVersion: target };
  writeText(abs, `${JSON.stringify(manifest, null, 2)}\n`);
}

function makeBranch(repoRoot: string, from: number, to: number, io: Io): boolean {
  const inside = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: repoRoot, encoding: "utf8" });
  if (inside.status !== 0 || (inside.stdout ?? "").trim() !== "true") {
    io.err("refusing --branch: not a git repository (run inside a repo, or upgrade without --branch)");
    return false;
  }
  const name = `docodego-upgrade-v${from}-to-v${to}`;
  const r = spawnSync("git", ["checkout", "-b", name], { cwd: repoRoot, encoding: "utf8" });
  if (r.status !== 0) {
    io.err(`refusing --branch: could not create ${name} — ${(r.stderr ?? "").trim()}`);
    return false;
  }
  return true;
}

function commit(repoRoot: string, from: number, to: number, io: Io): void {
  const name = `docodego-upgrade-v${from}-to-v${to}`;
  spawnSync("git", ["add", "-A"], { cwd: repoRoot });
  const c = spawnSync("git", ["commit", "-m", `docodego upgrade v${from} -> v${to}`], { cwd: repoRoot, encoding: "utf8" });
  if (c.status !== 0) {
    io.err(`branch ${name} is ready but the commit failed — commit by hand, then: git merge ${name}`);
    return;
  }
  io.err(`committed on ${name} — review, run docodego check, then merge: git merge ${name}`);
}

function say(io: Io, json: boolean, data: object, human: string): void {
  if (json) io.out(JSON.stringify(envelope("upgrade", data), null, 2));
  else io.out(human);
}
