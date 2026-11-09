// 580: per-command help, explain, generated docs, completions, envelopes, migrations contiguity, metrics, sequence beyond 999 — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cliVersion, specVersion, skillsIndex, ruleFiles, profiles as bundledProfiles } from "../bundled/index.ts";
import { treeFindings } from "../passes/tree.ts";
import { governanceFindings } from "../passes/governance.ts";
import { loadRecord } from "../record/load.ts";
import { COMMAND_HELP } from "../cli/help.ts";
import { usageText } from "../cli/args.ts";
import { COMPLETION_SHELLS } from "../cli/completions.ts";
import { EXPLANATIONS, FAMILY_TITLES } from "../passes/explain.ts";
import { today } from "../fsx.ts";
import { run, runRaw, read, write, check, fact, REPO_ROOT, GEN_DOCS, type Res } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(c: Ctx): Promise<void> {
  const { scratch } = c;
// --- v3: the contract surface — per-command --help, explain, generated docs ---
// The planted AGENTS.md promises "run any command with --help for its own
// contract"; these checks are that promise, enforced.
const LAW_COMMANDS = ["init", "new", "sketch", "setback", "grill", "score", "audit", "check", "lint", "status", "trace", "doctor", "deliver", "launch", "sign", "sign-off", "whoami", "metrics", "retire", "upgrade", "skill", "explain", "completions"];
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
check("explain resolves a bare gate id to its GATE page (560)", run(scratch, ["explain", "G4"]), 0, (r) => r.stdout.includes("GATE-G4") && r.stdout.includes("meaning:") && r.stdout.includes("law:") && r.stdout.includes("fix:"));
check("explain accepts the case the gates print, lower too", run(scratch, ["explain", "l2"]), 0, (r) => r.stdout.includes("GATE-L2") && r.stdout.includes("proof path"));
check("explain resolves the long form too", run(scratch, ["explain", "GATE-L5"]), 0, (r) => r.stdout.includes("how-to-run") && r.stdout.includes("fix:"));
check("explain --list carries the gate family", run(scratch, ["explain", "--list"]), 0, (r) => r.stdout.includes("GATE-G4") && r.stdout.includes("the gates"));
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

// --- v25: the surgical gate — metrics report + gate (460) ---
{
  const mx = mkdtempSync(join(tmpdir(), "docodego-conformance-metrics-"));
  const stockA = Array.from({ length: 18 }, (_, i) => `export const a${i} = ${i};`).join("\n");
  const stockB = Array.from({ length: 60 }, (_, i) => `export const b${i} = ${i};`).join("\n");
  write(mx, "src/a.ts", stockA);
  write(mx, "src/b.ts", stockB);
  const rep = run(mx, ["metrics", "report", "--root", "src", "--json"]);
  check("cli280: metrics report emits the v1 snapshot", rep, 0, (r) => r.stdout.includes("docodego/metrics/v1") && r.stdout.includes("\"codeLines\""));
  check("cli281: metrics report in text renders the structure map", run(mx, ["metrics", "report", "--root", "src"]), 0, (r) => r.stdout.includes("metrics report") && r.stdout.includes("structure"));
  write(mx, "before.json", rep.stdout);
  check("cli282: gate refuses without a baseline (DG-U122)", run(mx, ["metrics", "gate"]), 2, (r) => (r.stdout + r.stderr).includes("DG-U122"));
  const oversized = Array.from({ length: 300 }, (_, i) => `export const big${i} = ${i};`).join("\n");
  write(mx, "src/big.ts", oversized);
  check("cli283: gate refuses an oversized new file (DG-U119)", run(mx, ["metrics", "gate", "--baseline", "before.json", "--root", "src"]), 1, (r) => (r.stdout + r.stderr).includes("DG-U119") && (r.stdout + r.stderr).includes("big.ts"));
  rmSync(join(mx, "src/big.ts"));
  write(mx, "src/a.ts", stockA + "\n" + Array.from({ length: 50 }, (_, i) => `export const g${i} = ${i};`).join("\n"));
  check("cli284: gate refuses growth past the ceiling (DG-U120)", run(mx, ["metrics", "gate", "--baseline", "before.json", "--root", "src"]), 1, (r) => (r.stdout + r.stderr).includes("DG-U120"));
  write(mx, "src/a.ts", stockA);
  write(mx, "src/c.ts", Array.from({ length: 40 }, (_, i) => `export const c${i} = ${i};`).join("\n"));
  check("cli285: gate refuses an uncovered net addition (DG-U121)", run(mx, ["metrics", "gate", "--baseline", "before.json", "--root", "src"]), 1, (r) => (r.stdout + r.stderr).includes("DG-U121"));
  rmSync(join(mx, "src/b.ts"));
  check("cli286: gate passes surgical change covered by --retires", run(mx, ["metrics", "gate", "--baseline", "before.json", "--root", "src", "--retires", "b.ts"]), 0, (r) => r.stdout.includes("METRICS GATE PASS") && r.stdout.includes("credit 40"));
  rmSync(mx, { recursive: true, force: true });
}

// --- cli287+: the sequence beyond 999 — the unit-number grammar is \d{3,} ---
{
  const nb = mkdtempSync(join(tmpdir(), "docodego-conformance-seq999-"));
  const TRACKER = join(nb, ".docodego", "04-govern", "01-monitor", "tracker.md");
  const readdress = (from: string, to: string): void => {
    writeFileSync(TRACKER, readFileSync(TRACKER, "utf8").replaceAll(from, to));
    const spec = join(nb, ".docodego", "02-compose", "01-build", to, "spec.md");
    writeFileSync(spec, readFileSync(spec, "utf8").replaceAll(`name: ${from}`, `name: ${to}`));
  };
  check("cli287: init plants the numbering record", run(nb, ["init"]), 0);
  check("cli288: three-digit assignment is unchanged (010- after empty)", run(nb, ["new", "over-the-line", "--stream", "02-compose/01-build"]), 0, () => existsSync(join(nb, ".docodego", "02-compose", "01-build", "010-over-the-line", "spec.md")));
  renameSync(join(nb, ".docodego", "02-compose", "01-build", "010-over-the-line"), join(nb, ".docodego", "02-compose", "01-build", "1000-over-the-line"));
  readdress("010-over-the-line", "1000-over-the-line");
  check("cli289: assignment past a live four-digit unit yields 1010, never the DG-U012-forever collision", run(nb, ["new", "next-one", "--stream", "02-compose/01-build"]), 0, () => existsSync(join(nb, ".docodego", "02-compose", "01-build", "1010-next-one", "spec.md")));
  check("cli290: the second assignment saw 1010 and yields 1020", run(nb, ["new", "next-two", "--stream", "02-compose/01-build"]), 0, () => existsSync(join(nb, ".docodego", "02-compose", "01-build", "1020-next-two", "spec.md")));
  check("cli291: a four-digit unit carries no DG-N004 drift warning", run(nb, ["lint", "--json"]), 0, (r) => !r.stdout.includes("DG-N004"));
  check("cli292: the identity strip works at four digits (true duplicate refused)", run(nb, ["new", "over-the-line", "--stream", "02-compose/01-build"]), 1, (r) => (r.stdout + r.stderr).includes("DG-U012"));
  run(nb, ["new", "ninth", "--stream", "02-compose/01-build"]);
  renameSync(join(nb, ".docodego", "02-compose", "01-build", "1030-ninth"), join(nb, ".docodego", "02-compose", "01-build", "990-ninth"));
  readdress("1030-ninth", "990-ninth");
  {
    const rec = loadRecord(nb);
    const build = rec.units.filter((u) => u.stream === "02-compose/01-build").map((u) => u.name);
    fact("cli293: listings order 990 before 1000 — the lexical lie (1000 first) is absent", build.indexOf("990-ninth") < build.indexOf("1000-over-the-line") && build[0] === "990-ninth");
  }
  write(nb, ".docodego/02-compose/01-build/unnumbered/spec.md", `---\nname: unnumbered\ntype: unit\nstatus: draft\n---\n\n# unnumbered\n\n## intent\n\nThe DG-N004 probe: an un-numbered folder must still drift-warn.\n\n## scope\n\nIn: the warning. Out: everything else.\n\n## acceptance\n\n- AC1: the naming pass names this folder.\n\n## threats\n\n- the probe drifts -> the suite names it\n`);
  check("cli294: DG-N004 still fires for a genuinely un-numbered folder", run(nb, ["lint", "--json"]), 0, (r) => r.stdout.includes("DG-N004") && r.stdout.includes("unnumbered"));
  rmSync(join(nb, ".docodego", "02-compose", "01-build", "unnumbered"), { recursive: true, force: true });
  write(nb, ".docodego/04-govern/01-monitor/tracker.md", `| ${today()} | 1000-gone | delivered | 01-document/01-discover/1000-gone/spec.md |\n`);
  check("cli295: a tracker-only four-digit number stays spent (1010 assigned, not 1000)", run(nb, ["new", "gone-too", "--stream", "01-document/01-discover"]), 0, () => existsSync(join(nb, ".docodego", "01-document", "01-discover", "1010-gone-too", "spec.md")) && !existsSync(join(nb, ".docodego", "01-document", "01-discover", "1000-gone")));
  check("cli296: a pre-numbered four-digit name is honored, never double-numbered", run(nb, ["new", "1010-late", "--stream", "02-compose/01-build"]), 0, () => existsSync(join(nb, ".docodego", "02-compose", "01-build", "1010-late", "spec.md")));
  // retire a delivered four-digit unit: the tomb's behavior name carries the identity, not the number
  write(nb, ".docodego/02-compose/01-build/1010-late/spec.md", "---\nname: 1010-late\ntype: unit\nstatus: delivered\n---\n\n# 1010-late\n");
  write(nb, ".docodego/02-compose/01-build/1010-late/grill.md", "# grill\n");
  write(nb, ".docodego/02-compose/01-build/1010-late/score.md", "# score\n");
  write(nb, ".docodego/02-compose/01-build/1010-late/proofs.md", "# proofs — 1010-late\n\n- AC1 — the run: `02-compose/01-build/1010-late/proofs/run.txt`\n");
  write(nb, ".docodego/02-compose/01-build/1010-late/proofs/run.txt", "proof run output\n");
  write(nb, ".docodego/02-compose/01-build/1010-late/delivered.md", "# delivered\n");
  check("cli297: retiring a four-digit unit writes a-late — identity without the sequence number", run(nb, ["retire", "1010-late"]), 0, () => existsSync(join(nb, ".docodego", "system", "behavioral", "a-late", "spec.md")));
  rmSync(nb, { recursive: true, force: true });
  // three-digit regression on a second fresh record: nothing below 1000 moved
  const nb2 = mkdtempSync(join(tmpdir(), "docodego-conformance-seq999-regression-"));
  check("cli298: init plants the regression record", run(nb2, ["init"]), 0);
  check("cli299: first assignment is 010-", run(nb2, ["new", "first", "--stream", "02-compose/01-build"]), 0, () => existsSync(join(nb2, ".docodego", "02-compose", "01-build", "010-first", "spec.md")));
  check("cli300: second assignment is 020- (step of ten unchanged)", run(nb2, ["new", "second", "--stream", "02-compose/01-build"]), 0, () => existsSync(join(nb2, ".docodego", "02-compose", "01-build", "020-second", "spec.md")));
  {
    const rec = loadRecord(nb2);
    const build = rec.units.filter((u) => u.stream === "02-compose/01-build").map((u) => u.name);
    fact("cli301: three-digit listings keep today's order", build[0] === "010-first" && build[1] === "020-second");
  }
  rmSync(nb2, { recursive: true, force: true });
}

// --- 650: the workflow least-privilege pin (enhancement 7's verifiable
// half) — the permission blocks are asserted byte-exactly, so widening
// the write surface fails the suite; the files live outside the payload
// boundary, so these facts read the repo root directly ---
{
  const repoRoot = join(import.meta.dirname, "../../../..");
  const release = readFileSync(join(repoRoot, ".github/workflows/release.yml"), "utf8");
  const ci = readFileSync(join(repoRoot, ".github/workflows/ci.yml"), "utf8");
  fact("650: release.yml's write surface is exactly contents:write at the top, scoped reads + id-token on the npm job", release.includes("permissions:\n  contents: write\n") && release.includes("permissions:\n      contents: read\n      id-token: write\n"));
  fact("650: ci.yml declares no permissions — the default read-only surface", !ci.includes("permissions:"));
  fact("650: both npm publishes carry --provenance (the evidence law holds in CI)", release.split("npm publish --provenance").length - 1 === 2);
}
}
