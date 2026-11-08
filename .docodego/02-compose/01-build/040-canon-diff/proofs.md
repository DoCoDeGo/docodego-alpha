# proofs

- AC1 — diff against the just-delivered 1.0.2 index: exit 0, "no changes — the tree matches the delivered index (1.0.2)": `02-compose/01-build/040-canon-diff/proofs/diff-clean.txt`
- AC2 — the all-classes fixture: one AMENDED on enforced-by only (PATCH, field-level before → after shown), one AMENDED on severity veto → warn (MAJOR), one REPEALED (MAJOR), one ADDED (MINOR), one unchanged; suggested bump MAJOR, the highest class present: `02-compose/01-build/040-canon-diff/proofs/diff-fixture.txt`
- AC3 — missing index: exit 1, SP-D001 with remediation "run canon build first"; corrupt index: exit 1, SP-D002 with remediation: `02-compose/01-build/040-canon-diff/proofs/diff-missing-index.txt`, `02-compose/01-build/040-canon-diff/proofs/diff-corrupt-index.txt`
- AC4 — `--json` envelope `docodego-spec/diff/v1` carrying changes, suggestedBump, and the declaredBy note; no regression: lint 0, verify 0, coverage 0 (83% weighted), build exit 0 byte-identical (structure ba9b542a66c9… unchanged), `tsc --noEmit` clean, zero non-node imports: `02-compose/01-build/040-canon-diff/proofs/diff-json.txt`, `02-compose/01-build/040-canon-diff/proofs/typecheck.txt`
