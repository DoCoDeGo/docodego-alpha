// 580: forward-compat, skill flow, install digest, planted prose, git artifacts, compose artifact — moved verbatim from the pre-split conformance.ts; composed in order by ../conformance.ts (580-conformance-split)
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordFiles, ruleFiles, COMPOSE_LOG_TEMPLATE, profiles as bundledProfiles } from "../bundled/index.ts";
import { loadRecord } from "../record/load.ts";
import { digestFiles, digestSkillDir } from "../skills/lock.ts";
import { appendComposeLog } from "../record/record-write.ts";
import { run, runRaw, read, write, check, fact, REPO_ROOT } from "./helpers.ts";
import type { Ctx } from "./helpers.ts";

export async function area(_c: Ctx): Promise<void> {
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
  fact("the sweep reads the whole payload boundary (53 planted rows)", rows.length === 53);
  fact("the planted prose names only shipped paths — no repo-side or dead-tree references", offenders.length === 0);
}

// --- v2k: the record's machine artifacts leave git (370) ---
fact("720: the payload carries the founder-communication rule with its three fields", (() => { const r = ruleFiles()["founder-communication.md"] ?? ""; return r.includes("reader:") && r.includes("fails-when:") && r.includes("enforced-by:") && r.includes("high school kid") && r.includes("industry veteran"); })());
fact("720: the payload's rules map names the founder-communication rule", (ruleFiles()["README.md"] ?? "").includes("| founder-communication |"));
fact("the payload plants the record's gitignore under the replace-live law", (recordFiles()[".gitignore"] ?? "").includes("var/") && !(recordFiles()[".gitignore"] ?? "").includes("*.new") && (recordFiles()[".gitignore"] ?? "").includes("never lost, never hidden"));

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
}
