## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Reads the delivered law-index.json, classifies every law as ADDED, AMENDED (per normative field) or REPEALED against the current tree, and suggests the bump class — suggesting only, never writing a version.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Real runs in proofs/: diff against the just-delivered 1.0.2 index (no changes), the all-classes fixture run showing every classification and the MAJOR suggestion, the missing-index and corrupt-index refusals (SP-D001/SP-D002, exit 1), and the no-regression suite.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: the suggestion becoming the decision — a tool that declares versions instead of humans. Mitigation: diff has no write path at all; versions move only through the amendment procedure and build's refusals.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: writing versions or artifacts (amend's job), coverage/impact, doctor, publish, and grading prose — diff classifies fields, not sentences.
- GQ-AC1 asked: Criterion: 'AC1 — `canon diff` against the just-delivered 1.0.2 index exits 0 and reports no changes, no bump needed.' — how is this verified end-to-end?
  answered: Run canon diff — exit 0, output says no changes and no bump needed, because the tree matches the delivered 1.0.2 index.
- GQ-AC2 asked: Criterion: 'AC2 — the fixture tree (committed index describing four laws, tree carrying five) produces all three classes in one run: one law unchanged, one AMENDED on enforced-by only (PATCH), one AMENDED on severity (MAJOR), one ADDED (MINOR), one REPEALED (MAJOR) — and the suggested bump is MAJOR, the highest class present.' — how is this verified end-to-end?
  answered: Run canon diff --root apps/spec/fixtures/diff-spec --dist apps/spec/fixtures/diff-spec/dist — exit 0 with one unchanged law, AMENDED enforced-by (PATCH), AMENDED severity (MAJOR), one ADDED (MINOR), one REPEALED (MAJOR); suggested bump MAJOR, the highest class present.
- GQ-AC3 asked: Criterion: 'AC3 — diff with no `law-index.json` at the dist path exits 1 with SP-D001 and remediation "run canon build first"; an index that is not valid JSON exits 1 with SP-D002.' — how is this verified end-to-end?
  answered: Point --dist at a folder with no law-index.json — exit 1, SP-D001, remediation says run canon build first; then at an index that is not valid JSON — exit 1, SP-D002.
- GQ-AC4 asked: Criterion: 'AC4 — `--json` emits `docodego-spec/diff/v1` with the changes and the suggested bump; no regression: lint, verify, coverage, build all exit 0; typecheck clean; zero non-node imports.' — how is this verified end-to-end?
  answered: After diff lands: the --json envelope carries schema docodego-spec/diff/v1 with changes and suggestion; lint, verify, coverage, build all exit 0; tsc --noEmit clean; imports grep zero non-node — all in proofs/.

verdict: pass
