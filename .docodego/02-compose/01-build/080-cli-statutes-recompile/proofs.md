# proofs

- AC1 — the compiler's drift mode proves the committed page matches the
  canon: exit 0, "statutes page matches the canon", with the page head
  showing the compiled header (source claim, arc Appendix B binding note,
  † provenance, the gloss pair named): the page carries sixteen statutes,
  titles byte-equal to spec frontmatter, binds equal to the arc mapping
  (1→validate … 16→measure), and † completion lines for exactly the eight
  statutes that carry a Completion † (1, 2, 3, 5, 11, 14, 15, 16); none
  for the "complete as published" statutes. Correction recorded: the spec
  first said seven; the true count from the law files was eight, fixed in
  the spec before implementation ran:
  `02-compose/01-build/080-cli-statutes-recompile/proofs/compile-check.txt`
- AC2 — after the compiler ran and the record declared recordVersion 9,
  the bundle regenerated: two changes vs the committed v8 bundle
  (statutes content — patch class — and the declared version), payload
  carries specVersion 9 with fresh hashes and a fresh structure hash; the
  file set is byte-for-byte the v8 contract (36 files, structure hash
  equal — see the leak note below). bundle:verify honestly reports the
  pre-commit delta (exit 1 until committed; clean after):
  `02-compose/01-build/080-cli-statutes-recompile/proofs/bundle.txt`
- AC3 — canon doctor on the real tree exits 0 for the first time: no
  drift, mirror aligned 16/16 (titles match, streams bind), axes side by
  side never inferred — payload specVersion 9 · cli 0.8.0 · spec/ 1.0.2 ·
  delivered 1.0.2:
  `02-compose/01-build/080-cli-statutes-recompile/proofs/doctor-green.txt`
- AC4 — the adopter path, both branches. A record stamped 8 carrying the
  shipped v8 statutes bytes: the upgrade plan names the v8→v9 migration
  and the conflict, apply refreshes the mirror in place ("shipped v8
  bytes recognized"), stamps 9, and no .new sibling remains — the mirror
  equals the compiled canon. A record stamped 8 with locally edited
  statutes: the edit is preserved verbatim, the bundled copy rides the
  plan as .new for reconciliation, stamp 9:
  `02-compose/01-build/080-cli-statutes-recompile/proofs/adopter-shipped.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/adopter-edited.txt`
- AC5 — no regression: the record's check and lint exit 0; canon lint,
  verify, coverage, diff, build all exit 0 (diff: no changes; build:
  byte-identical at the same structure hash); typecheck clean; zero
  non-node, non-relative imports in the touched files:
  `02-compose/01-build/080-cli-statutes-recompile/proofs/record-check.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/record-lint.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/canon-lint.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/canon-verify.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/canon-coverage.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/canon-diff.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/canon-build.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/typecheck.txt`,
  `02-compose/01-build/080-cli-statutes-recompile/proofs/imports-new.txt`

## Found by this unit, fixed in it

- The bundler's unit-folder exclusion checked only a file's immediate
  directory for spec.md, so unit `proofs/` subfolders leaked unit
  internals into the payload — every canon unit since the first had
  quietly bloated it (119 embedded files; the true contract is 36). The
  fix walks ancestors: any file under .docodego whose lineage crosses a
  folder carrying spec.md is user state and never ships. The regenerated
  payload's file set now equals the committed v8 set exactly — the
  structure hash matches, and the only deltas are the statutes page and
  the declared version. Evidence: bundle.txt (36 files, structure
  4806e95233b7 — the committed v8 hash) and the leak-check lines in
  bundle.txt's verify section.
- The bundle guard's baseline was the working payload copy, so every
  in-unit recompile demanded a version bump; it now baselines the last
  DELIVERED (committed) bundle — the delivered-baseline rule, same law
  as canon build's manifest baseline. Recorded in the oldPayload header.

## Surgical backlog (recorded, not fixed here)

- DG-C002: the record CLI's proof-path checker misreads schema
  identifiers written in backticks (envelope names like
  docodego-spec/publish/v1) as file paths, warning on every unit that
  cites its envelope in proofs. Warning-level, cosmetic; belongs to the
  §12 pass (with init --force downgrade, registry contiguity, vocabulary
  stomp guard).
