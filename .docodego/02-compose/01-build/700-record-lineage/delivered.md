# delivered — 700-record-lineage

## what landed

The records are the product — this unit turns their anti-conflict
law from prose into machinery:

- **Doctor's decision-lineage check** — `adrLineageProblems(dir)`:
  every ADR file ↔ index-row parity in both directions, dead links,
  supersede pointers (a Superseded row must name its successor `by
  NNNN`, and the file must carry the same number), and file-status
  drift (a file marked Superseded cannot hide behind an unmarked
  row). Absent-able: products without a decisions directory report
  absence honestly and never fail.
- **Grill's fifth gate question** — GQ-5: *what does this unit
  supersede, obsolete, or retell — name the units or ADRs whose law
  it changes, or answer 'none — new ground'.* Skipping it fails the
  round. Ids stay contract; the vocabulary packs' four-id law is
  untouched.
- **The index repaired** — rows for ADR 0012 and 0013 landed in the
  studio repo's decisions index (the hand-caught gap that started
  this unit).

## how to see it work

`pnpm -C apps/cli run -s conformance` — 507 green; the drift fixture
shows each named problem and the repair emptying the list. On any
record: `docodego doctor` reads the lineage line; the next unit you
grill asks GQ-5 first.
## delivered 2026-11-10

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 74/100 — matches the recorded block (spec-sha f7e6daf3267795b6); latest verdict: pass; proof: apps/cli/src/commands/doctor.ts · warning: 1 path-like span(s) do not resolve (<cwd>/.docodego/<rel>) — launch will refuse if they are proof paths
