/** `skill` — the craft index: list (audit), add (bundled or opt-in remote),
 * remove. The lockfile (.docodego/skills-lock.json) is the evidence of what
 * is installed; `list` re-verifies every installed folder digest against it
 * and exits 1 on mismatch. Remote adds are opt-in: shallow git clone into a
 * temp dir, the skill folder located by SKILL.md, copied in, sha256 recorded.
 * A skill that is already installed is never silently overwritten: unchanged
 * bytes are a calm no-op; differing bytes refuse and land as `<name>.new/`
 * unless --force names explicit human intent.
 * Exit codes: 0 ok · 1 failure/mismatch · 2 usage · 3 record corrupt. */
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdtempSync, readdirSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Args, Io, SkillLockEntry, SkillsLock } from "../types.ts";
import { isDir, readText } from "../fsx.ts";
import { loadRecord, RecordFatal } from "../record/load.ts";
import { PROFILES, profiles as profileMap, skillFiles, skillsIndex } from "../bundled/index.ts";
import { digestSkillDir, emptyLock, LOCK_REL, plantSkill, readLock, SKILL_NAME_OK, verifyInstalled, writeLock } from "../skills/lock.ts";
import { complain } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const sub = args.pos[0];
  if (sub === "list") return list(args, io);
  if (sub === "add") return add(args, io);
  if (sub === "remove") return remove(args, io);
  return complain(args.json, io, { severity: "error", code: "DG-U070", message: "usage: docodego skill list [--json] | skill add <name> [--from <url>] [--force] | skill remove <name>" }, 2, "usage");
}

/** The lockfile: missing -> empty (nothing installed yet); corrupt -> exit 3. */
function lockOrFatal(root: string): SkillsLock {
  const raw = readText(join(root, LOCK_REL));
  if (raw === null) return emptyLock(0);
  try {
    return JSON.parse(raw) as SkillsLock;
  } catch {
    throw new RecordFatal({ severity: "error", code: "DG-R007", message: `${LOCK_REL} is not valid JSON — the record is corrupt`, file: LOCK_REL });
  }
}

function list(args: Args, io: Io): number {
  const rec = loadRecord(process.cwd());
  const lock = lockOrFatal(rec.root);
  const checks = verifyInstalled(rec.root, lock);
  const mismatches = checks.filter((c) => !c.ok).map((c) => c.name);
  if (mismatches.length > 0) {
    return complain(args.json, io, { severity: "error", code: "DG-K001", message: `skill integrity mismatch: ${mismatches.join(", ")} — installed folders differ from the lockfile digests; investigate before trusting them` }, 1, "skill");
  }
  const index = skillsIndex().map((s) => ({ name: s.name, version: s.version, installed: lock.installed.some((e) => e.name === s.name), defaultFor: s.defaultFor }));
  if (args.json) {
    io.out(JSON.stringify(envelope("skill", { index, installed: lock.installed, profiles: profileMap() }), null, 2));
  } else {
    io.out(index.map((s) => `  ${s.installed ? "[installed]" : "[          ]"} ${s.name} v${s.version}${s.defaultFor.length > 0 ? `  (${s.defaultFor.join(", ")})` : ""}`).join("\n"));
    io.err(`profiles: ${PROFILES.join(" · ")} — installed: ${lock.installed.map((e) => e.name).join(", ") || "(none)"}`);
  }
  return 0;
}

function add(args: Args, io: Io): number {
  const name = args.pos[1];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U071", message: "usage: docodego skill add <name> [--from <url>] [--force]" }, 2, "usage");
  }
  if (!SKILL_NAME_OK.test(name)) {
    return complain(args.json, io, { severity: "error", code: "DG-U074", message: `invalid skill name '${name}' — names are letters/digits/./_/- only (no paths, no traversal)` }, 2, "usage");
  }
  if (args.from !== undefined && (/^-/.test(args.from) || !/^(https|ssh|git|file):\/\//.test(args.from))) {
    return complain(args.json, io, { severity: "error", code: "DG-U075", message: `unsupported --from source — use an https://, ssh://, git:// or file:// URL (bare paths and ext::/fd:: transports are refused before git runs)` }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const lock = lockOrFatal(rec.root);
  const incoming = incomingSkill(args, io, rec.root, name);
  if (incoming === null) return args.from !== undefined ? 1 : 2;
  const { files, ...entry } = incoming;
  const skillDir = join(rec.root, "..", ".agents", "skills", name);
  const alreadyOnDisk = isDir(skillDir);
  const recorded = lock.installed.find((e) => e.name === name);
  if (alreadyOnDisk && digestSkillDir(skillDir) === incoming.integrity) {
    if (args.json) io.out(JSON.stringify(envelope("skill", { installed: entry, changed: false }), null, 2));
    else io.out(`${name} v${incoming.version} already installed, unchanged`);
    return 0;
  }
  if ((alreadyOnDisk || recorded !== undefined) && !args.force) {
    plantSkill(rec.root, `${name}.new`, files, false);
    io.err(`refusing: '${name}' exists${recorded !== undefined ? ` in ${LOCK_REL}` : " on disk"} and differs — incoming copy planted at .agents/skills/${name}.new/ for comparison; pass --force to replace`);
    return 1;
  }
  plantSkill(rec.root, name, files, args.force);
  lock.installed = lock.installed.filter((e) => e.name !== name);
  lock.installed.push(entry);
  writeLock(rec.root, lock);
  if (args.json) io.out(JSON.stringify(envelope("skill", { installed: entry, changed: true }), null, 2));
  else io.out(`installed ${name} v${incoming.version} (source ${incoming.source}, ${incoming.integrity.slice(0, 19)}…)`);
  return 0;
}

function remove(args: Args, io: Io): number {
  const name = args.pos[1];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U073", message: "usage: docodego skill remove <name>" }, 2, "usage");
  }
  if (!SKILL_NAME_OK.test(name)) {
    return complain(args.json, io, { severity: "error", code: "DG-U074", message: `invalid skill name '${name}' — names are letters/digits/./_/- only (no paths, no traversal)` }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const lock = lockOrFatal(rec.root);
  if (!lock.installed.some((e) => e.name === name)) {
    return complain(args.json, io, { severity: "error", code: "DG-K002", message: `skill '${name}' is not in ${LOCK_REL} — nothing to remove` }, 1, "skill");
  }
  lock.installed = lock.installed.filter((e) => e.name !== name);
  writeLock(rec.root, lock);
  rmSync(join(rec.root, "..", ".agents", "skills", name), { recursive: true, force: true });
  if (args.json) io.out(JSON.stringify(envelope("skill", { removed: name }), null, 2));
  else io.out(`removed ${name} (folder + lockfile entry)`);
  return 0;
}

/** The incoming skill: bundled by default, remote with --from <git-url>. */
function incomingSkill(args: Args, io: Io, root: string, name: string): SkillLockEntry & { files: Record<string, string> } | null {
  if (args.from !== undefined) return fetchRemote(args, io, name);
  const idx = skillsIndex().find((s) => s.name === name);
  if (idx === undefined) {
    complain(args.json, io, { severity: "error", code: "DG-U072", message: `unknown skill '${name}' — bundled skills: ${skillsIndex().map((s) => s.name).join(", ")} (remote sources need --from <git-url>)` }, 2, "usage");
    return null;
  }
  return { name: idx.name, version: idx.version, source: "bundled", integrity: idx.integrity, files: skillFiles(name) };
}

/** Opt-in remote: shallow clone into a temp dir, locate <name>/SKILL.md by
 * frontmatter name, copy the folder in, record the digest (computed over the
 * exact bytes that get planted, so list's re-verify matches). The source URL
 * is validated by the caller before this runs — only named transports reach
 * git, so ext::/fd:: and option-shaped strings never do. Symlinks inside the
 * cloned tree are skipped (lstat), never followed. */
function fetchRemote(args: Args, io: Io, name: string): (SkillLockEntry & { files: Record<string, string> }) | null {
  const tmp = mkdtempSync(join(tmpdir(), "docodego-skill-"));
  try {
    const clone = spawnSync("git", ["clone", "--depth", "1", args.from ?? "", tmp], { encoding: "utf8", timeout: 60000 });
    if (clone.status !== 0) {
      complain(args.json, io, { severity: "error", code: "DG-K003", message: `git clone failed: ${(clone.stderr ?? "").trim().split("\n")[0]}` }, 1, "usage");
      return null;
    }
    const dir = findSkillDir(tmp, name);
    if (dir === null) {
      complain(args.json, io, { severity: "error", code: "DG-K004", message: `no skill folder named '${name}' (a folder with SKILL.md whose frontmatter name is '${name}') in ${args.from}` }, 1, "usage");
      return null;
    }
    const files: Record<string, string> = {};
    for (const rel of walkDir(dir)) files[rel] = readFileSync(join(dir, rel), "utf8");
    const version = frontmatter(files["SKILL.md"] ?? "", "version") || "0.0.0";
    return { name, version, source: args.from ?? "", integrity: digestSkillDir(dir), files };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Depth-first search for a directory whose SKILL.md frontmatter names `name`.
 * Symlinked entries are skipped, not followed — a cloned tree can only offer
 * what it actually contains. */
function findSkillDir(root: string, name: string): string | null {
  for (const e of readdirSync(root).sort()) {
    const p = join(root, e);
    const st = lstatSync(p, { throwIfNoEntry: false });
    if (st === undefined || st.isSymbolicLink() || !st.isDirectory() || e === ".git") continue;
    const skillMd = join(p, "SKILL.md");
    if (existsSync(skillMd) && frontmatter(readFileSync(skillMd, "utf8"), "name") === name) return p;
    const nested = findSkillDir(p, name);
    if (nested !== null) return nested;
  }
  return null;
}

/** Relative paths of all files under `dir`, sorted, depth-first. Symlinks are
 * skipped (not followed): neither arbitrary reads nor link cycles survive. */
function walkDir(dir: string, base = ""): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir).sort()) {
    const p = join(dir, e);
    const st = lstatSync(p, { throwIfNoEntry: false });
    if (st === undefined || st.isSymbolicLink()) continue;
    const rel = base === "" ? e : `${base}/${e}`;
    if (st.isDirectory()) out.push(...walkDir(p, rel));
    else out.push(rel);
  }
  return out;
}

/** Frontmatter scalar reader (name / version / description). */
function frontmatter(src: string, key: string): string {
  const line = src.split("\n").find((l) => l.startsWith(`${key}:`));
  return line === undefined ? "" : line.slice(key.length + 1).trim();
}
