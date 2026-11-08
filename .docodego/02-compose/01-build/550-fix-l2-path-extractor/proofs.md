# proofs — 550-fix-l2-path-extractor

The round's one real bug, fixed at the shared extractor both gates
read — deliver and launch agree on what a proof path is by
construction now, not by coincidence.

- AC1 — the regression, pinned twice: the pure pin ("version strings
  are not proof paths") drives proofPaths directly — a list item
  citing src/run.txt beside 1.3.0, 2.10.5, and 1.0.0 extracts
  exactly that one path (the numeric tails stopped looking like
  extensions: PATH_LIKE now requires a letter in the tail). The
  end-to-end pin walks the fixture record: proofs.md carrying
  version strings leaves `check` clean (no phantom evidence) and
  launch's L2 reading "1 proof path(s), all present" — the exact
  scenario the test round caught accepting at deliver and refusing
  at launch.
- AC2 — the honest shapes survive, pinned as a set: bare first
  token, backticked span, label-then-path all extract; the skips
  still skip (docodego/whoami/v1 envelope schemas, trailing
  punctuation, bare directory tokens).
- AC3 — the write-time warning: deliver on a proofs.md with a
  dangling path-like span passes (exit 0, the gate is not blocked)
  and its output names the span and says launch will refuse if it
  is a proof path — the mismatch surfaces at write time instead of
  one gate later.
- AC4 — the battery in the committed state: check 0 errors,
  conformance all 450 green (5 new pins), bundle:verify clean at
  spec 27 (52 files — no payload change, as scoped: CLI code only),
  pnpm run doctor all healthy, docs fresh (25 files), build 11/11.

- the fix — `apps/cli/src/passes/check.ts` — PATH_LIKE now demands a
  letter in a separator-less tail [evidence: suite-run]
- the gates — `apps/cli/src/passes/gates.ts` — the G4 pass detail
  warns when a path-like span does not resolve [evidence: suite-run]
- the pins — `apps/cli/src/conformance.ts` — five new checks: the
  regression, the honest shapes, the skips, the check-level
  cleanliness, the L2 agreement [evidence: suite-run]
