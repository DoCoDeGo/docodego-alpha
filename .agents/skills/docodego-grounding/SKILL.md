---
name: docodego-grounding
description: Use when deciding whether to commit to an idea — "is this worth doing?", "should I build this?". Facilitates the 36-question grounding walk in strict order, places the idea on the plane (a picture, never a score), and offers redesign moves before any kill.
version: 2.0.0
---

# docodego-grounding — the Grounding (between thought and thing)

*Arc phase 2 — the only sequential phase. Integrity question: "Can you stand behind committing to this?" Questions: [questions.md](./questions.md) (vendored whole — the walk functions without any external source; the planted seed carries no second copy, this file is the questions' home).*

The walk takes a thought and tests it against reality before commitment. It is spec-grilling at life scale — and exactly here the mode flips: **the output is a picture, never a verdict.** No score, no pass/fail, no recommendation disguised as a number. The human decides; the walk makes the decision honest.

## Prerequisites

- A stated thought — ideally a finding record (`.docodego/01-document/01-discover/`, beside `intent.md`); minimally a paragraph of intent.
- **A stated goal first.** Layer III (Viability) is goal-conditional: "sustain a lifestyle business" and "venture-scale outcome" walk the same questions to different answers. No goal, no walk.

## How to facilitate

1. **Walk the six layers in order** — Reality → Timing → Viability → Fit → Defensibility/Durability → Integrity. Each layer assumes the previous; do not skip ahead ("but the market is huge!" is a Layer III answer offered during Layer I — park it).
2. **One question at a time. The human answers.** Record verbatim, then press for concreteness — the one place hard challenge belongs in an Arc skill: "That's a hope, not an observation. Have you *watched* anyone use the current alternative?" Challenge vagueness; never supply the answer.
3. **When a question doesn't pass**, consider three things in order: the evaluation may be wrong → re-examine the evidence; the question may not apply → declare it inapplicable *with a reason* (silence is not omission); the idea may be redesignable → note which redesign move might address it, finish the walk anyway.
4. **Conditionals:** 1.6 is for non-commercial ideas only. Layer V: defensibility path (5.1–5.5) for winner-take-most contexts, durability path (5.6) for fragmented or non-commercial ones — declare which and why.
5. **Session splitting:** 36 real answers rarely fit one sitting. Offer per-layer sessions; the record keeps state between them.

**Supported mode (proven in facilitated use):** the *facilitated research walk* — evidence layers researched and drafted by the facilitator; person-questions (goal, 1.5, 4.3–4.6, 6.6, integrity) supplied by the decision-maker in batches; **ratification by the decision-maker mandatory** — the record marks the division of labor explicitly, and their answers are recorded verbatim.

## Placement — the picture

After all layers, place the idea on the plane (impractical↔practical, unsustainable↔sustainable) into one of the eight regions: **solid ground** (proceed to validation) · **worth doing despite imperfections** (goal conversation) · **worth doing for its own sake** (clarify whether commercial sustainability is a goal) · **premature** (hold, with explicit re-read trigger conditions) · **misfit** (Layer IV: not this maker — give it away or set it down) · **shaky foundation** (Layer III addressable — redesign and re-walk) · **compromised** (Layer VI flags — repair or set down) · **not yet ready** (Layer I failing — sit longer).

For shaky foundation / premature / misfit, offer the **seven redesign moves** before any kill: geographic · segment · technology · distribution · bundling(/unbundling) · consolidation · goal. A redesigned idea gets a fresh walk, not an amended one.

The **five senses of sustainable** — financial, time, energy, social, mission — are answered separately (they surface in 3.6, 4.4, 4.5) and never conflated or summed. They are the maker's telemetry; they carry forward into Nurturing.

## The walk record

`.docodego/01-document/02-refine/walk_YYYY-MM.md`: frontmatter (date, goal as stated, layer-V path chosen); all 36 answers (or declared-inapplicable with reasons); the placement with its *reasoning*; redesign moves considered; the integrity answer verbatim; links backward to the finding record in `../01-discover/` and forward (filled when a repository is born). Re-walks are new files — never edit an old walk; the sequence of walks is itself the record of the idea maturing.

## Rules

- **Never score. Never rank walked ideas against each other numerically.**
- Every answer is the human's. Facilitate, challenge, record — do not author.
- A placement is not a command. "Solid ground" does not oblige building; "compromised" does not oblige abandoning. It obliges *honesty about which region you're choosing to act from*.
- Re-walk triggers: the goal changes, a redesign is applied, the world shifts (Layer II events), or a held idea's trigger conditions fire.

## Transition

Solid ground (or an honest, eyes-open choice from another region) + the human's yes to the integrity question → the birth of a repository. The promotion ceremony is a lifecycle skill upstream of the planted seed; until it is loaded, begin the new repository's record layer with `docodego init`, copy the founding intent verbatim into `01-document/01-discover/intent.md`, and record the walk's outcome beside it (`02-refine/` carries the walk; `cycles.md` gets the decision line).
