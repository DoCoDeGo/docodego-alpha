/** publish — the delivered artifacts, addressed by content. One directory
 * per delivered semver under <site>/v/, each carrying the stamped SPEC,
 * the law index, the manifest, and a verification badge restating the
 * structure hash and the recomputation a reader can run. llms.txt and
 * current.txt at the root are regenerated from the directories present —
 * the version directories themselves are only ever added, never rewritten.
 * Refusals before bytes: no delivered manifest (build first), a tree ahead
 * of its dist (publish ships what was delivered), a downgrade, a
 * same-version republish with a different structure. No PDF, no search
 * gimmicks: plain files, for the machines that read specs (ADR 0012). */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cmpVersion, loadSpec } from "../laws.ts";
import { exitFor, emit } from "../errors.ts";
import { treeStructure } from "./build.ts";
import type { Args, Diagnostic, Io } from "../types.ts";

export const SCHEMA = "docodego-spec/publish/v1";

const SEMVER = /^\d+\.\d+\.\d+$/;

interface Delivered {
  specVersion?: string;
  structureHash?: string;
  lawCount?: number;
}

/** current.txt is the site's own memory: version, structure, law count. */
function readCurrent(site: string): { version?: string; structureHash?: string } {
  const out: { version?: string; structureHash?: string } = {};
  try {
    for (const line of readFileSync(join(site, "current.txt"), "utf8").split(/\r?\n/)) {
      const v = /^current:\s*(\d+\.\d+\.\d+)/.exec(line);
      if (v !== null) out.version = v[1];
      const s = /^structure:\s*([0-9a-f]{8})/.exec(line);
      if (s !== null) out.structureHash = s[1];
    }
  } catch {
    // a fresh site has no memory yet
  }
  return out;
}

export function run(args: Args, io: Io): number {
  const root = args.root ?? "spec";
  const dist = args.dist ?? "apps/spec/dist";
  const site = args.site;
  if (site === undefined || site.trim() === "") {
    io.err("usage: canon publish --site <dir>\n\n  --site   the version-directory site's root; created on first publish");
    return 2;
  }
  const read = loadSpec(root);
  const diags: Diagnostic[] = [...read.diagnostics];

  const manifestPath = join(dist, "manifest.json");
  let delivered: Delivered | undefined;
  if (!existsSync(manifestPath)) {
    diags.push({
      severity: "error", code: "SP-S001",
      message: `no delivered manifest at '${manifestPath}' — run canon build first; publish ships what was delivered`,
      file: manifestPath,
    });
  } else {
    try {
      delivered = JSON.parse(readFileSync(manifestPath, "utf8")) as Delivered;
    } catch {
      diags.push({
        severity: "error", code: "SP-S001",
        message: `the manifest at '${manifestPath}' is not valid JSON — rebuild with canon build`,
        file: manifestPath,
      });
    }
  }

  let versions: string[] = [];
  try {
    versions = readdirSync(join(site, "v")).filter((d) => SEMVER.test(d)).sort(cmpVersion);
  } catch {
    versions = []; // first publish
  }
  const current = readCurrent(site);

  if (delivered !== undefined && delivered.specVersion !== undefined && SEMVER.test(delivered.specVersion)) {
    if (current.version !== undefined && cmpVersion(delivered.specVersion, current.version) < 0) {
      diags.push({
        severity: "error", code: "SP-S003",
        message: `publish would move the site backwards — it currently delivers ${current.version}, the dist says ${delivered.specVersion}; a downgrade is never a publish`,
        file: join(site, "current.txt"),
      });
    }
    const target = join(site, "v", delivered.specVersion, "manifest.json");
    if (existsSync(target)) {
      let published: Delivered | undefined;
      try {
        published = JSON.parse(readFileSync(target, "utf8")) as Delivered;
      } catch {
        published = undefined;
      }
      if (published !== undefined && published.structureHash !== delivered.structureHash) {
        diags.push({
          severity: "error", code: "SP-S004",
          message: `${delivered.specVersion} is already published with structure ${(published.structureHash ?? "?").slice(0, 12)}… but the dist now carries ${(delivered.structureHash ?? "?").slice(0, 12)}… — move the version forward with an amendment; content is never republished under the same name`,
          file: target,
        });
      }
    }
    if (delivered.structureHash !== undefined) {
      const { structureHash } = treeStructure(root);
      if (structureHash !== delivered.structureHash) {
        diags.push({
          severity: "error", code: "SP-S002",
          message: "the spec tree is ahead of the delivered index — run canon build; publish ships what was delivered, not what is in progress",
          file: manifestPath,
        });
      }
    }
  }

  const blocked = diags.some((d) => d.severity === "error");
  const wrote: string[] = [];
  if (!blocked && delivered?.specVersion !== undefined && delivered.structureHash !== undefined) {
    const version = delivered.specVersion;
    const target = join(site, "v", version);
    mkdirSync(target, { recursive: true });
    for (const f of ["SPEC.md", "law-index.json", "manifest.json"] as const) {
      copyFileSync(join(dist, f), join(target, f));
    }
    writeFileSync(
      join(target, "verification.txt"),
      `# verification — ${version}\n\nDelivered by canon build; verified by whoever reads it.\n\nversion: ${version}\nstructure: ${delivered.structureHash}\nlaw-count: ${delivered.lawCount ?? "?"}\nfiles: SPEC.md, law-index.json, manifest.json\n\nRecompute the structure identity: sha256 each file above, fold the\n'<file> <hash>' lines (joined by newlines) and sha256 that text — it must\nequal the structure hash here. The manifest beside this badge carries\nevery per-file checksum.\n`,
    );
    if (!versions.includes(version)) versions = [...versions, version].sort(cmpVersion);
    const lines = versions.map((v) => {
      const hash = v === version ? delivered.structureHash! : hashOfPublished(site, v);
      const tag = v === version ? " (current)" : "";
      return `- ${v} — v/${v}/SPEC.md${tag}${hash === undefined ? "" : ` · structure ${hash.slice(0, 12)}…`}`;
    });
    writeFileSync(
      join(site, "llms.txt"),
      `# The DoCoDeGo System — specification\n\nThe canon, published as plain files. Markdown and JSON are the payload;\nthe badge in each version directory carries the structure hash and how to\nrecompute it.\n\n## Versions\n\n${lines.join("\n")}\n`,
    );
    writeFileSync(
      join(site, "current.txt"),
      `current: ${version}\nstructure: ${delivered.structureHash}\nlaw-count: ${delivered.lawCount ?? "?"}\n`,
    );
    wrote.push(`v/${version}/`, "llms.txt", "current.txt");
  }

  emit(io, args.json, SCHEMA, {
    site,
    version: delivered?.specVersion,
    structureHash: delivered?.structureHash,
    lawCount: delivered?.lawCount,
    versions: versions.sort(cmpVersion),
    wrote,
    diagnostics: diags,
  });
  if (!args.json) {
    for (const d of diags) io.out(`spec ${d.severity}[${d.code}]: ${d.message}`);
    if (!blocked && delivered?.specVersion !== undefined) {
      io.out(`canon publish · ${delivered.specVersion} → ${site} (${wrote.join(", ")}) · structure ${(delivered.structureHash ?? "").slice(0, 12)}…`);
    }
  }
  return exitFor(diags);
}

/** The recorded hash of an already-published version, from its own badge —
 * the root files describe what is on disk, never what is remembered. */
function hashOfPublished(site: string, version: string): string | undefined {
  try {
    const m = /^structure:\s*(\S+)/.exec(readFileSync(join(site, "v", version, "verification.txt"), "utf8"));
    return m?.[1];
  } catch {
    return undefined;
  }
}
