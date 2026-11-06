---
name: docodego-demonstrate
description: Use when delivering or preparing delivery — gating on validation instead of schedule, running acceptance and launch-readiness checks, and (in maintenance) re-demonstrating that the system still does what its specs say. The delivery unit is the specification, all or nothing.
version: 1.0.0
---

# docodego-demonstrate — demonstrate on validation (DE)

*Reference: the planted framework, [.docodego/.framework/](../../../.docodego/.framework/README.md).*

Delivery is gated by validation, not schedule. The unit of delivery is the specification — all or nothing; partial state requires explicit human authorization. Every demonstrated output includes telemetry: an unobservable system cannot be governed.

## The delivery gate, in order

1. **Acceptance tests.** Every criterion in `assurance.md` has a corresponding test; run them all. Any criterion failing → return to the spec: identify what it failed to express, correct it, regenerate. Do **not** hotfix output without updating the spec — that plants hidden divergence that resurfaces at the next regeneration.
2. **Regeneration check.** If this composition was regenerated from a revised spec, the regeneration checklist must pass (human-verified) before delivery is considered. *(Tooling note: the regeneration-runner and launch-audit integrations are referenced designs, not yet adopted everywhere — where absent, run their checklists manually and record the results in the delivery log.)*
3. **Launch-readiness audit.** Before production: the release-gate audit profile (security headers, accessibility, bundle gates). A system can pass acceptance and still fail launch. Fix blockers; decide important findings with the human.
4. **Visual verification.** For user-facing surfaces, run the relevant `.docodego/visual-verify/` workflow if one exists; write one if the surface is new. Human-or-AI-runnable scripts — not tests, not specs — one per surface.
5. **Deliver atomically.** Deploy when all gates pass; roll back on any partial failure.

## Telemetry and the record

- Map every acceptance criterion to a runtime signal where feasible — a criterion tested once at delivery but never instrumented can drift undetected for days.
- Record SDL (spec-approval timestamp → first-deployment timestamp) for trend analysis.
- Append the delivery to the delivery log (`spec_id, agent_id, passed_first_attempt, human_correction, escalated, notes`) — this feeds `docodego-govern`.

## After delivery: the feedback duty

State plainly: does the delivered output match what was specified? Then state what was learned that should change the next specification. Feedback that never feeds back into DO is waste — hand refinement items to `docodego-govern` for the drift log.

## Nurturing posture: re-demonstration

In a live system this pillar is continuous, not per-release. On a signal (dependency bump, incident, quarterly review, spec touched):

1. Pick the affected `.docodego/03-rising/system/behavioral/` specs — the living record of what the system does.
2. Re-run their acceptance criteria against reality; re-run visual-verify flows for their surfaces.
3. Divergence found → either a regression (fix the code) or reality moved (reconcile the spec, human approves). Never let spec and system disagree silently — an `implemented` spec is a record of current reality that needs maintenance.

## Common mistakes

| Mistake | Fix |
|---|---|
| Shipping on schedule pressure with a failing criterion | The gate is validation; return to spec |
| Hotfixing output without touching the spec | Update spec + assurance, then fix — no hidden divergence |
| Accepting partial delivery silently | All or nothing, unless the human explicitly authorizes partial |
| Treating delivery as the end | State the learning; feed the next DO |
| Behavioral specs rotting after delivery | Re-demonstration is standing work in maintenance |
| No telemetry on delivered behavior | Unobservable means ungovernable — instrument the criteria |
