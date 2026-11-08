# proofs

- AC1 — the downgrade guard, both ways. A record stamped 10 (ahead of the
  bundled v9) survives init --force: the ahead-record warning prints and
  the manifest still says 10; a record stamped 8 gets the bundled 9 with
  no warning: `02-compose/01-build/spec7-surgical/proofs/init-above.txt`,
  `02-compose/01-build/spec7-surgical/proofs/init-below.txt`
- AC2 — the ladder check. assertContiguous(9) passes on the shipped
  registry; the pre-fix chain (ending at v6) is refused with the exact
  gap message; migrationsFor(6, 9) now lists three entries with honest
  notes (the v6→v7 and v7→v8 deltas were skill-bundle changes that rode
  the plan's create-only copy — entries exist so no version is skipped
  silently). The bundle guard calls the assertion on every bundle and
  --verify: `02-compose/01-build/spec7-surgical/proofs/registry-contiguity.txt`
- AC3 — the vocabulary voices hold. A record born with the agile pack
  upgrades with exactly one README mention in its plan (the record's own
  README — no stream pages); a plain record's plan carries all 17. The
  pack's words are birth words; only migrations touch them, and none do:
  `02-compose/01-build/spec7-surgical/proofs/upgrade-packed.txt`,
  `02-compose/01-build/spec7-surgical/proofs/upgrade-plain.txt`
- AC4 — the proof-path grammar, with the amendment recorded in the spec.
  Mid-state capture (after the schema-identifier exclusion, before the
  directory-token one): two warnings — the bare directory token proofs/
  and a fixture citation. Final: exactly one warning remains, the lawful
  one (canon-amend's prose cites a fixture-tree artifact; the fixture is
  committed at apps/spec/fixtures/diff-spec/amendments/1.0.1-ST-2.md but
  the token is fixture-root-relative, so no resolution variant finds it —
  true narration, warning-severity by the checker's own law, check exits
  0): `02-compose/01-build/spec7-surgical/proofs/check-midstate.txt`,
  `02-compose/01-build/spec7-surgical/proofs/check-final.txt`
- AC5 — no regression: canon lint, verify, coverage, diff, build, doctor
  all exit 0 (doctor still 16/16, diff still no changes); the record's
  lint and check exit 0; tsc clean:
  `02-compose/01-build/spec7-surgical/proofs/canon-lint.txt`,
  `02-compose/01-build/spec7-surgical/proofs/canon-verify.txt`,
  `02-compose/01-build/spec7-surgical/proofs/canon-coverage.txt`,
  `02-compose/01-build/spec7-surgical/proofs/canon-diff.txt`,
  `02-compose/01-build/spec7-surgical/proofs/canon-build.txt`,
  `02-compose/01-build/spec7-surgical/proofs/canon-doctor.txt`,
  `02-compose/01-build/spec7-surgical/proofs/record-lint.txt`,
  `02-compose/01-build/spec7-surgical/proofs/typecheck.txt`

## Notes

- The bundle passed with the assertion live: 36 files, structure hash
  unchanged — the two added registry entries are code, not payload.
- AC4's amendment (zero warnings → no false-positive warnings) was made
  before delivery and recorded in the spec itself; the grill was re-run
  against the amended text and re-scored.
