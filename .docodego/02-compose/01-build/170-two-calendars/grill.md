## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Every date the CLI stamps into a record becomes the writer's local wall-clock date via one shared fsx.today(), replacing three UTC clocks.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by grep proof (no toISOString().slice remains under apps/cli/src) + AC2's conformance assertion run in proofs/conformance.txt; AC3 by the existing conformance flows passing; AC4 by bundle verify byte-identical in proofs/.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: A test that only catches the defect at certain hours or machines — mitigated by AC2 comparing today() to an independent local computation of the same instant, which is timezone-proof and hour-proof.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Date formats beyond YYYY-MM-DD, historical row rewrites, timezone metadata, and any apps/spec change (it stamps nothing).
- GQ-AC1 asked: Criterion: 'AC1 — one clock: `fsx.today()` returns the local wall-clock date (local year/month/day getters, zero-padded `YYYY-MM-DD`), and both other stamp sites (template-docs, lock) call it instead of running their own clock — no `toISOString().slice(0, 10)` remains under apps/cli/src.' — how is this verified end-to-end?
  answered: End-to-end: the code search proof file shows exactly three stamp sites before and zero private clocks after; the conformance suite compiles the changed sources (strip-types) and all 218 checks pass, so the call sites still typecheck and run.
- GQ-AC2 asked: Criterion: 'AC2 — conformance proves the shape deterministically: `today()` equals the local-form date an independent local-clock computation produces for the same instant, and matches `YYYY-MM-DD` — an assertion that holds on a UTC machine (where local and UTC agree) and on any other, at any hour.' — how is this verified end-to-end?
  answered: The conformance check computes local Y-M-D from a fresh Date with local getters at the same instant and asserts string equality with today() plus the YYYY-MM-DD shape — recorded in proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the stamped surfaces keep their contracts: a tracker row, a delivery-log row, a grill round header, and a lockfile still carry a leading `YYYY-MM-DD`-shaped date (conformance already asserts these flows exit 0 and produce the files; the date shape is now asserted where cheap).' — how is this verified end-to-end?
  answered: The suite's existing tracker/delivery/grill/lockfile assertions keep passing, and a new shape assertion checks the tracker row's leading date field matches YYYY-MM-DD.
- GQ-AC4 asked: Criterion: 'AC4 — history untouched: the fix edits clock logic only — no migration, no date rewrite, no payload change (bundle verify stays byte-identical; the drift gate red pre-commit is the disclosed a-spec7-naming precedent, and only if a payload byte moves, which this unit does not expect).' — how is this verified end-to-end?
  answered: bundle --verify post-commit reports clean with structure 4806e95233b7 unchanged (recorded in proofs/); no migration is added and git diff of the unit shows no record-row edits.

verdict: pass
