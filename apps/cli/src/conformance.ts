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
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { recordFiles, profiles as bundledProfiles, cliVersion, specVersion } from "./bundled/index.ts";
import { STREAM_README_PATHS } from "./record/streams.ts";
import { COMMAND_HELP } from "./cli/help.ts";
import { usageText } from "./cli/args.ts";
import { EXPLANATIONS, FAMILY_TITLES } from "./passes/explain.ts";

const HERE = dirname(new URL(import.meta.url).pathname);
const MAIN = join(HERE, "main.ts");
const REPO_ROOT = join(HERE, "..", "..", "..");
const BUNDLE = join(REPO_ROOT, "apps", "cli", "scripts", "bundle.ts");
const GEN_DOCS = join(REPO_ROOT, "apps", "cli", "scripts", "gen-docs.ts");

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
check("new --from-sketch graduates the sketch", run(scratch, ["new", "first-unit", "--from-sketch", "idea-x"]), 0, () => existsSync(join(scratch, ".docodego", "01-document", "01-discover", "first-unit", "spec.md")));

// --- typed documents: epics and stories are types, never folders ---
check("new --type epic lands in 01-discover", run(scratch, ["new", "epic-ride", "--type", "epic"]), 0, () => read(scratch, "01-document/01-discover/epic-ride/spec.md").includes("type: epic"));
check("new --type story lands in 02-refine", run(scratch, ["new", "story-slice", "--type", "story"]), 0, () => read(scratch, "01-document/02-refine/story-slice/spec.md").includes("type: story"));
check("epic outside its home stream is refused", run(scratch, ["new", "epic-wrong", "--type", "epic", "--stream", "02-compose/01-build"]), 2);
check("unknown --type is a usage error", run(scratch, ["new", "novel-thing", "--type", "novel"]), 2);
check("non-kebab name is a usage error", run(scratch, ["new", "bad_unit"]), 2);
check("unknown --stream is a usage error", run(scratch, ["new", "ghost", "--stream", "09-nowhere"]), 2);
check("duplicate unit is refused", run(scratch, ["new", "first-unit"]), 1);

// --- a genuinely good spec (the fixture under test) ---
write(scratch, ".docodego/01-document/01-discover/first-unit/spec.md", `---
name: first-unit
type: unit
epic: epic-ride
status: draft
---

# first-unit

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
const q = run(scratch, ["grill", "first-unit", "--json"]);
check("grill --json lists the questions", q, 0, () => {
  const parsed = JSON.parse(q.stdout) as { data?: { questions?: unknown[] } };
  return (parsed.data?.questions?.length ?? 0) >= 4;
});
const count = (JSON.parse(q.stdout) as { data?: { questions?: unknown[] } }).data?.questions?.length ?? 0;
check("grill without a TTY and without answers is refused", run(scratch, ["grill", "first-unit"]), 2);
check("grill of an unknown unit is a usage error", run(scratch, ["grill", "ghost"]), 2);
write(scratch, "answers.txt", Array.from({ length: count }, () => "yes — evidence in the unit test output").join("\n") + "\n");
check("grill pass records the round and sets status", run(scratch, ["grill", "first-unit", "--answers", "answers.txt"]), 0, () => read(scratch, "01-document/01-discover/first-unit/spec.md").includes("status: grilled") && read(scratch, "01-document/01-discover/first-unit/grill.md").includes("verdict"));
check("grill fail records the failed round and exits 1", (() => {
  write(scratch, "empty.txt", "\n");
  return run(scratch, ["grill", "first-unit", "--answers", "empty.txt"]);
})(), 1, () => read(scratch, "01-document/01-discover/first-unit/grill.md").split("verdict").length >= 3);
write(scratch, "answers.txt", Array.from({ length: count }, () => "yes — evidence in the unit test output").join("\n") + "\n");
check("grill pass again — the last verdict wins", run(scratch, ["grill", "first-unit", "--answers", "answers.txt"]), 0);

// --- score: the floor prints, the breakdown lands, weak specs stay low ---
check("score writes the breakdown and sets status", run(scratch, ["score", "first-unit"]), 0, () => {
  const raw = read(scratch, "01-document/01-discover/first-unit/score.md");
  const m = /total:\s*(\d+)/.exec(raw);
  return m !== null && Number.parseInt(m[1] ?? "0", 10) >= 60;
});
check("score of an unknown unit is a usage error", run(scratch, ["score", "ghost"]), 2);
check("new accepts a fresh template unit", run(scratch, ["new", "weak-unit"]), 0);
check("score accepts it", run(scratch, ["score", "weak-unit"]), 0);
const weakRaw = read(scratch, "01-document/01-discover/weak-unit/score.md");
const weakTotal = Number.parseInt(/total:\s*(\d+)/.exec(weakRaw)?.[1] ?? "100", 10);
if (weakTotal < 60) passed += 1;
else failed.push(`weak template spec scored ${weakTotal} — placeholders must not pass the floor`);
const wq = run(scratch, ["grill", "weak-unit", "--json"]);
const wcount = (JSON.parse(wq.stdout) as { data?: { questions?: unknown[] } }).data?.questions?.length ?? 0;
write(scratch, "weak-answers.txt", Array.from({ length: wcount }, () => "placeholder answers only to keep the record consistent").join("\n") + "\n");
check("grill keeps the weak unit consistent", run(scratch, ["grill", "weak-unit", "--answers", "weak-answers.txt"]), 0);
check("the floor bites at deliver, not at score", run(scratch, ["deliver", "weak-unit"]), 1, (r) => r.stderr.includes("G2"));

// --- deliver: the gate refuses, then passes, committing only on green ---
check("deliver fails the gate with nothing committed", run(scratch, ["deliver", "first-unit"]), 1, () => !existsSync(join(scratch, ".docodego", "01-document", "01-discover", "first-unit", "delivered.md")));
write(scratch, "proof-evidence.txt", "unit test output: 3 attempts observed, final warning logged\n");
write(scratch, ".docodego/01-document/01-discover/first-unit/proofs.md", `# proofs\n\n- proof-evidence.txt — the unit test output\n`);
check("deliver passes all four gates", run(scratch, ["deliver", "first-unit"]), 0, () => read(scratch, "01-document/01-discover/first-unit/spec.md").includes("status: delivered") && read(scratch, "04-govern/01-monitor/tracker.md").includes("delivered"));

// --- the read commands over the finished record ---
check("check holds the record together", run(scratch, ["check"]), 0);
check("lint reports nothing", run(scratch, ["lint"]), 0);
check("lint --self-check validates the rule registry", run(scratch, ["lint", "--self-check"]), 0);
check("status renders the board", run(scratch, ["status"]), 0, (r) => r.stdout.includes("first-unit"));
check("status --json is an envelope", run(scratch, ["status", "--json"]), 0, (r) => (JSON.parse(r.stdout) as { schema?: string }).schema === "docodego/status/v1");
check("status --epic narrows to the rollup", run(scratch, ["status", "--epic", "epic-ride"]), 0, (r) => r.stdout.includes("first-unit"));
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
const LAW_COMMANDS = ["init", "new", "sketch", "grill", "score", "check", "lint", "status", "deliver", "upgrade", "skill", "explain"];
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
check("envelope: new", run(scratch, ["new", "json-unit", "--json"]), 0, (r) => envelopeOk("new", r));
check("envelope: sketch", run(scratch, ["sketch", "json-idea", "--json"]), 0, (r) => envelopeOk("sketch", r));
check("envelope: grill questions", run(scratch, ["grill", "json-unit", "--json"]), 0, (r) => envelopeOk("grill", r));
write(scratch, "json-answers.txt", Array.from({ length: 12 }, () => "covered — see proofs").join("\n") + "\n");
check("envelope: grill verdict", run(scratch, ["grill", "json-unit", "--answers", "json-answers.txt", "--json"]), 0, (r) => envelopeOk("grill", r));
check("envelope: score", run(scratch, ["score", "json-unit", "--json"]), 0, (r) => envelopeOk("score", r));
check("envelope: check", run(scratch, ["check", "--json"]), 0, (r) => envelopeOk("check", r));
check("envelope: lint", run(scratch, ["lint", "--json"]), 0, (r) => envelopeOk("lint", r));
check("envelope: status", run(scratch, ["status", "--json"]), 0, (r) => envelopeOk("status", r));
check("envelope: upgrade plan", run(scratch, ["upgrade", "--json"]), 0, (r) => envelopeOk("upgrade", r));
check("envelope: deliver fail lands on stderr", run(scratch, ["deliver", "weak-unit", "--json"]), 1, (r) => {
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

rmSync(fixture, { recursive: true, force: true });
rmSync(scratch, { recursive: true, force: true });
if (failed.length > 0) {
  process.stderr.write(`conformance: ${failed.length} failed, ${passed} passed\n`);
  for (const f of failed) process.stderr.write(`  FAIL ${f}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`conformance: all ${passed} checks green\n`);
}
