/** `sign <unit>` — the founder's signature: the last launch tier. The
 * tiers are strict (launch-passed first — no bypass), and the signature
 * is an act receipt, honestly bounded: it witnesses that the named
 * person ran this command over this evidence; it is an attestation, not
 * a cryptographic proof of identity, and the record never claims
 * otherwise. The identifier derives from the environment — git or
 * system details (the mechanism sign-off runs), or a typed `--by` (a
 * legal identifier or handle) — the whole act is shown, and one
 * confirmation closes it: an interactive run asks once ("sign and
 * approve?"); a headless run declares `--yes`; a run that is neither
 * confirmed nor promptable refuses with DG-U118 and appends nothing —
 * a signature without an actor's yes is furniture wearing
 * accountability's clothes. Pass: append the receipt row to the
 * signatures ledger, write the unit's signature.md (who, role, when in
 * the local calendar, evidence hashes at signing time), set status
 * `founder-signed`. A second signature of the same act is a rewritten
 * record and is refused with nothing appended. */
import { sha256, today, writeText } from "../fsx.ts";
import { readSync } from "node:fs";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { loadRecord, unitStatus } from "../record/load.ts";
import { appendSignature, appendTracker, setStatus } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { deriveIdentity } from "./sign-off.ts";
import { emitJson } from "../emit/json.ts";

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "usage: docodego sign <unit> [--by \"<legal identifier or handle>\"] [--role <role>] [--yes]" }, 2, "usage");
  }
  const role = typeof args.role === "string" && args.role !== "" ? args.role : "founder";

  const rec = loadRecord(process.cwd());
  const resolved = resolveUnitOrComplain(rec, name, io, args.json);
  if (typeof resolved === "number") return resolved;
  const unit = resolved;

  const status = unitStatus(unit);
  if (status === "founder-signed") {
    return complain(args.json, io, { severity: "error", code: "DG-U113", message: `${name} is already founder-signed — a second signature rewrites an act the record keeps once (nothing appended)` }, 1, "signature-refused");
  }
  if (status !== "launch-passed") {
    return complain(args.json, io, { severity: "error", code: "DG-U112", message: `${name} is ${status} — the tiers are strict: launch-passed first (docodego launch ${name}); no bypass exists` }, 1, "signature-refused");
  }

  const identity = deriveIdentity(typeof args.by === "string" && args.by.trim() !== "" ? args.by.trim() : undefined);
  if (identity.line.startsWith("unresolvable")) {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "a signature needs an identifier and none could be derived from git or system details — type --by \"<legal identifier or handle>\"" }, 2, "usage");
  }

  const specHash = sha256(join(rec.root, unit.dir, "spec.md"));
  const deliveredHash = unit.markers.delivered === null ? null : sha256(join(rec.root, unit.markers.delivered));
  const date = today();
  const evidence = `spec.md sha256:${specHash ?? "unavailable"}${deliveredHash === null ? "" : ` · delivered.md sha256:${deliveredHash}`}`;

  // One confirmation, one path per world: --yes declares the act for
  // headless callers; a TTY is shown the whole act and asked once;
  // everything else refuses with nothing appended (DG-U118).
  if (args.yes !== true) {
    if (args.json || process.stdin.isTTY !== true) {
      return complain(args.json, io, { severity: "error", code: "DG-U118", message: `${name}: a signature needs a human yes — an interactive run shows the act and asks once; a headless run declares --yes (nothing appended)` }, 1, "signature-refused");
    }
    io.out(`about to sign ${name} — founder-signed ${date}`);
    io.out(`  signed by: ${identity.line}`);
    io.out(`  role: ${role}`);
    io.out(`  act: founder-signed (attestation by command execution — the record witnesses the claim; it does not cryptographically prove identity)`);
    io.out(`  evidence: ${evidence}`);
    io.out("sign and approve? [y/N]");
    const buf = Buffer.alloc(1024);
    const bytes = readSync(0, buf, 0, buf.length, null);
    const answer = buf.toString("utf8", 0, bytes).trim().toLowerCase();
    if (answer !== "y" && answer !== "yes") {
      return complain(args.json, io, { severity: "error", code: "DG-U118", message: `${name}: declined at the prompt — nothing appended` }, 1, "signature-refused");
    }
  }

  const receipt = `## founder-signed ${date}\n\n- signed by: ${identity.line}\n- role: ${role}\n- act: founder-signed (attestation by command execution — the record witnesses the claim; it does not cryptographically prove identity)\n- evidence: ${evidence}\n`;
  writeText(unitFile(rec, unit, "signature.md"), `# signature — ${name}\n\n${receipt}`);
  const ledgerLine = appendSignature(rec, name, identity.line, role, "founder-signed");
  const trackerLine = appendTracker(rec, name, "founder-signed", `${unit.dir}/signature.md`);
  setStatus(join(rec.root, unit.dir, "spec.md"), "founder-signed");

  const line = `SIGNED ${name} — founder-signed ${date} · by ${identity.line} (${role}) · receipt ${unit.dir}/signature.md`;
  if (args.json) {
    emitJson(io, "sign", { unit: name, ok: true, by: identity.line, role, date, receipt: `${unit.dir}/signature.md`, ledger: ledgerLine, tracker: trackerLine });
  } else {
    io.out(line);
    io.err(`appended ${unit.dir}/signature.md + signatures ledger row + tracker row · status set to founder-signed`);
  }
  return 0;
}
