/** `init` — plant the record from the BUNDLE (the repo's own live folders,
 * embedded at build time): record files, AGENTS.md, agent presets, and the
 * profile's skills, then the lockfile and the manifest. Refuses over an
 * existing record unless --force — which fills what is missing and never
 * overwrites a planted file the user may have edited; the tracker is
 * created only when absent (append-only from its first byte). */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { Args, Io, Manifest, Mode } from "../types.ts";
import { isDir, readText, today, writeText } from "../fsx.ts";
import { detect } from "../record/detect.ts";
import { MANIFEST_REL, RECORD_DIR, TRACKER_REL } from "../record/load.ts";
import { agentsMd, recordFiles, ruleFiles, specVersion, COMPOSE_LOG_TEMPLATE, DEMO_README_TEMPLATE, DEFAULT_PROFILE, PROFILES, profiles as profileMap, skillsIndex, TRACKER_TEMPLATE, INTENT_TEMPLATE, CYCLES_TEMPLATE, DELIVERY_LOG_TEMPLATE, vocabularyPack, VOCABULARY_MOTTO, VOCABULARY_NAMES } from "../bundled/index.ts";
import { COMPOSE_LOG_REL, DEMO_DIR_REL, DELIVERY_LOG_REL } from "../record/record-write.ts";
import { applyMovementGlosses, renderVocabularyMd, type VocabularyPack } from "../record/vocabulary.ts";
import { installBundledSkill, plantAgentPresets, writeLock, emptyLock, LOCK_REL } from "../skills/lock.ts";
import { emitJson } from "../emit/json.ts";

/** The engine owns these: written fresh by init, never copied from the bundle. */
const ENGINE_OWNED = new Set([MANIFEST_REL, TRACKER_REL]);

export function run(args: Args, io: Io): number {
  const mode: Mode = args.mode ?? "review";
  const root = join(process.cwd(), RECORD_DIR);
  // ADR 0013's last piece: records are born under version control — git
  // must answer before anything is planted (a record born wild is the
  // exact hiding the law forbids); the birth commit happens after planting.
  if (!gitAvailable(process.cwd())) {
    io.err(`error[DG-U140]: git is not available — nothing was planted`);
    io.err(`  records are born under version control (ADR 0013) — make git available, then re-run 'docodego init'`);
    return 1;
  }
  if (isDir(root) && !args.force) {
    io.err(`refusing: ${RECORD_DIR}/ already exists — pass --force to fill what is missing (nothing is overwritten)`);
    return 1;
  }
  // the dialect is chosen at birth: a pack re-voices the fresh plant, and is
  // refused on an existing record — the record's words are part of its history
  let pack: VocabularyPack | undefined;
  if (args.vocabulary !== undefined) {
    pack = vocabularyPack(args.vocabulary);
    if (pack === undefined) {
      process.stderr.write(`error: --vocabulary must be one of ${VOCABULARY_NAMES.join("|")}, got '${args.vocabulary}'\n`);
      return 2;
    }
    if (isDir(root)) {
      io.err(`refusing: --vocabulary is chosen at birth — 'init --force --vocabulary' would re-voice an existing record, and records are never rewritten`);
      return 1;
    }
  }
  const wanted = args.allSkills
    ? skillsIndex().filter((s) => !s.autoAdd).map((s) => s.name)
    : pickProfile(args.profile);
  if (wanted === null) return 2; // unknown --profile — message already printed
  const detection = detect(process.cwd());
  const manifest: Manifest = {
    mode,
    codeState: detection.codeState,
    pattern: "compiler-passes",
    ring: "stable",
    recordVersion: specVersion(),
    detect: detection.detect,
    ...(pack !== undefined ? { vocabulary: pack.name } : {}),
  };
  const created: string[] = [];
  const putNew = (abs: string, body: string, label: string): void => {
    if (readText(abs) === null) {
      writeText(abs, body);
      created.push(label);
    }
  };
  // the record files, preserving the live folder structure — create-only
  for (const [rel, body] of Object.entries(recordFiles())) {
    if (!ENGINE_OWNED.has(rel)) putNew(join(root, rel), body, `${RECORD_DIR}/${rel}`);
  }
  putNew(join(root, TRACKER_REL), TRACKER_TEMPLATE, `${RECORD_DIR}/${TRACKER_REL}`);
  // the honesty layer: founding intent (verbatim), the cycle log, and the
  // delivery log the gate will append to — engine-owned, like the tracker
  putNew(join(root, "01-document/01-discover/intent.md"), INTENT_TEMPLATE, `${RECORD_DIR}/01-document/01-discover/intent.md`);
  putNew(join(root, "01-document/01-discover/cycles.md"), CYCLES_TEMPLATE, `${RECORD_DIR}/01-document/01-discover/cycles.md`);
  putNew(join(root, DELIVERY_LOG_REL), DELIVERY_LOG_TEMPLATE, `${RECORD_DIR}/${DELIVERY_LOG_REL}`);
  // the compose room's integrity artifact (IMP-15): anchored at init so an
  // empty compose room truthfully means "not there yet" — the gate appends
  // its first row at this record's first delivery
  putNew(join(root, COMPOSE_LOG_REL), COMPOSE_LOG_TEMPLATE, `${RECORD_DIR}/${COMPOSE_LOG_REL}`);
  // the demonstrate room's door (IMP-15): demo/ holds one bundle per
  // delivered unit; the anchor names the convention so an empty room
  // truthfully means "not there yet"
  putNew(join(root, DEMO_DIR_REL, "README.md"), DEMO_README_TEMPLATE, `${RECORD_DIR}/${DEMO_DIR_REL}/README.md`);
  // the manifest is engine-owned metadata: refreshed on init, other keys
  // preserved — and never stamped backwards (writeManifest returns the
  // surviving stamp; a record ahead of this CLI stays ahead)
  const stamped = writeManifest(root, manifest);
  manifest.recordVersion = stamped;
  created.push(`${RECORD_DIR}/${MANIFEST_REL}`);
  if (stamped > specVersion()) {
    io.err(`warning: this record's manifest says v${stamped} — newer than this CLI's bundled spec v${specVersion()}; filled what was missing and left the stamp alone (upgrade the CLI to match)`);
  }
  // the law + the agent presets
  putNew(join(process.cwd(), "AGENTS.md"), agentsMd(), "AGENTS.md");
  created.push(...plantAgentPresets(root));
  // the rules layer: five invariant rules + the map — create-only, like
  // everything else; a rule a repo lost is restored by re-running init
  for (const [rel, body] of Object.entries(ruleFiles())) {
    putNew(join(process.cwd(), ".agents", "rules", rel), body, `.agents/rules/${rel}`);
  }
  // the profile's skills + the lockfile that audits them
  const installed: string[] = [];
  const lock = emptyLock(specVersion());
  for (const name of wanted) {
    const res = installBundledSkill(root, name, false);
    if (res === null) continue;
    lock.installed.push(res.entry);
    installed.push(name);
  }
  writeLock(root, lock);
  created.push(`${RECORD_DIR}/${LOCK_REL}`);
  // the pack's words, laid over the fresh plant: the sixteen stream lines,
  // the movement glosses on the just-planted law, and the glossary bridge
  // beside the statutes (which stay verbatim, in every dialect)
  if (pack !== undefined) {
    for (const [id, line] of Object.entries(pack.streams)) {
      writeText(join(root, `${id}/README.md`), `${line}\n`);
    }
    writeText(join(root, ".standard", "vocabulary.md"), renderVocabularyMd(pack));
    created.push(`${RECORD_DIR}/.standard/vocabulary.md`);
    const agentsAbs = join(process.cwd(), "AGENTS.md");
    const agentsBody = readText(agentsAbs);
    if (agentsBody !== null && agentsBody === agentsMd()) {
      writeText(agentsAbs, applyMovementGlosses(agentsBody, pack.movements));
    }
  }

  const detectionLine =
    `${detection.fileCount} files, git depth ${detection.detect.gitDepth}, ` +
    `tests ${detection.detect.tests}, ci ${detection.detect.ci} -> ${detection.codeState}`;
  const birth = birthCommit(process.cwd(), created);
  if (!birth.ok) {
    io.err(`error[DG-U140]: ${birth.why}`);
    return 1;
  }
  const profileName = args.allSkills ? "all-skills" : (args.profile ?? DEFAULT_PROFILE);
  if (args.json) {
    emitJson(io, "init", { created, manifest, profile: profileName, skills: installed, detection: detectionLine, git: birth.line, date: today(), ...(pack !== undefined ? { vocabulary: pack.name } : {}) });
  } else {
    const vocabNote = pack !== undefined ? `, vocabulary ${pack.name}` : "";
    io.out(`${RECORD_DIR}/ ready — mode ${mode}, code state ${detection.codeState}, record v${specVersion()}, profile ${profileName}${vocabNote}`);
    io.err(`skills installed: ${installed.length ? installed.join(", ") : "(none)"}`);
    if (pack !== undefined) io.err(`vocabulary: ${pack.name} — ${VOCABULARY_MOTTO}`);
    io.err(`detected: ${detectionLine}`);
    io.err(birth.line);
    const recordCount = created.filter((l) => l.startsWith(`${RECORD_DIR}/`)).length;
    const agentCount = created.length - recordCount;
    io.err(`planted ${recordCount} record file(s) under ${RECORD_DIR}/ + ${agentCount} agent file(s) · skills installed: ${installed.length} — existing files were kept (create-only law)`);
  }
  return 0;
}

/** The pre-flight (DG-U140): git must answer before anything is planted. */
function gitAvailable(repoRoot: string): boolean {
  const pre = spawnSync("git", ["--version"], { cwd: repoRoot, encoding: "utf8" });
  return !pre.error && pre.status === 0;
}

/** The birth (ADR 0013, unit 710): records are born under version
 * control. Pre-flight: git must answer before anything is planted — a
 * record born wild is the exact hiding the law forbids. Then git init
 * when needed, and one birth commit carrying exactly the planted paths
 * (never the operator's own files), authored by the record's handle
 * identity via -c (the founder's privacy law: handle-based noreply;
 * no global config required). `created` holds repo-root-relative paths. */
function birthCommit(repoRoot: string, created: string[]): { ok: true; line: string } | { ok: false; why: string } {
  const git = (argv: string[]) => spawnSync("git", argv, { cwd: repoRoot, encoding: "utf8" });
  const inRepo = git(["rev-parse", "--is-inside-work-tree"]);
  const existing = inRepo.status === 0 && inRepo.stdout.trim() === "true";
  if (!existing) {
    const gi = git(["init"]);
    if (gi.status !== 0) return { ok: false, why: `git init failed — nothing was planted: ${(gi.stderr || "").trim().split("\n")[0]}` };
  }
  const identity = ["-c", "user.name=DoCoDeGo", "-c", "user.email=DoCoDeGo@users.noreply.github.com"];
  for (let i = 0; i < created.length; i += 50) {
    const add = git(["add", "--", ...created.slice(i, i + 50)]);
    if (add.status !== 0) return { ok: false, why: `git add failed: ${(add.stderr || "").trim().split("\n")[0]}` };
  }
  const msg = `record birth — planted by docodego init (spec v${specVersion()})`;
  const c = git([...identity, "commit", "-m", msg, "--no-verify", "--"]);
  if (c.status !== 0) {
    const out = (c.stderr || c.stdout || "").trim();
    if (/nothing to commit|no changes added/.test(out)) return { ok: true, line: existing ? "git: already under version control — the planted files were already committed" : "git: repository initialized (nothing new to commit)" };
    return { ok: false, why: `the birth commit failed — the record IS planted but NOT under version control; make git work and commit, or remove ${RECORD_DIR}/ and re-init: ${out.split("\n")[0]}` };
  }
  return { ok: true, line: existing ? "git: birth commit added to the existing repository (only the planted files staged)" : "git: repository initialized — the birth commit is made" };
}

/** Validate --profile against the bundled profiles; null (after printing) = usage error. */
function pickProfile(name?: string): string[] | null {
  const all = profileMap();
  if (name === undefined) return all[DEFAULT_PROFILE] ?? [];
  const picked = all[name];
  if (picked === undefined) {
    process.stderr.write(`error: --profile must be one of ${PROFILES.join("|")}, got '${name}'\n`);
    return null;
  }
  return picked;
}

/** Manifest write that preserves keys a user record may already carry — and
 * never moves recordVersion backwards: a record upgraded by a newer CLI
 * stays ahead of this one, stamped Math.max(existing, incoming), with the
 * ahead-record warning upgrade prints. H2's first versioning finding:
 * spreading the incoming stamp was a silent append-only violation. */
function writeManifest(root: string, manifest: Manifest): number {
  const abs = join(root, MANIFEST_REL);
  const raw = readText(abs);
  let merged: Manifest = manifest;
  if (raw !== null) {
    try {
      const existing = JSON.parse(raw) as Manifest;
      merged = { ...existing, ...manifest };
      merged.recordVersion = Math.max(existing.recordVersion ?? 0, manifest.recordVersion);
    } catch {
      merged = manifest;
    }
  }
  writeText(abs, `${JSON.stringify(merged, null, 2)}\n`);
  return merged.recordVersion;
}
