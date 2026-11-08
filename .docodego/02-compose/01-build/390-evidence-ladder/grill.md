## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Evidence claims can declare what kind of seeing they offer — [evidence: screenshot | test-transcript | session-recording | suite-run] beside the path in proofs.md or a demo bundle — and the checker refuses declarations outside that registry, so a visual claim is never silently a test substitution again.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance facts over fixture records: the registry shape (four types, one strength line each), the detector accepting declared types and failing DG-C019 on unknown ones in both proofs.md and demo bundles, the teach fixture (insert/idempotent/keep), and the suite proofs captured at HEAD.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The ladder hardening into a ranking that re-litigates the screenshot-vs-test substitution unilaterally — the exact judgment the audit says the law does not adjudicate. Mitigation: the registry describes strengths in one line each and never orders them; the detector refuses unknown declarations, never preferences.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Browser contention (IMP-20's other half — a practice problem for the visual-proof skill); type-against-content enforcement (a .txt declared screenshot is not mechanically adjudicable); scanning delivered.md/launch.md for declarations; retroactive declarations on old proofs.
- GQ-AC1 asked: Criterion: 'AC1 — the registry ships with declared strengths: four types, each with a one-line strength description, exported from the bundled payload — conformance fact, green every run.' — how is this verified end-to-end?
  answered: 
- GQ-AC2 asked: Criterion: 'AC2 — the checker holds the ladder: a proofs.md declaring `[evidence: screenshot]` checks clean; declaring `[evidence: vibe]` fails check with DG-C019 naming the registry; the same two shapes in a demo how-to-run.md behave identically — conformance facts.' — how is this verified end-to-end?
  answered: 
- GQ-AC3 asked: Criterion: 'AC3 — the grammar is taught where evidence lives: the demo scaffold's visual-evidence section names the declaration form and the registry; the honesty law's evidence bullet carries the declaration sentence — conformance fact + teach fixture (inserted in shipped-v21 bytes, idempotent, customized copies kept).' — how is this verified end-to-end?
  answered: 
- GQ-AC4 asked: Criterion: 'AC4 — the ladder is honest: registry 21 → 22 contiguous with the teach step, the transition mirror green with the hop, record manifest 22, bundle verify clean (52 files, boundary v2 — unchanged).' — how is this verified end-to-end?
  answered: 
- GQ-AC5 asked: Criterion: 'AC5 — the pages match: the new DG-C019 explain page generated, docs drift-free.' — how is this verified end-to-end?
  answered: 
- GQ-AC6 asked: Criterion: 'AC6 — the suite green at the new pairs: conformance, tsc, canon at spec 1.0.13.' — how is this verified end-to-end?
  answered: 

verdict: fail
## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Evidence claims can declare what kind of seeing they offer — [evidence: screenshot | test-transcript | session-recording | suite-run] beside the path in proofs.md or a demo bundle — and the checker refuses declarations outside that registry, so a visual claim is never silently a test substitution again.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance facts over fixture records: the registry shape (four types, one strength line each), the detector accepting declared types and failing DG-C019 on unknown ones in both proofs.md and demo bundles, the teach fixture (insert/idempotent/keep), and the suite proofs captured at HEAD.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The ladder hardening into a ranking that re-litigates the screenshot-vs-test substitution unilaterally — the exact judgment the audit says the law does not adjudicate. Mitigation: the registry describes strengths in one line each and never orders them; the detector refuses unknown declarations, never preferences.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Browser contention (IMP-20's other half — a practice problem for the visual-proof skill); type-against-content enforcement (a .txt declared screenshot is not mechanically adjudicable); scanning delivered.md/launch.md for declarations; retroactive declarations on old proofs.
- GQ-AC1 asked: Criterion: 'AC1 — the registry ships with declared strengths: four types, each with a one-line strength description, exported from the bundled payload — conformance fact, green every run.' — how is this verified end-to-end?
  answered: A conformance fact asserts EVIDENCE_TYPES exports exactly the four types, each value a non-empty strength line; runs in every suite pass.
- GQ-AC2 asked: Criterion: 'AC2 — the checker holds the ladder: a proofs.md declaring `[evidence: screenshot]` checks clean; declaring `[evidence: vibe]` fails check with DG-C019 naming the registry; the same two shapes in a demo how-to-run.md behave identically — conformance facts.' — how is this verified end-to-end?
  answered: Conformance fixtures: a unit proofs.md with [evidence: screenshot] checks clean; the same shape with [evidence: vibe] exits 1 naming DG-C019 and the registry; the identical pair asserted over a demo how-to-run.md.
- GQ-AC3 asked: Criterion: 'AC3 — the grammar is taught where evidence lives: the demo scaffold's visual-evidence section names the declaration form and the registry; the honesty law's evidence bullet carries the declaration sentence — conformance fact + teach fixture (inserted in shipped-v21 bytes, idempotent, customized copies kept).' — how is this verified end-to-end?
  answered: A conformance fact asserts the demo scaffold names the declaration form and registry, and the payload AGENTS.md carries the declaration sentence; the teach fixture proves inserted-in-shipped-bytes, idempotence, and customized-copies-kept.
- GQ-AC4 asked: Criterion: 'AC4 — the ladder is honest: registry 21 → 22 contiguous with the teach step, the transition mirror green with the hop, record manifest 22, bundle verify clean (52 files, boundary v2 — unchanged).' — how is this verified end-to-end?
  answered: The standing ladder facts: registry 21->22 with the teach step, the transition-table mirror, record manifest 22, bundle --verify clean at 52 files / spec 22 / boundary v2.
- GQ-AC5 asked: Criterion: 'AC5 — the pages match: the new DG-C019 explain page generated, docs drift-free.' — how is this verified end-to-end?
  answered: gen-docs runs clean after the new DG-C019 page joins the registry; the conformance docs-drift check stays green.
- GQ-AC6 asked: Criterion: 'AC6 — the suite green at the new pairs: conformance, tsc, canon at spec 1.0.13.' — how is this verified end-to-end?
  answered: Conformance, tsc, canon lint/verify/build/doctor at spec 1.0.13 · delivered 1.0.13, payload spec 22 — exit codes and tails under proofs/.

verdict: pass
