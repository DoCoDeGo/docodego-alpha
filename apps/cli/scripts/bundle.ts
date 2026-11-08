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
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validateVocabularyPack, type VocabularyPack } from "../src/record/vocabulary.ts";
import { assertContiguous } from "../src/versioning/migrations.ts";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..", "..", "..");
const PAYLOAD_TS = join(ROOT, "apps", "cli", "src", "bundled", "payload.ts");
const MANIFEST_JSON = join(ROOT, "apps", "cli", "src", "bundled", "manifest.json");

/** Exclusions from the user payload — committed, documented law:
 * - .docodego/.standard/guidelines/**  — authored research, provenance-local; never shipped.
 * - any .docodego folder containing a spec.md — unit folders are user state.
 * - .docodego/04-govern/01-monitor/tracker.md — planted fresh from a constant; our history is not their history.
 * - .docodego/01-document/01-discover/intent.md + cycles.md and .docodego/04-govern/delivery-log.md —
 *   engine-owned record roots (INTENT_TEMPLATE / CYCLES_TEMPLATE / DELIVERY_LOG_TEMPLATE),
 *   planted fresh by init and the v5->v6 migration, for the same reason as the tracker.
 * - .agents/profiles.json — compiled into the payload's profiles field, not duplicated as a file.
 * (.docodego/.standard/manifest.json IS bundled as the manifest-field contract, but
 * init/upgrade never plant it — the engine owns that file in a user record.)
 *
 * THE ALLOWLIST INVERSION (160-spec7-bundling, ruled 2026-11-08) retires the
 * denylist above: apps/cli/bundle.manifest.json names exactly which files are
 * product; everything unnamed is studio-private and never embeds. A named-but-
 * missing file fails the bundle loudly — the boundary is a contract. The count
 * of unnamed files is printed honestly at every bundle run. */
const ALLOWLIST_PATH = join(ROOT, "apps", "cli", "bundle.manifest.json");

interface BundleAllowlist {
  allowlistVersion: number;
  productFiles: string[];
  introducedIn?: Record<string, number>;
}

function readAllowlist(): BundleAllowlist {
  const parsed = JSON.parse(readFileSync(ALLOWLIST_PATH, "utf8")) as BundleAllowlist;
  if (typeof parsed.allowlistVersion !== "number" || !Array.isArray(parsed.productFiles)) {
    throw new Error(`${relative(ROOT, ALLOWLIST_PATH)}: the boundary law needs { allowlistVersion: number, productFiles: string[] }`);
  }
  return parsed;
}

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

function collect(): { files: Map<string, string>; privateCount: number } {
  const allow = readAllowlist();
  const files = new Map<string, string>();
  for (const rel of allow.productFiles) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) throw new Error(`allowlisted file missing: ${rel} — the boundary is a contract; fix the allowlist or restore the file`);
    files.set(rel, readFileSync(abs, "utf8"));
  }
  // the honesty count: studio files the allowlist never considered
  let privateCount = 0;
  for (const root of [join(ROOT, ".docodego"), join(ROOT, ".agents")]) {
    for (const abs of walk(root)) {
      const rel = relative(ROOT, abs).split("\\").join("/");
      if (!files.has(rel)) privateCount += 1;
    }
  }
  return { files, privateCount };
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

/** The honesty count from the last collect — printed by both run modes. */
let lastPrivateCount = 0;

const STATUTES_REL = ".docodego/.standard/statutes.md";

/** One-time seed: sha256 of every statutes.md generation the payload ever
 * shipped, recovered once from the payload's git history (v3..v8 shipped
 * 950faefc…; v9 onward 770e570c… — the old hand-copied V8_STATUTES constant
 * hashed to the first exactly, which is how the recovery was cross-checked).
 * Carried forward from the committed payload afterwards: each recompile
 * unions the committed payload's own generation, so the next canon change
 * pairs with the mirror refresh automatically — no constants to remember. */
const STATUTES_SHIPPED_SEED: string[] = [
  "950faefc481f0276913c49c5e31b0535e5aa80f44e2f957cff771f28fdd00902",
  "770e570c911333d0d21221485bcd739cd145b1fef3bf008efcd02334850f3e3b",
];

function buildPayload(old: Payload | null): Payload {
  const { files: collected, privateCount } = collect();
  lastPrivateCount = privateCount;
  // canonical order: the structure hash and the emitted object are
  // order-sensitive; the boundary contract's row order must not matter
  const files = new Map([...collected].sort(([a], [b]) => (a < b ? -1 : 1)));
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
  const allow = readAllowlist();
  return {
    specVersion: declared.recordVersion,
    cliVersion: cli.version ?? "0.0.0",
    structureHash: structureHashOf(paths),
    allowlistVersion: allow.allowlistVersion,
    files: Object.fromEntries(files),
    hashes,
    // when each path became product: declared explicitly for the rows the
    // git history recovered; a new allowlist row stamps at the version
    // that adds it — upgrade reads this to tell create from restore
    introducedIn: Object.fromEntries(paths.map((p) => [p, allow.introducedIn?.[p] ?? declared.recordVersion])),
    statutesShippedHashes: (() => {
      const shipped = [...(old?.statutesShippedHashes ?? STATUTES_SHIPPED_SEED)];
      const prev = old?.hashes?.[STATUTES_REL];
      if (prev !== undefined && !shipped.includes(prev)) shipped.push(prev);
      return shipped;
    })(),
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
  allowlistVersion: number;
  files: Record<string, string>;
  hashes: Record<string, string>;
  introducedIn: Record<string, number>;
  statutesShippedHashes: string[];
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

/** The guard's baseline is the last DELIVERED bundle — the payload as
 * committed — never the working copy, or iterating inside one delivery
 * unit would demand a version bump per recompile. The delivered-baseline
 * rule, same law as canon build's manifest baseline (found necessary by
 * the statutes-recompile unit, 2026-11-08). A committed, unmodified
 * payload is its own baseline; a dirty one defers to HEAD; no git, no
 * baseline (the working copy stands in, honestly). The committed source
 * imports types only, so a temp copy imports clean under strip-types. */
async function oldPayload(): Promise<Payload | null> {
  if (!existsSync(PAYLOAD_TS) || !existsSync(MANIFEST_JSON)) return null;
  const rel = relative(ROOT, PAYLOAD_TS);
  const dirty = spawnSync("git", ["status", "--porcelain", "-uno", rel], { encoding: "utf8", cwd: ROOT });
  const isDirty = (dirty.stdout ?? "").trim() !== "";
  if (!isDirty) {
    const mod = (await import(pathToFileURL(PAYLOAD_TS).href)) as { PAYLOAD: Payload };
    return mod.PAYLOAD;
  }
  const ls = spawnSync("git", ["ls-files", "--full-name", rel], { encoding: "utf8", cwd: ROOT });
  const tracked = (ls.stdout ?? "").trim().split("\n")[0] ?? "";
  if (tracked === "") {
    // never committed: the working copy is all there is
    const mod = (await import(pathToFileURL(PAYLOAD_TS).href)) as { PAYLOAD: Payload };
    return mod.PAYLOAD;
  }
  const show = spawnSync("git", ["show", `HEAD:${tracked}`], { encoding: "utf8", cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
  if (show.status !== 0 || !show.stdout) return null;
  const dir = mkdtempSync(join(tmpdir(), "bundle-baseline-"));
  try {
    const tmp = join(dir, "payload.ts");
    writeFileSync(tmp, show.stdout);
    const mod = (await import(pathToFileURL(tmp).href)) as { PAYLOAD: Payload };
    return mod.PAYLOAD;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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
  const old = await oldPayload();
  const fresh = buildPayload(old);
  const honesty = `${lastPrivateCount} studio file(s) stayed private under the boundary (allowlist v${fresh.allowlistVersion})`;
  // the ladder check: a behind record must find every migration step
  // between where it is and the version this bundle ships (spec 7)
  assertContiguous(fresh.specVersion);
  if (verify) {
    if (old === null) {
      process.stderr.write("verify: no committed bundle — run scripts/bundle.ts first\n");
      return 1;
    }
    const { changes } = driftReport(old, fresh);
    const manifestOk = JSON.stringify(JSON.parse(readFileSync(MANIFEST_JSON, "utf8"))) ===
      JSON.stringify({ specVersion: old.specVersion, cliVersion: old.cliVersion, structureHash: old.structureHash, files: old.hashes });
    if (changes.length === 0 && manifestOk) {
      process.stdout.write(`bundle verify: clean — ${Object.keys(fresh.files).length} files, spec ${fresh.specVersion}, structure ${fresh.structureHash.slice(0, 12)} — ${honesty}\n`);
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
    process.stdout.write(`bundle: ${changes.length} change(s), minimum bump ${minBump}, declared specVersion ${fresh.specVersion} (committed ${old.specVersion}) — ${honesty}\n`);
  } else {
    process.stdout.write(`bundle: first run — baseline emitted at specVersion ${fresh.specVersion} (guard skipped) — ${honesty}\n`);
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
  allowlistVersion: number;
  files: Record<string, string>;
  hashes: Record<string, string>;
  introducedIn: Record<string, number>;
  statutesShippedHashes: string[];
  skills: SkillIndexEntry[];
  profiles: Record<string, string[]>;
  vocabularies: VocabularyPack[];
}

export const PAYLOAD: Payload = ${JSON.stringify(fresh, null, 2)};
`;
  mkdirSync(dirname(PAYLOAD_TS), { recursive: true });
  writeFileSync(PAYLOAD_TS, ts);
  writeFileSync(MANIFEST_JSON, `${JSON.stringify({ specVersion: fresh.specVersion, cliVersion: fresh.cliVersion, structureHash: fresh.structureHash, files: fresh.hashes }, null, 2)}\n`);
  process.stdout.write(`bundle: wrote payload.ts + manifest.json — ${Object.keys(fresh.files).length} files, structure ${fresh.structureHash.slice(0, 12)}, ${fresh.skills.length} skills, boundary v${fresh.allowlistVersion}, ${lastPrivateCount} studio file(s) stayed private\n`);
  return 0;
}

main().then((code) => {
  process.exitCode = code;
});
