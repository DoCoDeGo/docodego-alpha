---
name: 180-spec7-ics-2
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 180-spec7-ics-2

## intent

Write the ICS 2.0 redesign proposal the founder commissioned ("ICS in my
opinion needs a significant uplift and redesign… We should be willing to
add more dimensions if they make sense responsibly", cycles.md cycle 2,
verbatim) and deliver it to founder review — acceptance is the founder's,
not the loop's. This unit ships a document, not code: no shipped behavior
changes until the founder accepts a direction.

The drift it answers is measured, not asserted: the spec's normative text
(apps/spec/dist/SPEC.md) defines FOUR dimensions — completeness,
testability, unambiguity, threat coverage — with three floors (≥60/100
total, ≥15 of 25 on threat coverage, no dimension at zero); the shipped
tool (apps/cli/src/passes/score.ts) runs FIVE passes — completeness 25,
unambiguity 25, testability 25, threat 15, anti-gaming 10 — so the threat
pass maxes at 15 (the spec's own floor is unreachable as written), the
anti-gaming pass exists nowhere in the normative text, and the
no-dimension-at-zero floor is enforced by neither the scorer nor the
delivery gate (the gate reads only the total).

## scope

In: the proposal document — the drift statement with citations; the
redesign principles (satisfiability as a gate-level check; deterministic
checks first; judged work labeled as judged); a classification of every
incumbent pass; dimension-addition criteria plus candidate dimensions for
the founder to accept or decline; a migration path from the incumbent
five-pass form with named options and trade-offs; the enumerated founder
decision points; the follow-up path for the gate family (grill, coverage)
under the same scrutiny.
Out: any change to score.ts, deliver.ts, or the canon text (those are
post-acceptance children); a full grill redesign (the proposal names the
path only); adopting any candidate dimension (that is the founder's call).

## acceptance

- AC1 — the proposal states the drift precisely, citing both sides by
  file and line: the spec's four dimensions and three floors, the tool's
  five passes and maxima, and the two floors no code enforces.
- AC2 — the proposal specifies satisfiability as a gate-level check: the
  definition (every criterion names an observation that could fail it),
  the refusal rule (unsatisfiable ⇒ gate refusal regardless of total),
  and at least one worked example drawn from this repo's own record.
- AC3 — the proposal classifies every incumbent pass as deterministic or
  judged-proxy, and specifies the honest-labeling output shape (a score
  report a stranger can read and see which numbers a machine verified and
  which are proxies), citing the LLM-judge instability evidence.
- AC4 — the proposal states dimension-addition criteria (what earns a new
  dimension) and presents candidate dimensions WITHOUT adopting them.
- AC5 — the proposal lays the migration path from the incumbent form:
  named options with trade-offs, what happens to each of the five passes,
  the floor, and the delivery gate; plus the follow-up path for grill and
  the other gates.
- AC6 — the enumerated founder decision points are explicit and complete
  enough to answer in one sitting; shipped behavior is untouched (bundle
  verify byte-identical).

## threats

- The proposal redesigning by fiat — shipping opinions as decisions.
  Mitigation: every design claim is an option with trade-offs; the
  decision points are the founder's; the unit delivers a proposal, and
  the loop's own gate cannot accept it.
- Grounding drift in the tool only (scoring the incumbent unfairly)
  while the canon text is the normative side. Mitigation: AC1 cites both
  sides; the proposal reads the spec first.
- Scope creep into implementing the accepted design. Mitigation: the
  unit's Out scope names implementation as post-acceptance children; AC6
  proves shipped behavior untouched via bundle verify.
