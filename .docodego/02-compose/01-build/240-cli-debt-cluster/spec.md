---
name: 240-cli-debt-cluster
type: unit
epic: 020-canon-debts
status: delivered
---

# 240-cli-debt-cluster

## intent

Cluster 4 of the debt epic: the open items in the cli-law audit, the
record-integrity audit's checker-coverage classes, and the dogfood
round — reconciled against what spec-7 already landed. The cli-law
audit's 29 items were written against the pre-spec-7 CLI: the
governance pass (220) landed items 1/3/29, the shelf (210) landed 7,
the tiers (190/200) landed 16, two calendars (170) landed 24, the
conformance growth landed 28's substance. What remains open is the
writer side of the status machine: the commands can still mint
incoherent state that check then condemns — score mints `scored` with
zero grill (13), re-score silently demotes a delivered unit (14),
grill-fail cannot demote (15), re-delivery doubles every landing row
(17 — this record's own 210 carries the doubling as live evidence), and
the gate re-parses prose instead of recomputing (10). Plus the small
mechanicals: status vocabulary invisible to check (2), hard-coded
board counts (22), absolute proof paths never resolve (23), DG-U013's
message (18). This child lands the writer-side batch, repairs the
doubled rows the re-delivery bug left in this record, and names the
deep remainder (satisfiability, strikes, proof classification, rails)
to its owning drafts and future children.

## scope

In: `score` refuses a unit with no grill record (13) and refuses a
delivered-class unit (14) — the refusals name the fix; `score` appends
a dated `# score` block (last block wins) carrying a `spec-sha:` line,
instead of rewriting (12); `setStatus` gains the transition law as a
shared helper the writers call — forward moves legal, the one backward
move legal is grill-fail demoting a delivered-class unit to `grilled`
with a mandatory `demoted` tracker row (15); `deliver` refuses an
already-delivered unit (17); G2 recomputes `scoreSpec` at the gate and
verifies the spec-sha — mismatch fails stale (10, 20a); `check`
validates the status vocabulary (2, DG-C015); the board's counts derive
from STATUS_VALUES with an other bucket (22); absolute proof paths
resolve (23); DG-U013's message states the home rule (18); the doubled
210 tracker/delivery-log/delivered.md rows struck with a repair note
(17's live evidence); conformance fixtures for every new refusal; the
stale facts in docs/record-format.md, docs/architecture.md,
docs/review-dimensions.md refreshed.
Out: the scorer's satisfiability redesign (9 — the ICS 2.0 proposal,
180-spec7-ics-2, owns it); struck-criteria semantics (11); proof
classification and grill-citation existence checks (4, 5, 19b — a
future proof-semantics child); the status rails and ship verdict (21,
29 — the EL-33 draft); the parked verb (candidate with the rails
child); the duplication minors 25/26/27 (a small refactor child).

## acceptance

- AC1 — the writer refusals hold: score without grill.md refuses
  naming the fix; score on a delivered-class unit refuses; deliver on
  an already-delivered unit refuses; grill-fail on a delivered-class
  unit demotes to grilled and appends a `demoted` tracker row — each
  proven by a conformance fixture through the real CLI.
- AC2 — the score is bound to the spec: score.md blocks append with a
  spec-sha line; G2 recomputes and fails stale with the sha mismatch
  named; a hand-edited `total:` no longer passes the gate.
- AC3 — check condemns a gibberish status (DG-C015) and the board
  counts every STATUS_VALUES status plus an other bucket; absolute
  proof paths resolve; DG-U013 states the home rule.
- AC4 — this record's doubled 210 rows are struck with a repair note,
  and the governance pass stays green on the repaired record.
- AC5 — no source docs touched; conformance green apart from the
  disclosed pre-commit drift gate (payload changes force it); tsc
  green; canon lint/verify green.

## threats

- The transition law bricking legitimate flows — re-scoring after a
  grill (the daily ritual) must stay legal: draft/grilled → scored is
  forward. Delivered-class is the terminal the law protects.
- Score-append breaking readers — score.md readers (G2, trace, status)
  must read the LAST block; the fixture re-scores twice and asserts the
  second block wins.
- The repair strike violating append-only — the doubled rows are
  struck (~~), never deleted, with a repair note row explaining the
  gate bug that produced them; the repair itself is recorded here.
