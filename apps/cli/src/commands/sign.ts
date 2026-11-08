/** `sign <unit>` — the founder's signature: the last launch tier. The
 * tiers are strict (launch-passed first — no bypass), and the signature
 * is an act receipt, honestly bounded: it witnesses that the named
 * person ran this command over this evidence; it is an attestation, not
 * a cryptographic proof of identity, and the record never claims
 * otherwise. The identifier comes from one source, chosen expressly:
 * `--name` (a typed legal identifier or handle — consented, stored
 * verbatim; `--by` is its documented alias), `--system` (this
 * environment's identity, skipping git), or the default ladder — git,
 * then system. The consent split (the founder's ruling, 2026-11-08):
 * a typed identifier stays verbatim; a derived identifier is stored as
 * `enc:v1:<base64>`, a versioned reversible encoding — the encoding
 * rethink (the founder's ruling, 2026-11-09): concealment from the
 * casual read, not cryptography; the CLI reveals it on demand
 * (`docodego whoami --decode`), so the team sees who signed and the
 * raw string still never stands in the file. The whole act is shown, and one confirmation closes it: an
 * interactive run asks once ("sign and approve?"); a headless run
 * declares `--yes`; a run that is neither confirmed nor promptable
 * refuses with DG-U118 and appends nothing — a signature without an
 * actor's yes is furniture wearing accountability's clothes. Pass:
 * append the receipt row to the signatures ledger, write the unit's
 * signature.md (who, role, when in the local calendar, evidence hashes
 * at signing time), set status `founder-signed`. A second signature of
 * the same act is a rewritten record and is refused with nothing
 * appended. */
import { sha256, today, writeText } from "../fsx.ts";
import { readSync } from "node:fs";
import { join } from "node:path";
import type { Args, Io } from "../types.ts";
import { loadRecord, unitStatus, type RecordAst } from "../record/load.ts";
import { appendSignature, appendTracker, setStatus } from "../record/record-write.ts";
import { complain, resolveUnitOrComplain, unitFile } from "./resolve.ts";
import { resolveIdentity, type Identity } from "./identity.ts";
import { emitJson } from "../emit/json.ts";

const USAGE = 'usage: docodego sign [<unit> | --all] [--name "<legal identifier or handle>"] [--system] [--role <role>] [--yes] (--by is an alias of --name)';

/** The act line's attestation limit: typed identifiers carry the base
 * clause; encoded ones add what the mechanism actually enforces — the
 * record claims the encoding's true size, no more. */
const actLine = (identity: Identity): string =>
  identity.kind === "typed"
    ? "founder-signed (attestation by command execution — the record witnesses the claim; it does not cryptographically prove identity)"
    : `founder-signed (attestation by command execution — the record witnesses the claim; it does not cryptographically prove identity. The identifier is encoded: concealment from the casual read, not cryptography — the CLI reveals it on demand, and one step of curiosity does the same without it)`;

/** The founder-tier marker (cycle 11 ruling, option C — 600): a founder
 * signature from a derived (encoded) identity is marked provisional —
 * the confirming act is a named-person founder signature. Typed --name
 * founders sign unmarked; the status value stays founder-signed and
 * the machine is untouched; the marker travels on the receipt, the
 * ledger row, and the sign line. One authored expression — the single
 * confirmation and the batch display both speak it. */
const markedRole = (role: string, identity: Identity): string =>
  role === "founder" && identity.kind !== "typed"
    ? `${role} (provisional — a derived identity signed; the confirming act is a named-person founder signature)`
    : role;

/** One typed line from stdin — the picker's read and the confirmation's
 * read are the same act: a human answering once. */
const askLine = (): string => {
  const buf = Buffer.alloc(1024);
  const bytes = readSync(0, buf, 0, buf.length, null);
  return buf.toString("utf8", 0, bytes).trim();
};

/** The unsigned: the units sitting at launch-passed — the strict tier's
 * waiting room, the only status the founder tier can act on — in name
 * order. Both the picker and the batch speak this one list. */
const unsignedNames = (rec: RecordAst): string[] =>
  rec.units.filter((u) => unitStatus(u) === "launch-passed").map((u) => u.name).sort();

export function run(args: Args, io: Io): number {
  const name = args.pos[0];
  const rec = loadRecord(process.cwd());
  if (name !== undefined && name !== "" && args.all === true) {
    return complain(args.json, io, { severity: "error", code: "DG-U119", message: `sign takes one target: a unit name or --all (every unsigned unit), not both (nothing appended) — ${USAGE}` }, 2, "usage");
  }
  if (name === undefined || name === "") {
    if (args.all === true) return signAll(rec, args, io);
    // the picker is the interactive world: a headless run cannot show a
    // list, so it names the contract and appends nothing (DG-U119).
    if (args.json || process.stdin.isTTY !== true) {
      return complain(args.json, io, { severity: "error", code: "DG-U119", message: `sign without a unit shows the unsigned and asks: run it on a terminal to pick by number or name (or "all"), or name the target, or declare the batch with --all (headless: --all --yes) — ${USAGE}` }, 2, "usage");
    }
    const unsigned = unsignedNames(rec);
    if (unsigned.length === 0) {
      io.out("nothing to sign — no launch-passed units await the founder tier");
      return 0;
    }
    io.out("unsigned units — launch-passed, awaiting the founder tier:");
    unsigned.forEach((u, i) => io.out(`  ${i + 1}) ${u}`));
    io.out('sign which? (number, name, or "all"; empty cancels)');
    const picked = askLine();
    if (picked === "" || picked === "q" || picked === "quit") {
      io.out("declined at the prompt — nothing appended");
      return 1;
    }
    const lower = picked.toLowerCase();
    if (lower === "all" || lower === "a") return signAll(rec, args, io);
    const chosen = /^\d+$/.test(lower) ? unsigned[Number(lower) - 1] : lower;
    if (chosen === undefined || !unsigned.includes(chosen)) {
      io.err(`not in the unsigned list: ${picked} — nothing appended`);
      return 1;
    }
    return signOne(chosen, args, io);
  }
  return signOne(name, args, io);
}

/** The batch (the founder's select-all, 620): the same act at batch
 * size — every act shown, one confirmation closes them all, each unit
 * signs independently (a mid-batch refusal is reported and the rest
 * proceed; the exit code tells the truth). */
function signAll(rec: RecordAst, args: Args, io: Io): number {
  if (args.json) {
    return complain(args.json, io, { severity: "error", code: "DG-U119", message: "--json signs one named unit — the batch is a human's act, shown whole and asked once (nothing appended)" }, 2, "usage");
  }
  const unsigned = unsignedNames(rec);
  if (unsigned.length === 0) {
    io.out("nothing to sign — no launch-passed units await the founder tier");
    return 0;
  }
  const typedName = typeof args.name === "string" && args.name.trim() !== "" ? args.name.trim() : typeof args.by === "string" && args.by.trim() !== "" ? args.by.trim() : undefined;
  if (typedName !== undefined && args.system === true) {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "sign takes one identifier source: --name/--by (a typed identifier) or --system (this environment) — not both (nothing appended)" }, 2, "usage");
  }
  const identity = resolveIdentity({ name: typedName, system: args.system === true });
  if (identity === "unresolvable") {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: 'a signature needs an identifier and none could be derived from git or system details — type --name "<legal identifier or handle>"' }, 2, "usage");
  }
  const role = typeof args.role === "string" && args.role !== "" ? args.role : "founder";
  const roleMarked = markedRole(role, identity);
  if (args.yes !== true) {
    if (process.stdin.isTTY !== true) {
      return complain(args.json, io, { severity: "error", code: "DG-U118", message: "the batch needs a human yes: an interactive run shows every act and asks once; a headless run declares --all --yes (nothing appended)" }, 1, "signature-refused");
    }
    io.out(`about to sign ${unsigned.length} unit(s) — founder-signed ${today()}`);
    io.out(`  signed by: ${identity.line}`);
    io.out(`  role: ${roleMarked}`);
    io.out("  units:");
    unsigned.forEach((u) => io.out(`    - ${u}`));
    io.out("sign and approve all? [y/N]");
    const answer = askLine().toLowerCase();
    if (answer !== "y" && answer !== "yes") {
      return complain(args.json, io, { severity: "error", code: "DG-U118", message: "declined at the prompt — nothing appended" }, 1, "signature-refused");
    }
  }
  let failed = 0;
  for (const u of unsigned) {
    if (signOne(u, args, io, { confirmed: true }) !== 0) failed++;
  }
  if (failed > 0) io.err(`${failed} of ${unsigned.length} signature(s) failed — the refusals above name them`);
  return failed === 0 ? 0 : 1;
}

function signOne(name: string, args: Args, io: Io, opts: { confirmed?: boolean } = {}): number {
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

  const typedName = typeof args.name === "string" && args.name.trim() !== "" ? args.name.trim() : typeof args.by === "string" && args.by.trim() !== "" ? args.by.trim() : undefined;
  if (typedName !== undefined && args.system === true) {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "sign takes one identifier source: --name/--by (a typed identifier) or --system (this environment) — not both (nothing appended)" }, 2, "usage");
  }
  const identity = resolveIdentity({ name: typedName, system: args.system === true });
  if (identity === "unresolvable") {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: 'a signature needs an identifier and none could be derived from git or system details — type --name "<legal identifier or handle>"' }, 2, "usage");
  }

  const specHash = sha256(join(rec.root, unit.dir, "spec.md"));
  const deliveredHash = unit.markers.delivered === null ? null : sha256(join(rec.root, unit.markers.delivered));
  const date = today();
  const evidence = `spec.md sha256:${specHash ?? "unavailable"}${deliveredHash === null ? "" : ` · delivered.md sha256:${deliveredHash}`}`;
  const act = actLine(identity);
  const roleMarked = markedRole(role, identity);

  // One confirmation, one path per world: --yes declares the act for
  // headless callers; a TTY is shown the whole act and asked once;
  // a batch that already asked once skips straight through; everything
  // else refuses with nothing appended (DG-U118).
  if (args.yes !== true && opts.confirmed !== true) {
    if (args.json || process.stdin.isTTY !== true) {
      return complain(args.json, io, { severity: "error", code: "DG-U118", message: `${name}: a signature needs a human yes — an interactive run shows the act and asks once; a headless run declares --yes (nothing appended)` }, 1, "signature-refused");
    }
    io.out(`about to sign ${name} — founder-signed ${date}`);
    io.out(`  signed by: ${identity.line}`);
    io.out(`  role: ${roleMarked}`);
    io.out(`  act: ${act}`);
    io.out(`  evidence: ${evidence}`);
    io.out("sign and approve? [y/N]");
    const answer = askLine().toLowerCase();
    if (answer !== "y" && answer !== "yes") {
      return complain(args.json, io, { severity: "error", code: "DG-U118", message: `${name}: declined at the prompt — nothing appended` }, 1, "signature-refused");
    }
  }

  const receipt = `## founder-signed ${date}\n\n- signed by: ${identity.line}\n- role: ${roleMarked}\n- act: ${act}\n- evidence: ${evidence}\n`;
  writeText(unitFile(rec, unit, "signature.md"), `# signature — ${name}\n\n${receipt}`);
  const ledgerLine = appendSignature(rec, name, identity.line, roleMarked, "founder-signed");
  const trackerLine = appendTracker(rec, name, "founder-signed", `${unit.dir}/signature.md`);
  setStatus(join(rec.root, unit.dir, "spec.md"), "founder-signed");

  const line = `SIGNED ${name} — founder-signed ${date} · by ${identity.line} (${roleMarked}) · receipt ${unit.dir}/signature.md`;
  if (args.json) {
    emitJson(io, "sign", { unit: name, ok: true, by: identity.line, identityKind: identity.kind, role, date, receipt: `${unit.dir}/signature.md`, ledger: ledgerLine, tracker: trackerLine });
  } else {
    io.out(line);
    io.err(`appended ${unit.dir}/signature.md + signatures ledger row + tracker row · status set to founder-signed`);
  }
  return 0;
}
