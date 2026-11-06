---
name: docodego-compose
description: Use when implementing from existing .docodego spec files. Verifies the ICS gate, enforces the mandatory read order, writes an ephemeral plan for human approval, then drives RED-GREEN-REFACTOR from assurance criteria with strict commit discipline.
version: 1.0.0
---

# docodego-compose — composition integrity (CO)

*Reference: the planted framework, [.docodego/.framework/](../../../.docodego/.framework/README.md).*

Stay inside the spec's scope — adding unrequested features is a governance event, not a favor. Honor negative constraints absolutely; do not engineer around them. Flag ambiguity visibly instead of guessing. Preserve invariants (business rules, data contracts, API contracts): they are not regenerable, and any change to them requires human review first.

## Pre-flight: the gate

Score the spec before reading anything else:

```bash
docodego score <path-to-spec.md>
```

(The gate runs through the CLI — `docodego score`; the threshold law is unchanged. Default threshold: 60.)

Below 60, Threat Coverage < 15, or any dimension at 0 → **stop**: "Spec scores <score>/100 — below the gate. Run docodego-document to fix it first." This gate is non-negotiable; composing against a 54-scored spec "to see what happens" costs more correction time than fixing the spec.

**A passing score is a floor, not a warrant.** The scorer checks the grammar of the criteria, never their truth — a spec can measure 100/100 and still carry five criteria no run could satisfy (the limits are set out under "What the score cannot see" in the `docodego-document` skill). So before RED: **re-run the command behind every figure a criterion names.** If a number cannot be reproduced, or a criterion has no observation that would fail it, stop and return to `docodego-document` — writing tests against an unsatisfiable criterion is the most expensive way to discover it.

## Read order (mandatory)

1. **deliverables.md first** — scope, delivery units, commit rules. It controls execution.
2. **spec.md + every `Uses` reference now** (including the phase's foundation files) — never lazily.
3. **assurance.md** — criteria, edge cases, integration checks.

Never start with spec.md: deliverables says what, spec says why, assurance says how to verify. `explore.md` is context, not instructions.

## Architecture, then plan, then code

- The human declares architecture (component boundaries, integration points, non-negotiables) before generation. If none is declared, ask — do not invent it.
- Write `plan.md` in the spec directory: file paths, signatures, sequence, technology choices. **Human approves before any code.** If the user waives it, warn once (rework risk), proceed, and note the waiver. `plan.md` is ephemeral — deleted at completion.
- Set spec `status: in-progress` after plan approval.

## Execute: RED-GREEN-REFACTOR from assurance

1. **RED** — failing tests written from the acceptance criteria (map criteria → tests in a comment block at the top of the test file: criterion, GIVEN/WHEN/THEN, test surface, what's mocked vs real).
2. **GREEN** — code to pass.
3. **REFACTOR** — clean up under green tests.
4. Verify integration assurance and regression signals.
5. Commit per delivery rules: follow delivery units **exactly** — one unit = one commit, each commit passing its unit's criteria. After each unit, re-read that unit's criteria and verify they are actually satisfied — don't assume.

## Mid-composition changes (reconciliation)

An ad-hoc request ("also add X") is never silently implemented. Classify the gap, update the specs first, get approval, resume:

| Gap | Example | Files touched | Re-score? |
|---|---|---|---|
| **Small** (default) | missing edge case | `assurance.md` only | no |
| **Medium** | new behavioral flow step | `spec.md` + `assurance.md` | yes |
| **Large** | scope fundamentally changed | all three + re-plan, possibly re-RED | yes |

## Completion

All units committed, all criteria checked → set `status: implemented`, bump version if this revised an existing spec, delete `plan.md`, run the Done When gates and the full test suite. Report faithfully — failing tests are reported with raw output, never glossed.

## Common mistakes

| Mistake | Fix |
|---|---|
| Skipping the ICS pre-flight | Always score first; BLOCKED means blocked |
| Reading spec.md first | deliverables first — it scopes the work |
| Coding before plan approval | Plan, approve, then code |
| Code before failing tests | RED comes first |
| Inventing delivery units | Follow deliverables exactly |
| Silently absorbing ad-hoc requests | Gap-classify, update specs, approve, resume |
| Escalating small gaps | Default is small: one assurance line, keep moving |
| Leaving plan.md behind | Ephemeral — delete on completion |
