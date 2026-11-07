# The loop

*How work happens: four movements, sixteen streams, one shape at every scale.*

## The four movements

| Movement | Verb | Streams | The duty asked |
|---|---|---|---|
| **Document** | mean it | discover · refine · validate · plan | the Author: is the intent clear? |
| **Compose** | make it | build · integrate · enhance · maintain | the Architect: is the design sound? |
| **Demonstrate** | prove it | demo · accept · release · deploy | the Gatekeeper: does the evidence hold? |
| **Govern** | own it | monitor · measure · retrospect · improve | the Governor: do we stand behind it? |

Every unit asks four questions, one per movement. These are duties, not job titles: a duty
is something you carry. One person can hold all four in a morning; a large team spreads them.
Agents take part in every duty; they hold none — "a duty is something you answer for, and an
agent cannot answer for anything." When the stakes rise, separate the duties by time, by
person, or by structure (the duty conflict rule).

Govern runs through everything: plan approval, the grilling's threat question, acceptance,
the signature on every receipt, and the authority to halt at any point. Its four streams hold
governance's own records. Improve feeds the next refine, so the loop closes.

## The unit and its loop

The unit is the smallest piece of work that can be built, proved and signed on its own.
Kinds of document, not places: an epic is a problem worth solving; a story is one decision
inside it; a unit is the smallest signable piece. Every unit runs the whole System in
miniature:

1. **spec** (mean it) — intent compiled into a form a person and an agent can both act on
   and check: what and why, acceptance criteria, the threat question, the release target, a
   stable identifier and a version. A section is left out only by saying so (the Declared
   Omission Rule).
2. **grill and score** (the spec's gates) — ten to fifteen hard questions from someone other
   than the author, every question answered (a clarification, a gap fixed, or an exclusion
   declared); then the Intent Clarity Score.
3. **build** (make it) — a person declares the structure, boundaries, integration points and
   constraints that do not bend, and approves the plan. Tests first, each seen failing; then
   code; then refactor. One unit, one commit.
4. **proofs** (prove it) — evidence that ran, witnessed, bound to the exact work, checkable
   by a stranger (EL-21…EL-23).
5. **receipt** (own it) — the unit's last act: its proofs, the spec version it was built
   against, what it taught, and the signature of a named person.

Each unit also moves through IRAF: **Intent**, the spec; **Reasoning**, the grilling and the
plan; **Action**, the build and the deploy; **Feedback**, the proofs and the signals from
use. The feedback stage is not optional — a unit without feedback has not finished its loop.

## Triggers, not calendars

The System schedules no ceremony. Work moves when something happens:

| Trigger | What it allows |
|---|---|
| spec approved | the work may be planned into the build |
| plan approved | building may start |
| criteria passing | the work may be demonstrated and accepted |
| drift seen | the work goes back to Document |
| a pattern seen three times | it is promoted to a rule with a test |

Drift sorts on two axes: from the **intent** (the spec was missing something, or the agent
invented something) goes back to Document; from **good engineering** (intent right, code
poor) goes back to Compose. An emergency patch owes the spec an update within one cycle
(ST-1). Fixing output again and again without fixing the intent is the Patch Spiral.

Sprints, release trains and change windows are an organisation's choices; the System does
not ask you to remove them. What flows through them changes: each window carries whole units,
each with a spec that passed its gate and a signed receipt or a stated reason for holding it.

## Sketches and graduation

A sketch is cheap, fast and free of governance: explore, try, throw away. Govern the
survivor, not the experiment. A sketch graduates into a unit when any of four things becomes
true:

- it meets **real users**;
- it touches **real data**;
- a **second person** must understand or change it;
- someone must **sign** it.

At graduation the sketch gets a spec, and from then on it runs the loop. What you must not
do is let a sketch drift into production without graduating: that is how one-shot work
becomes the system everyone depends on and nobody can explain.

## Adopting it

You do not adopt the System. You adopt one unit, and then another.

- **Alone:** the receipt and the grill. Sign every unit, and never be the only judge of a
  spec — separate the duties by time (write today, grill tomorrow; sign after a pause) and by
  structure (a fresh-context agent grills; the tool runs the proofs).
- **A small team:** the spec gate and the integrate rule — nothing enters the build without
  a spec that has passed its gate, and nothing is merged that its reviewer cannot explain.
- **An organisation with agents:** the modes, the invariants (EL-27) and the tested halt.
