---
name: 220-spec7-governance-pass
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 220-spec7-governance-pass

## intent

The epic's last spec-7 child: "the governance pass law, closing the
loop." The audit command already grades governance on demand (GOV-001..006,
including status-verdict coherence), but `check` — the pass that runs
everywhere, before every delivery, after every upgrade — grades only
shape and evidence paths. The record's ledgers can silently disagree
with its units: a delivered unit whose tracker row was deleted, a
delivery-log that names units that do not exist, a status that
contradicts the latest grill verdict. The commission: the governance
pass in `check` — tracker, delivery-log, and latest-verdict coherence —
so the record grades itself as a whole, not just file by file.

## scope

In: `check` gains the governance pass as record findings — DG-C011
(error) a delivered-class unit (delivered, launch-passed, founder-signed)
with no tracker row naming it; DG-C012 (error) a delivered-class unit
missing from the delivery log; DG-C013 (warning) a delivery-log row
naming a unit that is not in the record; DG-C014 (warning) a status
contradicting the latest grill verdict; the verdict detector shared with
audit, whose GOV-003 keeps the error severity from the same one source
of truth; explain pages for the four codes; the law in the spec tree (a
governance-pass section in `spec/conformance/gates-and-severity.md`);
the canon tree bumps to 1.0.5 (1.1.0 stays reserved); conformance
fixtures for each new finding.
Out: new CLI verbs (the pass rides `check`); audit's GOV ledger ids and
rotating archive (shipped, unchanged in shape); status rails (a separate
epic line, not this child); any gate change to `deliver`/`launch`.

## acceptance

- AC1 — a delivered-class unit with no tracker row fails `check`
  (DG-C011, error); one missing from the delivery log fails it
  (DG-C012, error); a delivery-log row naming an absent unit warns
  (DG-C013); a status contradicting the latest grill verdict warns
  (DG-C014) — each proven by a scratch fixture through the real pass.
- AC2 — the verdict detector is one source of truth: audit's GOV-003
  and check's DG-C014 run the same exported detector, audit mapping it
  to errors, check to warnings; audit's GOV ledger shape is unchanged.
- AC3 — the law lands: `spec/conformance/gates-and-severity.md` gains
  the governance-pass section (what coherence means, the two
  instruments, the four findings); canon lint/verify stay green; the
  tree bumps to 1.0.5 with the log row closing SP-V004's circle.
- AC4 — this record itself passes the governance pass: every
  delivered-class unit has its tracker row and delivery-log row, and no
  status contradicts its latest verdict — `docodego check` on this repo
  runs the new findings clean of errors.
- AC5 — no shipped surface changes shape: no new verbs, no flag or
  status changes; conformance stays green apart from the disclosed
  pre-commit drift gate; tsc green.

## threats

- Brick-by-coherence — a stricter check refusing upgrades on records
  whose ledgers predate the pass. Mitigation: the two errors fire only
  for delivered-class units the gate itself wrote rows for — a
  gate-written record passes; the fixture for a clean record is part of
  AC1's suite.
- Double-reporting — the same incoherence surfacing twice in one audit
  run. Mitigation: AC2's single detector; audit reports it under GOV-003
  only.
- Law-as-vibes — the section restating help text instead of law.
  Mitigation: AC3's section states the duty, the instruments, and the
  findings with their codes; nothing else.
