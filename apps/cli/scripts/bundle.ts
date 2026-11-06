/** bundle — the build-time bundler. The LIVE folders are the single source of
 * truth (.docodego/, AGENTS.md, .agents/); this script embeds them into the
 * CLI as a generated payload with hashes and a version stamp.
 *
 * Modes:
 *   (default)      build — recompute the bundle; run the bump guard; emit
 *                  src/bundled/payload.ts + src/bundled/manifest.json
 *   --verify       recompute and compare to the committed bundle; exit 1 on drift
 *
 * Reproducible embeds: no timestamps, no absolute paths — identical sources
 * produce identical bundle bytes, which is what makes drift checks possible.
 *
 * Run: node --experimental-strip-types scripts/bundle.ts
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validateVocabularyPack, type VocabularyPack } from "../src/record/vocabulary.ts";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..", "..");
const PAYLOAD_TS = join(ROOT, "apps", "cli", "src", "bundled", "payload.ts");
const MANIFEST_JSON = join(ROOT, "apps", "cli", "src", "bundled", "manifest.json");

/** Exclusions from the user payload — committed, documented law:
 * - .docodego/.standard/guidelines/**  — authored research, provenance-local; never shipped.
 * - any .docodego folder containing a spec.md — unit folders are user state.
 * - .docodego/04-govern/01-monitor/tracker.md — planted fresh from a constant; our history is not their history.
 * - .agents/profiles.json — compiled into the payload's profiles field, not duplicated as a file.
 * (.docodego/.standard/manifest.json IS bundled as the manifest-field contract, but
 * init/upgrade never plant it — the engine owns that file in a user record.) */
const EXCLUDE_FILES = new Set([
  ".docodego/04-govern/01-monitor/tracker.md",
  ".agents/profiles.json",
]);
const EXCLUDE_PREFIX = ".docodego/.standard/guidelines/";

const sha256 = (s: string): string => createHash("sha256").update(s).digest("hex");

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir).sort()) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function collect(): Map<string, string> {
  const files = new Map<string, string>();
  const roots = [join(ROOT, ".docodego"), join(ROOT, ".agents")];
  for (const root of roots) {
    for (const abs of walk(root)) {
      const rel = relative(ROOT, abs).split("\\").join("/");
      if (rel.startsWith(EXCLUDE_PREFIX) || EXCLUDE_FILES.has(rel)) continue;
      // a folder containing a spec.md is a unit — user state, never bundled
      if (rel.startsWith(".docodego/") && existsSync(join(dirname(abs), "spec.md"))) continue;
      files.set(rel, readFileSync(abs, "utf8"));
    }
  }
  const agentsMd = join(ROOT, "AGENTS.md");
  if (!existsSync(agentsMd)) throw new Error("AGENTS.md missing at repo root — it is part of the bundle");
  files.set("AGENTS.md", readFileSync(agentsMd, "utf8"));
  return new Map([...files].sort(([a], [b]) => (a < b ? -1 : 1)));
}

/** sha256 over the sorted relative paths — the record's shape, content-blind. */
const structureHashOf = (paths: string[]): string => sha256(paths.join("\n"));

/** sha256 over a skill folder: relpath + NUL + bytes per file, sorted — the
 * same algorithm the runtime uses to re-verify installed skills. */
function skillDigest(absDir: string): string {
  const h = createHash("sha256");
  for (const abs of walk(absDir)) {
    h.update(relative(absDir, abs).split("\\").join("/"));
    h.update("\0");
    h.update(readFileSync(abs));
  }
  return `sha256:${h.digest("hex")}`;
}

/** Frontmatter scalar reader for SKILL.md (name / description / version). */
function frontmatter(src: string, key: string): string {
  const line = src.split("\n").find((l) => l.startsWith(`${key}:`));
  return line === undefined ? "" : line.slice(key.length + 1).trim();
}

function buildPayload(): Payload {
  const files = collect();
  const paths = [...files.keys()];
  const hashes: Record<string, string> = {};
  for (const [p, body] of files) hashes[p] = sha256(body);
  const rawProfiles = JSON.parse(readFileSync(join(ROOT, ".agents", "profiles.json"), "utf8")) as { profiles: Record<string, string[]> };
  const profiles = rawProfiles.profiles;
  const skillsDir = join(ROOT, ".agents", "skills");
  const skills: SkillIndexEntry[] = readdirSync(skillsDir)
    .filter((e) => statSync(join(skillsDir, e)).isDirectory() && existsSync(join(skillsDir, e, "SKILL.md")))
    .sort()
    .map((name) => {
      const src = readFileSync(join(skillsDir, name, "SKILL.md"), "utf8");
      return {
        name,
        description: frontmatter(src, "description"),
        version: frontmatter(src, "version") || "0.0.0",
        source: "bundled" as const,
        integrity: skillDigest(join(skillsDir, name)),
        defaultFor: Object.keys(profiles).filter((p) => profiles[p]?.includes(name)).sort(),
      };
    });
  const declared = JSON.parse(files.get(".docodego/.standard/manifest.json") ?? "{}") as { recordVersion?: number };
  const cli = JSON.parse(readFileSync(join(ROOT, "apps", "cli", "package.json"), "utf8")) as { version?: string };
  if (typeof declared.recordVersion !== "number") throw new Error("the record versions itself: .docodego/.standard/manifest.json needs a numeric recordVersion");
  return {
    specVersion: declared.recordVersion,
    cliVersion: cli.version ?? "0.0.0",
    structureHash: structureHashOf(paths),
    files: Object.fromEntries(files),
    hashes,
    skills,
    profiles,
    vocabularies: loadVocabularies(),
  };
}

interface SkillIndexEntry {
  name: string;
  description: string;
  version: string;
  source: "bundled";
  integrity: string;
  defaultFor: string[];
}
interface Payload {
  specVersion: number;
  cliVersion: string;
  structureHash: string;
  files: Record<string, string>;
  hashes: Record<string, string>;
  skills: SkillIndexEntry[];
  profiles: Record<string, string[]>;
  vocabularies: VocabularyPack[];
}

/** Authored data — the packs are product templates, not this repo's record:
 * generated from nothing, validated fully, embedded only when valid. A pack
 * that fails `validateVocabularyPack` fails the build here, at the gate. */
function loadVocabularies(): VocabularyPack[] {
  const dir = join(ROOT, "apps", "cli", "vocabularies");
  if (!existsSync(dir)) return [];
  const packs: VocabularyPack[] = [];
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith(".json")) continue;
    const name = f.replace(/\.json$/, "");
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(join(dir, f), "utf8"));
    } catch (e) {
      throw new Error(`vocabulary ${f}: not valid JSON (${e instanceof Error ? e.message : String(e)})`);
    }
    const { pack, errors } = validateVocabularyPack(name, parsed);
    if (!pack || errors.length > 0) {
      throw new Error(`vocabulary ${f} failed the pack law:\n  ${errors.join("\n  ")}`);
    }
    packs.push(pack);
  }
  return packs;
}

const BUMPS = ["none", "patch", "minor", "major"] as const;
type Bump = (typeof BUMPS)[number];
const rank = (b: Bump): number => BUMPS.indexOf(b);

/** Minimum bump per the synthesis table. Hashes detect; humans declare more. */
function classify(path: string, oldB: string | undefined, newB: string | undefined): { bump: Bump; note: string } {
  if (newB === undefined) {
    return path.startsWith(".agents/skills/")
      ? { bump: "minor", note: "skill removal (deprecation note required)" }
      : { bump: "major", note: "user-visible required path removed" };
  }
  if (oldB === undefined) return { bump: "minor", note: "structure: path added" };
  if (oldB === newB) return { bump: "none", note: "unchanged" };
  if (path === ".docodego/.standard/manifest.json") {
    const keysOf = (s: string): string[] => Object.keys(JSON.parse(s)).sort();
    const added = keysOf(newB).filter((k) => !keysOf(oldB).includes(k));
    const removed = keysOf(oldB).filter((k) => !keysOf(newB).includes(k));
    if (removed.length > 0) return { bump: "major", note: `manifest field(s) removed: ${removed.join(", ")}` };
    if (added.length > 0) return { bump: "minor", note: `manifest field(s) added: ${added.join(", ")}` };
    return { bump: "none", note: "manifest values changed (state/declaration); field contract unchanged" };
  }
  if (path === "AGENTS.md") {
    const removed = oldB.split("\n").filter((l) => !newB.split("\n").includes(l));
    if (removed.length > 0) return { bump: "major", note: `AGENTS.md rule line(s) removed/rewritten: ${removed.length}` };
    return { bump: "minor", note: "AGENTS.md rule line(s) added" };
  }
  if (path.endsWith("statutes.md")) return { bump: "patch", note: "statutes content changed (declare MAJOR yourself for rule-meaning changes)" };
  if (path.startsWith(".agents/skills/")) return { bump: "minor", note: "skill content updated" };
  return { bump: "patch", note: "bundled content changed" };
}

async function oldPayload(): Promise<Payload | null> {
  if (!existsSync(PAYLOAD_TS) || !existsSync(MANIFEST_JSON)) return null;
  const mod = (await import(pathToFileURL(PAYLOAD_TS).href)) as { PAYLOAD: Payload };
  return mod.PAYLOAD;
}

function driftReport(oldP: Payload, newP: Payload): { changes: [string, Bump, string][]; minBump: Bump } {
  const keys = [...new Set([...Object.keys(oldP.files), ...Object.keys(newP.files)])].sort();
  const changes: [string, Bump, string][] = [];
  for (const k of keys) {
    const c = classify(k, oldP.files[k], newP.files[k]);
    if (c.bump !== "none") changes.push([k, c.bump, c.note]);
  }
  if (oldP.specVersion !== newP.specVersion) changes.push(["specVersion (declared)", newP.specVersion > oldP.specVersion ? "none" : "major", `declared ${oldP.specVersion} -> ${newP.specVersion}`]);
  if (oldP.cliVersion !== newP.cliVersion) changes.push(["cliVersion", "patch", `package version ${oldP.cliVersion} -> ${newP.cliVersion}`]);
  const minBump = changes.reduce<Bump>((acc, [, b]) => (rank(b) > rank(acc) ? b : acc), "none");
  return { changes, minBump };
}

async function main(): Promise<number> {
  const verify = process.argv.includes("--verify");
  const fresh = buildPayload();
  const old = await oldPayload();
  if (verify) {
    if (old === null) {
      process.stderr.write("verify: no committed bundle — run scripts/bundle.ts first\n");
      return 1;
    }
    const { changes } = driftReport(old, fresh);
    const manifestOk = JSON.stringify(JSON.parse(readFileSync(MANIFEST_JSON, "utf8"))) ===
      JSON.stringify({ specVersion: old.specVersion, cliVersion: old.cliVersion, structureHash: old.structureHash, files: old.hashes });
    if (changes.length === 0 && manifestOk) {
      process.stdout.write(`bundle verify: clean — ${Object.keys(fresh.files).length} files, spec ${fresh.specVersion}, structure ${fresh.structureHash.slice(0, 12)}\n`);
      return 0;
    }
    process.stderr.write(`bundle drift: ${changes.length} change(s)${manifestOk ? "" : " + manifest.json out of sync with payload.ts"}\n`);
    for (const [p, b, note] of changes) process.stderr.write(`  ${p} — ${b} — ${note}\n`);
    return 1;
  }
  // build: bump guard against the committed bundle, then emit.
  if (old !== null) {
    const { changes, minBump } = driftReport(old, fresh);
    // cliVersion is the code axis — it never forces a record-contract bump.
    const recordChanges = changes.filter(([p]) => p !== "cliVersion" && p !== "specVersion (declared)");
    const required = recordChanges.length > 0 ? old.specVersion + 1 : old.specVersion;
    if (fresh.specVersion < required) {
      process.stderr.write(`bundle: REFUSED — declared specVersion ${fresh.specVersion} is lower than the required minimum ${required}\n`);
      for (const [p, b, note] of recordChanges) process.stderr.write(`  ${p} — minimum bump ${b} — ${note}\n`);
      process.stderr.write("bump recordVersion in .docodego/.standard/manifest.json (hashes detect, humans declare) and re-run.\n");
      return 1;
    }
    process.stdout.write(`bundle: ${changes.length} change(s), minimum bump ${minBump}, declared specVersion ${fresh.specVersion} (committed ${old.specVersion})\n`);
  } else {
    process.stdout.write(`bundle: first run — baseline emitted at specVersion ${fresh.specVersion} (guard skipped)\n`);
  }
  const ts = `/** Generated by apps/cli/scripts/bundle.ts from the LIVE folders — do not edit.
 * The single source of truth is the repo's own .docodego/, AGENTS.md, .agents/.
 * Reproducible embed: no timestamps; identical sources give identical bytes. */

import type { VocabularyPack } from "../record/vocabulary.ts";
export type { VocabularyPack };

export interface SkillIndexEntry {
  name: string;
  description: string;
  version: string;
  source: "bundled";
  integrity: string;
  defaultFor: string[];
}

export interface Payload {
  specVersion: number;
  cliVersion: string;
  structureHash: string;
  files: Record<string, string>;
  hashes: Record<string, string>;
  skills: SkillIndexEntry[];
  profiles: Record<string, string[]>;
  vocabularies: VocabularyPack[];
}

export const PAYLOAD: Payload = ${JSON.stringify(fresh, null, 2)};
`;
  mkdirSync(dirname(PAYLOAD_TS), { recursive: true });
  writeFileSync(PAYLOAD_TS, ts);
  writeFileSync(MANIFEST_JSON, `${JSON.stringify({ specVersion: fresh.specVersion, cliVersion: fresh.cliVersion, structureHash: fresh.structureHash, files: fresh.hashes }, null, 2)}\n`);
  process.stdout.write(`bundle: wrote payload.ts + manifest.json — ${Object.keys(fresh.files).length} files, structure ${fresh.structureHash.slice(0, 12)}, ${fresh.skills.length} skills\n`);
  return 0;
}

main().then((code) => {
  process.exitCode = code;
});
