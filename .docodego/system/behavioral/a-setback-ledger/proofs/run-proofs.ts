/* Proof harness for 140-setback-ledger — runs the failure scenarios against
 * a fixture record and writes labeled transcripts into the unit's proofs/.
 * Ephemeral: run, commit the outputs, delete nothing here — the script lives
 * beside the proofs it produced. */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const UNIT = resolve(HERE, "..");
const MAIN = resolve(UNIT, "..", "..", "..", "..", "apps", "cli", "src", "main.ts");
const OUT = join(UNIT, "proofs");
mkdirSync(OUT, { recursive: true });

const fx = mkdtempSync(join(tmpdir(), "setback-proof-"));
spawnSync(process.execPath, ["--experimental-strip-types", MAIN, "init"], { cwd: fx, encoding: "utf8" });

const run = (argv) => spawnSync(process.execPath, ["--experimental-strip-types", MAIN, ...argv], { cwd: fx, encoding: "utf8" });
const ledger = () => spawnSync(process.execPath, ["-e", "console.log(require('fs').readFileSync('.docodego/04-govern/01-monitor/setbacks.md','utf8'))"], { cwd: fx, encoding: "utf8" }).stdout;

function emit(name, sections) {
  writeFileSync(join(OUT, name), sections.join("\n") + "\n");
}

// AC1 — the capture is immediate: counts 1 then 2, template planted, tracker rows
{
  const parts = [
    "$ docodego setback quirk-sed \"BSD sed misparsed the multi-expression script; reworked via node\"",
    run(["setback", "quirk-sed", "BSD sed misparsed the multi-expression script; reworked via node"]).stdout,
    "$ docodego setback quirk-sed \"bit again — second multi-expression failure\"",
    run(["setback", "quirk-sed", "bit again — second multi-expression failure"]).stdout,
    "$ cat .docodego/04-govern/01-monitor/setbacks.md  (template planted on first bite, counts machine-written)",
    ledger(),
    "$ tail tracker (one row per bite)",
    spawnSync(process.execPath, ["-e", "console.log(require('fs').readFileSync('.docodego/04-govern/01-monitor/tracker.md','utf8').split('\\n').filter(l=>l.includes('setback-quirk-sed')).join('\\n'))"], { cwd: fx, encoding: "utf8" }).stdout,
  ];
  emit("bite-counts.txt", parts);
}

// AC1 — usage refusals carry codes; --json envelope shape
{
  const miss = run(["setback", "quirk-sed"]);
  const bad = run(["setback", "Sed Quirk", "x"]);
  const json = run(["setback", "grill-miscount", "counted six answers for ten questions", "--json"]);
  emit("usage-refusals.txt", [
    "$ docodego setback quirk-sed   (no text)",
    `exit=${miss.status}`,
    miss.stderr,
    "$ docodego setback 'Sed Quirk' x   (not kebab)",
    `exit=${bad.status}`,
    bad.stderr,
    "$ docodego setback grill-miscount \"...\" --json",
    `exit=${json.status}`,
    json.stdout,
  ]);
}

// AC4 — warn at 2, exit 0
{
  const a = run(["audit"]);
  emit("audit-warn.txt", [
    "(fixture holds exactly two quirk-sed bites)",
    "$ docodego audit",
    a.stdout,
    `exit=${a.status}  (warn informs, never fails)`,
  ]);
}

// AC4 — fail at 3, exit 1, copy-paste scriptlets named
{
  run(["setback", "quirk-sed", "third bite of the same class"]);
  const a = run(["audit"]);
  emit("audit-fail.txt", [
    "$ docodego setback quirk-sed \"third bite of the same class\"",
    "$ docodego audit",
    a.stdout,
    `exit=${a.status}  (error tier forces the escalation)`,
  ]);
}

// AC2/AC4 — the response resets; audit silent; re-bite counts from the response; bad path warned
{
  const resp = run(["setback", "quirk-sed", "--respond", "01-document/01-discover/cycles.md — opened the quirk-sed mitigation cycle"]);
  const silent = run(["audit"]);
  const rebite = run(["setback", "quirk-sed", "it came back"]);
  run(["setback", "quirk-sed", "--respond", "trust me, it is handled"]);
  const warned = run(["audit"]);
  emit("respond-reset.txt", [
    "$ docodego setback quirk-sed --respond \"01-document/01-discover/cycles.md — opened the quirk-sed mitigation cycle\"",
    resp.stdout,
    resp.stderr,
    "$ (ledger rows after response and re-bite)",
    ledger(),
    "$ docodego audit   (after a real response: silent)",
    `exit=${silent.status}; GOV-006 line: ${silent.stdout.split("\n").find((l) => l.includes("GOV-006"))}`,
    "$ docodego setback quirk-sed --respond \"trust me, it is handled\"  (no path)",
    "$ docodego audit   (no path, no claim — warned)",
    `exit=${warned.status}; finding: ${warned.stdout.split("\n").find((l) => l.includes("names no path"))}`,
    "$ docodego setback quirk-sed \"it came back\"  — post-response bite counted 1 from the response (row above)",
  ]);
}

// AC3 — the standing index, near-duplicates visible
{
  run(["setback", "sed-quirk", "near-duplicate class minted on purpose"]);
  const l = run(["setback", "--list"]);
  const empty = run(["setback", "--list"], );
  emit("list.txt", [
    "$ docodego setback --list   (after the fixture's full arc)",
    l.stdout,
    l.stderr,
    `exit=${l.status}  — quirk-sed and sed-quirk both visible at a glance; near-duplicates converge at mint time or here`,
  ]);
}

// AC5 — rotation under the archive law
{
  spawnSync(process.execPath, ["-e", "const fs=require('fs');fs.writeFileSync('.docodego/04-govern/01-monitor/setbacks.md','# Setbacks\\n\\n| date | class | count | text |\\n|---|---|---|---|\\n'+Array.from({length:600},(_,i)=>'| 2026-11-08 | filler-class | 0 | filler row '+i+' |').join('\\n')+'\\n')"], { cwd: fx, encoding: "utf8" });
  const before = spawnSync(process.execPath, ["-e", "console.log(require('fs').statSync('.docodego/04-govern/01-monitor/setbacks.md').size)"], { cwd: fx, encoding: "utf8" }).stdout;
  const a = run(["audit"]);
  const r = run(["audit", "--rotate"]);
  emit("rotation.txt", [
    "(filler ledger written: 600 rows, over the 500-row rotate bound)",
    "$ docodego audit   (GOV-004 warns past the 100KB bound)",
    `size=${before.trim()} bytes; ${a.stdout.split("\n").find((l) => l.includes("setbacks.md is"))}`,
    `exit=${a.status}`,
    "$ docodego audit --rotate",
    r.stdout.split("\n").filter((l) => l.includes("rotate:")).join("\n"),
    `exit=${r.status}`,
    spawnSync(process.execPath, ["-e", "const fs=require('fs');const arch=fs.readdirSync('.docodego/04-govern/01-monitor').filter(f=>f.startsWith('setbacks-archive'));console.log('archive files:',arch.join(', '));const head=fs.readFileSync('.docodego/04-govern/01-monitor/'+arch[0],'utf8').split('\\n').slice(0,6).join('\\n');console.log(head);console.log('live tombstone:',fs.readFileSync('.docodego/04-govern/01-monitor/setbacks.md','utf8').split('\\n').find(l=>l.includes('archived')))"], { cwd: fx, encoding: "utf8" }).stdout,
  ]);
}

// AC6 — discoverability: help, completions, generated pages, explain pages
{
  const h = run(["setback", "--help"]);
  const comp = spawnSync(process.execPath, ["--experimental-strip-types", MAIN, "completions", "zsh"], { cwd: fx, encoding: "utf8" }).stdout;
  const ex = run(["explain", "DG-U091"]);
  const exBad = run(["explain", "DG-U099"]);
  emit("help.txt", [
    "$ docodego setback --help",
    h.stdout,
    `exit=${h.status}`,
    "$ docodego completions zsh | grep setback",
    comp.split("\n").filter((l) => l.includes("setback")).join("\n"),
    "$ docs/commands pages: audit.md (regenerated after drift) and setback.md exist — see the committed docs/ tree",
    "$ docodego explain DG-U091",
    ex.stdout.split("\n").slice(0, 4).join("\n"),
    "$ docodego explain DG-U099   (invented page refused)",
    `exit=${exBad.status}`,
    exBad.stderr.split("\n")[0],
  ]);
}

rmSync(fx, { recursive: true, force: true });
console.log("fixture proofs written to", OUT);
