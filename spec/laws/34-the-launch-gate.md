---
id: EL-34
title: The launch gate
pillar: record
severity: veto
enforced-by: launch — the launch gate over a delivered unit; sign — the signature gate over a launch-passed unit; the CLI is the only status writer
introduced-in: 1.1.0
status: active
---

# Engine law 34 — The launch gate

*Pillar: record — delivery ends the loop's own judgment; what happens
after it needs gates that are not the loop grading its own homework.*

## The law

A delivered unit is the loop's acceptance of its own work — it proves
the contract held, not that the system should ship. Two tiers stand
beyond it, and each is written by the gate that earned it, by nothing
else:

**launch-passed** — the unit's evidence survives a fresh audit of
reality: the delivered receipt on file, every proof path still
resolving (evidence that vanished since delivery proves nothing, and
the vanished paths are named), the record's own check pass error-clean,
and the delivery rows present in the tracker and the delivery log. The
gate refuses on any failed check and records the attempt; the tier is
never written over a refusal.

**founder-signed** — a named person attested the act. The signature is
an act receipt: who (a typed identifier or handle, recorded verbatim; an
identifier the engine derives from the environment is recorded as a
versioned fingerprint of it, never as it stands), what role, when (the
local calendar date), over what evidence (the sha256 of the unit's spec
and delivered receipt at signing time). The tiers are strict — no
signature without launch-passed, no bypass flag — and one signature per
act: a second signature rewrites a record the ledger keeps once, and is
refused.

The signature's honest limit, stated wherever the record shows one: a
signature is an attestation by command execution. It witnesses that
the named person ran the signing command over the named evidence. It
does not cryptographically prove the human's identity, and no output
of the record may claim otherwise. What it buys is accountability: a
person put their name on an act, and the act's evidence is hashed to
what stood on disk when they did. A fingerprinted identifier is
privacy, not anonymity: it resists a stranger's lookup, not a
determined guesser who already suspects the environment.

## Why

The loop's gates guard the loop's own work; every one of them is the
system grading its own homework. The commissions that matter — a
production release, a boundary decision, a public claim — deserve a
gate the loop cannot grant itself. The launch gate re-opens the
evidence to reality (proofs still exist, the record still checks
clean) instead of trusting the moment of delivery; the signature gate
puts the act in a named person's hands instead of the agent's. And the
honest limit is the point: a record that pretended its signatures were
cryptographic would be manufacturing the very fiction this system
exists to refuse.

## Violation

A launch-passed unit whose evidence no longer resolves; a founder-signed
unit with no signature receipt, or with a receipt whose evidence hashes
no longer match the files they hashed; a status moved to either tier by
hand; a bypass flag that signs over an unlaunched unit.

## Conformance

Checked today: `docodego launch` runs the four checks over the
delivered unit and refuses naming what failed; `docodego sign` requires
launch-passed (refused otherwise, no bypass), appends one row per act
to the signatures ledger, writes the unit's receipt with the evidence
hashes, and refuses a second signature of the same act; frontmatter
validation accepts the two tier statuses and nothing beyond them. The
statuses ride EL-33's rails law: gate-written only, forward only.
Direction: the audit sweep gains a launch-tier check (a launch-passed
unit's proofs re-resolve on every sweep, not only at launch time) as a
follow-up unit in the record's debt map.
