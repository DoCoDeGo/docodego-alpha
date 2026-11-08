# proofs

- AC1 — build over the committed spec set: exit 0, three artifacts written, law-index.json parses with 31 laws (ST-1 → EL-31) at specVersion 1.0.0: `system/behavioral/a-canon-build/proofs/build-1.txt`, `system/behavioral/a-canon-build/proofs/law-index-check.txt`
- AC2 — idempotence: immediate rebuild exits 0 and all three artifact shasums are byte-identical (diff exit 0): `system/behavioral/a-canon-build/proofs/build-2.txt`, `system/behavioral/a-canon-build/proofs/shasum-1.txt`, `system/behavioral/a-canon-build/proofs/shasum-2.txt`, `system/behavioral/a-canon-build/proofs/idempotence.txt`
- AC3 — downgrade refused: fixture tree at 0.9.0 against a manifest at 1.0.0 — SP-B001, exit 1, nothing written: `system/behavioral/a-canon-build/proofs/downgrade.txt`
- AC4 — undeclared change refused: fixture tree at 1.0.0 with a stale structure hash — SP-B002, exit 1, remediation names the amendment procedure: `system/behavioral/a-canon-build/proofs/stalehash.txt`
- AC5 — no regression and the vendored law holds: lint exit 0, verify exit 0 after build; `tsc --noEmit` clean; zero non-node imports: `system/behavioral/a-canon-build/proofs/lint-after.txt`, `system/behavioral/a-canon-build/proofs/verify-after.txt`, `system/behavioral/a-canon-build/proofs/typecheck.txt`, `system/behavioral/a-canon-build/proofs/imports-non-node.txt`
