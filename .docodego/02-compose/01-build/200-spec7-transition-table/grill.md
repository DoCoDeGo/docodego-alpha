## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit ports the versioning transition law into the spec tree as spec/record/version-transition.md — axes, registry, skip-distance, the shipped hop table — binding the doc to the code registry via conformance, and bumps the tree to 1.0.3.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1/AC3 by canon lint+verify+build green with the doc present (proofs/canon.txt); AC2 by the conformance hop-for-hop fact (proofs/conformance.txt); AC4 by the doctor axes line (proofs/canon-doctor.txt); AC5 by tsc green and the diff touching only the export + facts (proofs/cli-tsc.txt).
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The doc drifting from the registry as hops ship. Mitigated by AC2: the conformance suite compares the doc's table against the exported registry hop for hop every run.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The blueprint's manifest fields (bornSpec/planted/specHash), new engine-law ids, any upgrade-engine behavior change, and the 1.1.0 amendment batch (kept free by the patch bump).
- GQ-AC1 asked: Criterion: 'AC1 — `spec/record/version-transition.md` exists, obeys the document standard (one H1 naming the thing, one-paragraph purpose, meaningful H2s), and states all three law pieces: the axes (with the never-inferred rule), the registry law (contiguous, never consolidated), and skip-distance (forward-only, every hop, downgrade refused).' — how is this verified end-to-end?
  answered: The doc follows the trail's own shape (one H1, purpose paragraph, question-naming H2s); canon lint enforces the document standard over the tree and runs green — proofs/canon.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the doc carries the shipped transition table: one row per hop v0→v13, each row naming what the hop taught — and the rows match the code registry hop for hop (conformance compares the doc's table against the exported registry: same hop count, same from/to pairs).' — how is this verified end-to-end?
  answered: The conformance fact parses the doc's table rows and compares from/to pairs against the exported registry — a mismatch fails the suite; recorded in proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the doc is not an orphan: the trail document links to it where a reader asks about versions, and canon lint + verify + build stay green with it present.' — how is this verified end-to-end?
  answered: The trail document gains a versions pointer; canon verify checks links and referential integrity and runs green — proofs/canon.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the structure change bumps the spec-tree version to 1.0.3 (patch — a new record doc, no law semantics changed), the built manifest carries it, and the doctor's version pair reads it side by side with the payload axis without drift.' — how is this verified end-to-end?
  answered: spec/SPEC.md stamps 1.0.3; canon build writes the manifest with it; doctor prints the pair side by side with no drift — proofs/canon-doctor.txt.
- GQ-AC5 asked: Criterion: 'AC5 — no shipped CLI behavior changes: the upgrade engine, bundle guard, and migrations behave byte-identically (the only source change is the registry export + the conformance fact that reads it).' — how is this verified end-to-end?
  answered: The only source changes are the registry export, the conformance fact, and the doc; tsc green and the conformance suite green apart from the disclosed pre-commit drift gate — proofs/cli-tsc.txt, proofs/conformance.txt.

verdict: pass
