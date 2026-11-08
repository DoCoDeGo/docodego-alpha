/** identity — the signer's identity: source resolution, the consent
 * split, and the versioned fingerprint. The founder's ruling (2026-11-08,
 * recorded verbatim in the record's cycles log and the research report
 * `01-document/01-discover/research/sign-identity-privacy.md`): an
 * identifier a human typed is consent — it stays verbatim; an identifier
 * derived from the environment is machine noise — it is stored as
 * `fp:v1:<64 hex>`, a per-record-salted scrypt fingerprint, never as it
 * stands. The salt lives beside the ledger it keys
 * (`04-govern/signature-salt`), committed, create-only: the record stays
 * self-contained (clone-and-verify) and re-clone-stable (a regenerated
 * salt would silently reshuffle every fingerprint). The v1 tag freezes
 * the scrypt params (N=16384, r=8, p=1, 32 bytes) — a future change ships
 * as fp:v2, never re-tuned in place. The honest limit, stated wherever a
 * signature shows: a fingerprint is privacy, not anonymity — it resists
 * a stranger's lookup, not a determined guesser. */
import { randomBytes, scryptSync } from "node:crypto";
import { hostname, userInfo } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { readText, writeText } from "../fsx.ts";

export type IdentityKind = "typed" | "git" | "system";
export type Identity = { line: string; kind: IdentityKind; raw: string };

const SALT_PATH = join(".docodego", "04-govern", "signature-salt");
export const SALT_REL = SALT_PATH;

const gitConfig = (key: string): string | null => {
  const r = spawnSync("git", ["config", "--get", key], { encoding: "utf8" });
  const v = (r.stdout ?? "").trim();
  return r.status === 0 && v !== "" ? v : null;
};

/** The versioned fingerprint: scrypt over the raw identifier, keyed by
 * the record's own salt. Deterministic within a record (two rows, one
 * environment — one fp), unlinkable across records (each record's salt
 * differs). */
export const fingerprint = (raw: string, salt: string): string =>
  `fp:v1:${scryptSync(raw, salt, 32, { N: 16384, r: 8, p: 1 }).toString("hex")}`;

/** The record's salt: read the committed one, or create it once. A file
 * that exists but is not a 32-hex salt is refused (null) — regenerating
 * would orphan the linkability of every row already keyed to it. */
export const loadOrCreateSalt = (root: string): string | null => {
  const abs = join(root, SALT_PATH);
  const existing = readText(abs);
  if (existing !== null) {
    const t = existing.trim();
    return /^[0-9a-f]{32}$/.test(t) ? t : null;
  }
  const salt = randomBytes(16).toString("hex");
  writeText(abs, `${salt}\n`);
  return salt;
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
 * the consented words themselves; a derived one is fingerprinted with
 * the record's salt before it exists as text anyone will store. `salt`
 * comes from loadOrCreateSalt; null propagates (the caller refuses the
 * act rather than invent a key). */
export const resolveIdentity = (source: { name?: string; system?: boolean }, salt: string | null): Identity | "unresolvable" | "unsaltable" => {
  const typed = typeof source.name === "string" && source.name.trim() !== "" ? source.name.trim() : undefined;
  if (typed !== undefined) return { line: `${typed} (a typed legal identifier)`, kind: "typed", raw: typed };
  const d = derivedRaw(source.system === true);
  if (d === null) return "unresolvable";
  if (salt === null) return "unsaltable";
  return { line: `${fingerprint(d.raw, salt)} (the ${d.kind} identity of the environment, fingerprinted)`, kind: d.kind, raw: d.raw };
};

/** The salt's home: the record layer's governed directory at cwd —
 * sign-off can sign an amendment outside a record; the salt keys the
 * ledger the act will land in, so it lives where the act happens. */
export const saltRoot = (): string => process.cwd();
