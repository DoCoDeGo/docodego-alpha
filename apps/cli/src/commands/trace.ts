/** `trace <unit>` — everything recorded about one unit, on one timeline:
 * creation, grill rounds, the score, the proofs, the deliveries, plus the
 * tracker rows naming it. Read-only — the traceability anchor, made a command. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { readText } from "../fsx.ts";
import { loadRecord, type RecordAst } from "../record/load.ts";
import { field } from "../record/frontmatter.ts";
import { proofResolves } from "../passes/check.ts";
import { buildTimeline } from "../passes/trace.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U050", message: "usage: docodego trace <unit> [--json]" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
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
    io.out(JSON.stringify(envelope("trace", data, true), null, 2));
    return 0;
  }
  const rows = events.map((e) => `  ${e.date.padEnd(10)} ${e.kind.padEnd(12)} ${e.detail}`).join("\n");
  io.out(`trace ${unit.name} — status ${status}, stream ${unit.stream}\n${rows}`);
  return 0;
}

/** A marker file's text; the marker path is record-root relative. */
function markerText(rec: RecordAst, rel: string | null): string | null {
  return rel === null ? null : readText(join(rec.root, rel));
}
