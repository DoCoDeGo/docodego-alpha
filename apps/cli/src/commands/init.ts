/** `init` — plant the record from the BUNDLE (the repo's own live folders,
 * embedded at build time): record files, AGENTS.md, agent presets, and the
 * profile's skills, then the lockfile and the manifest. Refuses over an
 * existing record unless --force — which fills what is missing and never
 * overwrites a planted file the user may have edited; the tracker is
 * created only when absent (append-only from its first byte). */
import { join } from "node:path";
import type { Args, Io, Manifest, Mode } from "../types.ts";
import { isDir, readText, today, writeText } from "../fsx.ts";
import { detect } from "../record/detect.ts";
import { MANIFEST_REL, RECORD_DIR, TRACKER_REL } from "../record/load.ts";
import { agentsMd, recordFiles, specVersion, DEFAULT_PROFILE, PROFILES, profiles as profileMap, skillsIndex, TRACKER_TEMPLATE, INTENT_TEMPLATE, CYCLES_TEMPLATE, DELIVERY_LOG_TEMPLATE, vocabularyPack, VOCABULARY_NAMES } from "../bundled/index.ts";
import { DELIVERY_LOG_REL } from "../record/record-write.ts";
import { applyMovementGlosses, renderVocabularyMd, type VocabularyPack } from "../record/vocabulary.ts";
import { installBundledSkill, plantAgentPresets, writeLock, emptyLock, LOCK_REL } from "../skills/lock.ts";
import { envelope } from "../emit/json.ts";

/** The engine owns these: written fresh by init, never copied from the bundle. */
const ENGINE_OWNED = new Set([MANIFEST_REL, TRACKER_REL]);

export function run(args: Args, io: Io): number {
  const mode: Mode = args.mode ?? "review";
  const root = join(process.cwd(), RECORD_DIR);
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
  const wanted = args.allSkills ? skillsIndex().map((s) => s.name) : pickProfile(args.profile);
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
  // the manifest is engine-owned metadata: refreshed on init, other keys preserved
  writeManifest(root, manifest);
  created.push(`${RECORD_DIR}/${MANIFEST_REL}`);
  // the law + the agent presets
  putNew(join(process.cwd(), "AGENTS.md"), agentsMd(), "AGENTS.md");
  created.push(...plantAgentPresets(root));
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
  const profileName = args.allSkills ? "all-skills" : (args.profile ?? DEFAULT_PROFILE);
  if (args.json) {
    io.out(JSON.stringify(envelope("init", { created, manifest, profile: profileName, skills: installed, detection: detectionLine, date: today(), ...(pack !== undefined ? { vocabulary: pack.name } : {}) }), null, 2));
  } else {
    const vocabNote = pack !== undefined ? `, vocabulary ${pack.name}` : "";
    io.out(`${RECORD_DIR}/ ready — mode ${mode}, code state ${detection.codeState}, record v${specVersion()}, profile ${profileName}${vocabNote}`);
    io.err(`skills installed: ${installed.length ? installed.join(", ") : "(none)"}`);
    if (pack !== undefined) io.err(`vocabulary: ${pack.name} — words change, the contract does not`);
    io.err(`detected: ${detectionLine}`);
    io.err(`planted ${created.length} file(s); existing files were kept (create-only law)`);
  }
  return 0;
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

/** Manifest write that preserves keys a user record may already carry. */
function writeManifest(root: string, manifest: Manifest): void {
  const abs = join(root, MANIFEST_REL);
  const raw = readText(abs);
  let merged: Manifest = manifest;
  if (raw !== null) {
    try {
      merged = { ...(JSON.parse(raw) as Manifest), ...manifest };
    } catch {
      merged = manifest;
    }
  }
  writeText(abs, `${JSON.stringify(merged, null, 2)}\n`);
}
