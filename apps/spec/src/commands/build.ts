/** build — compile the spec tree into its machine artifacts: law-index.json
 * (laws as data — the agent-era payload), a canonical SPEC.md copy, and
 * manifest.json (spec semver, sha256 structure hash, per-file checksums).
 * Deterministic by law: identical trees produce identical bytes — no
 * timestamps, fixed key order — because downstream drift checks are only as
 * good as the reproducibility underneath them. Version sanity before bytes:
 * no build moves the spec backwards, and no content change lands under an
 * unchanged version. Hashes detect, humans declare (EL-20). */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cmpVersion, loadSpec, walkMd } from "../laws.ts";
import { exitFor, emit } from "../errors.ts";
import { countsOf } from "../emit.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/build/v1";

const sha256 = (data: string | Buffer): string => createHash("sha256").update(data).digest("hex");

/** The baseline a build may not silently supersede is the last DELIVERED
 * state — the manifest as committed — never the working tree, or iterating
 * inside one delivery unit would be impossible. A committed, unmodified
 * manifest is its own baseline; anything else defers to HEAD. */
function baselineManifest(manifestPath: string): { specVersion?: string; structureHash?: string } | undefined {
  const dirty = spawnSync("git", ["status", "--porcelain", "-uno", manifestPath], { encoding: "utf8" });
  const isDirty = (dirty.stdout ?? "").trim() !== ""; // git failing yields "" — non-repos parse the file as before
  if (existsSync(manifestPath) && !isDirty) {
    try {
      return JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      return { specVersion: "unreadable" };
    }
  }
  const ls = spawnSync("git", ["ls-files", "--full-name", manifestPath], { encoding: "utf8" });
  const tracked = (ls.stdout ?? "").trim().split("\n")[0] ?? "";
  if (tracked === "") return undefined;
  const show = spawnSync("git", ["show", `HEAD:${tracked}`], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  if (show.status !== 0) return undefined;
  try {
    return JSON.parse(show.stdout ?? "");
  } catch {
    return undefined;
  }
}

export function run(args: Args, io: Io): number {
  const root = args.root ?? "spec";
  const dist = args.dist ?? "apps/spec/dist";
  const read = loadSpec(root);
  const diags: Diagnostic[] = [...read.diagnostics];

  const files = walkMd(root);
  const checksums: Record<string, string> = {};
  for (const file of files) checksums[file] = sha256(readFileSync(join(root, file)));
  const structureHash = sha256(files.map((f) => `${f} ${checksums[f] ?? ""}`).join("\n"));
  const specVersion = read.specVersion;

  if (specVersion === undefined) {
    diags.push({
      severity: "error", code: "SP-B003",
      message: "no Version stamp in SPEC.md — build refuses to write artifacts it cannot version",
      file: "SPEC.md", span: { start: { line: 5, col: 1 }, end: { line: 5, col: 120 } },
    });
  }

  // version sanity against the last delivered state (the committed manifest)
  const manifestPath = join(dist, "manifest.json");
  const prev = baselineManifest(manifestPath);
  if (prev !== undefined) {
    if (prev.specVersion === "unreadable") {
      diags.push({
        severity: "error", code: "SP-B004",
        message: `existing manifest at ${manifestPath} is not valid JSON — fix it or delete the dist folder`,
        file: "apps/spec/dist/manifest.json",
      });
    } else {
      const c = cmpVersion(prev.specVersion ?? "0.0.0", specVersion ?? "0.0.0");
      if (c > 0) {
        diags.push({
          severity: "error", code: "SP-B001",
          message: `build would move the spec backwards — the delivered state says ${prev.specVersion}, source says ${specVersion}; a downgrade is never a migration`,
          file: "SPEC.md", span: { start: { line: 5, col: 1 }, end: { line: 5, col: 120 } },
        });
      } else if (c === 0 && prev.structureHash !== undefined && prev.structureHash !== structureHash) {
        diags.push({
          severity: "error", code: "SP-B002",
          message: `the law set changed but the version did not — ${specVersion} was already delivered with a different structure`,
          file: "SPEC.md", span: { start: { line: 5, col: 1 }, end: { line: 5, col: 120 } },
        });
      }
    }
  }

  const blocked = diags.some((d) => d.severity === "error");
  const wrote: string[] = [];
  if (!blocked && specVersion !== undefined) {
    mkdirSync(dist, { recursive: true });
    writeFileSync(join(dist, "SPEC.md"), readFileSync(join(root, "SPEC.md")));
    const index = {
      schema: "docodego-spec/law-index/v1",
      specVersion,
      lawCount: read.laws.length,
      laws: read.laws.map((l) => ({
        id: l.id,
        title: l.title,
        pillar: l.pillar,
        severity: l.severity,
        "enforced-by": l.enforcedBy,
        "introduced-in": l.introducedIn,
        status: l.status,
        file: l.file,
      })),
    };
    writeFileSync(join(dist, "law-index.json"), `${JSON.stringify(index, null, 2)}\n`);
    const manifest = {
      schema: "docodego-spec/manifest/v1",
      specVersion,
      structureHash,
      fileCount: files.length,
      lawCount: read.laws.length,
      files: checksums,
    };
    writeFileSync(join(dist, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    wrote.push("SPEC.md", "law-index.json", "manifest.json");
  }

  const counts = countsOf(diags);
  emit(io, args.json, SCHEMA, {
    root, dist, specVersion, structureHash, files: files.length, laws: read.laws.length, wrote, diagnostics: diags,
  });
  if (!args.json) {
    if (diags.length > 0) {
      io.out(diags.map((d) => `spec ${d.severity}[${d.code}]: ${d.message}`).join("\n"));
    }
    io.out(
      blocked
        ? `canon build · refused — nothing written (${counts.errors} error(s))`
        : `canon build · ${files.length} file(s), ${read.laws.length} law(s), structure ${structureHash.slice(0, 12)}… → ${wrote.join(", ")}`,
    );
  }
  return exitFor(diags);
}
