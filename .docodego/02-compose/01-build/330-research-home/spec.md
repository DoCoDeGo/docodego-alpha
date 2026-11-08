---
name: 330-research-home
type: unit
epic: 020-canon-debts
status: scored
---

# 330-research-home

## intent

Improvement item 22 — research's legal home. The audit's scenario: an
agent grounded work in `01-discover/research/`, the checker linted the
folder as a broken unit (DG-F001 — a folder in a stream without a
spec.md), and the agent moved the material inside a unit folder to
satisfy the checker — grounding artifacts impersonating units to be
legal. The unit blesses research as a first-class non-unit, both
halves of the audit's fix: the scanner skips a folder named `research`
directly in `01-discover` (and only there — a spec-less folder anywhere
else is still DG-F001), and the 01-discover README names the home so a
cold reader finds it. The README is planted bytes, so the move pays the
bump chain (record 17 → 18, transition row, spec 1.0.9, amendment);
the migration's steps are empty — stream READMEs are the record's birth
words (pack-voiced copies are excluded from the plan's conflict scan),
so the line rides create-only copies and customized READMEs keep their
words; the checker's exemption makes research legal regardless of what
any README says.

## scope

In: the scanner exemption (exact name `research`, only under
`01-document/01-discover`); the one-line home named in the 01-discover
README; the bump chain (record 18, transition row, spec 1.0.9 +
amendment row, payload regen); a conformance fixture proving both
edges (research/ lints clean, a spec-less sibling folder still earns
DG-F001). Out: teaching research in the grounding skill (its walk
files already live where the agent puts them); new DG codes (the
exemption removes a false positive, it adds none); IMP-3/12/13/14.

## acceptance

- AC1 — a record holding `.docodego/01-document/01-discover/research/`
  with loose notes lints clean of DG-F001, while a spec-less sibling
  folder in the same stream still earns it — the conformance fixture
  proves both edges in one record.
- AC2 — the 01-discover README names the research home, and the
  regenerated payload ships the line (the sweep fact still holds 51
  rows).
- AC3 — the ladder is honest: registry 17 → 18 contiguous with the
  entry present, the transition mirror green with the new hop, record
  manifest 18, bundle verify clean at the new pair.
- AC4 — the suite green at the new pairs (conformance, tsc, canon at
  spec 1.0.9 · delivered 1.0.9).

## threats

- The exemption masking real rot — a folder named research could hide
  an unfinished unit. Accepted deliberately: the name is exact and
  top-level only; a real unit belongs in its `NNN-` folder, and the
  research home is for notes that never were units.
- Pack-voiced READMEs — the teach chain cannot voice the line into a
  pack-voiced README, so the migration carries no steps and the line
  rides birth copies only; the checker's exemption carries the law, so
  legality never depends on the README's wording.
- The bump chain is mechanical (walked four times now).
