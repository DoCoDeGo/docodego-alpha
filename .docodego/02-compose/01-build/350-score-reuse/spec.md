---
name: 350-score-reuse
type: unit
epic: 020-canon-debts
status: scored
---

# 350-score-reuse

## intent

Improvement item 12 — score reuse. The audit's scenario: a materially
revised spec inherits the old 100 with no marker; the number then
certifies content it never graded. Half the fix already exists — score
writes the spec's content hash into score.md (`spec-sha:`), and the
deliver gate G2 refuses a stale binding at delivery time. What is
missing is the standing surface: `check` is silent about a scored or
delivered unit whose spec hash no longer matches its recorded score —
the reuse warning. The unit adds it (DG-C018, warning): the same
last-block-wins extraction the gate uses, compared against the current
spec's sha16; a mismatch warns that the score describes an older spec
and names the re-run. Scored and delivered units alike — the audit's
case is precisely a delivered unit whose spec was revised afterwards.

## scope

In: the reuse warning in checkUnit (claims-score units, score.md's last
spec-sha vs the current spec sha16, warning DG-C017's neighbor
DG-C018); the explain page naming the fix; gen-docs regen; a
conformance fixture (score a unit, revise the spec body afterwards,
check warns; the untouched twin stays quiet). Out: any gate change (G2
already refuses at delivery — the warning is the standing light);
planted bytes (no record-contract bump); the scorer's satisfiability
question (R10-5's separate thread, not this item); IMP-3/14.

## acceptance

- AC1 — a scored unit whose spec body changes after scoring earns the
  DG-C018 warning on check, naming both shas and the re-run; the same
  record before the edit is quiet — the conformance fixture proves both
  sides.
- AC2 — the extraction is the gate's own law (last spec-sha line wins),
  so the warning and the G2 refusal can never disagree about which
  binding is current.
- AC3 — DG-C018 has its explain page naming the concrete fix, and the
  generated docs carry it.
- AC4 — the suite green with the version pairs holding (no payload
  change): conformance, tsc, canon.

## threats

- Warning fatigue — every spec edit after scoring warns until
  re-scored. Accepted: that is the point (the number certifies what it
  graded); the fix is one command away and the warning says so.
- The warning firing during the normal flow (score → deliver with no
  edit) would be noise — it cannot: the sha is written from the same
  bytes the unit carries; only a real post-score edit moves it.
