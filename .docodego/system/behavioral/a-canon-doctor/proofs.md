# proofs

- AC1 — doctor on the real tree: the honest red. Lint+verify rerun clean,
  structure ok, index ok, version pair ok (1.0.2 = 1.0.2), and the mirror
  found behind: SP-F005, 0/16 aligned, first drift "statute 1 binds
  '01-discover, 03-validate' but ST-1 carries title 'Intent Is Absolute'
  and stream 'validate'" — exit 1; axes line: payload specVersion 8 · cli
  0.8.0 · spec/ 1.0.2 · delivered 1.0.2, side by side, never equated:
  `system/behavioral/a-canon-doctor/proofs/doctor-real.txt`
- AC2 — doctor on the fixture tree (built dist outside the root, aligned
  payload fixture): exit 0, "no drift — lint+verify rerun clean, structure
  ok, index ok, version pair ok, mirror aligned (1 mirror statutes vs 1
  tree statutes)":
  `system/behavioral/a-canon-doctor/proofs/doctor-fixture.txt`; fixture
  sources: `apps/canon/fixtures/doctor-spec/`,
  `apps/canon/fixtures/doctor-spec-dist/manifest.json`,
  `apps/canon/fixtures/payload-aligned.ts`
- AC3 — drift detections on a mutated scratch copy (the scratch was
  ephemeral: created, run, deleted): SP-F001 structure ahead of the
  delivered index, SP-F002 manifest 9.9.9 vs SPEC.md 1.0.0, SP-F003 index
  counts 99 laws vs tree 1 — one run, exit 1:
  `system/behavioral/a-canon-doctor/proofs/doctor-drift.txt`; SP-F004 no
  delivered manifest at an empty dist — exit 1:
  `system/behavioral/a-canon-doctor/proofs/doctor-no-dist.txt`
- AC4 — no regression on the real tree: lint 0, verify 0, coverage 0,
  diff 0, build 0; `tsc --noEmit` clean; zero non-node imports; `--json`
  envelope `docodego-spec/doctor/v1` (exit 1 is the honest mirror
  verdict, the envelope reports the run):
  `system/behavioral/a-canon-doctor/proofs/lint-real.txt`,
  `system/behavioral/a-canon-doctor/proofs/verify-real.txt`,
  `system/behavioral/a-canon-doctor/proofs/coverage-real.txt`,
  `system/behavioral/a-canon-doctor/proofs/diff-real.txt`,
  `system/behavioral/a-canon-doctor/proofs/build-real.txt`,
  `system/behavioral/a-canon-doctor/proofs/typecheck.txt`,
  `system/behavioral/a-canon-doctor/proofs/imports-non-node.txt`,
  `system/behavioral/a-canon-doctor/proofs/doctor-json.txt`

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.
