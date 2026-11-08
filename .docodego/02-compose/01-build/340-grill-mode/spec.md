---
name: 340-grill-mode
type: unit
epic: 020-canon-debts
status: delivered
---

# 340-grill-mode

## intent

Improvement item 13 — solo-grill honesty. The audit's law: "the form of
independence must not be recorded as the fact of it" — a round of
questions answered by the agent itself looks in the record exactly like
a round answered by a founder, and nothing distinguishes them. The unit
makes every grill round name its mode: `grill` gains `--by <who>`, and
the appended grill.md block opens with the round line — `- round:
self-grilled — the agent answered its own questions; the form of
independence is not the fact of it` when no --by is given, `- round:
answered by <who>` when it is. The answers scaffold teaches the flag,
the usage line carries it, and the conformance suite holds both modes.
This unit's own grill round (and every round after it in this record)
is recorded as self-grilled — the law applying to its authors first.

## scope

In: grillBlock's round line (template-docs.ts), the `--by` passthrough
in commands/grill.ts (the flag already exists in the args machinery for
sign), the usage line in the command and cli/help.ts, the scaffold
comment teaching it, gen-docs regen, and the conformance checks for
both modes. Out: any gate or refusal tied to the mode (IMP-13 records
honesty, it does not forbid solo grills — the floor and gates stand
unchanged); planted bytes (no record-contract bump); the evidence-per-
answer alternative from the audit (a stricter form, not taken).

## acceptance

- AC1 — a plain round records `round: self-grilled — the agent answered
  its own questions` in grill.md; a `--by Founder` round records
  `round: answered by Founder` — the grillmode checks in the
  conformance suite prove both.
- AC2 — the scaffold teaches the flag and the usage line carries it
  (the help text regenerates into the docs without drift).
- AC3 — the verdict and status machinery is untouched: pass/fail and
  the grilled status behave exactly as before (the existing grill
  fixtures stay green).
- AC4 — the suite green: conformance, tsc, canon (no payload change —
  the version pairs hold).

## threats

- A founder answers but nobody passes --by — the record says
  self-grilled and under-credits the human. Mitigated by teaching: the
  scaffold comment and the usage line name the flag; the failure mode
  is under-claiming independence, which is the honest direction (never
  over-claiming).
- The append-only grill.md gains a line — existing records' old blocks
  lack the round line and that is fine: the law is forward-looking, the
  old rounds are historical words (never rewritten).
