## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit makes grillBlock record the round's mode — a --by <who> flag on grill names the human answerer; without it the block opens with "round: self-grilled" saying plainly the agent answered its own questions; the scaffold comment, the usage line, and the help text teach the flag; conformance holds both modes.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the grillmode checks (a plain round records self-grilled, a --by Founder round records answered-by); AC2 by the scaffold text, the usage line, and the regen docs; AC3 by the existing grill fixtures staying green (verdict and status untouched); AC4 by conformance + tsc + canon with the version pairs unchanged — proofs/conformance.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: A founder answers without --by and the record under-credits the human. Mitigated by teaching (scaffold + usage); the failure direction is under-claiming independence, never over-claiming — the honest side.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Gates or refusals tied to the mode, planted bytes, the evidence-per-answer alternative, other IMP items — out.
- GQ-AC1 asked: Criterion: 'AC1 — a plain round records `round: self-grilled — the agent answered its own questions` in grill.md; a `--by Founder` round records `round: answered by Founder` — the grillmode checks in the conformance suite prove both.' — how is this verified end-to-end?
  answered: the two grillmode checks — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the scaffold teaches the flag and the usage line carries it (the help text regenerates into the docs without drift).' — how is this verified end-to-end?
  answered: the help regen — proofs/gen-docs.txt and the usage line in proofs/help.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the verdict and status machinery is untouched: pass/fail and the grilled status behave exactly as before (the existing grill fixtures stay green).' — how is this verified end-to-end?
  answered: the pre-existing grill fixtures green — proofs/conformance.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite green: conformance, tsc, canon (no payload change — the version pairs hold).' — how is this verified end-to-end?
  answered: proofs/tsc.txt, proofs/canon.txt.

verdict: pass
