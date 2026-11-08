/** `trace <unit>` — everything recorded about one unit, on one timeline:
 * creation, grill rounds, the score, the proofs, the deliveries, plus the
 * tracker rows naming it. Read-only — the traceability anchor, made a command. */
import { join } from "node:path";
import { existsSync, readdirSync } from "node:fs";
import type { Args, Io } from "../types.ts";
import { readText, isDir, isFile } from "../fsx.ts";
import { loadRecord, type RecordAst } from "../record/load.ts";
import { field } from "../record/frontmatter.ts";
import { proofResolves } from "../passes/check.ts";
import { buildTimeline } from "../passes/trace.ts";
import { findRetired, tombFiles, type Tomb } from "./retire.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { emitJson } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U050", message: "usage: docodego trace <unit> [--json]" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  // The second home first: a retired unit still traces — its tomb's own
  // files stand in for the stream markers that no longer resolve, and the
  // tracker history (original name) carries the delivery rows.
  const tomb = findRetired(rec, name);
  if (tomb !== null) return traceRetired(rec, tomb, args, io);
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;

  const events = buildTimeline({
    unit: unit.name,
    spec: readText(unitFile(rec, unit, "spec.md")),
    grill: markerText(rec, unit.markers.grill),
    score: markerText(rec, unit.markers.score),
    proofs: markerText(rec, unit.markers.proofs),
    delivered: markerText(rec, unit.markers.delivered),
    tracker: rec.trackerPath === null ? null : readText(join(rec.root, rec.trackerPath)),
    trackerArchives: trackerArchives(rec),
    evidence: {
      spec: `${unit.dir}/spec.md`,
      grill: unit.markers.grill,
      score: unit.markers.score,
      proofs: unit.markers.proofs,
      delivered: unit.markers.delivered,
    },
    proofExists: (p) => proofResolves(rec, unit, p),
  });

  const status = field(unit.spec?.front ?? null, "status") ?? "draft";
  if (args.json) {
    const data = {
      unit: unit.name,
      status,
      epic: field(unit.spec?.front ?? null, "epic"),
      story: field(unit.spec?.front ?? null, "story"),
      events,
    };
    emitJson(io, "trace", data, true);
    return 0;
  }
  const rows = events.map((e) => `  ${e.date.padEnd(10)} ${e.kind.padEnd(12)} ${e.detail}`).join("\n");
  io.out(`trace ${unit.name} — status ${status}, stream ${unit.stream}\n${rows}`);
  return 0;
}

/** A retired unit's timeline: same builder, tomb files as sources, proof
 * paths resolving against the tomb as well as the usual roots. */
function traceRetired(rec: RecordAst, tomb: Tomb, args: Args, io: Io): number {
  const files = tombFiles(rec, tomb);
  const has = (s: string | null): string | null => (s === null ? null : `${tomb.rel}/${s}`);
  const events = buildTimeline({
    unit: tomb.name,
    spec: files.spec,
    grill: files.grill,
    score: files.score,
    proofs: files.proofs,
    delivered: files.delivered,
    tracker: rec.trackerPath === null ? null : readText(join(rec.root, rec.trackerPath)),
    trackerArchives: trackerArchives(rec),
    evidence: {
      spec: `${tomb.rel}/spec.md`,
      grill: has(files.grill),
      score: has(files.score),
      proofs: has(files.proofs),
      delivered: has(files.delivered),
    },
    proofExists: (p) => isFile(join(rec.cwd, p)) || isDir(join(rec.cwd, p)) || isFile(join(rec.root, p)) || isFile(join(rec.root, tomb.rel, p)),
  });
  const status = `retired${tomb.retiredOn === null ? "" : ` (${tomb.retiredOn})`}`;
  if (args.json) {
    const data = { unit: tomb.name, status, home: tomb.rel, events };
    emitJson(io, "trace", data, true);
    return 0;
  }
  const rows = events.map((e) => `  ${e.date.padEnd(10)} ${e.kind.padEnd(12)} ${e.detail}`).join("\n");
  io.out(`trace ${tomb.name} — ${status}, home ${tomb.rel}\n${rows}`);
  return 0;
}

/** A marker file's text; the marker path is record-root relative. */
/** Tracker archives hold rows the live file no longer does (audit
 * --rotate); trace scans them so retired rows keep their coverage. */
function trackerArchives(rec: RecordAst): string[] {
  if (rec.trackerPath === null) return [];
  const dir = join(rec.root, rec.trackerPath, "..");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^tracker-archive-\d+\.md$/.test(f))
    .sort()
    .map((f) => readText(join(dir, f)) ?? "")
    .filter((s) => s !== "");
}

function markerText(rec: RecordAst, rel: string | null): string | null {
  return rel === null ? null : readText(join(rec.root, rel));
}
