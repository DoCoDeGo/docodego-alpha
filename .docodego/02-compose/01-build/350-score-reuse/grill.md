## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit adds the reuse warning to checkUnit: for scored and delivered units, the last spec-sha line in score.md (the gate's own last-block-wins extraction) is compared against the current spec's sha16; a mismatch warns DG-C018 naming both shas and the re-score; the explain page and the regen docs carry the fix; a conformance fixture proves both sides.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the fixture (quiet before the post-score edit, DG-C018 after); AC2 by sharing the extraction law with G2 (last spec-sha line wins); AC3 by the explain page and the regen; AC4 by conformance + tsc + canon with the pairs unchanged — proofs/conformance.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Warning fatigue on every post-score edit. Mitigated: the warning names the one-command fix; the normal flow cannot fire it (the sha is written from the same bytes); the spec records the acceptance.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Gate changes, planted bytes, the satisfiability thread (R10-5), IMP-3/14 — out.
- GQ-AC1 asked: Criterion: 'AC1 — a scored unit whose spec body changes after scoring earns the DG-C018 warning on check, naming both shas and the re-run; the same record before the edit is quiet — the conformance fixture proves both sides.' — how is this verified end-to-end?
  answered: the two-sided fixture — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the extraction is the gate's own law (last spec-sha line wins), so the warning and the G2 refusal can never disagree about which binding is current.' — how is this verified end-to-end?
  answered: the extraction shared with G2's regex — the code plus the fixture.
- GQ-AC3 asked: Criterion: 'AC3 — DG-C018 has its explain page naming the concrete fix, and the generated docs carry it.' — how is this verified end-to-end?
  answered: docs/diagnostics.md carries DG-C018 — proofs/explain-page.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite green with the version pairs holding (no payload change): conformance, tsc, canon.' — how is this verified end-to-end?
  answered: proofs/tsc.txt, proofs/canon.txt.

verdict: pass
