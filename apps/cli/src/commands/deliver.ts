/** `deliver <unit>` — the gate. Four decisions from pure gate passes:
 * spec complete · score >= 60 · grill verdict pass · at least one proof path
 * that exists on disk. Pass: append delivered.md + tracker + delivery log
 * + the compose room's compose-log row, set status `delivered`, print the
 * gate line. Fail: print failed gates, record the attempt in the tracker,
 * exit 1 — the landing is never written. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, readText, sha16, today } from "../fsx.ts";
import { loadRecord, unitStatus } from "../record/load.ts";
import { field } from "../record/frontmatter.ts";
import { deliverGates } from "../passes/index.ts";
import { assertTransition, appendTracker, appendDeliveryLog, appendComposeLog, setStatus } from "../record/record-write.ts";
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

  // the gate lands a unit once (cli-law 17): a second delivery would double
  // every landing row — the status machine refuses before any gate runs, so
  // the refusal never spams the tracker either
  const refused = assertTransition(unit.name, unitStatus(unit), "delivered");
  if (refused !== null) {
    return complain(args.json, io, { severity: "error", code: "DG-U041", message: `${refused} — its landing rows already stand; see 'docodego trace ${unit.name}'` }, 1, "state");
  }

  const gates = deliverGates(rec, unit);
  const failed = gates.filter((g) => !g.passed);

  if (failed.length > 0) {
    const table = gates.map((g) => `  ${g.passed ? "pass" : "FAIL"}  ${g.id}  ${g.label} — ${g.detail}`).join("\n");
    // the attempt is recorded: a refused gate leaves one tracker line, so the
    // record can reconstruct the attempts and not only the landings
    const refusal = `${failed.map((g) => g.id).join(",")} failed — ${failed[0]?.detail ?? ""}`;
    const trackerLine = appendTracker(rec, name, "gate-refused", refusal.length > 90 ? `${refusal.slice(0, 87)}...` : refusal);
    if (args.json) {
      io.err(JSON.stringify(envelope("deliver", { unit: name, gates, tracker: trackerLine }, false), null, 2));
    } else {
      io.err(`gate review for ${name}:\n${table}`);
      io.err(`GATE FAIL ${name} — ${failed.map((g) => g.id).join(", ")} failed; nothing committed (attempt recorded in the tracker)`);
    }
    return 1;
  }

  const date = today();
  appendText(unitFile(rec, unit, "delivered.md"), `## delivered ${date}\n\n- gates: ${gates.map((g) => g.id).join(", ")} all passed\n- detail: ${gates.map((g) => g.detail).join("; ")}\n`);
  const trackerLine = appendTracker(rec, name, "delivered", `${unit.dir}/delivered.md`);
  const logLine = appendDeliveryLog(rec, name, gates.map((g) => g.id).join(","), gates.find((g) => g.id === "G4")?.detail ?? "");
  // the compose room's integrity row (IMP-15): the unit, the spec hash it
  // delivered against, and the declared spec-vs-built deviations — the hash
  // is taken after the status stamp, so an auditor re-hashing the delivered
  // spec on disk gets exactly the row's binding
  setStatus(join(rec.root, unit.dir, "spec.md"), "delivered");
  const specSha = sha16(readText(join(rec.root, unit.dir, "spec.md")) ?? "");
  const composeLine = appendComposeLog(rec, name, specSha, field(unit.spec?.front ?? null, "deviations"));

  const gateLine = `GATE PASS ${name} — delivered ${date} (${gates.map((g) => `${g.id} ${g.detail}`).join(" · ")})`;
  if (args.json) {
    io.out(JSON.stringify(envelope("deliver", { unit: name, ok: true, gates, tracker: trackerLine, deliveryLog: logLine, composeLog: composeLine }), null, 2));
  } else {
    io.out(gateLine);
    io.err(`appended ${unit.dir}/delivered.md + tracker + 04-govern/delivery-log.md + 02-compose/compose-log.md · status set to delivered`);
  }
  return 0;
}
