/** conformance — the CLI proves itself. Spawns the real binary against
 * scratch records and asserts exit codes plus on-disk effects across the
 * whole lifecycle: init -> sketch -> new (unit/epic/story) -> grill -> score
 * -> deliver, then the refusals and the read commands; plus the v2 dogfood
 * law: the bundle drift gate, self-application against this repo's own live
 * record, the v1->current migration of a hand-built fixture, the conflict law,
 * forward-compat, the skill flow, --version, and --branch.
 * Run:   node --experimental-strip-types src/conformance.ts
 * Exit 0 = every check green; exit 1 = at least one failed (named). */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordFiles, agentsMd, profiles as bundledProfiles, cliVersion, specVersion, skillsIndex, ruleFiles, vocabularies, VOCABULARY_NAMES, vocabularyPack, COMPOSE_LOG_TEMPLATE, DEMO_README_TEMPLATE, DEMO_HOWTO_TEMPLATE, EVIDENCE_TYPES } from "./bundled/index.ts";
import { treeFindings } from "./passes/tree.ts";
import { governanceFindings } from "./passes/governance.ts";
import { loadRecord } from "./record/load.ts";
import { STREAM_README_PATHS, ALL_STREAMS } from "./record/streams.ts";
import { validateVocabularyPack } from "./record/vocabulary.ts";
import { digestFiles, digestSkillDir } from "./skills/lock.ts";
import { COMMAND_HELP } from "./cli/help.ts";
import { usageText } from "./cli/args.ts";
import { COMPLETION_SHELLS } from "./cli/completions.ts";
import { today, sha16 } from "./fsx.ts";
import { appendComposeLog } from "./record/record-write.ts";
import { MIGRATIONS } from "./versioning/migrations.ts";
import { createHash } from "node:crypto";
import { EXPLANATIONS, FAMILY_TITLES } from "./passes/explain.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const MAIN = join(HERE, "main.ts");
const REPO_ROOT = join(HERE, "..", "..", "..");
const BUNDLE = join(REPO_ROOT, "apps", "cli", "scripts", "bundle.ts");
const GEN_DOCS = join(REPO_ROOT, "apps", "cli", "scripts", "gen-docs.ts");
const FUZZ = join(REPO_ROOT, "apps", "cli", "scripts", "fuzz.ts");

let passed = 0;
const failed: string[] = [];

type Res = { code: number; stdout: string; stderr: string };

function run(cwd: string, argv: string[]): Res {
  const r = spawnSync(process.execPath, ["--experimental-strip-types", MAIN, ...argv], { cwd, encoding: "utf8" });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

function runRaw(cwd: string, cmd: string, argv: string[]): Res {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8" });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

function read(cwd: string, rel: string): string {
  return readFileSync(join(cwd, ".docodego", rel), "utf8");
}

function write(cwd: string, rel: string, body: string): void {
  const abs = join(cwd, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body);
}

/** One check: run the step, compare the exit code, optionally assert content. */
function check(label: string, res: Res, expect: number, assert?: (r: Res) => boolean): void {
  const contentOk = assert === undefined || assert(res);
  if (res.code === expect && contentOk) passed += 1;
  else {
    failed.push(`${label} — expected exit ${expect}${assert !== undefined && !contentOk ? " + content assertion" : ""}, got ${res.code}${res.stderr !== "" ? ` · stderr: ${res.stderr.split("\n")[0]?.slice(0, 120)}` : ""}`);
    process.stderr.write(`  FAIL ${label} — got exit ${res.code}: ${res.stdout.split("\n")[0]?.slice(0, 140)} | ${res.stderr.split("\n")[0]?.slice(0, 140)}\n`);
  }
}

/** A check without a spawn — direct assertion over imported state or disk. */
function fact(label: string, ok: boolean): void {
  if (ok) passed += 1;
  else failed.push(`${label} — assertion failed`);
}

const scratch = mkdtempSync(join(tmpdir(), "docodego-conformance-"));

// --- init: plant, refuse, force-fill ---
check("init plants the record", run(scratch, ["init"]), 0, () => existsSync(join(scratch, ".docodego", "README.md")));
check("init refuses over an existing record", run(scratch, ["init"]), 1);
check("init --force fills without overwriting", run(scratch, ["init", "--force"]), 0, () => read(scratch, "README.md").includes("01-discover"));
fact("init planted AGENTS.md at the repo root", existsSync(join(scratch, "AGENTS.md")));
fact("init planted the agent presets", existsSync(join(scratch, ".agents", "agents", "docodego-reviewer.md")));
fact("init wrote the skills lockfile", existsSync(join(scratch, ".docodego", "skills-lock.json")));
const defaultLock = JSON.parse(read(scratch, "skills-lock.json")) as { installed: { name: string }[] };
fact("default profile (product-team) skills are installed", JSON.stringify(defaultLock.installed.map((e) => e.name).sort()) === JSON.stringify([...bundledProfiles()["product-team"] ?? []].sort()));
fact("planted skills live in .agents/skills", existsSync(join(scratch, ".agents", "skills", "docodego", "SKILL.md")));

// --- sketch + graduation ---
check("sketch plants an idea file", run(scratch, ["sketch", "idea-x"]), 0, () => existsSync(join(scratch, ".docodego", "01-document", "01-discover", "sketch-idea-x.md")));
check("new --from-sketch graduates the sketch", run(scratch, ["new", "010-first-unit", "--from-sketch", "idea-x"]), 0, () => existsSync(join(scratch, ".docodego", "01-document", "01-discover", "010-first-unit", "spec.md")));

// --- typed documents: epics and stories are types, never folders ---
check("new --type epic lands in 01-discover", run(scratch, ["new", "020-epic-ride", "--type", "epic"]), 0, () => read(scratch, "01-document/01-discover/020-epic-ride/spec.md").includes("type: epic"));
check("new --type story lands in 02-refine", run(scratch, ["new", "010-story-slice", "--type", "story"]), 0, () => read(scratch, "01-document/02-refine/010-story-slice/spec.md").includes("type: story"));
check("epic outside its home stream is refused", run(scratch, ["new", "epic-wrong", "--type", "epic", "--stream", "02-compose/01-build"]), 2);
check("unknown --type is a usage error", run(scratch, ["new", "novel-thing", "--type", "novel"]), 2);
check("non-kebab name is a usage error", run(scratch, ["new", "bad_unit"]), 2);
check("unknown --stream is a usage error", run(scratch, ["new", "ghost", "--stream", "09-nowhere"]), 2);
check("duplicate unit is refused", run(scratch, ["new", "010-first-unit"]), 1);

// --- a genuinely good spec (the fixture under test) ---
write(scratch, ".docodego/01-document/01-discover/010-first-unit/spec.md", `---
name: 010-first-unit
type: unit
epic: 020-epic-ride
status: draft
---

# 010-first-unit

## intent

Add a retry with backoff to the webhook sender so flaky networks stop dropping deliveries.

## scope

In: the webhook sender module and its retry policy.
Out: queue persistence and dead-letter handling.

## acceptance

- a failed webhook send retries exactly 3 times with exponential backoff, verified by a unit test counting attempts
- after the third failure the sender logs one final warning line, verified by asserting that log line

## threats

- retry storms overload the receiver -> cap at 3 attempts with jittered backoff
`);

// --- grill: question listing, refusal without answers, pass sets status ---
const q = run(scratch, ["grill", "010-first-unit", "--json"]);
check("grill --json lists the questions", q, 0, () => {
  const parsed = JSON.parse(q.stdout) as { data?: { questions?: unknown[] } };
  return (parsed.data?.questions?.length ?? 0) >= 4;
});
const count = (JSON.parse(q.stdout) as { data?: { questions?: unknown[] } }).data?.questions?.length ?? 0;
check("grill without a TTY and without answers is refused", run(scratch, ["grill", "010-first-unit"]), 2);
check("grill of an unknown unit is a usage error", run(scratch, ["grill", "ghost"]), 2);
write(scratch, "answers.txt", Array.from({ length: count }, () => "yes — evidence in the unit test output").join("\n") + "\n");
check("grill pass records the round and sets status", run(scratch, ["grill", "010-first-unit", "--answers", "answers.txt"]), 0, () => read(scratch, "01-document/01-discover/010-first-unit/spec.md").includes("status: grilled") && read(scratch, "01-document/01-discover/010-first-unit/grill.md").includes("verdict"));
check("grill fail records the failed round and exits 1", (() => {
  write(scratch, "empty.txt", "\n");
  return run(scratch, ["grill", "010-first-unit", "--answers", "empty.txt"]);
})(), 1, () => read(scratch, "01-document/01-discover/010-first-unit/grill.md").split("verdict").length >= 3);
write(scratch, "answers.txt", Array.from({ length: count }, () => "yes — evidence in the unit test output").join("\n") + "\n");
check("grill pass again — the last verdict wins", run(scratch, ["grill", "010-first-unit", "--answers", "answers.txt"]), 0);
// --- grill: structured answers — GQ-keyed, multi-line-safe ---
write(scratch, "structured.txt", "GQ-1: adds a retry with backoff to the webhook sender\nGQ-2: the unit test counts attempts; its output is recorded in proofs.md\nGQ-3: retry storms — capped at three attempts with jittered backoff\nGQ-4: queue persistence stays out of scope\nGQ-AC1: |\n  the unit test counts exactly three attempts on a failing send\nGQ-AC2: |-\n  the final warning log line is asserted in the same test\n");
check("grill accepts a structured answers file", run(scratch, ["grill", "010-first-unit", "--answers", "structured.txt"]), 0, () => read(scratch, "01-document/01-discover/010-first-unit/grill.md").includes("counts exactly three attempts"));
write(scratch, "unknown-gq.txt", "GQ-1: fine\nGQ-99: invented\n");
check("structured answers with an unknown question id exit 2", run(scratch, ["grill", "010-first-unit", "--answers", "unknown-gq.txt"]), 2, (r) => r.stderr.includes("unknown question id 'GQ-99'"));

// --- score: the floor prints, the breakdown lands, weak specs stay low ---
check("score writes the breakdown and sets status", run(scratch, ["score", "010-first-unit"]), 0, () => {
  const raw = read(scratch, "01-document/01-discover/010-first-unit/score.md");
  const m = /total:\s*(\d+)/.exec(raw);
  return m !== null && Number.parseInt(m[1] ?? "0", 10) >= 60;
});
check("score of an unknown unit is a usage error", run(scratch, ["score", "ghost"]), 2);
check("new accepts a fresh template unit", run(scratch, ["new", "030-weak-unit"]), 0);
const wq = run(scratch, ["grill", "030-weak-unit", "--json"]);
const wcount = (JSON.parse(wq.stdout) as { data?: { questions?: unknown[] } }).data?.questions?.length ?? 0;
write(scratch, "weak-answers.txt", Array.from({ length: wcount }, () => "placeholder answers only to keep the record consistent").join("\n") + "\n");
// the score rides a grilled unit now (cli-law 13): the weak unit grills
// first, then scores — the floor still bites at deliver, never at score
check("grill keeps the weak unit consistent", run(scratch, ["grill", "030-weak-unit", "--answers", "weak-answers.txt"]), 0);
check("score accepts it — the floor bites at deliver, not at score", run(scratch, ["score", "030-weak-unit"]), 0);
const weakRaw = read(scratch, "01-document/01-discover/030-weak-unit/score.md");
const weakTotal = Number.parseInt(/total:\s*(\d+)/.exec(weakRaw)?.[1] ?? "100", 10);
if (weakTotal < 60) passed += 1;
else failed.push(`weak template spec scored ${weakTotal} — placeholders must not pass the floor`);
check("the floor bites at deliver, not at score", run(scratch, ["deliver", "030-weak-unit"]), 1, (r) => r.stderr.includes("G2"));

// --- deliver: the gate refuses, then passes, committing only on green ---
check("deliver fails the gate with nothing committed", run(scratch, ["deliver", "010-first-unit"]), 1, () => !existsSync(join(scratch, ".docodego", "01-document", "01-discover", "010-first-unit", "delivered.md")));
write(scratch, "proof-evidence.txt", "unit test output: 3 attempts observed, final warning logged\n");
write(scratch, ".docodego/01-document/01-discover/010-first-unit/proofs.md", `# proofs\n\n- proof-evidence.txt — the unit test output\n- 01-document/01-discover/010-first-unit/spec.md — the delivered spec, cited by path\n`);
check("deliver passes all four gates", run(scratch, ["deliver", "010-first-unit"]), 0, () => read(scratch, "01-document/01-discover/010-first-unit/spec.md").includes("status: delivered") && read(scratch, "04-govern/01-monitor/tracker.md").includes("delivered"));
// the compose room's row (380): written once, on green only — the refused
// attempt above must not have left one, and the hash must re-bind from disk
const composeBody = read(scratch, "02-compose/compose-log.md");
fact("deliver appends the compose room's row — once, on green only", (composeBody.match(/\| 010-first-unit \|/g) ?? []).length === 1);
fact("the compose row binds the delivered spec's on-disk hash", composeBody.includes(sha16(read(scratch, "01-document/01-discover/010-first-unit/spec.md"))));
fact("an undeclared deviation lands as none recorded in the live record", composeBody.includes("| none recorded |"));

// --- the read commands over the finished record ---
check("check holds the record together", run(scratch, ["check"]), 0);
check("lint reports nothing", run(scratch, ["lint"]), 0);
check("lint --self-check validates the rule registry", run(scratch, ["lint", "--self-check"]), 0);
check("status renders the board", run(scratch, ["status"]), 0, (r) => r.stdout.includes("010-first-unit"));
check("status --json is an envelope", run(scratch, ["status", "--json"]), 0, (r) => (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/status/v1");
check("status --epic narrows to the rollup", run(scratch, ["status", "--epic", "020-epic-ride"]), 0, (r) => r.stdout.includes("010-first-unit"));

// --- trace: one unit's recorded arc on one timeline ---
check("trace replays the full arc", run(scratch, ["trace", "010-first-unit"]), 0, (r) =>
  r.stdout.includes("created") && r.stdout.includes("grill") && r.stdout.includes("verdict: pass") &&
  r.stdout.includes("score") && r.stdout.includes("delivered"));
check("trace --json is an envelope", run(scratch, ["trace", "010-first-unit", "--json"]), 0, (r) => (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/trace/v1");
check("trace of a bare draft shows just the created line", run(scratch, ["trace", "020-epic-ride"]), 0, (r) => r.stdout.includes("created") && !r.stdout.includes("grill"));
check("trace of an unknown unit is a usage error", run(scratch, ["trace", "ghost"]), 2);
check("trace without a unit name is a usage error", run(scratch, ["trace"]), 2);

// --- retire: the second home — gate, verified move, tomb, trace, number-forever ---
check("retire of an undelivered unit is refused", run(scratch, ["retire", "030-weak-unit"]), 2, (r) => r.stderr.includes("DG-U101"));
check("retire of an unknown unit is a usage error", run(scratch, ["retire", "ghost"]), 2);
check("retire without a unit name is a usage error", run(scratch, ["retire"]), 2, (r) => r.stderr.includes("DG-U100"));
check("retire --dry-run prints the plan and moves nothing", run(scratch, ["retire", "010-first-unit", "--dry-run"]), 0, (r) =>
  r.stdout.includes("dry run") && r.stdout.includes("system/behavioral/a-first-unit") && existsSync(join(scratch, ".docodego", "01-document", "01-discover", "010-first-unit")) && !existsSync(join(scratch, ".docodego", "system", "behavioral")));
check("retire --json is an envelope", run(scratch, ["retire", "010-first-unit", "--as", "first-unit", "--dry-run", "--json"]), 0, (r) => (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/retire/v1");
check("retire moves the delivered unit to the second home", run(scratch, ["retire", "010-first-unit"]), 0, () => {
  const spec = read(scratch, "system/behavioral/a-first-unit/spec.md");
  return !existsSync(join(scratch, ".docodego", "01-document", "01-discover", "010-first-unit"))
    && spec.includes("retired_on:") && spec.includes("was: 010-first-unit") && spec.includes("status: delivered");
});
check("retire re-addresses citations and appends both rows", run(scratch, ["check"]), 0, () =>
  read(scratch, "system/behavioral/a-first-unit/proofs.md").includes("system/behavioral/a-first-unit")
  && read(scratch, "04-govern/01-monitor/tracker.md").includes("retired from 01-document/01-discover/")
  && read(scratch, "04-govern/delivery-log.md").includes("retired"));
check("a second retire is refused — the tomb is final", run(scratch, ["retire", "010-first-unit"]), 1, (r) => r.stderr.includes("DG-U104"));
check("a same-named tomb via --as is refused too", run(scratch, ["retire", "030-weak-unit", "--as", "first-unit"]), 1, (r) => r.stderr.includes("DG-U104"));
check("trace follows the unit into the tomb", run(scratch, ["trace", "010-first-unit"]), 0, (r) =>
  r.stdout.includes("retired") && r.stdout.includes("system/behavioral/a-first-unit") && r.stdout.includes("delivered"));
check("status shows the tombstone", run(scratch, ["status"]), 0, (r) => r.stdout.includes("retired 1 under system/behavioral/") && !r.stdout.includes("010-first-unit"));
check("the retired number is never reused (live siblings counted)", run(scratch, ["new", "fresh-unit"]), 0, () => existsSync(join(scratch, ".docodego", "01-document", "01-discover", "040-fresh-unit")));
check("explain carries the retire refusals", run(scratch, ["explain", "DG-U101"]), 0, (r) => r.stdout.includes("not delivered"));

// --- retire: number-forever — a record whose ONLY unit retired mints 020, never 010 again ---
const ghost = mkdtempSync(join(tmpdir(), "docodego-conformance-ghost-"));
check("ghost: init", run(ghost, ["init", "--mode", "review"]), 0);
write(ghost, ".docodego/01-document/01-discover/010-only-unit/spec.md", `---
name: 010-only-unit
type: unit
status: draft
---

# 010-only-unit

## intent

Add a retry with backoff to the webhook sender so flaky networks stop dropping deliveries.

## scope

In: the webhook sender module and its retry policy.
Out: queue persistence and dead-letter handling.

## acceptance

- a failed webhook send retries exactly 3 times with exponential backoff, verified by a unit test counting attempts
- after the third failure the sender logs one final warning line, verified by asserting that log line

## threats

- retry storms overload the receiver -> cap at 3 attempts with jittered backoff
`);
const gq = run(ghost, ["grill", "010-only-unit", "--json"]);
const gcount = (JSON.parse(gq.stdout) as { data?: { questions?: unknown[] } }).data?.questions?.length ?? 0;
write(ghost, "g-answers.txt", Array.from({ length: gcount }, () => "yes — evidence in the unit test output").join("\n") + "\n");
check("ghost: grill pass", run(ghost, ["grill", "010-only-unit", "--answers", "g-answers.txt"]), 0);
check("ghost: score over the floor", run(ghost, ["score", "010-only-unit"]), 0);
write(ghost, "g-proof.txt", "unit test output: 3 attempts observed\n");
write(ghost, ".docodego/01-document/01-discover/010-only-unit/proofs.md", "# proofs\n\n- g-proof.txt — the unit test output\n");
check("ghost: delivered", run(ghost, ["deliver", "010-only-unit"]), 0);
check("ghost: retired to the second home", run(ghost, ["retire", "010-only-unit"]), 0, () => existsSync(join(ghost, ".docodego", "system", "behavioral", "a-only-unit")));
check("ghost: the next unit mints 020 — the tomb spent 010 forever", run(ghost, ["new", "next-one"]), 0, () => existsSync(join(ghost, ".docodego", "01-document", "01-discover", "020-next-one")));

// --- doctor: standing triage over a healthy, an empty, and a broken record ---
check("doctor is green on the healthy record", run(scratch, ["doctor"]), 0, (r) => r.stdout.includes("checks healthy") && !r.stdout.includes("SICK"));
check("doctor --json is an envelope", run(scratch, ["doctor", "--json"]), 0, (r) => {
  try {
    return (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/doctor/v1";
  } catch {
    return false;
  }
});
const dr = mkdtempSync(join(tmpdir(), "docodego-conformance-doctor-"));
check("doctor on an empty dir exits 0 and reports the missing record", run(dr, ["doctor"]), 0, (r) => r.stdout.includes("SICK record layer") && r.stdout.includes("checks healthy"));
check("doctor --json carries the absent check honestly", run(dr, ["doctor", "--json"]), 0, (r) => {
  const parsed = JSON.parse(r.stdout) as { data?: { checks?: { name: string; ok: boolean }[] } };
  return (parsed.data?.checks ?? []).some((c) => c.name === "record layer" && c.ok === false);
});
write(dr, ".docodego/.standard/manifest.json", "{ not json");
check("a corrupt manifest is a failed check with exit 1 — never exit 3", run(dr, ["doctor"]), 1, (r) => r.stdout.includes("SICK manifest"));
rmSync(dr, { recursive: true, force: true });

// --- the README quickstart, replayed literally: the docs cannot lie ---
const qs = mkdtempSync(join(tmpdir(), "docodego-conformance-readme-"));
check("quickstart: init --mode review", run(qs, ["init", "--mode", "review"]), 0);
check("quickstart: sketch plants the idea", run(qs, ["sketch", "retry-webhook-idea"]), 0);
check("quickstart: new --from-sketch graduates it", run(qs, ["new", "010-retry-webhook", "--from-sketch", "retry-webhook-idea"]), 0);
write(qs, ".docodego/01-document/01-discover/010-retry-webhook/spec.md", `---
name: 010-retry-webhook
type: unit
status: draft
---

# 010-retry-webhook

## intent

Add a retry with capped exponential backoff to the webhook sender so flaky
networks stop dropping deliveries.

## scope

In: the webhook sender module and its retry policy.
Out: queue persistence and dead-letter handling.

## acceptance

- a failed webhook send retries exactly 3 times with exponential backoff, verified by a unit test counting attempts
- after the third failure the sender logs one final warning line, verified by asserting that log line

## threats

- retry storms overload the receiver -> cap at 3 attempts with jittered backoff
`);
write(qs, "answers.txt", "capped exponential backoff, three attempts\nthe unit test counts attempts\nretry storms — capped at three attempts with jittered backoff\nqueue persistence stays out of scope\nthe unit test counts exactly three attempts on a failing send\nthe final warning log line is asserted in the same test\n");
check("quickstart: grill pass", run(qs, ["grill", "010-retry-webhook", "--answers", "answers.txt"]), 0);
check("quickstart: score clears the floor", run(qs, ["score", "010-retry-webhook"]), 0, () => {
  const m = /total:\s*(\d+)/.exec(read(qs, "01-document/01-discover/010-retry-webhook/score.md"));
  return m !== null && Number.parseInt(m[1] ?? "0", 10) >= 60;
});
write(qs, "proof.txt", "unit test output: 3 attempts observed, final warning logged\n");
write(qs, ".docodego/01-document/01-discover/010-retry-webhook/proofs.md", "# proofs\n\n- proof.txt — the unit test output\n");
check("quickstart: deliver passes all four gates", run(qs, ["deliver", "010-retry-webhook"]), 0, () => read(qs, "01-document/01-discover/010-retry-webhook/spec.md").includes("status: delivered"));
rmSync(qs, { recursive: true, force: true });
check("upgrade reports the record current", run(scratch, ["upgrade"]), 0);
check("upgrade --apply is additive and calm", run(scratch, ["upgrade", "--apply"]), 0);

// --- corruption and usage edges ---
const bare = mkdtempSync(join(tmpdir(), "docodego-conformance-bare-"));
check("status without a record exits 3", run(bare, ["status"]), 3);
check("unknown command is a usage error", run(scratch, ["frobnicate"]), 2);
check("no command is a usage error", run(scratch, []), 2);
rmSync(bare, { recursive: true, force: true });

// --- v2: bundle law — code and bundle cannot disagree ---
const bundledReadmes = Object.keys(recordFiles()).filter((p) => p.endsWith("/README.md") && p.includes("/") && !p.startsWith(".standard")).sort();
fact("the bundle carries exactly the 16 stream READMEs", JSON.stringify(bundledReadmes) === JSON.stringify([...STREAM_README_PATHS].sort()));
check("bundle drift gate: bundle --verify is clean", runRaw(REPO_ROOT, process.execPath, ["--experimental-strip-types", BUNDLE, "--verify"]), 0);
check("parser fuzz: seeded broken input never crashes the parser and goldens match", runRaw(REPO_ROOT, process.execPath, ["--experimental-strip-types", FUZZ, "--iterations", "200"]), 0);
check("self-application: the fresh CLI checks its own repo", run(REPO_ROOT, ["check"]), 0);
check("self-application: the fresh CLI lints its own repo", run(REPO_ROOT, ["lint"]), 0);

// --- v2: upgrade of a hand-built v1 fixture ---
const fixture = mkdtempSync(join(tmpdir(), "docodego-conformance-v1-"));
const fixtureSpecRel = ".docodego/01-document/01-discover/kept-unit/spec.md";
write(fixture, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 1\n}\n`);
const fixtureSpec = `---\nname: kept-unit\ntype: unit\nstatus: draft\n---\n\n# kept-unit\n\n## intent\n\nUNIT-CONTRACT-BYTES v1 — this unit predates the v2 record contract.\n`;
write(fixture, fixtureSpecRel, fixtureSpec);
check("fixture upgrade plan exits 0", run(fixture, ["upgrade"]), 0, (r) => r.stdout.includes("v1->v2"));
check("fixture upgrade --apply exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("fixture manifest stamped to the bundled spec", JSON.parse(read(fixture, ".standard/manifest.json")).recordVersion === specVersion());
fact("fixture skills-lock.json exists", existsSync(join(fixture, ".docodego", "skills-lock.json")));
fact("fixture tracker carries the migration line", read(fixture, "04-govern/01-monitor/tracker.md").includes("v1->v2") && read(fixture, "04-govern/01-monitor/tracker.md").includes("skills-lock.json"));
fact("fixture unit content unchanged byte-for-byte", readFileSync(join(fixture, fixtureSpecRel), "utf8") === fixtureSpec);
fact("fixture received the bundled record files", existsSync(join(fixture, ".docodego", "README.md")) && read(fixture, "README.md").includes("01-discover"));

// --- v2: conflict law — user-modified files are never overwritten ---
write(fixture, ".docodego/README.md", `${read(fixture, "README.md")}\nMY OWN EDIT — do not lose this line\n`);
write(fixture, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 1\n}\n`);
check("re-upgrade with a conflict exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("user-modified README.md NOT overwritten", read(fixture, "README.md").includes("MY OWN EDIT"));
fact("bundled version landed side-by-side as README.md.new", existsSync(join(fixture, ".docodego", "README.md.new")) && readFileSync(join(fixture, ".docodego", "README.md.new"), "utf8").includes("01-discover"));

// --- v12: restore law — a deleted engine file is never silently re-created ---
// a record at the bundled version that LOST a planted file gets the copy
// back as `<path>.new` (owed a merge — the deletion may have been
// deliberate), same twin law as a conflict; never written in place.
rmSync(join(fixture, ".docodego", "README.md"));
rmSync(join(fixture, ".docodego", "README.md.new"));
check("restore plan exits 0 and names the restore", run(fixture, ["upgrade"]), 0, (r) => r.stdout.includes("R restore") && r.stdout.includes("owed a merge"));
check("restore upgrade --apply exits 0", run(fixture, ["upgrade", "--apply"]), 0);
fact("deleted README.md NOT re-created in place", !existsSync(join(fixture, ".docodego", "README.md")));
fact("restored copy waits as README.md.new", existsSync(join(fixture, ".docodego", "README.md.new")) && readFileSync(join(fixture, ".docodego", "README.md.new"), "utf8").includes("01-discover"));

// --- v12: one calendar — the local wall-clock date is the only stamp ---
// the two-calendars defect: gate rows in UTC, the human's rows local.
// The assertion is implementation-shape-proofing, not clock-watching:
// today() must equal an independent local computation of the same
// instant (true on a UTC machine too, where the two forms agree).
{
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  const localNow = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  fact("today() is the local wall-clock date (YYYY-MM-DD)", /^\d{4}-\d{2}-\d{2}$/.test(today()) && today() === localNow);
  fact("tracker rows carry a leading YYYY-MM-DD date", /^\| \d{4}-\d{2}-\d{2} \|/m.test(read(fixture, "04-govern/01-monitor/tracker.md")));
}

// --- v13: the transition table cannot drift from the registry ---
// spec/record/version-transition.md carries the shipped hops as law; this
// fact is the binding: same hop count, same from/to pairs, or the suite
// fails and the doc gets fixed before anything ships.
{
  const doc = readFileSync(join(REPO_ROOT, "spec", "record", "version-transition.md"), "utf8");
  const docRows = [...doc.matchAll(/^\| v(\d+) \| v(\d+) \|(.+?)\|?$/gm)].map((m) => `${m[1]}->${m[2]}`);
  const regRows = MIGRATIONS.map((m) => `${m.from}->${m.to}`);
  fact("the transition table mirrors the migration registry hop for hop", JSON.stringify(docRows) === JSON.stringify(regRows));
}

// --- v13: the launch tiers — delivered -> launch-passed -> founder-signed ---
// the tiers are gate-written and strict: launch audits reality over a
// delivered unit; sign requires launch-passed and records a named
// person's attestation; a second signature is a rewritten record.
write(fixture, ".docodego/01-document/01-discover/kept-unit/spec.md", `---\nname: kept-unit\ntype: unit\nstatus: draft\n---\n\n# kept-unit\n\n## intent\n\nThe kept unit proves the tier flow end to end: 2 criteria, all checkable by one command run per criterion.\n\n## scope\n\nIn: the tier flow proof. Out: any production behavior.\n\n## acceptance\n\n- AC1: the proof file exists at 01-document/01-discover/kept-unit/proofs/run.txt after 1 command run\n- AC2: the receipt file signature.md carries the signer name and 2 evidence hashes\n\n## threats\n\n- the fixture drifts from the grammar -> the conformance suite fails loudly and names the check\n`);
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs.md", "# proofs — kept-unit\n\n- AC1 — the run: `01-document/01-discover/kept-unit/proofs/run.txt`\n");
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs/run.txt", "proof run output\n");
const grillJson = run(fixture, ["grill", "kept-unit", "--json"]);
const qids = (grillJson.stdout.match(/"id": "GQ-(?:AC)?[0-9]+"/g) ?? []).map((s) => s.match(/GQ(?:AC)?[0-9]+/)?.[0] ?? "");
const ansPath = join(fixture, "gq.txt");
writeFileSync(ansPath, qids.map((id) => `${id}: the fixture proves the tier flow; observation: the suite asserts the receipt`).join("\n") + "\n");
check("grill round passes on the fixture", run(fixture, ["grill", "kept-unit", "--answers", "gq.txt"]), 0);
rmSync(ansPath);
check("score passes on the fixture", run(fixture, ["score", "kept-unit"]), 0, (r) => !r.stdout.includes("below the gate"));
check("deliver passes on the fixture", run(fixture, ["deliver", "kept-unit"]), 0);
check("sign refused before launch (DG-U112)", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder"]), 1, (r) => r.stdout.includes("DG-U112") || r.stderr.includes("DG-U112"));
rmSync(join(fixture, ".docodego", "01-document", "01-discover", "kept-unit", "proofs", "run.txt"));
check("launch refused on vanished evidence (exit 1)", run(fixture, ["launch", "kept-unit"]), 1, (r) => r.stdout.includes("vanished") || r.stderr.includes("vanished"));
// L5 (010-demo-bundles): the launch repairs forward — the pre-bundles unit's
// missing scaffold is written beside the refusal, and the refusal names it
check("launch repairs forward: the missing demo bundle scaffolded beside the refusal", run(fixture, ["launch", "kept-unit"]), 1, (r) => (r.stdout + r.stderr).includes("scaffold") && existsSync(join(fixture, ".docodego", "03-demonstrate", "demo", "kept-unit", "how-to-run.md")));
write(fixture, ".docodego/03-demonstrate/demo/kept-unit/how-to-run.md", "# how to run\n\nFilled: the suite is the demo — the conformance suite walks kept-unit's tier flow end to end.\n");
write(fixture, ".docodego/01-document/01-discover/kept-unit/proofs/run.txt", "proof run output restored\n");
check("launch passes on restored evidence + filled bundle", run(fixture, ["launch", "kept-unit"]), 0, (r) => r.stdout.includes("L5 how-to-run.md filled"));
check("sign without --yes on a headless run refuses (DG-U118)", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder"]), 1, (r) => r.stdout.includes("DG-U118") || r.stderr.includes("DG-U118"));
fact("the unconfirmed signature planted nothing", !existsSync(join(fixture, ".docodego", "04-govern", "signatures.md")));
check("sign passes with a typed identifier, declared headless", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder", "--yes"]), 0);
const ledgerBefore = read(fixture, "04-govern/signatures.md").split("\n").length;
check("second signature refused (DG-U113)", run(fixture, ["sign", "kept-unit", "--by", "Testy Founder"]), 1, (r) => r.stdout.includes("DG-U113") || r.stderr.includes("DG-U113"));
fact("the refused second signature appended nothing", read(fixture, "04-govern/signatures.md").split("\n").length === ledgerBefore);
const receipt = read(fixture, "01-document/01-discover/kept-unit/signature.md");
fact("the receipt quotes the signer verbatim", receipt.includes("signed by: Testy Founder"));
fact("the receipt names the typed identifier as typed", receipt.includes("(a typed legal identifier)"));
fact("the receipt carries the attestation limit", receipt.includes("attestation by command execution"));
fact("the receipt carries the spec evidence hash", /spec\.md sha256:[0-9a-f]{64}/.test(receipt));
fact("the signatures ledger row exists", /\| [0-9]{4}-[0-9]{2}-[0-9]{2} \| kept-unit \| Testy Founder \(a typed legal identifier\) \| founder \| founder-signed \|/.test(read(fixture, "04-govern/signatures.md")));
check("launch is calm on a founder-signed unit", run(fixture, ["launch", "kept-unit"]), 0, (r) => r.stdout.includes("already"));

// the derived path — the founder's ruling (450): no typed details. A second
// unit walks the tiers and signs with no --by: the identifier comes from the
// environment's git or system details, and the receipt names which.
write(fixture, ".docodego/01-document/01-discover/derived-unit/spec.md", `---\nname: derived-unit\ntype: unit\nstatus: draft\n---\n\n# derived-unit\n\n## intent\n\nThe derived unit proves the signature derives its identifier: 2 criteria, all checkable by one command run per criterion.\n\n## scope\n\nIn: the derived-identity proof. Out: any production behavior.\n\n## acceptance\n\n- AC1: the proof file exists at 01-document/01-discover/derived-unit/proofs/run.txt after 1 command run\n- AC2: the receipt file signature.md names a derived identifier and its kind\n\n## threats\n\n- the fixture drifts from the grammar -> the conformance suite fails loudly and names the check\n`);
write(fixture, ".docodego/01-document/01-discover/derived-unit/proofs.md", "# proofs — derived-unit\n\n- AC1 — the run: `01-document/01-discover/derived-unit/proofs/run.txt`\n");
write(fixture, ".docodego/01-document/01-discover/derived-unit/proofs/run.txt", "proof run output\n");
const dGrill = run(fixture, ["grill", "derived-unit", "--json"]);
const dQids = (dGrill.stdout.match(/"id": "GQ-(?:AC)?[0-9]+"/g) ?? []).map((s) => s.match(/GQ(?:AC)?[0-9]+/)?.[0] ?? "");
const dAnsPath = join(fixture, "gq-derived.txt");
writeFileSync(dAnsPath, dQids.map((id) => `${id}: the fixture proves the derived path; observation: the suite asserts the receipt`).join("\n") + "\n");
check("grill round passes on the derived fixture", run(fixture, ["grill", "derived-unit", "--answers", "gq-derived.txt"]), 0);
rmSync(dAnsPath);
check("score passes on the derived fixture", run(fixture, ["score", "derived-unit"]), 0, (r) => !r.stdout.includes("below the gate"));
check("deliver passes on the derived fixture", run(fixture, ["deliver", "derived-unit"]), 0);
write(fixture, ".docodego/03-demonstrate/demo/derived-unit/how-to-run.md", "# how to run\n\nFilled: the suite is the demo — the conformance suite walks derived-unit's tier flow end to end.\n");
check("launch passes on the derived fixture", run(fixture, ["launch", "derived-unit"]), 0);
check("sign passes with no --by — the identifier derives, declared headless", run(fixture, ["sign", "derived-unit", "--yes"]), 0);
const derivedReceipt = read(fixture, "01-document/01-discover/derived-unit/signature.md");
fact("the derived receipt names an environment identity and its kind", derivedReceipt.includes("(the git identity of the environment)") || derivedReceipt.includes("(the system identity of the environment)"));
fact("the derived receipt carries no typed line", !derivedReceipt.includes("(a typed legal identifier)"));

// --- v2: forward-compat — a newer record is refused politely ---
const newer = mkdtempSync(join(tmpdir(), "docodego-conformance-fwd-"));
write(newer, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 99\n}\n`);
check("newer record: upgrade exits 0 with the forward-compat line", run(newer, ["upgrade"]), 0, (r) => r.stdout.includes("newer than this CLI"));
fact("newer record: nothing was changed", !existsSync(join(newer, ".docodego", "README.md")));
rmSync(newer, { recursive: true, force: true });

// --- v2: the skill flow ---
const sf = mkdtempSync(join(tmpdir(), "docodego-conformance-skill-"));
check("init --profile docs-only plants a docs-only record", run(sf, ["init", "--profile", "docs-only"]), 0);
const docsLock = JSON.parse(read(sf, "skills-lock.json")) as { installed: { name: string }[] };
fact("docs-only profile installs exactly its set", JSON.stringify(docsLock.installed.map((e) => e.name).sort()) === JSON.stringify([...bundledProfiles()["docs-only"] ?? []].sort()));
check("skill list audits the lockfile", run(sf, ["skill", "list"]), 0);
check("skill add of a bundled skill outside the profile installs it", run(sf, ["skill", "add", "docodego-compose"]), 0, () => {
  const lock = JSON.parse(read(sf, "skills-lock.json")) as { installed: { name: string }[] };
  return lock.installed.some((e) => e.name === "docodego-compose") && existsSync(join(sf, ".agents", "skills", "docodego-compose", "SKILL.md"));
});
check("skill remove takes the folder and the lockfile entry", run(sf, ["skill", "remove", "docodego-compose"]), 0, () => {
  const lock = JSON.parse(read(sf, "skills-lock.json")) as { installed: { name: string }[] };
  return !lock.installed.some((e) => e.name === "docodego-compose") && !existsSync(join(sf, ".agents", "skills", "docodego-compose"));
});
check("skill add of an unknown name is a usage error", run(sf, ["skill", "add", "no-such-craft"]), 2);
check("skill with no subcommand is a usage error", run(sf, ["skill"]), 2);
check("skill list --json is an envelope", run(sf, ["skill", "list", "--json"]), 0, (r) => (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/skill/v1");
check("integrity mismatch is a finding with exit 1", (() => {
  write(sf, ".agents/skills/docodego-document/SKILL.md", "tampered\n");
  return run(sf, ["skill", "list"]);
})(), 1, (r) => r.stderr.includes("integrity mismatch"));
rmSync(sf, { recursive: true, force: true });

// --- v2b: the install digest binds the planted bytes (280) ---
// The recipe identity: digestFiles (over the in-memory map — the bytes the
// install plants) and digestSkillDir (over the folder on disk) are one
// algorithm. The end-to-end proof: a real file:// clone installs, its lock
// entry verifies, list re-verifies green, and re-adding the unchanged
// remote skill is idempotent — which only works if install-time map digest
// and verify-time folder digest agree.
{
  const map: Record<string, string> = { "SKILL.md": "---\nname: probe\nversion: 1.2.3\n---\n\nbody\n", "refs/deep.txt": "nested\n", "a.txt": "flat\n" };
  const dirTmp = mkdtempSync(join(tmpdir(), "docodego-digest-"));
  mkdirSync(join(dirTmp, "refs"), { recursive: true });
  writeFileSync(join(dirTmp, "SKILL.md"), map["SKILL.md"] ?? "");
  writeFileSync(join(dirTmp, "refs", "deep.txt"), map["refs/deep.txt"] ?? "");
  writeFileSync(join(dirTmp, "a.txt"), map["a.txt"] ?? "");
  fact("digestFiles and digestSkillDir agree — one recipe, two surfaces", digestFiles(map) === digestSkillDir(dirTmp));
  rmSync(dirTmp, { recursive: true, force: true });

  const repo = mkdtempSync(join(tmpdir(), "docodego-skill-repo-"));
  mkdirSync(join(repo, "probe-skill"), { recursive: true });
  writeFileSync(join(repo, "probe-skill", "SKILL.md"), "---\nname: probe-skill\nversion: 9.9.9\ndescription: the remote fixture\n---\n\nprobe body\n");
  runRaw(repo, "git", ["init", "-q", "."]);
  runRaw(repo, "git", ["add", "."]);
  runRaw(repo, "git", ["-c", "user.name=fixture", "-c", "user.email=fixture@localhost", "commit", "-qm", "probe skill"]);
  const st280 = mkdtempSync(join(tmpdir(), "docodego-conformance-skill280-"));
  check("skill280: init plants the record", run(st280, ["init"]), 0);
  check("skill280: skill add --from file:// installs the remote skill", run(st280, ["skill", "add", "probe-skill", "--from", `file://${repo}`]), 0, () => {
    const lock = JSON.parse(read(st280, "skills-lock.json")) as { installed: { name: string; version: string; integrity: string }[] };
    const e = lock.installed.find((x) => x.name === "probe-skill");
    return e !== undefined && e.version === "9.9.9" && e.integrity.startsWith("sha256:");
  });
  check("skill280: skill list re-verifies the remote install green", run(st280, ["skill", "list"]), 0);
  check("skill280: re-adding the unchanged remote skill is idempotent (map digest == folder digest)", run(st280, ["skill", "add", "probe-skill", "--from", `file://${repo}`]), 0, (r) => r.stdout.includes("unchanged"));
  rmSync(st280, { recursive: true, force: true });
  rmSync(repo, { recursive: true, force: true });
}

// --- v2c: the planted prose names only shipped paths (290) ---
// The sweep as a gate: every planted row is read every run, and any
// reference to a repo-side prefix (scripts/, apps/, docs/, temp/) or the
// dead `.framework` tree fails the suite. Planted prose is the consumer
// agent's whole world — a dead path in it is a dead end on day one.
{
  const manifest = JSON.parse(readFileSync(join(REPO_ROOT, "apps", "cli", "src", "bundled", "manifest.json"), "utf8")) as { files: Record<string, string> };
  const rows = Object.keys(manifest.files);
  const stale = /(^|[^A-Za-z0-9._/-])(scripts\/|apps\/|docs\/|temp\/|\.framework)/;
  const offenders: string[] = [];
  for (const rel of rows) {
    const lines = readFileSync(join(REPO_ROOT, rel), "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) if (stale.test(lines[i] ?? "")) offenders.push(`${rel}:${i + 1}`);
  }
  fact("the sweep reads the whole payload boundary (52 planted rows)", rows.length === 52);
  fact("the planted prose names only shipped paths — no repo-side or dead-tree references", offenders.length === 0);
}

// --- v2k: the record's machine artifacts leave git (370) ---
fact("the payload plants the record's gitignore with both rules", (recordFiles()[".gitignore"] ?? "").includes("var/") && (recordFiles()[".gitignore"] ?? "").includes("*.new"));

// --- v2l: the compose room's integrity artifact (380) ---
fact("the compose log template names its readers and its grammar", COMPOSE_LOG_TEMPLATE.includes("handoff agent") && COMPOSE_LOG_TEMPLATE.includes("build-honesty auditor") && COMPOSE_LOG_TEMPLATE.includes("| date | unit | spec | deviations |"));
{
  const cl = mkdtempSync(join(tmpdir(), "docodego-conformance-compose-"));
  check("compose fixture init", run(cl, ["init"]), 0, () => existsSync(join(cl, ".docodego", "02-compose", "compose-log.md")));
  fact("the planted log matches the shipped template bytes", read(cl, "02-compose/compose-log.md").startsWith(COMPOSE_LOG_TEMPLATE));
  const rec = loadRecord(cl);
  const plain = appendComposeLog(rec, "010-plain", "abcdef0123456789", undefined);
  const declared = appendComposeLog(rec, "020-declared", "0123456789abcdef", "payouts stubbed in the demo build");
  const piped = appendComposeLog(rec, "030-piped", "1111222233334444", "kept the legacy | delimiter");
  const body = read(cl, "02-compose/compose-log.md");
  fact("an undeclared deviation lands as none recorded", plain.includes("| none recorded |"));
  fact("a declared deviation lands verbatim", declared.includes("| payouts stubbed in the demo build |"));
  fact("a pipe in the declaration is escaped, not paraphrased", piped.includes("kept the legacy \\| delimiter"));
  fact("rows carry the delivered spec hash", body.includes("abcdef0123456789") && body.includes("0123456789abcdef"));
  rmSync(join(cl, ".docodego", "02-compose", "compose-log.md"));
  appendComposeLog(loadRecord(cl), "040-late", "2222333344445555", undefined);
  fact("a lost log is recreated with its header on the next append", read(cl, "02-compose/compose-log.md").startsWith("# Compose log"));
  rmSync(cl, { recursive: true, force: true });
}

// --- v2m: the demonstrate room's bundles (010-demo-bundles) ---
fact("the demo room anchor names its readers and the not-there-yet truth", DEMO_README_TEMPLATE.includes("show me it working") && DEMO_README_TEMPLATE.includes("launch auditor") && DEMO_README_TEMPLATE.includes("not there yet"));
fact("the demo scaffold carries the three fill sections and the honesty line", DEMO_HOWTO_TEMPLATE.includes("## see it work") && DEMO_HOWTO_TEMPLATE.includes("## run output") && DEMO_HOWTO_TEMPLATE.includes("## visual evidence") && DEMO_HOWTO_TEMPLATE.includes("paths, not pasted binaries"));
fact("init plants the demo room anchor", existsSync(join(scratch, ".docodego", "03-demonstrate", "demo", "README.md")) && read(scratch, "03-demonstrate/demo/README.md") === DEMO_README_TEMPLATE);
fact("deliver scaffolded the delivered unit's bundle — byte-identical to the template, all sections present", read(scratch, "03-demonstrate/demo/010-first-unit/how-to-run.md") === DEMO_HOWTO_TEMPLATE);

// --- v2n: the evidence ladder (390) ---
fact("the evidence registry ships with declared strengths, described never ranked", Object.keys(EVIDENCE_TYPES).join(",") === "suite-run,test-transcript,screenshot,session-recording" && Object.values(EVIDENCE_TYPES).every((s) => s.length > 10));
fact("the demo scaffold teaches the declaration grammar and the registry", DEMO_HOWTO_TEMPLATE.includes("[evidence: screenshot]") && DEMO_HOWTO_TEMPLATE.includes("[evidence: session-recording]") && DEMO_HOWTO_TEMPLATE.includes("never ranked"));
fact("the payload's AGENTS.md teaches the declaration sentence", agentsMd().includes("[evidence: screenshot]") && agentsMd().includes("described never ranked"));
{
  const { teachEvidenceLadder } = await import("./versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-teach5-"));
  const rec = join(ag, ".docodego");
  mkdirSync(rec, { recursive: true });
  const v21 = "## The honesty law\n\n- **Evidence is a path that exists.** No path, no claim. A proofs.md entry\n  names a real file; `verified: false` recorded honestly is worth more than\n  a claim that was never checked.\n";
  writeFileSync(join(ag, "AGENTS.md"), v21);
  const first = teachEvidenceLadder(rec);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  const second = teachEvidenceLadder(rec);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-teach6-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own evidence rules\n\nnothing here matches the scaffold\n");
  const keptNote = teachEvidenceLadder(join(custom, ".docodego"));
  const keptBody = readFileSync(join(custom, "AGENTS.md"), "utf8");
  fact("the evidence teach inserts the declaration sentence into shipped-v21 bytes", first.includes("updated AGENTS.md") && taught.includes("described never ranked"));
  fact("the evidence teach is idempotent", second.includes("already present") && taught === readFileSync(join(ag, "AGENTS.md"), "utf8"));
  fact("the evidence teach keeps a customized AGENTS.md untouched", keptNote.includes("customized") && keptBody === "# my own evidence rules\n\nnothing here matches the scaffold\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}
// --- v23: the register split (410) ---
fact("the payload's AGENTS.md carries the two registers with the accepted lists", agentsMd().includes("## The two registers") && agentsMd().includes("verbatim intent, append-only records") && agentsMd().includes("score as a checklist") && agentsMd().includes("`deviations: <what> — <why>`"));
{
  const { teachRegisters } = await import("./versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-teach7-"));
  const rec = join(ag, ".docodego");
  mkdirSync(rec, { recursive: true });
  const v22 = "## The honesty law\n\n- **Records append.** Superseded text is struck or archived, never deleted.\n\n## The commands\n\n- `docodego check` — record integrity.\n";
  writeFileSync(join(ag, "AGENTS.md"), v22);
  const first = teachRegisters(rec);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  const second = teachRegisters(rec);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-teach8-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own law\n\nno commands heading here\n");
  const keptNote = teachRegisters(join(custom, ".docodego"));
  const keptBody = readFileSync(join(custom, "AGENTS.md"), "utf8");
  fact("the registers teach inserts the section into shipped-v22 bytes", first.includes("updated AGENTS.md") && taught.includes("## The two registers") && taught.includes("honored\nrefusals") && taught.indexOf("## The two registers") < taught.indexOf("## The commands"));
  fact("the registers teach is idempotent", second.includes("already present") && taught === readFileSync(join(ag, "AGENTS.md"), "utf8"));
  fact("the registers teach keeps a customized AGENTS.md untouched", keptNote.includes("customized") && keptBody === "# my own law\n\nno commands heading here\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}
// --- v24: the sign-off tool (420) ---
{
  const so = mkdtempSync(join(tmpdir(), "docodego-conformance-signoff-"));
  const specRoot = join(so, "spec");
  mkdirSync(join(specRoot, "amendments"), { recursive: true });
  mkdirSync(join(specRoot, "laws"), { recursive: true });
  const lawBody = "---\nid: EL-35\ntitle: The demo law\n---\n\n# Engine law 35 — The demo law\n";
  writeFileSync(join(specRoot, "laws", "35-the-demo-law.md"), lawBody);
  const amendment = (id: string, lawHeading: string): string => `---\nid: AMEND-NEW-${id}-1.3.0\nlaw: (new) ${id} — demo\nproposed-version: 1.3.0\nstatus: draft\n---\n\n# New law ${id}\n\n## Proposed law file: ${lawHeading}\n\n> demo text\n\n## The founder's sign-off\n\nSigned: (pending — \`docodego sign-off\` records the decision; EL-19 keeps the words verbatim, beside the hash of the exact text signed)\n`;
  const amen1 = join(specRoot, "amendments", "1.3.0-EL-35-new.md");
  writeFileSync(amen1, amendment("EL-35", "laws/35-the-demo-law.md"));
  check("sign-off fills the pending block — quote verbatim, hash, derivation named, limit stated", run(so, ["sign-off", amen1, "--quote", "Accept it", "--by", "Ada Lovelace"]), 0, (r) => {
    const body = readFileSync(amen1, "utf8");
    const lawHash = createHash("sha256").update(lawBody).digest("hex");
    return body.includes('"Accept it"') && !body.includes("(pending") && body.includes("a typed legal identifier") && body.includes(lawHash) && body.includes("scanned for secrets") && body.includes("witnesses the act");
  });
  check("a second sign-off of the same act is refused — nothing changed", run(so, ["sign-off", amen1, "--quote", "Accept it again"]), 1, (r) => r.stderr.includes("DG-U115"));
  const amen2 = join(specRoot, "amendments", "1.3.0-EL-36-new.md");
  writeFileSync(amen2, amendment("EL-36", "laws/36-not-landed-yet.md"));
  const before2 = readFileSync(amen2, "utf8");
  check("a secret-shaped quote is refused and stores nothing", run(so, ["sign-off", amen2, "--quote", "sure thing sk-abcdef1234567890abcdef123456"]), 1, (r) => {
    const after = readFileSync(amen2, "utf8");
    return r.stderr.includes("DG-U114") && after === before2;
  });
  check("an unresolvable law file is refused (DG-U116)", run(so, ["sign-off", amen2, "--quote", "Accept it"]), 1, (r) => r.stderr.includes("DG-U116"));
  check("sign-off without --quote is a usage error", run(so, ["sign-off", amen2]), 2, (r) => r.stderr.includes("DG-U117"));
  const amen3 = join(specRoot, "amendments", "1.3.0-EL-37-new.md");
  writeFileSync(amen3, amendment("EL-37", "laws/35-the-demo-law.md"));
  check("without --by the receipt names the derivation kind (git or system) and the limit", run(so, ["sign-off", amen3, "--quote", "Accept it"]), 0, (r) => {
    const body = readFileSync(amen3, "utf8");
    return /identity of the environment\)/.test(body) && body.includes("witnesses the act");
  });
  rmSync(so, { recursive: true, force: true });
}
// the detector, over a real delivered unit: an unknown declaration fails
// check naming the registry; a declared one passes; the demo bundle is
// scanned with its own path named
const keptProofsRel = "01-document/01-discover/kept-unit/proofs.md";
const keptProofsOriginal = read(fixture, keptProofsRel);
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal + "\n- extra — the run again: `01-document/01-discover/kept-unit/proofs/run.txt` [evidence: vibe]\n");
check("an unknown evidence declaration is flagged (DG-C019 warning, registry named)", run(fixture, ["check"]), 0, (r) => r.stdout.includes("DG-C019") && r.stdout.includes("'vibe'") && r.stdout.includes("never ranked"));
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal + "\n- extra — the run again: `01-document/01-discover/kept-unit/proofs/run.txt` [evidence: screenshot]\n");
check("a declared registry evidence type checks clean — no DG-C019", run(fixture, ["check"]), 0, (r) => !r.stdout.includes("DG-C019"));
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal);
const keptDemoRel = "03-demonstrate/demo/kept-unit/how-to-run.md";
const keptDemoOriginal = read(fixture, keptDemoRel);
write(fixture, ".docodego/" + keptDemoRel, keptDemoOriginal + "\n[evidence: seance]\n");
check("the demo bundle is scanned too, and names its own path", run(fixture, ["check"]), 0, (r) => r.stdout.includes("DG-C019") && r.stdout.includes(keptDemoRel));
write(fixture, ".docodego/" + keptDemoRel, keptDemoOriginal);
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal + "\n- the ladder taught — a claim `` `evidence: seance` `` quoted in a code span is prose about the syntax, not a declaration, and the registry says nothing\n");
check("a backticked mention quotes the syntax instead of claiming it", run(fixture, ["check"]), 0, (r) => !r.stdout.includes("'seance'"));
write(fixture, ".docodego/" + keptProofsRel, keptProofsOriginal);

// --- v2d: the gate-rows law ships and teaches (300) ---
fact("the payload's AGENTS.md teaches the gate-rows law", agentsMd().includes("Gate rows ride the unit's commit"));
{
  const { teachGateRowsHome } = await import("./versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-teach-"));
  const rec = join(ag, ".docodego");
  mkdirSync(rec, { recursive: true });
  const v15 = "## The honesty law\n\n- **Failure is evidence.** Proof files may show what failed; a refused gate\n  records its attempt in the tracker. What the record cannot reconstruct\n  did not, for this repository's purposes, happen.\n";
  writeFileSync(join(ag, "AGENTS.md"), v15);
  const first = teachGateRowsHome(rec);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  const second = teachGateRowsHome(rec);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-teach2-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# my own house rules\n\nnothing here matches the scaffold\n");
  const keptNote = teachGateRowsHome(join(custom, ".docodego"));
  const keptBody = readFileSync(join(custom, "AGENTS.md"), "utf8");
  fact("the teach step inserts the gate-rows bullet into shipped-v15 bytes", first.includes("updated AGENTS.md") && taught.includes("Gate rows ride"));
  fact("the teach step is idempotent", second.includes("already present") && taught === readFileSync(join(ag, "AGENTS.md"), "utf8"));
  fact("the teach step keeps a customized AGENTS.md untouched", keptNote.includes("customized") && keptBody === "# my own house rules\n\nnothing here matches the scaffold\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}

// --- v2e: the event order and the repair rule ship and teach (310) ---
fact("the payload's AGENTS.md states the event order and the repair rule", agentsMd().includes("`new` → `grill` → `score` → `deliver`") && agentsMd().includes("repaired forward, never rewritten"));
{
  const { teachEventOrder } = await import("./versioning/migrations.ts");
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-teach3-"));
  const rec = join(ag, ".docodego");
  mkdirSync(rec, { recursive: true });
  const v16 = "The loop is weighted to the work, never forced onto it: a one-line fix may\nmove sketch → spec → proof → deliver in minutes; a complex feature earns the\nfull round of grilling and scoring. What is never skipped is the order —\nno implementation before a scored spec, no delivery without a proof that\nexists. When a task outgrows the loop, record it.\n";
  writeFileSync(join(ag, "AGENTS.md"), v16);
  const first = teachEventOrder(rec);
  const taught = readFileSync(join(ag, "AGENTS.md"), "utf8");
  const second = teachEventOrder(rec);
  const custom = mkdtempSync(join(tmpdir(), "docodego-conformance-teach4-"));
  mkdirSync(join(custom, ".docodego"), { recursive: true });
  writeFileSync(join(custom, "AGENTS.md"), "# house rules\n\nnothing matches\n");
  const keptNote = teachEventOrder(join(custom, ".docodego"));
  const keptBody = readFileSync(join(custom, "AGENTS.md"), "utf8");
  fact("the event-order teach inserts the sentences into shipped-v16 bytes", first.includes("updated AGENTS.md") && taught.includes("`new` → `grill` → `score` → `deliver`"));
  fact("the event-order teach is idempotent", second.includes("already present") && taught === readFileSync(join(ag, "AGENTS.md"), "utf8"));
  fact("the event-order teach keeps a customized AGENTS.md untouched", keptNote.includes("customized") && keptBody === "# house rules\n\nnothing matches\n");
  rmSync(ag, { recursive: true, force: true });
  rmSync(custom, { recursive: true, force: true });
}

// --- v2f: the stale-proofs light fires on post-delivery commits (320) ---
{
  const g = mkdtempSync(join(tmpdir(), "docodego-conformance-stale-"));
  const git = (args: string[], when?: string) => spawnSync("git", args, { cwd: g, encoding: "utf8", env: when === undefined ? process.env : { ...process.env, GIT_AUTHOR_DATE: when, GIT_COMMITTER_DATE: when } });
  git(["init", "-q", "."]);
  write(g, "evidence.txt", "v1\n");
  git(["add", "."]);
  git(["-c", "user.name=f", "-c", "user.email=f@l", "commit", "-qm", "evidence at day one"], "2026-01-01T09:00:00");
  const spec = ["---", "name: early-unit", "type: unit", "status: delivered", "---", "", "# early-unit", "", "## intent", "", "cite the evidence file.", "", "## acceptance", "", "- AC — the evidence file proves it."].join("\n");
  write(g, join(".docodego", ".standard", "manifest.json"), `{\n  "recordVersion": ${specVersion()}\n}\n`);
  write(g, join(".docodego", "02-compose", "01-build", "early-unit", "spec.md"), spec);
  write(g, join(".docodego", "02-compose", "01-build", "early-unit", "delivered.md"), "## delivered 2026-01-02\n");
  write(g, join(".docodego", "02-compose", "01-build", "early-unit", "proofs.md"), "- AC — the evidence file proves it: `evidence.txt`\n");
  write(g, join(".docodego", "02-compose", "01-build", "early-unit", "score.md"), "score 80 — ok\n");
  const before = run(g, ["check"]);
  write(g, "evidence.txt", "v2\n");
  git(["add", "."]);
  git(["-c", "user.name=f", "-c", "user.email=f@l", "commit", "-qm", "evidence moves after delivery"], "2026-01-05T09:00:00");
  const after = run(g, ["check"]);
  fact("check is quiet while evidence predates the delivery day", !before.stdout.includes("DG-C017"));
  fact("check warns DG-C017 when cited evidence gains a post-delivery commit", after.stdout.includes("DG-C017") && after.stdout.includes("recapture the proof or record the supersession row"));
  rmSync(g, { recursive: true, force: true });
}

// --- v2g: research is a first-class non-unit (330) ---
{
  const rh = mkdtempSync(join(tmpdir(), "docodego-conformance-research-"));
  write(rh, join(".docodego", ".standard", "manifest.json"), `{\n  "recordVersion": ${specVersion()}\n}\n`);
  write(rh, join(".docodego", "01-document", "01-discover", "research", "walk-notes.md"), "grounding material, not a unit\n");
  write(rh, join(".docodego", "01-document", "01-discover", "wannabe-unit", "README.md"), "a folder with no spec\n");
  const res = run(rh, ["audit"]);
  fact("the research home lints clean — no DG-F001 for 01-discover/research", !res.stdout.includes("research"));
  fact("a spec-less sibling folder still earns the broken-unit finding", res.stdout.includes("wannabe-unit") && res.stdout.includes("has no spec.md"));
  rmSync(rh, { recursive: true, force: true });
}

// --- v2h: the grill round names its mode (340) ---
{
  const gh = mkdtempSync(join(tmpdir(), "docodego-conformance-grillmode-"));
  check("grillmode: init", run(gh, ["init"]), 0);
  check("grillmode: new", run(gh, ["new", "mode-unit"]), 0);
  write(gh, "ans.txt", "GQ-1: the intent holds\nGQ-2: by the proofs\nGQ-3: none\nGQ-4: none\nGQ-AC1: by the capture\nGQ-AC2: same\n");
  check("grillmode: a plain round", run(gh, ["grill", "010-mode-unit", "--answers", "ans.txt"]), 0, () => {
    const md = read(gh, join("01-document", "01-discover", "010-mode-unit", "grill.md"));
    return md.includes("round: self-grilled — the agent answered its own questions");
  });
  write(gh, "ans.txt", "GQ-1: the intent holds\nGQ-2: by the proofs\nGQ-3: none\nGQ-4: none\nGQ-AC1: by the capture\nGQ-AC2: same\n");
  check("grillmode: a named round", run(gh, ["grill", "010-mode-unit", "--answers", "ans.txt", "--by", "Founder"]), 0, (r) => {
    const md = read(gh, join("01-document", "01-discover", "010-mode-unit", "grill.md"));
    return md.includes("round: answered by Founder");
  });
  rmSync(gh, { recursive: true, force: true });
}

// --- v2i: the reuse warning — a score certifies what it graded (350) ---
{
  const rh = mkdtempSync(join(tmpdir(), "docodego-conformance-reuse-"));
  check("reuse: init", run(rh, ["init"]), 0);
  check("reuse: new", run(rh, ["new", "scored-unit"]), 0);
  write(rh, "ans.txt", "GQ-1: holds\nGQ-2: by proofs\nGQ-3: none\nGQ-4: none\nGQ-AC1: captured\nGQ-AC2: same\n");
  check("reuse: grill", run(rh, ["grill", "010-scored-unit", "--answers", "ans.txt"]), 0);
  check("reuse: score", run(rh, ["score", "010-scored-unit"]), 0);
  const quiet = run(rh, ["check"]);
  fact("check is quiet while the score binds the living spec", !quiet.stdout.includes("DG-C018"));
  const body = read(rh, join("01-document", "01-discover", "010-scored-unit", "spec.md"));
  write(rh, join(".docodego", "01-document", "01-discover", "010-scored-unit", "spec.md"), body.replace("## intent", "## intent (revised materially after scoring)"));
  const warned = run(rh, ["check"]);
  fact("check warns DG-C018 when the spec moves past its recorded score", warned.stdout.includes("DG-C018") && warned.stdout.includes("re-run 'docodego score'"));
  fact("a drift-class warning renders its class", warned.stdout.includes("warning (drift)[DG-C018]"));
  rmSync(rh, { recursive: true, force: true });
}

// --- the deliver flip: a landing moves the status line the score bound ---
{
  // a delivered unit whose only post-score change is the status flip
  // (scored -> delivered, written by the gate) is NOT drift: the number
  // still certifies the content. A real content edit after delivery is.
  const fh = mkdtempSync(join(tmpdir(), "docodego-conformance-flip-"));
  check("flip: init", run(fh, ["init"]), 0);
  check("flip: new", run(fh, ["new", "landed-unit"]), 0);
  write(fh, join(".docodego", "01-document", "01-discover", "010-landed-unit", "spec.md"), `---
name: 010-landed-unit
type: unit
status: draft
---

# 010-landed-unit

## intent

Add a retry with backoff to the webhook sender so flaky networks stop dropping deliveries.

## scope

In: the webhook sender module and its retry policy.
Out: queue persistence and dead-letter handling.

## acceptance

- a failed webhook send retries exactly 3 times with exponential backoff, verified by a unit test counting attempts
- the final attempt's failure is logged once, verified by the same test's warning assertion

## threats

- retry storms -> the cap bounds attempts; the test asserts the count
`);
  const qf = run(fh, ["grill", "010-landed-unit", "--json"]);
  const fq = (JSON.parse(qf.stdout) as { data?: { questions?: unknown[] } }).data?.questions?.length ?? 0;
  write(fh, "ans.txt", Array.from({ length: fq }, () => "yes — evidence in the unit test output").join("\n") + "\n");
  check("flip: grill", run(fh, ["grill", "010-landed-unit", "--answers", "ans.txt"]), 0);
  check("flip: score", run(fh, ["score", "010-landed-unit"]), 0);
  write(fh, join(".docodego", "01-document", "01-discover", "010-landed-unit", "proofs.md"), "# proofs\n\n- 01-document/01-discover/010-landed-unit/spec.md — the delivered spec, cited by path\n");
  check("flip: deliver", run(fh, ["deliver", "010-landed-unit"]), 0, () => read(fh, join("01-document", "01-discover", "010-landed-unit", "spec.md")).includes("status: delivered"));
  const after = run(fh, ["check"]);
  fact("check is quiet on the deliver flip alone", !after.stdout.includes("DG-C018"));
  const spec = read(fh, join("01-document", "01-discover", "010-landed-unit", "spec.md"));
  write(fh, join(".docodego", "01-document", "01-discover", "010-landed-unit", "spec.md"), spec.replace("## intent", "## intent (edited after the landing)"));
  const drifted = run(fh, ["check"]);
  fact("check still warns when delivered content truly changes", drifted.stdout.includes("DG-C018"));
  rmSync(fh, { recursive: true, force: true });
}

// --- v2j: the triage classes render (360) ---
{
  const ph = mkdtempSync(join(tmpdir(), "docodego-conformance-prose-"));
  check("prose: init", run(ph, ["init"]), 0);
  check("prose: new", run(ph, ["new", "wording-unit"]), 0);
  write(ph, "ans.txt", "GQ-1: holds\nGQ-2: by proofs\nGQ-3: none\nGQ-4: none\nGQ-AC1: captured\nGQ-AC2: same\n");
  check("prose: grill", run(ph, ["grill", "010-wording-unit", "--answers", "ans.txt"]), 0);
  check("prose: score", run(ph, ["score", "010-wording-unit"]), 0);
  write(ph, join(".docodego", "01-document", "01-discover", "010-wording-unit", "proofs.md"), "# proofs\n\n- AC1 — real: `01-document/01-discover/010-wording-unit/spec.md`\n- stray: `/etc/hosts` absolute\n");
  const res = run(ph, ["check"]);
  fact("a prose-class warning renders its class", res.stdout.includes("warning (prose)[DG-C002]"));
  rmSync(ph, { recursive: true, force: true });
}

// --- v5: vocabulary packs — words change, the contract does not ---
// The pack law, enforced at every layer: embedded packs pass the validator,
// cover exactly the canonical keys, keep ids and paths intact, init applies
// the dialect to a fresh plant only, and grill asks the pack's phrasing
// with canonical ids.
fact("three packs ship: plain, agile, babok", JSON.stringify(VOCABULARY_NAMES) === JSON.stringify(["agile", "babok", "plain"]));
fact("every bundled pack passes the pack validator", vocabularies().every((p) => validateVocabularyPack(p.name, p).errors.length === 0));
for (const p of vocabularies()) {
  fact(`pack ${p.name} covers exactly the sixteen streams`, JSON.stringify(Object.keys(p.streams).sort()) === JSON.stringify([...ALL_STREAMS].sort()));
  fact(`pack ${p.name} keeps the four gate ids`, JSON.stringify(Object.keys(p.gateQuestions).sort()) === JSON.stringify(["GQ-1", "GQ-2", "GQ-3", "GQ-4"]));
  fact(`pack ${p.name} never renames a path or id`, ALL_STREAMS.every((id) => p.streams[id] !== undefined));
}
const vf = mkdtempSync(join(tmpdir(), "docodego-conformance-vocab-"));
const babok = vocabularyPack("babok")!;
check("init --vocabulary babok plants the dialect", run(vf, ["init", "--vocabulary", "babok"]), 0, () => read(vf, "01-document/01-discover/README.md") === `${babok.streams["01-document/01-discover"]}\n`);
fact("all sixteen stream READMEs carry the pack's words, byte for byte", ALL_STREAMS.every((id) => read(vf, `${id}/README.md`) === `${babok.streams[id]}\n`));
fact("the manifest records the birth dialect", (JSON.parse(read(vf, ".standard/manifest.json")) as { vocabulary?: string }).vocabulary === "babok");
fact("the glossary bridge is planted with a real entry set", (read(vf, ".standard/vocabulary.md").match(/\| \*\*/g) ?? []).length >= 10);
fact("the statutes are untouched by the pack", read(vf, ".standard/statutes.md").includes("Recorded verbatim"));
const agentsVocab = readFileSync(join(vf, "AGENTS.md"), "utf8");
fact("AGENTS.md movement glosses carry the pack's words, tags intact", agentsVocab.includes("— business needs elicited, analysed, and specified (DO)") && !agentsVocab.includes("intent sharpened into plans"));
run(vf, ["new", "010-voice-unit"]);
const vq = run(vf, ["grill", "010-voice-unit", "--json"]);
check("grill asks the pack's phrasing under the canonical id", vq, 0, (r) => {
  const first = (JSON.parse(r.stdout) as { data?: { questions?: { id: string; text: string }[] } }).data?.questions?.[0];
  return first !== undefined && first.id === "GQ-1" && first.text === babok.gateQuestions["GQ-1"];
});
check("an unknown --vocabulary is a usage error", run(vf, ["init", "--force", "--vocabulary", "klingon"]), 2, (r) => r.stderr.includes("--vocabulary must be one of"));
check("a vocabulary on an existing record is refused — words are chosen at birth", run(vf, ["init", "--force", "--vocabulary", "plain"]), 1, (r) => r.stderr.includes("chosen at birth"));
rmSync(vf, { recursive: true, force: true });
const vd = mkdtempSync(join(tmpdir(), "docodego-conformance-canonical-"));
check("default init still plants the canonical voice", run(vd, ["init"]), 0, () => read(vd, "01-document/01-discover/README.md") === recordFiles()["01-document/01-discover/README.md"]);
check("init plants the record's gitignore", run(vd, ["check"]), 0, () => read(vd, ".gitignore").includes("var/") && read(vd, ".gitignore").includes("*.new"));
fact("default manifest carries no vocabulary key", !("vocabulary" in (JSON.parse(read(vd, ".standard/manifest.json")) as Record<string, unknown>)));
run(vd, ["new", "010-plain-unit"]);
const dvq = run(vd, ["grill", "010-plain-unit", "--json"]);
check("canonical grill asks the canonical question", dvq, 0, (r) => {
  const first = (JSON.parse(r.stdout) as { data?: { questions?: { id: string; text: string }[] } }).data?.questions?.[0];
  return first !== undefined && first.id === "GQ-1" && first.text === "What does this unit do, in one sentence a stranger can verify?";
});
rmSync(vd, { recursive: true, force: true });

// --- v0.7.1: skill-add hardening — names, sources, symlinks (checklist §2) ---
// The threat pass's probes, kept as law: a skill name can never traverse, a
// source URL can only be a named transport, symlinks in a remote tree are
// never followed, and the lockfile stays metadata-only.
const sh = mkdtempSync(join(tmpdir(), "docodego-conformance-skillhard-"));
run(sh, ["init"]);
check("a traversing name is refused at add", run(sh, ["skill", "add", "../../escape"]), 2, (r) => r.stderr.includes("DG-U074"));
check("a traversing name is refused at remove", run(sh, ["skill", "remove", "../.."]), 2, (r) => r.stderr.includes("DG-U074"));
check("ext:: transports are refused before git runs", run(sh, ["skill", "add", "x", "--from", "ext::touch pwned.txt"]), 2, (r) => r.stderr.includes("DG-U075"));
check("option-shaped sources are refused", run(sh, ["skill", "add", "x", "--from", "--upload-pack=evil"]), 2, (r) => r.stderr.includes("DG-U075"));
check("bare paths are refused — named transports only", run(sh, ["skill", "add", "x", "--from", "../not-a-url"]), 2, (r) => r.stderr.includes("DG-U075"));
const gitFixture = (repo: string): void => {
  runRaw(repo, "git", ["init"]);
  runRaw(repo, "git", ["config", "user.email", "fixture@example.com"]);
  runRaw(repo, "git", ["config", "user.name", "fixture"]);
  runRaw(repo, "git", ["add", "-A"]);
  runRaw(repo, "git", ["commit", "-m", "fixture"]);
};
const secret = join(sh, "outside-secret.txt");
writeFileSync(secret, "secret-contents-from-outside\n");
const goodRepo = join(sh, "fixture-good");
const goodDir = join(goodRepo, "tskill");
mkdirSync(goodDir, { recursive: true });
writeFileSync(join(goodDir, "SKILL.md"), "---\nname: tskill\nversion: 1.2.3\ndescription: probe craft\n---\n\nprobe body\n");
gitFixture(goodRepo);
check("a file:// remote install works end to end", run(sh, ["skill", "add", "tskill", "--from", `file://${goodRepo}`]), 0);
fact("installed craft carries the remote's bytes", read(sh, "../.agents/skills/tskill/SKILL.md").includes("probe body"));
fact("the lockfile entry is metadata-only — no file contents", (() => {
  const entry = (JSON.parse(read(sh, "skills-lock.json")) as { installed: { name: string; files?: unknown }[] }).installed.find((e) => e.name === "tskill");
  return entry !== undefined && entry.files === undefined;
})());
check("skill list re-verifies the remote install", run(sh, ["skill", "list"]), 0);
const symRepo = join(sh, "fixture-sym");
const symDir = join(symRepo, "withsym");
mkdirSync(symDir, { recursive: true });
writeFileSync(join(symDir, "SKILL.md"), "---\nname: withsym\nversion: 1.0.0\n---\n\nsym body\n");
let symlinksWork = true;
try {
  symlinkSync(secret, join(symDir, "linkfile"));
} catch {
  symlinksWork = false;
}
if (symlinksWork) {
  gitFixture(symRepo);
  check("a remote tree with a symlink installs cleanly", run(sh, ["skill", "add", "withsym", "--from", `file://${symRepo}`]), 0);
  fact("the symlink was skipped, not followed — no arbitrary read", !existsSync(join(sh, ".agents/skills/withsym/linkfile")));
  fact("the outside secret never entered the craft", !read(sh, "../.agents/skills/withsym/SKILL.md").includes("secret-contents-from-outside"));
  check("the record still verifies clean after the remote adds", run(sh, ["skill", "list"]), 0);
} else {
  fact("symlink probe skipped — filesystem does not support symlinks", true);
}
const evilRepo = join(sh, "fixture-evil");
const evilDir = join(evilRepo, "escape");
mkdirSync(evilDir, { recursive: true });
writeFileSync(join(evilDir, "SKILL.md"), "---\nname: ../../escape\nversion: 9.9.9\n---\n\nEVIL BODY\n");
gitFixture(evilRepo);
check("a remote declaring a traversing name is refused before any clone", run(sh, ["skill", "add", "../../escape", "--from", `file://${evilRepo}`]), 2, (r) => r.stderr.includes("DG-U074"));
fact("nothing escaped the skills directory", !existsSync(join(sh, "escape")) && !existsSync(join(sh, ".agents/skills/escape")));
rmSync(sh, { recursive: true, force: true });

// --- v2: --branch runs the upgrade on its own branch and commits ---
const bf = mkdtempSync(join(tmpdir(), "docodego-conformance-branch-"));
runRaw(bf, "git", ["init"]);
runRaw(bf, "git", ["config", "user.email", "fixture@example.com"]);
runRaw(bf, "git", ["config", "user.name", "fixture"]);
run(bf, ["init"]);
write(bf, ".docodego/.standard/manifest.json", `{\n  "recordVersion": 1\n}\n`);
runRaw(bf, "git", ["add", "-A"]);
runRaw(bf, "git", ["commit", "-m", "baseline"]);
check("upgrade --branch exits 0", run(bf, ["upgrade", "--branch", "--apply"]), 0);
fact("the upgrade branch exists", runRaw(bf, "git", ["rev-parse", "--verify", `docodego-upgrade-v1-to-v${specVersion()}`]).code === 0);
fact("the commit message is plain", runRaw(bf, "git", ["log", "--format=%s", "-1", `docodego-upgrade-v1-to-v${specVersion()}`]).stdout.trim() === `docodego upgrade v1 -> v${specVersion()}`);
fact("manifest was stamped on the branch", JSON.parse(read(bf, ".standard/manifest.json")).recordVersion === specVersion());
rmSync(bf, { recursive: true, force: true });

// --- v3: the contract surface — per-command --help, explain, generated docs ---
// The planted AGENTS.md promises "run any command with --help for its own
// contract"; these checks are that promise, enforced.
const LAW_COMMANDS = ["init", "new", "sketch", "setback", "grill", "score", "audit", "check", "lint", "status", "trace", "doctor", "deliver", "launch", "sign", "sign-off", "retire", "upgrade", "skill", "explain", "completions"];
fact("every law command has a help page", JSON.stringify(Object.keys(COMMAND_HELP).sort()) === JSON.stringify([...LAW_COMMANDS].sort()));
fact("the global usage lists every command", LAW_COMMANDS.every((c) => usageText().includes(c)));
for (const c of LAW_COMMANDS) {
  check(`--help prints ${c}'s own contract`, run(scratch, [c, "--help"]), 0, (r) => r.stdout.startsWith(`docodego ${c} —`) && r.stdout.includes("usage:"));
}
check("an unknown command is never helped — even with --help", run(scratch, ["frobnicate", "--help"]), 2);
check("global --help advertises the per-command contract and explain", run(scratch, ["--help"]), 0, (r) => r.stdout.includes("per-command") && r.stdout.includes("explain"));
check("explain prints a code page", run(scratch, ["explain", "DG-F004"]), 0, (r) => r.stdout.includes("meaning:") && r.stdout.includes("law:") && r.stdout.includes("fix:"));
check("explain prints a family", run(scratch, ["explain", "DG-F"]), 0, (r) => r.stdout.includes("DG-F001") && r.stdout.includes("DG-F007"));
check("explain --list covers the codes with family headers", run(scratch, ["explain", "--list"]), 0, (r) => r.stdout.includes("DG-S001") && r.stdout.includes("DG-U080") && r.stdout.includes("DG-F  "));
check("explain --json is an envelope", run(scratch, ["explain", "--json", "DG-U022"]), 0, (r) => (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/explain/v1");
check("explain of an unknown code is a usage error", run(scratch, ["explain", "DG-ZZZ"]), 2);
check("explain without a target is a usage error", run(scratch, ["explain"]), 2);
// --- completions: generated from the help registry, one script per shell ---
for (const shell of COMPLETION_SHELLS) {
  check(`completions ${shell} emits a script naming real commands`, run(scratch, ["completions", shell]), 0, (r) =>
    LAW_COMMANDS.every((c) => r.stdout.includes(c)) && (r.stdout.includes("--json") || r.stdout.includes("-l json")));
}
check("completions of an unknown shell is a usage error", run(scratch, ["completions", "powershell"]), 2);
check("completions without a shell is a usage error", run(scratch, ["completions"]), 2);
fact("the explanation registry covers every family", Object.keys(FAMILY_TITLES).every((f) => EXPLANATIONS.some((e) => e.code.startsWith(f))));
fact("the explanation registry covers the whole emitted surface", EXPLANATIONS.length >= 55);
check("generated docs match their registries", runRaw(REPO_ROOT, process.execPath, ["--experimental-strip-types", GEN_DOCS, "--verify"]), 0);

// --- v3: the --json envelope contract holds across every command ---
const envelopeOk = (cmd: string, r: Res): boolean => {
  try {
    return (JSON.parse(r.stdout) as { schema?: string }).schema === `docodego/${cmd}/v1`;
  } catch {
    return false;
  }
};
const envDir = mkdtempSync(join(tmpdir(), "docodego-conformance-env-"));
check("envelope: init", run(envDir, ["init", "--json"]), 0, (r) => envelopeOk("init", r));
rmSync(envDir, { recursive: true, force: true });
check("envelope: new", run(scratch, ["new", "010-json-unit", "--json"]), 0, (r) => envelopeOk("new", r));
check("envelope: sketch", run(scratch, ["sketch", "json-idea", "--json"]), 0, (r) => envelopeOk("sketch", r));
check("envelope: grill questions", run(scratch, ["grill", "010-json-unit", "--json"]), 0, (r) => envelopeOk("grill", r));
write(scratch, "json-answers.txt", Array.from({ length: 12 }, () => "covered — see proofs").join("\n") + "\n");
check("envelope: grill verdict", run(scratch, ["grill", "010-json-unit", "--answers", "json-answers.txt", "--json"]), 0, (r) => envelopeOk("grill", r));
check("envelope: score", run(scratch, ["score", "010-json-unit", "--json"]), 0, (r) => envelopeOk("score", r));
check("envelope: check", run(scratch, ["check", "--json"]), 0, (r) => envelopeOk("check", r));
check("envelope: lint", run(scratch, ["lint", "--json"]), 0, (r) => envelopeOk("lint", r));
check("envelope: status", run(scratch, ["status", "--json"]), 0, (r) => envelopeOk("status", r));
check("envelope: upgrade plan", run(scratch, ["upgrade", "--json"]), 0, (r) => envelopeOk("upgrade", r));
check("envelope: deliver fail lands on stderr", run(scratch, ["deliver", "030-weak-unit", "--json"]), 1, (r) => {
  try {
    const parsed = JSON.parse(r.stderr) as { schema?: string; ok?: boolean };
    return parsed.schema === "docodego/deliver/v1" && parsed.ok === false;
  } catch {
    return false;
  }
});

// the explain hint renders on the findings channel (stdout for lint), then
// the scratch record is restored so nothing downstream sees the broken unit
write(scratch, ".docodego/01-document/02-refine/broken-thing/spec.md", "---\nname: broken-thing\ntype: unit\nstatus: wild\n---\n\n# broken-thing\n\n## intent\n\nx\n");
check("diagnostics carry an explain hint", run(scratch, ["lint"]), 1, (r) => r.stdout.includes("help: docodego explain DG-F004"));
check("envelope: lint findings carry ok:false", run(scratch, ["lint", "--json"]), 1, (r) => {
  try {
    const parsed = JSON.parse(r.stdout) as { schema?: string; ok?: boolean };
    return parsed.schema === "docodego/lint/v1" && parsed.ok === false;
  } catch {
    return false;
  }
});
rmSync(join(scratch, ".docodego", "01-document", "02-refine", "broken-thing"), { recursive: true, force: true });

// --- v2: --version prints both axes ---
check("--version prints cli and record spec versions", run(scratch, ["--version"]), 0, (r) => {
  const line = r.stdout.trim();
  return line.startsWith(`docodego cli ${cliVersion()}`) && line.endsWith(`record spec ${specVersion()}`);
});

// --- setback: the failure ledger, its counter, and the wired escalation ---
// The founder's rule, mechanical: document the bite, respond, and the
// audit fails at three until the response lands. The response names a
// real path or the sweep warns — no path, no claim.
const sb = mkdtempSync(join(tmpdir(), "docodego-conformance-setback-"));
check("init for the setback record", run(sb, ["init"]), 0);
check("setback refuses a bite without text", run(sb, ["setback", "quirk-sed"]), 2, (r) => r.stderr.includes("DG-U090"));
check("setback refuses a non-kebab class", run(sb, ["setback", "Sed Quirk", "x"]), 2, (r) => r.stderr.includes("DG-U091"));
check("first bite plants the ledger and counts 1", run(sb, ["setback", "quirk-sed", "first failure"]), 0, () => read(sb, "04-govern/01-monitor/setbacks.md").includes("| 1 | first failure"));
check("second bite counts 2", run(sb, ["setback", "quirk-sed", "second failure"]), 0, () => read(sb, "04-govern/01-monitor/setbacks.md").includes("| 2 | second failure"));
check("audit warns at two bites but exits 0", run(sb, ["audit"]), 0, (r) => r.stdout.includes("second bite of quirk-sed") && r.stdout.includes("GOV-006"));
check("third bite counts 3", run(sb, ["setback", "quirk-sed", "third failure"]), 0);
check("audit fails at three, naming the owed work", run(sb, ["audit"]), 1, (r) => r.stdout.includes("3 recurrences of quirk-sed") && r.stdout.includes("docodego sketch quirk-sed-mitigation"));
check("respond appends a count-0 row", run(sb, ["setback", "quirk-sed", "--respond", "01-document/01-discover/cycles.md"]), 0, () => read(sb, "04-govern/01-monitor/setbacks.md").split("\n").some((l) => l.includes("quirk-sed | 0 |")));
check("audit is silent after a real response", run(sb, ["audit"]), 0, (r) => !r.stdout.includes("quirk-sed"));
check("a post-response bite counts from the response", run(sb, ["setback", "quirk-sed", "it came back"]), 0, () => read(sb, "04-govern/01-monitor/setbacks.md").includes("| 1 | it came back"));
check("a response naming no resolvable path is warned", (() => {
  run(sb, ["setback", "quirk-sed", "--respond", "trust me, it is handled"]);
  return run(sb, ["audit"]);
})(), 0, (r) => r.stdout.includes("names no path that resolves"));
check("setback --list prints the class index", run(sb, ["setback", "--list"]), 0, (r) => r.stdout.includes("quirk-sed: lifetime") && r.stdout.includes("last response"));
// the bound and the rotation, on the same record: over-bound warns, then
// --rotate moves whole rows byte-identically under the archive law.
write(sb, ".docodego/04-govern/01-monitor/setbacks.md", "# Setbacks\n\n| date | class | count | text |\n|---|---|---|---|\n" + Array.from({ length: 2200 }, (_, i) => `| 2026-11-08 | filler-class | 0 | filler row ${i} padded to make the file genuinely large for the bound check |`).join("\n") + "\n");
check("a ledger past its bound is warned", run(sb, ["audit"]), 0, (r) => r.stdout.includes("setbacks.md is") && r.stdout.includes("100KB bound"));
check("audit --rotate archives setbacks rows", (() => run(sb, ["audit", "--rotate"]))(), 0, (r) => {
  const live = read(sb, "04-govern/01-monitor/setbacks.md");
  const archive = read(sb, "04-govern/01-monitor/setbacks-archive-1.md");
  return archive !== null && archive.includes("| date | class | count | text |") && live.includes("archived") && live.includes("setbacks-archive-1.md") && r.stdout.includes("setbacks.md: moved");
});
const sbLiveRows = read(sb, "04-govern/01-monitor/setbacks.md").split("\n").filter((l) => /^\| 2026/.test(l)).length;
fact("rotation keeps the newest rows live (tracker bound minus tombstone)", sbLiveRows >= 200 && sbLiveRows <= 201);
rmSync(sb, { recursive: true, force: true });

// --- v14: the nine-skill shelf + the rules layer (spec7-shelf-and-stack) ---
{
  const AUTO_ADD = new Set(["tech-stack", "docodego-payments", "research-verify"]);
  const idx = skillsIndex();
  for (const name of [...AUTO_ADD, "security-baseline-for-ai-code", "destructive-action-guard", "reward-hacking-detection", "supply-chain-evidence", "incident-record-writing", "docs-publishing"]) {
    const s = idx.find((e) => e.name === name);
    fact(`the shelf carries ${name} at v1 with a trigger-precise description`, s !== undefined && s.version === "1.0.0" && s.description.length >= 60 && /use when|Use when|Use before|Use after|whenever/.test(s.description));
  }
  for (const name of AUTO_ADD) {
    const s = idx.find((e) => e.name === name);
    fact(`${name} is auto-add: marked in the index, listed in no profile`, s?.autoAdd === true && Object.values(bundledProfiles).every((list) => !list.includes(name)));
  }
  const rules = Object.keys(ruleFiles()).sort();
  fact("the rules layer plants six files: the README map + five invariant rules", JSON.stringify(rules) === JSON.stringify(["README.md", "interruption-safety.md", "no-untracked-source.md", "privacy-at-network-layer.md", "reduced-motion.md", "standard-stack-default.md"]));
  // the floor and the scans, driven through scratch fixtures
  const t = mkdtempSync(join(tmpdir(), "dg-tree-"));
  const rulesDir = join(t, ".agents", "rules");
  mkdirSync(rulesDir, { recursive: true });
  mkdirSync(join(t, "src"), { recursive: true });
  writeFileSync(join(t, "package.json"), JSON.stringify({ devDependencies: { typescript: "^5" } }));
  writeFileSync(join(t, "src", "typed.ts"), "const x: number = 1;\n");
  writeFileSync(join(t, "src", "legacy.js"), "function f() { return 2; }\n");
  writeFileSync(join(rulesDir, "standard-stack-default.md"), readFileSync(join(REPO_ROOT, ".agents", "rules", "standard-stack-default.md"), "utf8"));
  fact("stack scan: plain JS beside a typed stack warns DG-C008", treeFindings(t).some((d) => d.code === "DG-C008" && d.file === "src/legacy.js"));
  writeFileSync(join(rulesDir, "no-untracked-source.md"), readFileSync(join(REPO_ROOT, ".agents", "rules", "no-untracked-source.md"), "utf8"));
  writeFileSync(join(rulesDir, "good.md"), "---\nreader: someone\nfails-when: something\nenforced-by: practice: the named instrument\n---\n\n# ok\n");
  fact("rules floor: a practice rule with a named instrument holds", !treeFindings(t).some((d) => d.code === "DG-C010" && d.file?.endsWith("good.md")));
  writeFileSync(join(rulesDir, "bad.md"), "---\nreader: someone\nfails-when: something\n---\n\n# missing enforced-by\n");
  fact("rules floor: an empty enforced-by lists the rule as furniture (DG-C010)", treeFindings(t).some((d) => d.code === "DG-C010" && d.file?.endsWith("bad.md")));
  rmSync(t, { recursive: true, force: true });
}

// --- governance pass: the ledgers and the units agree (spec7-governance-pass) ---
{
  const gov = mkdtempSync(join(tmpdir(), "docodego-conformance-gov-"));
  check("governance fixture: init runs clean", run(gov, ["init"]), 0);
  const unitDir = ".docodego/01-document/01-discover/010-done-unit";
  write(gov, `${unitDir}/spec.md`, "---\nname: 010-done-unit\ntype: unit\nstatus: delivered\n---\n\n# 010-done-unit\n\n## intent\n\nDelivered, with rows.\n");
  write(gov, `${unitDir}/grill.md`, "# grill\n\nverdict: pass\n");
  write(gov, `${unitDir}/delivered.md`, "# delivered\n\nGates passed.\n");
  const trackerRow = "| 2026-11-08 | 010-done-unit | delivered | 01-document/01-discover/010-done-unit/delivered.md |\n";
  const logRow = "| 2026-11-08 | 010-done-unit | G1,G2,G3,G4 | proof: 01-document/01-discover/010-done-unit/delivered.md |\n";
  // read() prefixes .docodego; write() takes the repo-root-relative path
  write(gov, ".docodego/04-govern/01-monitor/tracker.md", read(gov, "04-govern/01-monitor/tracker.md") + trackerRow);
  write(gov, ".docodego/04-govern/delivery-log.md", read(gov, "04-govern/delivery-log.md") + logRow);
  const findings = () => governanceFindings(loadRecord(gov));
  fact("governance: a gate-written record holds its silence", findings().length === 0);
  write(gov, ".docodego/04-govern/01-monitor/tracker.md", read(gov, "04-govern/01-monitor/tracker.md").replace(trackerRow, ""));
  fact("governance: deleting the tracker row fails DG-C011 as an error", findings().some((d) => d.code === "DG-C011" && d.severity === "error"));
  write(gov, ".docodego/04-govern/01-monitor/tracker.md", read(gov, "04-govern/01-monitor/tracker.md") + trackerRow);
  write(gov, ".docodego/04-govern/delivery-log.md", read(gov, "04-govern/delivery-log.md").replace(logRow, ""));
  fact("governance: deleting the delivery-log row fails DG-C012 as an error", findings().some((d) => d.code === "DG-C012" && d.severity === "error"));
  write(gov, ".docodego/04-govern/delivery-log.md", read(gov, "04-govern/delivery-log.md") + logRow);
  write(gov, ".docodego/04-govern/delivery-log.md", read(gov, "04-govern/delivery-log.md") + "| 2026-11-08 | 090-ghost-unit | G1 | proof: nowhere.md |\n");
  fact("governance: a ghost delivery-log row warns DG-C013", findings().some((d) => d.code === "DG-C013" && d.severity === "warning"));
  write(gov, ".docodego/04-govern/delivery-log.md", read(gov, "04-govern/delivery-log.md").replace("| 2026-11-08 | 090-ghost-unit | G1 | proof: nowhere.md |\n", ""));
  write(gov, `${unitDir}/grill.md`, "# grill\n\nverdict: pass\nverdict: fail\n");
  fact("governance: a fail verdict after delivery warns DG-C014", findings().some((d) => d.code === "DG-C014" && d.severity === "warning"));
  fact("the verdict detector is the one source of truth audit's GOV-003 reads", readFileSync(join(REPO_ROOT, "apps", "cli", "src", "commands", "audit.ts"), "utf8").includes("verdictIncoherence(rec)"));
  rmSync(gov, { recursive: true, force: true });
}

// ————— enhancement 9 (260): the payload types are declared once. Before
// this, bundle.ts held the real interfaces AND hand-copies inside the
// emitted template — two declarations, hand-synced, no gate watching.
// Now types.ts is the one home and the compiler is the gate.
{
  const typesSrc = readFileSync(join(REPO_ROOT, "apps", "cli", "src", "types.ts"), "utf8");
  const bundleSrc = readFileSync(join(REPO_ROOT, "apps", "cli", "scripts", "bundle.ts"), "utf8");
  const payloadSrc = readFileSync(join(REPO_ROOT, "apps", "cli", "src", "bundled", "payload.ts"), "utf8");
  const decls = (s: string): number => (s.match(/^\s*(export )?interface (Payload|SkillIndexEntry)\b/gm) ?? []).length;
  fact("the payload types are declared once — in types.ts", decls(typesSrc) === 2);
  fact("bundle.ts holds no interface copy", decls(bundleSrc) === 0);
  fact("the generated payload holds no interface copy", decls(payloadSrc) === 0);
  fact("the generated payload imports the shared types", payloadSrc.includes(`import type { Payload, SkillIndexEntry } from "../types.ts"`));
}

// ————— cli-law writer side (240): the status machine refuses what the
// record cannot trust — score rides a grill, landings are terminal, a fail
// verdict demotes with a row, scores bind by sha, and the gate recomputes
// instead of trusting prose.
{
  const s240 = mkdtempSync(join(tmpdir(), "docodego-cli240-"));
  const specBody = (name: string, dir: string): string => [
    "---",
    `name: ${name}`,
    "type: unit",
    "status: draft",
    "---",
    "",
    `# ${name}`,
    "",
    "## intent",
    "",
    "Adds a retry with backoff to the webhook sender so a failed POST no longer drops the event.",
    "",
    "## scope",
    "",
    "In: the retry loop, the jittered backoff, the attempt counter. Out: queue persistence, new transports.",
    "",
    "## acceptance",
    "",
    `- AC1 — when the webhook POST fails, \`retry.test.ts\` re-runs it: the file \`${dir}/retry.test.ts\` exists and passes with three attempts.`,
    "- AC2 — the command run returns 0 and prints `3 attempts` on failure-then-recovery, recorded in proofs.md.",
    "",
  ].join("\n");
  const answers = "GQ-1: adds a retry with backoff to the webhook sender\nGQ-2: the unit test counts attempts; its output is recorded in proofs.md\nGQ-3: retry storms — capped at three attempts with jittered backoff\nGQ-4: queue persistence stays out of scope\nGQ-AC1: the unit test counts exactly three attempts on a failing send\nGQ-AC2: the command returns 0 and prints 3 attempts\n";
  const plant = (name: string, dir: string): void => {
    write(s240, `.docodego/${dir}/spec.md`, specBody(name, dir));
    write(s240, `.docodego/${dir}/proofs.md`, `# proofs — ${name}\n\n- AC1 — the test ran: \`${dir}/retry.test.txt\`\n`);
    write(s240, `.docodego/${dir}/retry.test.txt`, "proof: 3 attempts, exit 0\n");
  };
  const specOf = (dir: string): string => `${dir}/spec.md`;
  const scoreOf = (dir: string): string => `${dir}/score.md`;

  run(s240, ["init"]);
  run(s240, ["new", "first-unit"]);
  plant("010-first-unit", "01-document/01-discover/010-first-unit");
  check("cli240: score refuses a unit with no grill record", run(s240, ["score", "010-first-unit"]), 1, (r) => r.stderr.includes("DG-U031"));
  write(s240, "ans240.txt", answers);
  run(s240, ["grill", "010-first-unit", "--answers", "ans240.txt"]);
  run(s240, ["score", "010-first-unit"]);
  fact("cli240: the score block binds the spec by sha", read(s240, scoreOf("01-document/01-discover/010-first-unit")).includes("spec-sha: "));
  run(s240, ["score", "010-first-unit"]);
  fact("cli240: a re-score appends a dated block — two blocks on disk", (read(s240, scoreOf("01-document/01-discover/010-first-unit")).match(/^# score /gm) ?? []).length === 2);
  check("cli240: the gate delivers a bound, recomputed score", run(s240, ["deliver", "010-first-unit"]), 0, (r) => r.stdout.includes("GATE PASS"));
  check("cli240: a landing is terminal — deliver refuses the second pass", run(s240, ["deliver", "010-first-unit"]), 1, (r) => r.stderr.includes("DG-U041"));
  fact("cli240: the refused re-delivery writes no second tracker row", (read(s240, "04-govern/01-monitor/tracker.md").match(/\| 010-first-unit \| delivered \|/g) ?? []).length === 1);
  check("cli240: score refuses a delivered-class unit", run(s240, ["score", "010-first-unit"]), 1, (r) => r.stderr.includes("DG-U032"));
  check("cli240: a passing re-grill cannot unset a landing", run(s240, ["grill", "010-first-unit", "--answers", "ans240.txt"]), 0, (r) => r.stderr.includes("a landing is terminal") && read(s240, specOf("01-document/01-discover/010-first-unit")).includes("status: delivered"));
  write(s240, "bad240.txt", "GQ-1:\nGQ-2:\nGQ-3:\nGQ-4:\nGQ-AC1:\nGQ-AC2:\n");
  run(s240, ["grill", "010-first-unit", "--answers", "bad240.txt"]);
  fact("cli240: a fail verdict demotes a landing, with a tracker row", read(s240, specOf("01-document/01-discover/010-first-unit")).includes("status: grilled") && read(s240, "04-govern/01-monitor/tracker.md").includes("| demoted |"));
  run(s240, ["grill", "010-first-unit", "--answers", "ans240.txt"]);
  run(s240, ["score", "010-first-unit"]);
  check("cli240: the demoted unit re-lands through the gate", run(s240, ["deliver", "010-first-unit"]), 0, (r) => r.stdout.includes("GATE PASS"));

  run(s240, ["new", "second-unit"]);
  const dir2 = "01-document/01-discover/020-second-unit";
  plant("020-second-unit", dir2);
  write(s240, "ans2.txt", answers);
  run(s240, ["grill", "020-second-unit", "--answers", "ans2.txt"]);
  run(s240, ["score", "020-second-unit"]);
  write(s240, `.docodego/${dir2}/spec.md`, read(s240, specOf(dir2)) + "\n<!-- a late edit the score never saw -->\n");
  check("cli240: a spec edited after scoring fails G2 stale by sha", run(s240, ["deliver", "020-second-unit"]), 1, (r) => r.stderr.includes("the score is stale"));
  write(s240, `.docodego/${dir2}/spec.md`, specBody("020-second-unit", dir2));
  run(s240, ["score", "020-second-unit"]);
  // the gate reads the LAST block — the tamper must forge the live one
  const scoreRaw = read(s240, scoreOf(dir2));
  const lastTotal = scoreRaw.lastIndexOf("total: ");
  write(s240, `.docodego/${dir2}/score.md`, scoreRaw.slice(0, lastTotal) + scoreRaw.slice(lastTotal).replace(/^total: \d+/, "total: 100"));
  check("cli240: a hand-edited total fails the gate's recompute", run(s240, ["deliver", "020-second-unit"]), 1, (r) => r.stderr.includes("does not recompute"));
  write(s240, `.docodego/${dir2}/spec.md`, read(s240, specOf(dir2)).replace("status: scored", "status: banana"));
  check("cli240: a gibberish status fails check as DG-C015", run(s240, ["check"]), 1, (r) => r.stdout.includes("DG-C015"));
  write(s240, `.docodego/${dir2}/spec.md`, read(s240, specOf(dir2)).replace("status: banana", "status: scored"));
  write(s240, `.docodego/${dir2}/proofs.md`, "# proofs — 020-second-unit\n\n- proof at the machine root: `/etc/hosts`\n");
  check("cli240: an absolute proof path is named, never probed", run(s240, ["check"]), 1, (r) => r.stdout.includes("absolute proof path"));
  check("cli240: the board counts every vocabulary status plus other", run(s240, ["status", "--json"]), 0, (r) => r.stdout.includes('"launchPassed"') && r.stdout.includes('"founderSigned"') && r.stdout.includes('"other"'));

  // the silent downgrade (270): a manifest naming an unbundled pack fails
  // check as DG-C016 and surfaces in doctor's record-check tally
  const manifestRaw = read(s240, ".standard/manifest.json");
  const manifest = JSON.parse(manifestRaw) as Record<string, unknown>;
  const vocabBefore = manifest["vocabulary"];
  manifest["vocabulary"] = "klingon";
  write(s240, ".docodego/.standard/manifest.json", JSON.stringify(manifest, null, 2));
  check("cli270: a manifest naming an unbundled pack fails check as DG-C016", run(s240, ["check"]), 1, (r) => r.stdout.includes("DG-C016") && r.stdout.includes("klingon"));
  write(s240, `.docodego/${dir2}/proofs.md`, `# proofs — 020-second-unit\n\n- AC1 — the test ran: \`${dir2}/retry.test.txt\`\n`);
  const docRes = run(s240, ["doctor"]);
  check("cli270: doctor's tally counts the same one error — one detector, both surfaces", docRes, 1, (r) => (r.stdout + r.stderr).match(/record check\s*—\s*1 error/) !== null);
  manifest["vocabulary"] = typeof vocabBefore === "string" ? vocabBefore : "plain";
  write(s240, ".docodego/.standard/manifest.json", JSON.stringify(manifest, null, 2));
  check("cli270: a valid pack stays green", run(s240, ["check"]), 0);
  rmSync(s240, { recursive: true, force: true });
}

rmSync(fixture, { recursive: true, force: true });
rmSync(scratch, { recursive: true, force: true });
if (failed.length > 0) {
  process.stderr.write(`conformance: ${failed.length} failed, ${passed} passed\n`);
  for (const f of failed) process.stderr.write(`  FAIL ${f}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`conformance: all ${passed} checks green\n`);
}
