# proofs — 200-spec7-transition-table

- AC1 — the transition law in the tree: `canon/record/version-transition.md`
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

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.

- supersession (2026-11-09, unit 610-supersession-recognition) — the transition table moved after this delivery: hops v18 through v29 landed under their own units, each with its registry entry and mirror row recorded then. The evidence above describes the tree as this unit delivered it; the later movement is the later units' own recorded acts, not a defect in this proof. Declared on purpose per the drift gate's repair.
