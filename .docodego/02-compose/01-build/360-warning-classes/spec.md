---
name: 360-warning-classes
type: unit
epic: 020-canon-debts
status: delivered
---

# 360-warning-classes

## intent

Improvement item 14 — check warning classes. The audit's law: mark each
warning as `drift` (a real gap) or `prose` (cosmetic wording) so triage
does not cost an `explain` per code. Today every warning renders bare
(`warning[DG-C002]: …`) and an agent triaging a full check run pays a
page read per code to learn whether the finding is a defect or a
wording habit. The unit adds the triage class to the Diagnostic type,
renders it inline for warnings (`warning (prose)[DG-C002]`), and
classifies every warning site at its detector — the detector knows its
own nature. Unclassified future warnings read as `drift`: the safe
assumption, so the classification can never rot into silence. The
C002 family (absolute proof paths, quoted variants) is `prose` — honest
narration, cosmetic fix; every other warning is `drift`. The audit's
tooling nit (`node --test test/` under strip-types) was investigated:
no shipped doc teaches that invocation — moot, recorded here as the
finding.

## scope

In: the `class` field on Diagnostic (optional, drift | prose); the
renderer printing it for warnings only (errors need no class); the
detector-site classification across the passes (the C002 family prose,
everything else drift); conformance facts proving both classes render.
Out: errors and notes (unclassified by design); registry Rule rows (the
explain summaries — the class lives on the emitted Diagnostic, not the
catalog); any new warning code; planted bytes (no record-contract
bump); changing any warning's severity or message.

## acceptance

- AC1 — a prose-class warning renders as `warning (prose)[DG-C002]`
  and a drift-class one as `warning (drift)[DG-C018]` — the conformance
  facts assert both renderings on real runs.
- AC2 — an unclassified warning still reads `warning (drift)` — the
  default is the code, proven by the same captures (no site emits an
  unclassified warning today; the default is the rot-guard).
- AC3 — every warning site in the passes carries an explicit class (the
  C002 family prose, all others drift) — tsc holds the field's type,
  the suite holds the render.
- AC4 — the suite green with the version pairs holding (no payload
  change): conformance, tsc, canon.

## threats

- The classification itself drifting from reality (a prose-tagged code
  that is actually a defect). Mitigated: the class sits at the detector
  site next to the message it describes, so a message edit sees its
  class; the C002 prose verdict is recorded in this spec as the triage's
  evidence (absolute paths and quoted variants are wording habits, the
  gate's dead-path error still catches real loss).
- Process note (the repair rule, recorded honestly): the detector edits
  began while this spec was still being drafted — the loop law wants no
  implementation before a scored spec, so this note records the
  sequencing and the score below binds the spec as it now stands;
  repaired forward, never rewritten.
