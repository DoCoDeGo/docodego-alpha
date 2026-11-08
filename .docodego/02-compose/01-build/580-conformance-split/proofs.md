# proofs — 580-conformance-split

The DG-U120 debt retired: the suite's one 1585-line file became a
thin composer plus seven area modules, and all 461 checks stayed
green with byte-identical labels.

- AC1 — labels byte-identical: the 406 statically captured
  check/fact labels, in order, before and after the split — the
  diff is empty. Both lists ride as run artifacts:
  `02-compose/01-build/580-conformance-split/proofs/labels-before.txt`
  and
  `02-compose/01-build/580-conformance-split/proofs/labels-after.txt`
  ([evidence: suite-run]).
- AC2 — typecheck green and the suite is one command, one verdict:
  `pnpm typecheck` exit 0; `pnpm -C apps/cli run -s conformance`
  prints `conformance: all 461 checks green`, exit 0 — first run
  after the split, no iteration on the suite itself (only import
  wiring). The composer is `apps/cli/src/conformance.ts` (36 lines:
  setup, ordered awaits, tail); the shared handles are
  `apps/cli/src/conformance/helpers.ts`; the areas are
  `apps/cli/src/conformance/a1-lifecycle.ts` through
  `apps/cli/src/conformance/a7-contract-surface.ts` (largest 389
  lines). The splitter script itself was ephemeral — written under
  the harness temp dir, run once, removed.
- AC3 — the debt retired structurally: `docodego metrics report`
  no longer lists conformance.ts among the largest files at all
  (36 lines); the largest source file is now
  `apps/cli/src/versioning/migrations.ts` (743) — a file the
  suite never grows. Future units append to their area's module,
  under the ceiling. `pnpm run doctor` reports all healthy.
- AC4 — the battery in the committed state: check 0 errors
  (2 pre-existing drift warnings on 160/200 proofs, unchanged by
  this unit), conformance 461 green, bundle:verify clean at
  spec 27 — no payload change, all suite plumbing — docs fresh
  (25 files), build 11/11.
