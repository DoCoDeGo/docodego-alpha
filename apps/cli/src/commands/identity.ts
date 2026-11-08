/** identity — the signer's identity: source resolution, the consent
 * split, and the versioned reversible encoding. The founder's rulings,
 * recorded verbatim in the record's cycles log: a typed identifier is
 * consent (2026-11-08) — it stays verbatim; a derived identifier is
 * machine noise — never stored as it stands. The storage mechanism is
 * the founder's encoding rethink (2026-11-09, cycle 8, unit 530): the
 * derived identifier is stored as `enc:v1:<base64>`, a versioned
 * reversible encoding — "difficult enough to identify someone without
 * the DoCoDeGo CLI", revealed by the CLI on demand (`docodego whoami`,
 * `--decode <value>`), so a team can see who signed while the file
 * itself reads opaque. The honest limit, stated wherever a signature
 * shows: an encoded identifier is concealment from the casual read, not
 * cryptography — the CLI reveals it on demand, and one step of
 * curiosity does the same without it. This supersedes the v25-era
 * per-record-salted fingerprint (`fp:v1:<hex>`) on the sign path: the
 * scrypt machinery is retired from storage, existing fp rows stand as
 * recorded (append-only — no scrubbing), and the committed salt file
 * stays as their historical key. The v1 tag freezes the encoding
 * (standard base64 of the utf-8 raw string) — a future change ships as
 * enc:v2, never re-cut in place. */
import { hostname, userInfo } from "node:os";
import { spawnSync } from "node:child_process";

export type IdentityKind = "typed" | "git" | "system";
export type Identity = { line: string; kind: IdentityKind; raw: string };

const gitConfig = (key: string): string | null => {
  const r = spawnSync("git", ["config", "--get", key], { encoding: "utf8" });
  const v = (r.stdout ?? "").trim();
  return r.status === 0 && v !== "" ? v : null;
};

/** The versioned reversible encoding: standard base64 of the raw
 * identifier, utf-8. Deterministic everywhere — the same environment
 * carries the same token in every record (the salted fingerprint's
 * cross-record unlinkability is the property this design trades away;
 * the 1.2.5 amendment names the trade). */
export const encoded = (raw: string): string =>
  `enc:v1:${Buffer.from(raw, "utf8").toString("base64")}`;

/** The reveal: decode an `enc:v1:<base64>` value to its plain string —
 * the founder's ruled surface ("only reveal it when needed"). Returns
 * null for anything that is not an enc value; `fp:v1` rows in
 * particular are NOT decodable (keyed one-way fingerprints, by the
 * design that made them) and the caller says so honestly. */
export const decodeEncoded = (value: string): string | null => {
  const m = /^enc:v1:([A-Za-z0-9+/]+={0,2})$/.exec(value.trim());
  if (m === null) return null;
  try {
    const raw = Buffer.from(m[1] ?? "", "base64").toString("utf8");
    return raw === "" ? null : raw;
  } catch {
    return null;
  }
};

/** The raw environment identity: git first, then system — the 450 ladder,
 * unchanged in order. Returns null when neither resolves. */
export const derivedRaw = (forceSystem: boolean): { raw: string; kind: "git" | "system" } | null => {
  if (!forceSystem) {
    const name = gitConfig("user.name");
    if (name !== null) {
      const email = gitConfig("user.email");
      return { raw: email === null ? name : `${name} <${email}>`, kind: "git" };
    }
  }
  try {
    return { raw: `${userInfo().username}@${hostname()}`, kind: "system" };
  } catch {
    return null;
  }
};

/** The identity, resolved and stored-form-ready. A typed identifier is
 * the consented words themselves; a derived one is encoded before it
 * exists as text anyone will store. */
export const resolveIdentity = (source: { name?: string; system?: boolean }): Identity | "unresolvable" => {
  const typed = typeof source.name === "string" && source.name.trim() !== "" ? source.name.trim() : undefined;
  if (typed !== undefined) return { line: `${typed} (a typed legal identifier)`, kind: "typed", raw: typed };
  const d = derivedRaw(source.system === true);
  if (d === null) return "unresolvable";
  return { line: `${encoded(d.raw)} (the ${d.kind} identity of the environment, encoded)`, kind: d.kind, raw: d.raw };
};
