---
name: docodego-govern
description: Use for governance work — adversarial spec grilling, post-implementation validation, drift checks, the intent review, convention promotion, and measurement (AAR/GTR/SDL/DDL). Governance is an overlay across all phases, not a phase at the end.
version: 1.0.0
---

# docodego-govern — govern posture (GO)

*Reference: the planted framework, [.docodego/.framework/](../../../.docodego/.framework/README.md).*

Standing posture: produce an auditable reasoning trace for every non-trivial decision — no black boxes. If you cannot produce one, say so rather than simulating one. Respect declared scope limits. Report confidence; pause below threshold rather than proceeding. The human holds kill-switch authority — respect a halt immediately and leave the system consistent.

## Grilling (pre-composition governance)

Grill a spec directory adversarially after it passes the ICS gate, and record the round with `docodego grill <unit>`. The grilling reads the spec, its `Uses` foundations, and the actual code, then returns 10–15 pointed questions with "why it matters" — questions only, never fixes — adversarial by design (race conditions, state gaps, security surfaces, leaks, error propagation, integration risks, unstated assumptions, untestable criteria). The author answers every question, updates the files, and re-scores if `spec.md` changed. Cross-validation rule: **the author is never the sole scorer of their own spec.**

## Post-implementation validation

On request, after completion, or when revisiting a feature:

1. Read the spec set; compare against the implementation.
2. Flag divergences: behavior in code but not in spec → add to spec; behavior in spec but not in code → regression or intentional removal, name which; stale `Uses` references → fix.
3. Spec updated → re-score, bump version, human approves.

## The drift log and the intent review

Weekly, 30 minutes, three segments — the numbers are inputs; drift-log entries and refinement tasks are the outputs:

| Segment | Questions | Output |
|---|---|---|
| Drift check | Did deliveries pass criteria? Anything technically correct but felt wrong? Unpredicted behavior? | drift log entries |
| Spec health | Specs unclear, outdated, too broad, blocked? Deployment learning that changes a spec? | refinement tasks → next DO |
| GO signal | All deliveries reviewed? AAR threshold, confidence breaches, scope violations? | escalation items |

No drift items and no refinements for weeks → governance is not looking hard enough.

## Measurement

From the delivery log: acceptance-at-rate (AAR < 50% → pause and investigate; declining over three cycles → trigger regardless of value; GTR 0% for months at autonomy → governance asleep) and SDL/DDL trends (rising SDL → look for falling ICS two cycles back; high DDL → criteria weren't instrumented as monitors). *(Tooling note: the analyzer scripts are referenced designs, not yet adopted everywhere — compute the metrics from the delivery log directly until they are, and record them in the delivery record.)*

## Convention promotion

A pattern appearing in **3+ specs** may deserve promotion: project-wide laws → `.docodego/03-rising/system/foundation/<area>.md`; agent rules → [AGENTS.md](../../../AGENTS.md). Add the rule, replace inline occurrences with references, human approves. Not before three occurrences.

## Arc seam

Drift logs and intent-review outputs are evidence for the product-scale integrity checkpoints (`docodego-nurturing`, `docodego-leaving` — upstream of the planted seed). The loop's GO answers "does output match intent?"; the Arc's question — "can you still stand behind this?" — belongs to the human. Supply the evidence; never answer it for them.

## Common mistakes

| Mistake | Fix |
|---|---|
| Governance as end-of-cycle event | It is an overlay — grill before, validate after, review weekly |
| The griller suggesting fixes | Questions only; fixes belong to the author |
| Simulating a reasoning trace | If you can't produce one, say so |
| Metrics as the output | Metrics are inputs; drift entries and refinement tasks are outputs |
| Promoting conventions early | Three occurrences, then promote |
| Ignoring a halt to "finish cleanly" | Halt immediately; consistent state, then stop |
