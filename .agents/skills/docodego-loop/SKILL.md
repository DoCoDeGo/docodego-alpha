---
name: docodego-loop
description: The standing DoCoDeGo workflow. Use for any non-trivial engineering task — it enforces the DO→CO→DE→GO loop by default, refuses specless generation, and routes to docodego-document (author), docodego-compose (implement), docodego-demonstrate (deliver), docodego-govern (oversee).
version: 2.0.0
---

# docodego-loop — the standing workflow

*Reference: the record index, [.docodego/README.md](../../../.docodego/README.md), and the statutes it points to.*

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

Units live where the CLI puts them: `docodego new <name>` scaffolds
`.docodego/01-document/01-discover/<name>/` (epics land there too, stories
in `02-refine/`; `--stream` moves a unit to the stream where its work
happens). The unit directory holds what the commands earn, nothing more:
`spec.md` (the contract — intent, scope, acceptance, threats), `grill.md`,
`score.md`, `proofs.md`, `delivered.md`. A complex unit may grow
`assurance.md` and `deliverables.md` beside the spec (see
`docodego-document`); `explore.md` and `plan.md` are scratch you may add —
ephemeral, deleted at completion. A terse library fact belongs in a
`knowledge/` note under `01-document/` — never a spec, never scored.

Status is earned, never hand-written: `draft → grilled → scored → delivered`.
Delivered units are the record of what the system does; a project that grows
large may retire them into a `system/behavioral/` practice — named `a-*`
behaviors, re-checked on touch — but nothing plants that on day one.

## Permitted deviations (document them or don't take them)

| Case | Rule |
|---|---|
| Trivial change (typo, comment) | No spec — the test: could a user or downstream system observe the behavior change? If yes, spec it. |
| Production emergency | Patch first; spec updated within one cycle. |
| Exploration / spike | No spec, but a spike's output is input to a spec, never a deliverable — delete spike code before CO. |

An undocumented deviation is the road back to specless generation.

## Arc awareness

If the task has no product thread at all — no grounded idea behind the repository, or the user is deciding *whether* rather than *how* — that is not loop territory; route through the `docodego` locator to the Arc family. The loop governs fidelity (output matching intent); it cannot answer whether the intent is worth having.
