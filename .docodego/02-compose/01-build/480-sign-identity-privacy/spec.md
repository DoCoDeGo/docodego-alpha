---
name: 480-sign-identity-privacy
type: unit
status: scored
---

# 480-sign-identity-privacy

## intent

The founder's cycle-6 addendum (verbatim in cycles.md, design
recorded in `01-discover/research/sign-identity-privacy.md`): keep the
signed-by identifier — it may default to a unique system
fingerprint, optionally a name (`--system` / `--name "some name"`,
exact structure delegated to the studio) — and stop storing raw
environment identities in the clear, because "individuals won't
adopt this if they suspect their privacy is at risk". The engine
adopts the consent split: an identifier a human typed is consent and
stays verbatim; an identifier derived from the environment is
machine noise and is stored as a versioned, per-record-salted
fingerprint — never as it stands.

## scope

In: the identity surface for `sign` and `sign-off` — `--name "<identifier>"`
(typed, verbatim, secret-scanned) with `--by` kept forever as a
documented alias; `--system` (forces the environment identity,
skipping git); the no-flag default ladder unchanged (git → system);
`--name` + `--system` together refused by DG-U111 (one signer, one
source); derived identifiers stored as `fp:v1:<64 hex>` — scrypt
(N=16384, r=8, p=1, 32 bytes, stdlib only), params frozen by the v1
tag, salted per record (`04-govern/signature-salt`, 32 hex from
randomBytes, create-only, committed — the record stays self-contained
and re-clone-stable); receipt/ledger/sign-off wording gains
"`, fingerprinted`" plus the honest-limit clause "resists lookup, not
a determined guesser"; `--yes` and DG-U118 byte-for-byte untouched;
one-signature-per-act (DG-U113, status-driven) untouched; no new
refusal code (DG-U111 owns the conflict); conformance keeps every
`--by` pin green (they prove the alias) and adds: `--system` on a
git-configured fixture, the conflict refusal, the exact-hex pin
against a fixture-written salt, the uses-not-regenerates salt fact,
same-record same-fp, cross-record different-fp; the payload hop
v24→v25 — the batch that owes the chain — carrying `teachSignIdentity`
and the staged 470 second-use teach (from
`470-dual-use/teach-staged.md`; SW-023's twin-text dedup stays held —
its template-vs-teach site map is its own batch, recorded in proofs),
with the version-transition row mirroring and the doctor
axes aligning; the EL-34 amendment 1.2.4 scaffolded with the consent-
split wording — the founder's sign-off remains the unit's person-gate
before the law text lands.

Out: scrubbing or rewriting existing rows (append-only — the 1.2.3
sign-off's stored identity stands as recorded; strike-and-archive
would be a separate founder act); `grill`'s `--by <who>` (a different
surface, typed consent by definition); any uncommitted salt (a
committed ledger keyed to an uncommitted secret breaks
clone-and-verify); changing the derivation ladder's order; new refusal
codes; a payload version bump beyond 25.

## threats

- fp rows ship while the law still reads "recorded verbatim" — the
  exact command-vs-law drift the record's own verify exists to catch.
  Mitigation: AC9's ordering holds the amendment scaffold and names
  the founder's sign-off as the person-gate before the law text
  lands; the receipt's honest-limit clause claims only what scrypt
  enforces (resists lookup, not a determined guesser).
- cold records break — records taught the `--by` wording could refuse
  after the surface changes. Mitigation: `--by` is kept forever as a
  byte-identical alias; every existing conformance pin stays green
  unchanged; the v25 teach uses the anchor-teacher contract
  (customized copies keep their words, the refreshed copy rides as a
  `.new` sibling).
- the salt becomes a liability — a lost or divergent salt makes fps
  unverifiable or silently reshuffled. Mitigation: create-only writes
  (the first derived sign creates it, later runs use it or refuse),
  the file is committed with the ledger it keys, and the conformance
  fact asserts the CLI uses a pre-existing salt rather than
  regenerating.
- scrypt cost mis-tuned — too weak defeats the point, too strong
  makes signing slow. Mitigation: the params are frozen by the v1 tag
  at the conservative default (N=16384, r=8, p=1 — tens of
  milliseconds per sign); a change ships as fp:v2, never re-tuned in
  place.

## acceptance

- AC1 — a no-flag `sign <unit> --yes` on a git-configured record
  stores `fp:v1:<64 lowercase hex>` with the derivation kind named —
  and the raw git/system identity string appears in no written file
  (signature.md, the ledger, the tracker).
- AC2 — `--name "Ada Lovelace"` stores the name verbatim with
  "(a typed legal identifier)", and `--by "Ada Lovelace"` behaves
  byte-identically (the alias); the `--name` value passes through the
  secret scan.
- AC3 — `--system` on a git-configured record skips git and stores
  the system identity's fingerprint with kind `system`.
- AC4 — `--name` and `--system` together refuse exit 2 (DG-U111) and
  append nothing.
- AC5 — two units signed by one environment in one record share one
  fp value; the same environment signing in a second record (different
  salt) produces a different fp — linkability inside the record,
  unlinkability across records.
- AC6 — `sign-off` without flags writes the fingerprinted Identity
  line; with `--by`/`--name` it stays verbatim; the salt is used, not
  regenerated (the pre-written fixture salt survives the run).
- AC7 — wherever a signature shows (receipt, ledger template header,
  help bodies), the attestation limit carries the fingerprint clause:
  privacy, not anonymity — it resists a stranger's lookup, not a
  determined guesser.
- AC8 — the conformance pins are deterministic: the exact fp hex is
  computed in the fixture from a fixture-controlled salt and asserted
  byte-for-byte; no random output is pinned.
- AC9 — the amendment-before-flip ordering holds: EL-34 amendment
  1.2.4 is scaffolded (draft) with the consent-split wording in this
  unit, the record cites the founder's verbatim addendum as its why,
  and the founder's sign-off — the person-gate — is the named next
  act before the law text lands; no fingerprinted row is shipped
  while the law still reads "recorded verbatim" without the split.
- AC10 — the payload hop lands whole: recordVersion 25 with
  teachSignIdentity + the second-use teach (SW-023 stays held — the
  hop carries the two directed teaches; the dedup's site map is
  recorded as still-owed in proofs); version-transition.md carries the
  v24→v25 row; the doctor axes align (payload 25, cli, spec/,
  delivered) and bundle verify is green at the new payload.
