## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit adds class: drift | prose to Diagnostic, renders it inline for warnings (warning (prose)[DG-C002], warning (drift)[DG-C018], unclassified reads drift), and classifies all 24 warning sites at their detectors — the C002 family prose (absolute paths, quoted variants: wording habits), everything else drift; the node --test nit investigated moot (no shipped doc teaches that invocation).
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by conformance facts asserting both renderings on real runs; AC2 by the same captures plus the default in the renderer; AC3 by tsc holding the field type across the sites and the suite holding the render; AC4 by conformance + tsc + canon with the pairs unchanged — proofs/conformance.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The classification rotting (a prose tag on a real defect). Mitigated: the class sits at the detector site beside the message it describes; the C002 prose verdict is recorded in the spec as the triage's evidence; the drift default is the safe assumption for future sites.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Errors and notes, registry Rule rows, new warning codes, planted bytes, any severity or message change — out.
- GQ-AC1 asked: Criterion: 'AC1 — a prose-class warning renders as `warning (prose)[DG-C002]` and a drift-class one as `warning (drift)[DG-C018]` — the conformance facts assert both renderings on real runs.' — how is this verified end-to-end?
  answered: the two rendering facts — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — an unclassified warning still reads `warning (drift)` — the default is the code, proven by the same captures (no site emits an unclassified warning today; the default is the rot-guard).' — how is this verified end-to-end?
  answered: the drift default in the renderer — the code plus the captures.
- GQ-AC3 asked: Criterion: 'AC3 — every warning site in the passes carries an explicit class (the C002 family prose, all others drift) — tsc holds the field's type, the suite holds the render.' — how is this verified end-to-end?
  answered: tsc clean across 24 classified sites — proofs/tsc.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite green with the version pairs holding (no payload change): conformance, tsc, canon.' — how is this verified end-to-end?
  answered: proofs/canon.txt at the unchanged pairs.

verdict: pass
