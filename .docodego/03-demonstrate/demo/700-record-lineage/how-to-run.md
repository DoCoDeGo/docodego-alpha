# how to run

## see it work

1. `pnpm -C apps/cli run -s conformance` — 507 green; the a2
   700 block: drift fixture names each problem, repair empties the
   list, doctor absent line, GQ-5 asked / skip-fails / answer-passes.
2. In the studio repo (docs/decisions present): `docodego doctor`
   prints "decision lineage — 13 ADRs indexed, pointers intact".
   Break it: delete a row from the index, run again — the file is
   named; restore, healthy.
3. The next grill you run asks GQ-5 first: "What does this unit
   supersede, obsolete, or retell?"

## run output

proofs.md quotes the gates; the scanner is
apps/cli/src/commands/doctor.ts adrLineageProblems, pinned verbatim
in apps/cli/src/conformance/a2-edges.ts.

## visual evidence

none — the suite is the demo.
