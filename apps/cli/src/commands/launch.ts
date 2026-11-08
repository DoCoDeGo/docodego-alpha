/** `launch <unit>` — the launch gate: the first post-delivery tier.
 * Delivery is the loop accepting its own work; launch-passed is the record
 * surviving a fresh audit of reality (the delivered receipt on file, every
 * proof path still resolving, the record's check pass error-clean, the
 * delivery rows present, the demo bundle filled). Pass: append launch.md +
 * tracker row, set status `launch-passed`, print the gate line. Fail:
 * print failed gates, record the attempt in the tracker, exit 1 — the tier
 * is never written over a refusal. Idempotent: a unit already launch-passed
 * is answered calmly and rewritten by nothing. */
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, today } from "../fsx.ts";
import { loadRecord } from "../record/load.ts";
import { launchGates } from "../passes/index.ts";
import { appendTracker, setStatus, scaffoldDemoHowTo, DEMO_DIR_REL, DEMO_HOWTO_NAME } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { unitStatus } from "../record/load.ts";
import { envelope } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U110", message: "usage: docodego launch <unit>" }, 2, "usage");
  }
  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;

  const status = unitStatus(unit);
  if (status === "launch-passed" || status === "founder-signed") {
    const line = `${name} is already ${status} — nothing to re-earn, nothing rewritten`;
    if (args.json) io.out(JSON.stringify(envelope("launch", { unit: name, ok: true, already: true, status }, true), null, 2));
    else io.out(line);
    return 0;
  }

  // repair forward, never rewrite: a unit delivered before the demo
  // bundles (or with a lost scaffold) gets the create-only scaffold here,
  // so L5's refusal can point at a file to fill — the gate pass itself
  // stays a pure read
  const scaffoldNote = scaffoldDemoHowTo(rec, name) ? `scaffolded ${DEMO_DIR_REL}/${name}/${DEMO_HOWTO_NAME} — fill it before relaunch` : null;

  const gates = launchGates(rec, unit);
  const failed = gates.filter((g) => !g.passed);
  if (failed.length > 0) {
    const table = gates.map((g) => `  ${g.passed ? "pass" : "FAIL"}  ${g.id}  ${g.label} — ${g.detail}`).join("\n");
    const refusal = `${failed.map((g) => g.id).join(",")} failed — ${failed[0]?.detail ?? ""}`;
    const trackerLine = appendTracker(rec, name, "launch-refused", refusal.length > 90 ? `${refusal.slice(0, 87)}...` : refusal);
    if (args.json) {
      io.err(JSON.stringify(envelope("launch", { unit: name, gates, tracker: trackerLine, ...(scaffoldNote !== null ? { scaffold: scaffoldNote } : {}) }, false), null, 2));
    } else {
      io.err(`launch gate review for ${name}:`);
      if (scaffoldNote !== null) io.err(`  note — ${scaffoldNote}`);
      io.err(table);
      io.err(`LAUNCH REFUSED ${name} — ${failed.map((g) => g.id).join(", ")} failed; the tier was not written (attempt recorded in the tracker)`);
    }
    return 1;
  }

  const date = today();
  appendText(unitFile(rec, unit, "launch.md"), `## launch-passed ${date}\n\n- gates: ${gates.map((g) => g.id).join(", ")} all passed\n- detail: ${gates.map((g) => g.detail).join("; ")}\n`);
  const trackerLine = appendTracker(rec, name, "launch-passed", `${unit.dir}/launch.md`);
  setStatus(join(rec.root, unit.dir, "spec.md"), "launch-passed");

  const gateLine = `LAUNCH PASS ${name} — launch-passed ${date} (${gates.map((g) => `${g.id} ${g.detail}`).join(" · ")})`;
  if (args.json) {
    io.out(JSON.stringify(envelope("launch", { unit: name, ok: true, gates, tracker: trackerLine }), null, 2));
  } else {
    io.out(gateLine);
    io.err(`appended ${unit.dir}/launch.md + tracker row · status set to launch-passed — the next tier is a person: docodego sign ${name} --by "<legal name>"`);
  }
  return 0;
}
