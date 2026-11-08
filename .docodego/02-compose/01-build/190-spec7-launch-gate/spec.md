---
name: 190-spec7-launch-gate
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 190-spec7-launch-gate

## intent

The loop ends at `delivered`, but delivery is the loop accepting its own
work — the commissioning record (epic child 4) names the tiers the record
actually needs: delivered → launch-passed → founder-signed, and the
e-signature model that makes the last tier an accountable act by a named
person. This unit ships the launch gate: two new gate-written statuses
(`launch-passed`, `founder-signed`), the `docodego launch` command (the
launch-readiness audit over a delivered unit), the `docodego sign`
command (the founder's signature as an act receipt), and the canon-side
law draft (EL-34, riding the 1.1.0 amendment batch beside EL-18 and
EL-33) that names the rails the CLI now runs on.

The design obeys the rails law the 1.1.0 batch already carries (EL-33
draft): a status is written by the gate that earned it and by nothing
else; the chain moves forward only; a status without its gate's record on
file is a rewritten record, refused. It also states the signature model's
honest limit: a CLI signature is an attestation by command execution —
the record witnesses who claimed the act, when, over what evidence; it
cannot cryptographically prove the human's identity, and the law will not
pretend otherwise.

## scope

In: `STATUS_VALUES` grows the two tier statuses; `docodego launch <unit>`
(its gate: delivered-receipt present, proofs still resolve, record check
clean, tracker + delivery-log rows exist) sets `launch-passed` with a
receipt; `docodego sign <unit> --by <legal name>` requires
`launch-passed` and sets `founder-signed`, appending an act receipt
(who, role, when in the local calendar, what + evidence hashes, why) to
the append-only signatures ledger and the unit's own signature file; the
EL-34 law draft in the canon tree; conformance for the whole flow, both
refusals, and the receipts' content; help registry, completions, and
generated docs updated (docs:verify stays green).
Out: cryptographic signatures (the model is an attestation; the law says
so); a `--direct` bypass that signs without launch-passed (the tiers are
strict); the grill/coverage scrutiny children (they inherit the ICS
direction first); amending the accepted text (the EL-34 draft rides 1.1.0
unsigned, like its batch siblings).

## acceptance

- AC1 — the tier rails are gate-written: `launch` refuses a unit without
  `delivered` (its own code, exit 2, nothing written), `sign` refuses a
  unit without `launch-passed` the same way; `STATUS_VALUES` carries the
  two new values so frontmatter validation accepts them and nothing else.
- AC2 — the launch gate audits reality: all four launch checks
  (delivered.md present, every proofs.md path still resolving, `check`
  clean for the record, tracker + delivery-log rows on file) must pass —
  a unit with a vanished proof path refuses with the path named.
- AC3 — the signature is an act receipt: signing appends one row to the
  signatures ledger (`04-govern/signatures.md`, planted from a template
  on first sign) and writes the unit's `signature.md` — who (the
  `--by` name, verbatim), role, local-calendar date, the unit, sha256 of
  its spec.md and delivered.md at signing time — and sets
  `founder-signed`.
- AC4 — the EL-34 law draft exists at `spec/amendments/1.1.0-EL-34-new.md`
  in the batch's format (anchor, proposed law file, why, grilling), the
  canon suite stays green with the draft present (drafts ride outside the
  built tree until accepted), and it takes the next free law id.
- AC5 — both commands register everywhere the other commands register:
  the command registry, the help registry (`--help` honest), completions,
  and `docs:verify` regenerated green; the conformance LAW_COMMANDS list
  carries both names.
- AC6 — statuses move forward only: `launch` on a `launch-passed` unit is
  idempotent-calm (already passed, nothing rewrites), `sign` twice is
  refused as a rewritten act (one signature per unit; the record keeps
  one signature row per act), and no command in this unit moves a status
  backward.

## threats

- The signature theater trap: shipping a "founder-signed" status that
  proves nothing and implies cryptography. Mitigation: AC3's receipt
  names its own nature; the EL-34 draft states the attestation limit in
  the law text itself.
- Gate proliferation without enforcement (statuses that read as
  decoration). Mitigation: AC1/AC2 make both gates refusing, evidenced,
  and conformance-tested end to end.
- Drift between the two commands and the established command grammar
  (json envelopes, refusal codes, help). Mitigation: AC5's registration
  sweep and the conformance flow reusing the scratch-record harness the
  other commands prove themselves with.
