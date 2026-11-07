# proofs

- AC1 — build over the committed spec set: exit 0, three artifacts written, law-index.json parses with 31 laws (ST-1 → EL-31) at specVersion 1.0.0: `02-compose/01-build/canon-build/proofs/build-1.txt`, `02-compose/01-build/canon-build/proofs/law-index-check.txt`
- AC2 — idempotence: immediate rebuild exits 0 and all three artifact shasums are byte-identical (diff exit 0): `02-compose/01-build/canon-build/proofs/build-2.txt`, `02-compose/01-build/canon-build/proofs/shasum-1.txt`, `02-compose/01-build/canon-build/proofs/shasum-2.txt`, `02-compose/01-build/canon-build/proofs/idempotence.txt`
- AC3 — downgrade refused: fixture tree at 0.9.0 against a manifest at 1.0.0 — SP-B001, exit 1, nothing written: `02-compose/01-build/canon-build/proofs/downgrade.txt`
- AC4 — undeclared change refused: fixture tree at 1.0.0 with a stale structure hash — SP-B002, exit 1, remediation names the amendment procedure: `02-compose/01-build/canon-build/proofs/stalehash.txt`
- AC5 — no regression and the vendored law holds: lint exit 0, verify exit 0 after build; `tsc --noEmit` clean; zero non-node imports: `02-compose/01-build/canon-build/proofs/lint-after.txt`, `02-compose/01-build/canon-build/proofs/verify-after.txt`, `02-compose/01-build/canon-build/proofs/typecheck.txt`, `02-compose/01-build/canon-build/proofs/imports-non-node.txt`
