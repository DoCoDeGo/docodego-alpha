---
name: canon-diff
type: unit
status: delivered
---

# canon-diff

## intent

`canon diff` reads the last delivered index (`apps/spec/dist/law-index.json`)
and classifies every change between it and the current spec tree — ADDED,
AMENDED (per normative field), REPEALED — then suggests the bump class
(severity flip → MAJOR, title/pillar → MINOR, bindings and status flips →
PATCH, added law → MINOR, repealed law → MAJOR). The tool suggests, a human
declares (EL-20): diff never writes a version; it hands the amendment its
change list. It exists now because `amend` consumes exactly this
classification, and because a maker should see what a rebuild would change
before it lands.

## scope

In: the `diff` command, the field-level classification, the bump
suggestion, a fixture exercising every change class, honest refusals when
the index is missing or unreadable. Out: writing versions or artifacts
(`amend`'s job), coverage/impact, doctor, publish, grading prose changes
(diff classifies fields, not sentences).

## acceptance

- AC1 — `canon diff` against the just-delivered 1.0.2 index exits 0 and
  reports no changes, no bump needed.
- AC2 — the fixture tree (committed index describing four laws, tree
  carrying five) produces all three classes in one run: one law unchanged,
  one AMENDED on enforced-by only (PATCH), one AMENDED on severity
  (MAJOR), one ADDED (MINOR), one REPEALED (MAJOR) — and the suggested
  bump is MAJOR, the highest class present.
- AC3 — diff with no `law-index.json` at the dist path exits 1 with
  SP-D001 and remediation "run canon build first"; an index that is not
  valid JSON exits 1 with SP-D002.
- AC4 — `--json` emits `docodego-spec/diff/v1` with the changes and the
  suggested bump; no regression: lint, verify, coverage, build all exit 0;
  typecheck clean; zero non-node imports.

## threats

- the suggestion becoming the decision (the tool declaring versions).
  Mitigation: diff has no write path at all — it prints a suggestion and a
  change list; the version moves only through the amendment procedure and
  build's own refusals.
- field diffs reading as normative edits when they are bookkeeping.
  Mitigation: every change line names the field and both values, so a
  reviewer judges with the actual words, not a class label.
- scope creep into a release-notes generator. Mitigation: out of scope
  recorded here; diff emits classifications, not prose.
