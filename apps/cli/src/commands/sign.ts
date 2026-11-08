/** `sign <unit> --by <legal name>` — the founder's signature: the last
 * launch tier. The tiers are strict (launch-passed first — no bypass), and
 * the signature is an act receipt, honestly bounded: it witnesses that the
 * named person ran this command over this evidence; it is an attestation,
 * not a cryptographic proof of identity, and the record never claims
 * otherwise. Pass: append the receipt row to the signatures ledger, write
 * the unit's signature.md (who, role, when in the local calendar, evidence
 * hashes at signing time), set status `founder-signed`. A second signature
 * of the same act is a rewritten record and is refused with nothing
 * appended. */
import { createHash } from "node:crypto";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { appendText, readText, today, writeText } from "../fsx.ts";
import { loadRecord, unitStatus } from "../record/load.ts";
import { appendSignature, appendTracker, setStatus } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { envelope } from "../emit/json.ts";

const sha256 = (abs: string): string | null => {
  const raw = readText(abs);
  return raw === null ? null : createHash("sha256").update(raw).digest("hex");
};

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  if (name === undefined || name === "") {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "usage: docodego sign <unit> --by \"<legal name>\" [--role <role>]" }, 2, "usage");
  }
  const by = args.by;
  if (by === undefined || by === "" || by === true) {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "a signature needs a name: docodego sign <unit> --by \"<legal name>\"" }, 2, "usage");
  }
  const signer = typeof by === "string" ? by : "";
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

  const specHash = sha256(join(rec.root, unit.dir, "spec.md"));
  const deliveredHash = unit.markers.delivered === null ? null : sha256(join(rec.root, unit.markers.delivered));
  const date = today();
  const receipt = `## founder-signed ${date}\n\n- signed by: ${signer}\n- role: ${role}\n- act: founder-signed (attestation by command execution — the record witnesses the claim; it does not cryptographically prove identity)\n- evidence: spec.md sha256:${specHash ?? "unavailable"}${deliveredHash === null ? "" : ` · delivered.md sha256:${deliveredHash}`}\n`;
  writeText(unitFile(rec, unit, "signature.md"), `# signature — ${name}\n\n${receipt}`);
  const ledgerLine = appendSignature(rec, name, signer, role, "founder-signed");
  const trackerLine = appendTracker(rec, name, "founder-signed", `${unit.dir}/signature.md`);
  setStatus(join(rec.root, unit.dir, "spec.md"), "founder-signed");

  const line = `SIGNED ${name} — founder-signed ${date} · by ${signer} (${role}) · receipt ${unit.dir}/signature.md`;
  if (args.json) {
    io.out(JSON.stringify(envelope("sign", { unit: name, ok: true, by: signer, role, date, receipt: `${unit.dir}/signature.md`, ledger: ledgerLine, tracker: trackerLine }), null, 2));
  } else {
    io.out(line);
    io.err(`appended ${unit.dir}/signature.md + signatures ledger row + tracker row · status set to founder-signed`);
  }
  return 0;
}
