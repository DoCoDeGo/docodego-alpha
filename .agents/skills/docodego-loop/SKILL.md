---
name: docodego-loop
description: The standing DoCoDeGo workflow. Use for any non-trivial engineering task — it enforces the DO→CO→DE→GO loop by default, refuses specless generation, and routes to docodego-document (author), docodego-compose (implement), docodego-demonstrate (deliver), docodego-govern (oversee).
version: 1.0.0
---

# docodego-loop — the standing workflow

*Reference: the planted framework, [.docodego/.framework/](../../../.docodego/.framework/README.md).*

For any non-trivial task, run the loop. Never generate implementation before a specification exists and has scored ICS ≥ 60 — the spec is the contract. When output fails an acceptance criterion, return to the spec and correct the intent; do not patch the output. After delivery, state plainly whether what shipped matches what was specified.

## The loop

```
DO (document) → CO (compose) → DE (demonstrate) → GO (govern) ─┐
  ↑                                                             │
  └──────────────────── feedback ◄──────────────────────────────┘
```

| Phase | Skill | Trigger |
|---|---|---|
| Author specs | `docodego-document` | "write specs for X"; new feature / improvement / bugfix / refactor |
| Implement from specs | `docodego-compose` | spec files exist, asked to build |
| Deliver on validation | `docodego-demonstrate` | acceptance criteria met, delivery approaching |
| Oversee and feed back | `docodego-govern` | grilling, drift checks, post-implementation validation, intent review |

## What to refuse

- **Composing against a spec below ICS 60.** Offer to fix the spec instead.
- **Generating code for a task with no spec.** Offer to author one via `docodego-document`.
- **Silently assuming through spec ambiguity.** Flag it visibly; never guess.

## Spec home and lifecycle

Specs live at `.docodego/03-rising/new/<category>/<name>/` — categories `features/`, `improvements/`, `bugfix/`, `refactor/` (plus `knowledge/` for terse single-file library notes — not specs, never ICS-scored). Each spec is a directory: `explore.md` (scratchpad), `spec.md` (lean intent), `assurance.md` (verification contract), `deliverables.md` (execution contract), `plan.md` (ephemeral, deleted at completion). Status frontmatter: `draft → in-progress → implemented`. Implemented specs move to `.docodego/03-rising/system/behavioral/` as living documentation.

## Permitted deviations (document them or don't take them)

| Case | Rule |
|---|---|
| Trivial change (typo, comment) | No spec — the test: could a user or downstream system observe the behavior change? If yes, spec it. |
| Production emergency | Patch first; spec updated within one cycle. |
| Exploration / spike | No spec, but a spike's output is input to a spec, never a deliverable — delete spike code before CO. |

An undocumented deviation is the road back to specless generation.

## Arc awareness

If the task has no product thread at all — no grounded idea behind the repository, or the user is deciding *whether* rather than *how* — that is not loop territory; route through the `docodego` locator to the Arc family. The loop governs fidelity (output matching intent); it cannot answer whether the intent is worth having.
