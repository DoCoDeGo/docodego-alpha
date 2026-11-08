## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit exempts a folder named exactly research directly in 01-discover from the unit scan (DG-F001 cannot fire there), names the home in the 01-discover README (one line, planted), and pays the bump chain (record 18, transition row, spec 1.0.9, amendment; migration steps empty because stream READMEs are birth words excluded from conflict scans).
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the conformance fixture (research/ with loose notes lints clean; a spec-less sibling folder in the same stream still earns DG-F001); AC2 by the README line plus the regen with the sweep fact still holding 51 rows; AC3 by the transition-mirror fact and bundle verify clean at record 18; AC4 by conformance + tsc + canon at the 1.0.9 pair — proofs/conformance.txt, proofs/bundle.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The exemption masking real rot. Mitigated: exact name, top-level of one stream only; real units live in NNN- folders; the spec records the acceptance deliberately.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: New DG codes, the grounding skill's prose, IMP-3/12/13/14, any gate change — out.
- GQ-AC1 asked: Criterion: 'AC1 — a record holding `.docodego/01-document/01-discover/research/` with loose notes lints clean of DG-F001, while a spec-less sibling folder in the same stream still earns it — the conformance fixture proves both edges in one record.' — how is this verified end-to-end?
  answered: the two-edge fixture — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the 01-discover README names the research home, and the regenerated payload ships the line (the sweep fact still holds 51 rows).' — how is this verified end-to-end?
  answered: the sweep fact (51 rows) and the README line in the regen — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the ladder is honest: registry 17 → 18 contiguous with the entry present, the transition mirror green with the new hop, record manifest 18, bundle verify clean at the new pair.' — how is this verified end-to-end?
  answered: mirror fact green with the v17-to-v18 row; bundle verify clean — proofs/conformance.txt, proofs/bundle.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite green at the new pairs (conformance, tsc, canon at spec 1.0.9 · delivered 1.0.9).' — how is this verified end-to-end?
  answered: proofs/tsc.txt, proofs/canon.txt at the 1.0.9 pair.

verdict: pass
