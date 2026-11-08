---
name: 520-sign-off-writes-the-record
type: unit
status: launch-passed
---

# 520-sign-off-writes-the-record

## intent

The founder's ruling (cycle 8, approving the cycle-7 finding verbatim
in spirit: "Everything else is approved"): a sign-off is a record act.
Today `docodego sign-off` writes only into the law file — the founder
signed 1.2.4 yesterday and the record layer held no trace of the act
except the created salt, exactly the gap they named ("When I sign, I
would expect the changes to take place under .docodego"). The fix:
sign-off writes the same dual-write the unit-sign path makes — one
signatures-ledger row (keyed by the amendment's id, act
`amendment-signed`) and one tracker row citing the amendment path —
after the receipt lands in the law file. The receipt stays the
evidence; the rows make the act visible to check, trace, and every
record reader.

## scope

In: sign-off loads the record (a sign-off without a record layer is a
DG-R001/2 fatal like any record command — the act belongs in the
record), appends the ledger row and tracker row after the receipt
write, and says so in its output and help body (help edit ⇒ docs
regen). Conformance: the sign-off fixture records init-first (the
record requirement), the typed row, the tracker row, the
refusal-appends-nothing pin, and the derived row carrying the
fingerprint. Out: no retroactive row for the 1.2.4 act (it predates
the machinery; hand-writing rows for past acts is fabrication — its
receipt in the law file is its evidence, and this unit is the forward
repair); no identity-encoding change (that is the signing-rethink
unit, next); no new refusal codes.

## acceptance

- A sign-off on a fixture record writes the signatures-ledger row
  (`| <date> | <amendment-id> | <identity line> | founder |
  amendment-signed |`) and the tracker row; the record's own check
  stays green with them in place.
- The refused second sign-off (DG-U115) appends no rows — the ledger
  is byte-identical before and after the refusal.
- The derived sign-off's ledger row carries the fingerprinted identity
  line; the typed row carries the verbatim name.
- A record-less amendment sign-off dies with the record fatal (the
  fixture proves init is now required).
- The help body names the record write; the generated docs match
  their registries; the full battery stays green.

## threats

- The biggest threat to landing: the record requirement breaking the
  existing sign-off fixture suite (its scratch records never ran init
  — they hand-wrote only the salt, which pre-loadRecord sign-off
  tolerated). Mitigation: the fixtures now init first — the same fix
  an adopter needs — and the suite pins the new requirement explicitly
  rather than discovering it as a mysterious fatal.

deviations: the implementation was written before this spec was
scored — the work ran ahead of the record during the same working
session; recorded as Mistake 7 in cycles.md, the spec scored before
deliver, and the delivered unit carries the order slip in its own
frontmatter rather than the history hiding it.
