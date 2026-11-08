## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: `docodego sign-off` becomes a record act: after the receipt lands in
the law file it appends a signatures-ledger row (keyed by the
amendment id, act amendment-signed) and a tracker row — the same
dual-write a unit sign makes — and requires the record layer like
every record command, so the founder's signature is visible under
`.docodego/` without opening the law file.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The conformance sign-off fixture inits its records and pins each
fact through real command runs: the typed ledger row, the tracker
row, the refused-second-sign-off byte-identity of the ledger, the
derived row carrying the fingerprint, and the record fatal when no
record exists — plus the battery (check, conformance, docs:verify
after the help edit, bundle:verify) green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The biggest threat: the new record requirement breaking the existing
sign-off suite — its scratch records hand-wrote only a salt and
never ran init, which pre-loadRecord sign-off tolerated. Mitigation:
the fixtures init first (the same fix an adopter needs) and the
requirement is pinned as its own check, not discovered as a mystery
fatal. Second: tracker rows citing a path outside the record root
(the amendment lives in spec/) tripping a path pass — the fixture's
check runs green with the row present, proving no pass validates
tracker evidence against the record root.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: A retroactive ledger row for the 1.2.4 act (it predates the
machinery; hand-writing rows for past acts is fabrication — the
receipt in the law file is its evidence, this unit is the forward
repair); any identity-encoding change (the signing-rethink unit
follows); new refusal codes (DG-R001/2 already own the
no-record fatal); help registry restructure (one body line added,
docs regenerated).

- GQ-AC1 asked: Criterion: 'A sign-off on a fixture record writes the signatures-ledger row (`| <date> | <amendment-id> | <identity line> | founder | amendment-signed |`) and the tracker row; the record's own check stays green with them in place.' — how is this verified end-to-end?
  answered: The fixture signs amen1 with --by "Ada Lovelace" and asserts the
ledger line byte-exact (`| AMEND-NEW-EL-35-1.3.0 | Ada Lovelace (a
typed legal identifier) | founder | amendment-signed |`) and the
tracker naming the amendment id — both through `docodego check`
staying green with the rows present.

- GQ-AC2 asked: Criterion: 'The refused second sign-off (DG-U115) appends no rows — the ledger is byte-identical before and after the refusal.' — how is this verified end-to-end?
  answered: The ledger's bytes are captured before the refused second sign-off
and compared after: identical — a refusal appends nothing, the same
law the refusal message states.

- GQ-AC3 asked: Criterion: 'The derived sign-off's ledger row carries the fingerprinted identity line; the typed row carries the verbatim name.' — how is this verified end-to-end?
  answered: The derived sign-off (amen3, fixture salt) writes a ledger row whose
identity cell is the fixture-computed fingerprint line — asserted
byte-exact against scrypt computed in fixture code.

- GQ-AC4 asked: Criterion: 'A record-less amendment sign-off dies with the record fatal (the fixture proves init is now required).' — how is this verified end-to-end?
  answered: The record-less case: a scratch with no `.docodego/` record —
sign-off dies with the record fatal (exit 3 path), asserted by the
fixture now running init before its first sign-off plus the existing
refusals unchanged.

- GQ-AC5 asked: Criterion: 'The help body names the record write; the generated docs match their registries; the full battery stays green.' — how is this verified end-to-end?
  answered: The help body names the record write; `pnpm docs:verify` reports the
generated docs fresh; the battery — check, conformance at its new
count, bundle:verify clean, doctor at zero errors — green, named in
proofs.


verdict: pass
