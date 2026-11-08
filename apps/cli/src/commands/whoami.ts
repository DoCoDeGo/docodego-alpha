/** `whoami` — the signer's identity, in the open. The reveal surface the
 * founder ruled into existence (cycle 8, verbatim in cycles.md:
 * "encoding seems to be perfectly fine to hide the identity and only
 * reveal it when needed"): plain output shows what this environment
 * derives and exactly how it is stored — the raw string to you, the
 * `enc:v1:<base64>` token to everyone else. `--decode <value>` is the
 * flag "specifically for decoding the identity": anyone on the team can
 * reveal any encoded row — that is the point; visibility within the
 * team is the design. The honesty the command owes: an encoded
 * identifier is concealment from the casual read, not cryptography —
 * the CLI reveals it on demand, and one step of curiosity does the
 * same without it. `fp:v1` values (records signed before the encoding
 * rethink) are keyed one-way fingerprints and refuse decoding with
 * exactly that truth. No record layer is needed: this command reads
 * your environment and whatever value you hand it — it writes nothing,
 * anywhere. */
import type { Args, Io } from "../types.ts";
import { complain } from "./resolve.ts";
import { decodeEncoded, derivedRaw, encoded } from "./identity.ts";
import { emitJson } from "../emit/json.ts";

const USAGE = 'usage: docodego whoami [--system] [--decode "<enc:v1:...>"] [--json]';

export function run(args: Args, io: Io): number {
  // --decode: the reveal — the value is the interface, not a file.
  if (typeof args.decode === "string" && args.decode.trim() !== "") {
    const value = args.decode.trim();
    const plain = decodeEncoded(value);
    if (plain !== null) {
      if (args.json) {
        emitJson(io, "whoami", { ok: true, decode: value, plain });
      } else {
        io.out(plain);
        io.err(`decodes to the line above — concealment from the casual read, not cryptography`);
      }
      return 0;
    }
    if (/^fp:v\d+:[0-9a-f]+$/i.test(value)) {
      return complain(args.json, io, { severity: "error", code: "DG-U111", message: "this is an fp row (a pre-encoding-rethink signature): a keyed one-way fingerprint, not reversible by design — the salt that keyed it stays committed beside its ledger; the plain string it witnessed was never stored" }, 1, "whoami-refused");
    }
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: `${USAGE} — the value to decode must be an enc:v1:<base64> stored identity (fp rows are one-way; raw strings decode to themselves)` }, 2, "usage");
  }

  const d = derivedRaw(args.system === true);
  if (d === null) {
    return complain(args.json, io, { severity: "error", code: "DG-U111", message: "no identifier could be derived from git or system details — this environment has no identity to show" }, 1, "whoami-refused");
  }
  const stored = encoded(d.raw);
  if (args.json) {
    emitJson(io, "whoami", { ok: true, raw: d.raw, kind: d.kind, stored });
  } else {
    io.out(`identity: ${d.raw} (${d.kind} identity of this environment)`);
    io.out(`stored as: ${stored}`);
    io.err(`the stored form decodes to the identity above — the file reads opaque, the CLI reveals on demand; concealment from the casual read, not cryptography`);
  }
  return 0;
}
