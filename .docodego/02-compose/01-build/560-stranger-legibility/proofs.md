# proofs — 560-stranger-legibility

The three legibility finds from the v27 test round, fixed at the
surface where the stranger actually is: the failure message.

- AC1 — the scaffold travels with the refusal: the fixture flow now
  delivers with no proofs.md and pins the pair — deliver exits 1
  naming G4 AND the scaffold exists (create-only: the second refusal
  re-refuses byte-identical, never rewriting). The scaffold teaches
  the grammar without planting phantoms: its example path is prose,
  not a backticked span (the suite caught my first draft doing
  exactly that — six cascade FAILs, then the fix). The wiring:
  `apps/cli/src/bundled/index.ts` (PROOFS_TEMPLATE),
  `apps/cli/src/record/record-write.ts` (scaffoldProofs),
  `apps/cli/src/commands/deliver.ts` (the note beside the refusal).
- AC2 — score prints its whys: the rows carry each axis's note, and
  the fixture pin asserts both the testability note ("without an
  observable marker") and the unambiguity note ("no vague words")
  appear in stdout. One-line change in
  `apps/cli/src/commands/score.ts` — the note was computed all
  along; it just never reached the screen.
- AC3 — gates are explainable: nine entries (GATE-G1..G4, GATE-L1..L5)
  joined the registry under a GATE family, and explain normalizes the
  bare id the refusals print — G4, l2, GATE-L5 each resolve to
  meaning/law/fix (pins per form), while DG-ZZZ still refuses as
  usage and --list carries the family. The registry lives in
  `apps/cli/src/passes/explain.ts`; the resolver is
  `apps/cli/src/commands/explain.ts`.
- AC4 — the battery in the committed state: check 0 errors,
  conformance all 457 green (7 new pins), bundle:verify clean at
  spec 27 — no payload change, all engine code — pnpm run doctor
  all healthy, docs fresh (25 files), build 11/11.
