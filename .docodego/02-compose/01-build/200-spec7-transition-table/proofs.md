# proofs — 200-spec7-transition-table

- AC1 — the transition law in the tree: `spec/record/version-transition.md`
  (one H1, purpose paragraph, question-naming H2s; the axes with the
  never-inferred rule, the registry law, skip-distance) — canon lint over
  the tree runs green —
  `02-compose/01-build/200-spec7-transition-table/proofs/canon-lint.txt`.
- AC2 — the shipped hop table mirrors the registry hop for hop: the new
  conformance fact parses the doc's table and compares from/to pairs
  against the exported MIGRATIONS — "the transition table mirrors the
  migration registry hop for hop" passes; suite 237/237 —
  `02-compose/01-build/200-spec7-transition-table/proofs/conformance.txt`.
- AC3 — not an orphan: the trail gains a Versions section linking the
  table; canon verify (links, referential integrity) green —
  `02-compose/01-build/200-spec7-transition-table/proofs/canon-verify.txt`.
- AC4 — the version pair: SPEC.md stamps 1.0.3, the amendments log gains
  the 1.0.3 row (SP-V004's circle closed in source — the pre-doctor error
  is gone), build writes the manifest at 1.0.3; the doctor's remaining
  pre-commit errors are the delivered-baseline rule only (SP-F001/F002 —
  the committed manifest is 1.0.2 until this unit lands), disclosed here —
  `02-compose/01-build/200-spec7-transition-table/proofs/canon-doctor.txt`;
  the post-commit doctor runs clean and CI depends on it.
- AC5 — no shipped behavior changes: tsc green; the only source changes
  are the conformance fact + import (the registry was already exported) —
  `02-compose/01-build/200-spec7-transition-table/proofs/cli-tsc.txt` +
  `02-compose/01-build/200-spec7-transition-table/proofs/cli-tsc.exit`.
