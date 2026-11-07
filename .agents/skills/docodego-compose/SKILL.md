---
name: docodego-compose
description: Use when implementing from existing .docodego spec files. Verifies the ICS gate, reads the unit's contract in the right order, writes an ephemeral plan for human approval, then drives RED-GREEN-REFACTOR from the acceptance criteria with strict commit discipline.
version: 2.0.0
---

# docodego-compose — composition integrity (CO)

*Reference: the record index, [.docodego/README.md](../../../.docodego/README.md), and the statutes it points to.*

Stay inside the spec's scope — adding unrequested features is a governance event, not a favor. Honor negative constraints absolutely; do not engineer around them. Flag ambiguity visibly instead of guessing. Preserve invariants (business rules, data contracts, API contracts): they are not regenerable, and any change to them requires human review first.

## Pre-flight: the gate

Score the spec before reading anything else:

```bash
docodego score <unit>
```

(The gate runs through the CLI — `docodego score`; the threshold law is unchanged. Default threshold: 60.)

Below 60, Threat Coverage < 15, or any dimension at 0 → **stop**: "Spec scores <score>/100 — below the gate. Run docodego-document to fix it first." This gate is non-negotiable; composing against a 54-scored spec "to see what happens" costs more correction time than fixing the spec.

**A passing score is a floor, not a warrant.** The scorer checks the grammar of the criteria, never their truth — a spec can measure 100/100 and still carry five criteria no run could satisfy (the limits are set out under "What the score cannot see" in the `docodego-document` skill). So before RED: **re-run the command behind every figure a criterion names.** If a number cannot be reproduced, or a criterion has no observation that would fail it, stop and return to `docodego-document` — writing tests against an unsatisfiable criterion is the most expensive way to discover it.

## Read order (mandatory)

1. **spec.md** — why, scope, acceptance. It is the contract.
2. **Every reference the spec names, now** — never lazily.
3. **assurance.md and deliverables.md when the unit grew them** — criteria strategy, delivery units, commit rules. They refine execution; the spec controls it.

`explore.md` is context, not instructions.

## Architecture, then plan, then code

- The human declares architecture (component boundaries, integration points, non-negotiables) before generation. If none is declared, ask — do not invent it.
- Write `plan.md` in the unit directory: file paths, signatures, sequence, technology choices. **Human approves before any code.** If the user waives it, warn once (rework risk), proceed, and note the waiver. `plan.md` is ephemeral — deleted at completion.
- Statuses are earned by commands, never hand-written — compose works on a `scored` unit; `delivered` comes only from the gate.

## Execute: RED-GREEN-REFACTOR from the criteria

1. **RED** — failing tests written from the acceptance criteria (map criteria → tests in a comment block at the top of the test file: criterion, GIVEN/WHEN/THEN, test surface, what's mocked vs real).
2. **GREEN** — code to pass.
3. **REFACTOR** — clean up under green tests.
4. Verify integration assurance and regression signals when the unit carries them.
5. Commit per delivery rules: follow delivery units **exactly** — one unit = one commit, each commit passing its unit's criteria. After each unit, re-read that unit's criteria and verify they are actually satisfied — don't assume.

## Mid-composition changes (reconciliation)

An ad-hoc request ("also add X") is never silently implemented. Classify the gap, update the specs first, get approval, resume:

| Gap | Example | Files touched | Re-score? |
|---|---|---|---|
| **Small** (default) | missing edge case | one assurance line (or a threats line in spec.md) | no |
| **Medium** | new behavioral flow step | `spec.md` + `assurance.md` | yes |
| **Large** | scope fundamentally changed | all unit files + re-plan, possibly re-RED | yes |

## Completion

All criteria checked, all tests green → delete `plan.md`, run the Done When gates and the full test suite, then record proofs in the unit's `proofs.md` and run `docodego deliver <unit>` — the gate, not you, sets `delivered`. Report faithfully — failing tests are reported with raw output, never glossed.

## Common mistakes

| Mistake | Fix |
|---|---|
| Skipping the ICS pre-flight | Always score first; BLOCKED means blocked |
| Skipping the spec's own references | Read every named file before coding |
| Coding before plan approval | Plan, approve, then code |
| Code before failing tests | RED comes first |
| Inventing delivery units | Follow deliverables.md exactly when it exists |
| Silently absorbing ad-hoc requests | Gap-classify, update specs, approve, resume |
| Escalating small gaps | Default is small: one assurance line, keep moving |
| Leaving plan.md behind | Ephemeral — delete on completion |
| Hand-writing a status | Statuses are earned: grill, score, deliver |
