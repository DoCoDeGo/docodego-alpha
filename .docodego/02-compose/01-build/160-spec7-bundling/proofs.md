# proofs — 160-spec7-bundling

- AC1 — allowlist inversion: the payload compiles from exact allowlisted
  paths only; a loose file changes nothing —
  `02-compose/01-build/160-spec7-bundling/proofs/leak-proof.txt`
  (36 files, structure 4806e95233b7 unchanged, private count rose 283 → 294).
- AC1 — an allowlisted-but-missing file fails the bundle loudly, naming the
  path and the law: `allowlisted file missing: AGENTS.md — the boundary is a
  contract…`, exit 1 —
  `02-compose/01-build/160-spec7-bundling/proofs/missing-file-proof.txt`;
  restored afterwards, clean again —
  `02-compose/01-build/160-spec7-bundling/proofs/restore-clean-proof.txt`.
- AC2 — upgrade tells create from restore: a record at the bundled version
  that lost a planted file gets a twin (owed a merge), never an in-place
  re-create — conformance "restore plan exits 0 and names the restore",
  "deleted README.md NOT re-created in place", "restored copy waits as
  README.md.new" —
  `02-compose/01-build/160-spec7-bundling/proofs/conformance.txt`.
- AC3 — the statutes mirror refresh derives shipped generations from the
  payload's accumulated statutesShippedHashes (git archaeology seed:
  v3..v8 = 950faefc…, v9+ = 770e570c…; the deleted V8_STATUTES constant
  hashed to 950faefc… exactly — scripts/bundle.ts carries the seed; the
  hand constant is gone from migrations.ts). Observation, not a proof file:
  the seed lives in `apps/cli/scripts/bundle.ts` (STATUTES_SHIPPED_SEED) and
  the payload ships the accumulated set (`apps/cli/src/bundled/payload.ts`).
- AC4 — record self-declares v12; bundle regenerates with the bump guard
  satisfied (AGENTS.md + declared version → minimum major, declared 12 ≥
  required 12) —
  `02-compose/01-build/160-spec7-bundling/proofs/bundle-regen.txt`.
- AC5 — full conformance: 217 passed, 1 failed = the bundle drift gate,
  which compares against the COMMITTED payload — red pre-commit is expected
  and disclosed (a-spec7-naming precedent) —
  `02-compose/01-build/160-spec7-bundling/proofs/conformance.txt`,
  `02-compose/01-build/160-spec7-bundling/proofs/bundle-verify.txt`
  ("verify exit: 1 (1 = pre-commit drift, expected)"); runs clean post-commit.
- AC5 — canon doctor: no drift, mirror aligned (16 vs 16), version axes
  payload 12 · cli 0.8.0 · spec 1.0.2 · delivered 1.0.2 —
  `02-compose/01-build/160-spec7-bundling/proofs/canon-doctor.txt`.
- AC5 — CLI typecheck green (strict, noEmit; includes the pre-existing
  audit/setback strict-null debt fixed here) —
  `02-compose/01-build/160-spec7-bundling/proofs/cli-tsc.txt` +
  `02-compose/01-build/160-spec7-bundling/proofs/cli-tsc.exit`.
- AC5 — spec typecheck green —
  `02-compose/01-build/160-spec7-bundling/proofs/spec-tsc.txt` +
  `02-compose/01-build/160-spec7-bundling/proofs/spec-tsc.exit`.
- AC6 — CI mirror guards: compile-statutes --check green —
  `02-compose/01-build/160-spec7-bundling/proofs/compile-statutes-check.txt`;
  docs verify green —
  `02-compose/01-build/160-spec7-bundling/proofs/docs-verify.txt`; both
  wired into `.github/workflows/ci.yml`.

- supersession (2026-11-09, unit 610-supersession-recognition) — the payload and CI workflow moved after this delivery: the boundary allowlist was revised, the packaging switched to pnpm, and the payload hopped under its own units (480 through 600). The evidence above describes the tree as this unit delivered it; the later movement is the later units' own recorded acts, not a defect in this proof. Declared on purpose per the drift gate's repair.
