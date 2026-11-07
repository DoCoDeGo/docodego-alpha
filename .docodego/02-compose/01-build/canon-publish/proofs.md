# proofs

- AC1 — fresh publish of the delivered 1.0.2: exit 0; the layout is
  v/1.0.2/{SPEC.md, law-index.json, manifest.json, verification.txt} plus
  root llms.txt (versions with structure-hash prefixes) and current.txt
  (version, full hash, law count); the badge restates the structure hash
  and the recomputation a reader can run:
  `02-compose/01-build/canon-publish/proofs/publish-fresh.txt`
- AC2 — idempotence: a second publish exits 0 and every site file is
  byte-identical (sha256 before/after, diff exit 0); deleting current.txt
  and republishing regenerates it from the v/ directory:
  `02-compose/01-build/canon-publish/proofs/idempotence.txt` (hash lists:
  `02-compose/01-build/canon-publish/proofs/hashes-before.txt`,
  `02-compose/01-build/canon-publish/proofs/hashes-after.txt`)
- AC3 — refusals, each exit 1 and taught: SP-S001 no delivered manifest;
  SP-S002 tree ahead of dist (an unbuilt change in a fixture copy);
  SP-S003 downgrade below the site's current 9.9.9; SP-S004 same version
  already published with a different structure (deadbeef… vs ba9b542a66c9…):
  `02-compose/01-build/canon-publish/proofs/refuse-s1.txt`,
  `02-compose/01-build/canon-publish/proofs/refuse-s2.txt`,
  `02-compose/01-build/canon-publish/proofs/refuse-s3.txt`,
  `02-compose/01-build/canon-publish/proofs/refuse-s4.txt`
- AC4 — no regression on the real tree: lint 0, verify 0, coverage 0,
  diff 0, build 0; `tsc --noEmit` clean; zero non-node imports; `--json`
  envelope `docodego-spec/publish/v1`:
  `02-compose/01-build/canon-publish/proofs/lint-real.txt`,
  `02-compose/01-build/canon-publish/proofs/verify-real.txt`,
  `02-compose/01-build/canon-publish/proofs/coverage-real.txt`,
  `02-compose/01-build/canon-publish/proofs/diff-real.txt`,
  `02-compose/01-build/canon-publish/proofs/build-real.txt`,
  `02-compose/01-build/canon-publish/proofs/typecheck.txt`,
  `02-compose/01-build/canon-publish/proofs/imports-non-node.txt`,
  `02-compose/01-build/canon-publish/proofs/publish-json.txt`
