/** `score <unit>` — run the five ICS-lite passes over the unit's AST, write
 * the visible breakdown to score.md, set status `scored`, print the floor. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { readText, writeText, today, sha16 } from "../fsx.ts";
import { loadRecord, unitStatus } from "../record/load.ts";
import { scoreSpec } from "../passes/index.ts";
import { scoreReport } from "../record/template-docs.ts";
import { assertTransition, setStatus } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { emitJson } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U030", message: "usage: docodego score <unit> [--json]" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;

  // the score rides a grilled unit: no grill record, no score (cli-law 13)
  if (unit.markers.grill === null) {
    return complain(args.json, io, { severity: "error", code: "DG-U031", message: `no grill record for '${unit.name}' — the score rides a grilled unit; run 'docodego grill ${unit.name}' first` }, 1, "state");
  }
  // and the status machine guards the move: a delivered-class unit's score
  // is history — scoring cannot unland what the gate landed (cli-law 14)
  const refused = assertTransition(unit.name, unitStatus(unit), "scored");
  if (refused !== null) {
    return complain(args.json, io, { severity: "error", code: "DG-U032", message: refused }, 1, "state");
  }

  const result = scoreSpec(unit);
  const scoreRel = `${unit.dir}/score.md`;
  // the status flips first, THEN the sha binds: the block must hash the
  // spec exactly as it now stands (status included), or the gate's
  // recompute would read a file the score never saw
  setStatus(join(rec.root, unit.dir, "spec.md"), "scored");
  // the append law (cli-law 12): a re-score appends a dated block — the last
  // block wins, and the history of what scored when stays readable. Each
  // block binds the spec it scored by sha; the gate recomputes both.
  const scorePath = unitFile(rec, unit, "score.md");
  const existing = readText(scorePath);
  const specSha = sha16(readText(join(rec.root, unit.dir, "spec.md")) ?? "");
  const block = scoreReport(unit.name, today(), result.lines, result.total, result.floor, specSha);
  writeText(scorePath, existing === null ? block : `${existing.replace(/\n+$/, "")}\n\n${block}`);

  if (args.json) {
    emitJson(io, "score", { ...result, written: scoreRel, status: "scored" });
  } else {
    const rows = result.lines.map((l) => `  ${l.pass.padEnd(14)} ${String(l.got).padStart(3)}/${l.max}`).join("\n");
    io.out(`score ${unit.name}\n${rows}\n  ${"total".padEnd(14)} ${String(result.total).padStart(3)}/100`);
    io.err(`floor ${result.floor} — deliver refuses below it · wrote ${scoreRel} · status set to scored`);
  }
  return 0;
}
