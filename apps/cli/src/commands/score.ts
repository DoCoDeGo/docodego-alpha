/** `score <unit>` — run the five ICS-lite passes over the unit's AST, write
 * the visible breakdown to score.md, set status `scored`, print the floor. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { writeText, today } from "../fsx.ts";
import { loadRecord } from "../record/load.ts";
import { scoreSpec } from "../passes/index.ts";
import { scoreReport } from "../record/template-docs.ts";
import { setStatus } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U030", message: "usage: docodego score <unit> [--json]" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;

  const result = scoreSpec(unit);
  const scoreRel = `${unit.dir}/score.md`;
  writeText(unitFile(rec, unit, "score.md"), scoreReport(unit.name, today(), result.lines, result.total, result.floor));
  setStatus(join(rec.root, unit.dir, "spec.md"), "scored");

  if (args.json) {
    io.out(JSON.stringify(envelope("score", { ...result, written: scoreRel, status: "scored" }), null, 2));
  } else {
    const rows = result.lines.map((l) => `  ${l.pass.padEnd(14)} ${String(l.got).padStart(3)}/${l.max}`).join("\n");
    io.out(`score ${unit.name}\n${rows}\n  ${"total".padEnd(14)} ${String(result.total).padStart(3)}/100`);
    io.err(`floor ${result.floor} — deliver refuses below it · wrote ${scoreRel} · status set to scored`);
  }
  return 0;
}
