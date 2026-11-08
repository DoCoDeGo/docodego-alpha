---
name: 530-encoded-signature-identity
type: unit
status: launch-passed
---

# 530-encoded-signature-identity

## intent

The founder's ruling (cycle 8, verbatim in cycles.md): the signing
storage flips from one-way to reversible. "Signing it with a machine
has no meaning if others cannot tell who signed it… encoding seems to
be perfectly fine to hide the identity and only reveal it when needed.
We only need to make it difficult enough to identify someone without
DoCoDeGo CLI." The privacy concern is named precisely — plaintext
names or system names on GitHub — and the ruled bar is obfuscation
against a casual read, not cryptography. This reverses the sketch
`sketch-readable-signature-identity.md`'s recommendation (whoami
re-derivation), which recorded the decode design as open for exactly
this founder decision; the sketch stands as history, the ruling
supersedes it. The consent split's spine is untouched: a typed
`--name` stays verbatim; a derived identifier is still never stored
as it stands — it is stored as `enc:v1:<base64>`, a versioned
reversible encoding the CLI reveals on demand (`docodego whoami`,
`--decode <value>` for any row). The 1.2.4 law wording ("versioned
fingerprint… privacy, not anonymity") is revised by a fresh amendment
scaffold (1.2.5-EL-34), landing mechanism and scaffold together — the
480 ordering — with the law text itself moving only on the founder's
sign-off. Existing `fp:v1` rows (430's signature, the 1.2.4 receipt)
stand as recorded — append-only, no scrubbing — and the salt file
stays committed as their historical key.

## scope

In: `identity.ts` — derived identities encode (`enc:v1:<base64>` of
the raw git-or-system string) instead of fingerprinting; the scrypt
fingerprint and salt creation leave the sign path (the salt file is
never deleted or rewritten — legacy rows keep their key); a
`decodeEncoded` reader. A new `docodego whoami` command: what this
environment derives (plain, to you), the stored encoded form, and
`--decode <value>` revealing any encoded row — the team-visibility
surface the ruling asks for; `fp:v1` values refuse decoding with the
honest message (one-way by design). `sign` and `sign-off` storage and
prose move to the encoded wording ("encoded" replaces
"fingerprinted"; the honest clause repriced: concealment from the
casual read, not cryptography — the CLI reveals on demand, and one
step of curiosity does too). The signatures-ledger template prose in
the payload. The 1.2.5 amendment scaffold at
`spec/amendments/1.2.5-EL-34.md` (draft, pending block, carrying the
proposed law wording and naming the traded property: the encoding is
deterministic across records — the salt's cross-record unlinkability
is what it cost). The payload hop to record version 27 with the
v26→v27 migration teach (AGENTS.md sign line reworded in place, the
whoami line added). Help registry + generated docs. Conformance: the
fp pins become enc pins, the whoami block pins the round-trip and the
fp refusal, the teach contract is pinned. Out: any change to the
1.2.4 law file, SPEC.md version stamp, or statutes mirror (all
founder-sign-off-gated); typed-name behavior; the tier rails; the
`--yes`/one-signature mechanisms; retroactive changes to existing
rows.

## acceptance

- A derived sign (unit or amendment) stores
  `enc:v1:<base64>` — the raw environment string never appears as it
  stands; a typed `--name` row is byte-identical verbatim.
- `docodego whoami` prints the plain derivation, its kind, and the
  exact stored form; `whoami --decode <enc-value>` returns the plain
  string (round-trip pinned in conformance); `--decode` of an
  `fp:v1` value refuses with the one-way honesty; the command works
  without a record layer.
- The salt file is never created anew by the sign path; existing
  salt files and `fp:v1` rows are untouched by any command.
- The 1.2.5 scaffold exists in the law tree's shape, draft, pending
  block intact, `docodego sign-off` runnable against it.
- The record payload declares version 27 with the v26→v27 teach in
  the registry (contiguous, no gaps); a v26 fixture upgrades cleanly;
  the live AGENTS.md carries the same sign-line bytes the scaffold
  ships.
- The full battery holds: check, conformance at its new count,
  bundle:verify at spec 27, doctor zero errors, docs fresh.

## threats

- The biggest threat to landing: the honesty law inverted by the
  unit's own prose — "encoding" quietly claimed as privacy somewhere
  in the help, the template, or the scaffold. Mitigation: one honest
  clause, repriced once, used everywhere ("concealment from the
  casual read, not cryptography"), pinned in conformance so a drift
  to over-claiming fails the suite.
- Second: the cross-record correlation trade going unrecorded — the
  salt existed to make identities unlinkable across records, and the
  encoding gives that up silently if the scaffold does not say so.
  Mitigation: the scaffold's risk paragraph names the property lost
  in plain words, so the founder signs with open eyes.
- Third: scrubbing gravity — the old fp rows and salt are exactly
  the kind of "stale" artifact a cleanup deletes. Mitigation: scope
  says rows stand and the salt stays; no command in this unit writes
  to either.
