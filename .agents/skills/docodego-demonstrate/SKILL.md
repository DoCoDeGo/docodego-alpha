---
name: docodego-demonstrate
description: Use when delivering or preparing delivery — gating on validation instead of schedule, running acceptance and launch-readiness checks, and (in maintenance) re-demonstrating that the system still does what its specs say. The delivery unit is the specification, all or nothing.
version: 2.0.0
---

# docodego-demonstrate — demonstrate on validation (DE)

*Reference: the record index, [.docodego/README.md](../../../.docodego/README.md), and the statutes it points to.*

Delivery is gated by validation, not schedule. The unit of delivery is the specification — all or nothing; partial state requires explicit human authorization. Every demonstrated output includes telemetry: an unobservable system cannot be governed.

## The delivery gate, in order

1. **Proofs on disk.** For every acceptance criterion, record what ran into the unit's `proofs.md` — one list item per proof, naming a real file (`- AC1 — the suite ran: proofs/run.txt`). A proof that never showed red proves little: show the failing state first where feasible.
2. **Acceptance tests.** Every criterion has a corresponding test or observation; run them all. Any criterion failing → return to the spec: identify what it failed to express, correct it, regenerate. Do **not** hotfix output without updating the spec — that plants hidden divergence that resurfaces at the next regeneration.
3. **The gate.** `docodego deliver <unit>` — four checks (spec complete, score ≥ 60, grill verdict pass, a proof path that exists). Green: the CLI writes delivered.md, the tracker row, and the delivery-log row, and sets `delivered`. Red: the attempt is recorded in the tracker; fix what the gate names and retry.
4. **Launch-readiness audit.** Before production: the release-gate audit profile (security headers, accessibility, bundle gates). A system can pass acceptance and still fail launch. Fix blockers; decide important findings with the human.
5. **Visual verification.** For user-facing surfaces, run the relevant visual-verify workflow if one exists (a `visual-verify/` practice is earned as the product grows surfaces); write one if the surface is new. Human-or-AI-runnable scripts — not tests, not specs — one per surface.

## Telemetry and the record

- Map every acceptance criterion to a runtime signal where feasible — a criterion tested once at delivery but never instrumented can drift undetected for days.
- Record SDL (spec-approval timestamp → first-deployment timestamp) in the unit's records for trend analysis.
- The CLI writes the delivery-log row (`date, unit, gates, proof`). **Amend it by appending**: a follow-up row for the same unit that records what was learned — `passed_first_attempt`, `human_correction`, the lesson. The log is append-only; corrections are new rows, never edits.

## After delivery: the feedback duty

State plainly: does the delivered output match what was specified? Then state what was learned that should change the next specification. Feedback that never feeds back into DO is waste — hand refinement items to `docodego-govern` for the drift log.

## Nurturing posture: re-demonstration

In a live system this pillar is continuous, not per-release. On a signal (dependency bump, incident, quarterly review, spec touched):

1. Pick the affected delivered units — or, where the project has grown the practice, its `system/behavioral/` specs: the living record of what the system does.
2. Re-run their acceptance criteria against reality; re-run visual-verify flows for their surfaces.
3. Divergence found → either a regression (fix the code) or reality moved (reconcile the spec, human approves). Never let spec and system disagree silently — a `delivered` spec is a record of current reality that needs maintenance.

## Common mistakes

| Mistake | Fix |
|---|---|
| Shipping on schedule pressure with a failing criterion | The gate is validation; return to spec |
| Hotfixing output without touching the spec | Update spec + assurance, then fix — no hidden divergence |
| Accepting partial delivery silently | All or nothing, unless the human explicitly authorizes partial |
| Treating delivery as the end | State the learning; feed the next DO |
| Behavioral specs rotting after delivery | Re-demonstration is standing work in maintenance |
| No telemetry on delivered behavior | Unobservable means ungovernable — instrument the criteria |
