---
name: spec7-proof-semantics
type: unit
status: scored
epic: canon-spec-7
---

# spec7-proof-semantics

## intent

Turn what the session learned about proofs and statuses into law text, by
amendment, ending at founder review. Proof semantics amends EL-18
(evidence-is-a-path), whose conformance line already admits unfinished
direction ("lint resolves every evidence path") — the amendment carries
the five semantics this session's own tooling proved out: a proof is a
path that resolves; a proof is reproducible (it holds what ran and what
came out, checkable by a stranger); failure is evidence (a run that
failed, recorded with the gap named, is an honest proof of state, never
hidden); narration is not claim (dead extra proof paths are warnings —
honest history — while every-path-dead is the error); and guards baseline
the last delivered state (in-unit iteration free, post-delivery drift
refuses). Status rails ride as a new law: statuses move through gates —
the CLI sets them, they never move backward, and a status change without
its gate is a rewritten record. The amendment procedure (meta/
how-to-amend.md) is followed exactly: scaffold, grill from a non-author,
founder signs. The flip, the log row, and the 1.1.0 bump commit together
only on acceptance — until then the tree stays at 1.0.2 with the
proposals pending, the chain unextended.

## scope

In: the EL-18 amendment text; the new-law draft (working title: statuses
move through gates); the amendment grilling (ten to fifteen questions
from someone other than the author, answered, revisions recorded); the
scaffolds via canon amend; proofs that the tree stays green with the
proposals present. Out: the founder's signature (mechanism arrives with
the launch-gate child; the decision is the founder's regardless), the
flip/log/bump (rides acceptance), ICS 2.0 (its own child), any statute
word change (rare, word-for-word recorded, not this batch).

## acceptance

- AC1 — canon amend scaffolds the EL-18 amendment with the anchor, the
  current version's hash, and the three questions (what changed, why,
  what risk), and the drafted text answers all three.
- AC2 — the EL-18 amendment text carries the five proof semantics and
  survives its amendment grilling: ten to fifteen questions from a
  non-author, every answer recorded, revisions visible.
- AC3 — the status-rails new-law draft reaches the same bar: grilled,
  answered, revised, with its enforceability named (which gate sets
  which status, what refuses a backward move).
- AC4 — the tree stays green with the proposals present: canon lint and
  verify exit 0; build and doctor stay byte-unchanged at 1.0.2 (no flip,
  the chain unextended).
- AC5 — the delivered state names the pending plainly: what the founder
  is asked to accept, and that flip + log row + bump ride the signature.

## threats

- Tired law: amendments are the highest-stakes work the System ships.
  Mitigation: the non-author grill is a gate, not a formality; the
  founder reviews before anything flips.
- Scaffold drift: a scaffold whose baseline hash goes stale as the tree
  moves. Mitigation: canon verify re-derives the chain; doctor holds.
- Scope creep: status rails dragging in gate redesign or ICS territory.
  Mitigation: the law describes the rails that exist and the CLI already
  enforces; nothing new is invented here.
