---
name: 310-event-order
type: unit
epic: 020-canon-debts
status: scored
---

# 310-event-order

## intent

Improvement item 10 — the canonical event order and the repair rule.
The loop paragraph of the planted AGENTS.md teaches the discipline
informally ("no implementation before a scored spec, no delivery
without a proof that exists") but never names the events, their order,
or what happens when a gate refuses — the repair rule lives only in
gate refusal messages and tribal memory. The unit makes it explicit in
the same paragraph: a unit's status events run in one order (`new` →
`grill` → `score` → `deliver`), and a refused gate records the attempt
in the tracker and re-enters at the refused step (re-score re-binds the
spec hash, re-deliver re-runs the checks) — the record repaired
forward, never rewritten. The move pays the bump chain again: record
contract 16 → 17 with a teach step, transition-table row, spec 1.0.8,
amendment row.

## scope

In: the event-order + repair-rule sentences in the loop paragraph of
the planted AGENTS.md; the v16 → v17 migration entry with a teach
step (same conservative contract as teachGateRowsHome); the transition
row; the spec version + amendment row; the payload regenerated; a
conformance fact (the payload's AGENTS.md row names the order) and a
teach fixture (insert + idempotence + customized-kept). Out: any new
gate or DG code (the order is already enforced by DG-U031 and the
deliver gates — the law states the duty); the other unowned IMP items.

## acceptance

- AC1 — the planted AGENTS.md's loop paragraph states the event order
  and the repair rule, and the regenerated payload ships it (the
  conformance fact reads the row).
- AC2 — the teach contract holds: shipped-v16 bytes gain the sentences
  in place, idempotent re-run, customized copy kept (fixture-proven).
- AC3 — the ladder is honest: registry 16 → 17 contiguous, the
  transition mirror green with the new hop, record manifest 16 → 17
  declared, bundle verify clean at the new pair.
- AC4 — the suite green at the new pairs (conformance, tsc, canon at
  spec 1.0.8 · delivered 1.0.8).

## threats

- Over-precision — naming the events could fossilize a flow that
  legitimately varies (a sketch unit moving fast still walks every
  gate, just quickly — the paragraph already says the loop is weighted,
  never forced). The sentences state the order of events, not a
  minimum time in each.
- The bump chain is mechanical now (walked twice, 290 and 300); the
  doctor holds the pairs.
- The repair rule must not read as "refusal is failure" — the wording
  keeps 300's honesty: the attempt recorded is the trail working.
