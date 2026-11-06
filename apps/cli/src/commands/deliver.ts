/** `deliver <unit>` — the gate. Four decisions from pure gate passes:
 * spec complete · score >= 60 · grill verdict pass · at least one proof path
 * that exists on disk. Pass: append delivered.md + tracker, set status
 * `delivered`, print the gate line. Fail: print failed gates, exit 1,
 * commit nothing. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, today } from "../fsx.ts";
import { loadRecord } from "../record/load.ts";
import { deliverGates } from "../passes/index.ts";
import { appendTracker, setStatus } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U040", message: "usage: docodego deliver <unit>" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;

  const gates = deliverGates(rec, unit);
  const failed = gates.filter((g) => !g.passed);

  if (failed.length > 0) {
    const table = gates.map((g) => `  ${g.passed ? "pass" : "FAIL"}  ${g.id}  ${g.label} — ${g.detail}`).join("\n");
    if (args.json) {
      io.err(JSON.stringify(envelope("deliver", { unit: name, gates }, false), null, 2));
    } else {
      io.err(`gate review for ${name}:\n${table}`);
      io.err(`GATE FAIL ${name} — ${failed.map((g) => g.id).join(", ")} failed; nothing committed`);
    }
    return 1;
  }

  const date = today();
  appendText(unitFile(rec, unit, "delivered.md"), `## delivered ${date}\n\n- gates: ${gates.map((g) => g.id).join(", ")} all passed\n- detail: ${gates.map((g) => g.detail).join("; ")}\n`);
  const trackerLine = appendTracker(rec, name, "delivered", `${unit.dir}/delivered.md`);
  setStatus(join(rec.root, unit.dir, "spec.md"), "delivered");

  const gateLine = `GATE PASS ${name} — delivered ${date} (${gates.map((g) => `${g.id} ${g.detail}`).join(" · ")})`;
  if (args.json) {
    io.out(JSON.stringify(envelope("deliver", { unit: name, ok: true, gates, tracker: trackerLine }), null, 2));
  } else {
    io.out(gateLine);
    io.err(`appended ${unit.dir}/delivered.md + tracker · status set to delivered`);
  }
  return 0;
}
