// 580: gate-rows, event order, stale-proofs, research, grill mode, reuse warning, deliver flip, triage, vocabulary packs, skill-add hardening, branch upgrade — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordFiles, agentsMd, specVersion, vocabularies, VOCABULARY_NAMES, vocabularyPack } from "../bundled/index.ts";
import { ALL_STREAMS } from "../record/streams.ts";
import { validateVocabularyPack } from "../record/vocabulary.ts";
import { run, runRaw, read, write, check, fact } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(_c: Ctx): Promise<void> {
// --- v2d: the gate-rows law ships and teaches (300) ---
fact("the payload's AGENTS.md teaches the gate-rows law", agentsMd().includes("Gate rows ride the unit's commit"));
{
  const { teachGateRowsHome } = await import("../versioning/migrations.ts");
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
  const { teachEventOrder } = await import("../versioning/migrations.ts");
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
  const proofsPath = join(".docodego", "02-compose", "01-build", "early-unit", "proofs.md");
  write(g, proofsPath, "- AC — the evidence file proves it: `evidence.txt`\n- supersession (2026-01-05, unit other-unit) — the evidence describes the delivery-day tree on purpose; the drift is declared, not silent\n");
  const declared = run(g, ["check"]);
  write(g, proofsPath, "- AC — the evidence file proves it: `evidence.txt`\n- supersession row that mentions the drift but carries no date — prose, not the row the gate recognizes\n");
  const undated = run(g, ["check"]);
  fact("a dated supersession row declares the drift on purpose — the light stays quiet (610)", !declared.stdout.includes("DG-C017"));
  fact("undated prose cannot quiet the light — the row must carry its date (610)", undated.stdout.includes("DG-C017"));
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
  write(gh, "ans.txt", "GQ-1: the intent holds\nGQ-2: by the proofs\nGQ-3: none\nGQ-4: none\nGQ-5: none — new ground\nGQ-AC1: by the capture\nGQ-AC2: same\n");
  check("grillmode: a plain round", run(gh, ["grill", "010-mode-unit", "--answers", "ans.txt"]), 0, () => {
    const md = read(gh, join("01-document", "01-discover", "010-mode-unit", "grill.md"));
    return md.includes("round: self-grilled — the agent answered its own questions");
  });
  write(gh, "ans.txt", "GQ-1: the intent holds\nGQ-2: by the proofs\nGQ-3: none\nGQ-4: none\nGQ-5: none — new ground\nGQ-AC1: by the capture\nGQ-AC2: same\n");
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
  write(rh, "ans.txt", "GQ-1: holds\nGQ-2: by proofs\nGQ-3: none\nGQ-4: none\nGQ-5: none — new ground\nGQ-AC1: captured\nGQ-AC2: same\n");
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
  write(ph, "ans.txt", "GQ-1: holds\nGQ-2: by proofs\nGQ-3: none\nGQ-4: none\nGQ-5: none — new ground\nGQ-AC1: captured\nGQ-AC2: same\n");
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
check("init plants the record's gitignore (var/ stands, nothing else ignored)", run(vd, ["check"]), 0, () => read(vd, ".gitignore").includes("var/") && !read(vd, ".gitignore").includes("*.new"));
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
}
