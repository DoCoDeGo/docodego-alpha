// 580: init, refusal, force-fill, sketch graduation, typed docs, the genuinely good spec, grill, score, deliver, the read commands, trace, retire, number-forever, doctor, the README replay — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sha16 } from "../fsx.ts";
import { profiles as bundledProfiles } from "../bundled/index.ts";
import { run, runRaw, read, write, check, fact, countOrFail, MAIN } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(c: Ctx): Promise<void> {
  const { scratch } = c;
// --- init: plant, refuse, force-fill ---
check("init plants the record", run(scratch, ["init"]), 0, () => existsSync(join(scratch, ".docodego", "README.md")));
{
  const ag = mkdtempSync(join(tmpdir(), "docodego-conformance-init-split-"));
  const r = runRaw(ag, process.execPath, [MAIN, "init"]);
  fact("the planted line names record files, agent files, and skills separately", /planted \d+ record file\(s\) under \.docodego\/ \+ \d+ agent file\(s\) · skills installed: \d+/.test(r.stderr) && !/planted \d+ file\(s\);/.test(r.stderr));
  rmSync(ag, { recursive: true, force: true });
}
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
check("new's line names the scaffolded unit beside its spec path (570)", run(scratch, ["new", "015-named-scaffold", "--type", "story"]), 0, (r) => r.stdout.includes("unit 015-named-scaffold scaffolded — spec:") && r.stdout.includes("spec.md"));

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
write(scratch, "structured.txt", "GQ-1: adds a retry with backoff to the webhook sender\nGQ-2: the unit test counts attempts; its output is recorded in proofs.md\nGQ-3: retry storms — capped at three attempts with jittered backoff\nGQ-4: queue persistence stays out of scope\nGQ-5: none — new ground\nGQ-AC1: |\n  the unit test counts exactly three attempts on a failing send\nGQ-AC2: |-\n  the final warning log line is asserted in the same test\n");
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
countOrFail(weakTotal < 60, `weak template spec scored ${weakTotal} — placeholders must not pass the floor`);
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
check("check's green line states its verified scope (570)", run(scratch, ["check"]), 0, (r) => r.stdout.includes("record holds together") && r.stdout.includes("unit(s) walked") && r.stdout.includes("0 findings"));
check("lint reports nothing", run(scratch, ["lint"]), 0);
check("lint --self-check validates the rule registry", run(scratch, ["lint", "--self-check"]), 0);
check("status renders the board", run(scratch, ["status"]), 0, (r) => r.stdout.includes("010-first-unit"));
check("status's counter line is labeled by current status (570)", run(scratch, ["status"]), 0, (r) => r.stdout.includes("by current status: draft"));
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
write(qs, "answers.txt", "capped exponential backoff, three attempts\nthe unit test counts attempts\nretry storms — capped at three attempts with jittered backoff\nqueue persistence stays out of scope\nnone — new ground\nthe unit test counts exactly three attempts on a failing send\nthe final warning log line is asserted in the same test\n");
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
}
