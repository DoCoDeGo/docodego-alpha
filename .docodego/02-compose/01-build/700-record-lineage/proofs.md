# proofs — 700-record-lineage

- `pnpm -C apps/cli run -s conformance` — "conformance: all 507 checks green" (495 + 12 net: the drift fixture's four named problems, the repair emptying the list, doctor's absent-able line, the probe unit scaffolded, GQ-5 in the scaffold, skip-fails (exit 1), answer-passes)
- `apps/cli/src/commands/doctor.ts` — `adrLineageProblems(dir)`: pure scanner (file ↔ index parity both directions, dead links, `by NNNN` pointers in rows and files, file-status vs row drift); composed as the absent-able `decision lineage` triage check
- `apps/cli/src/passes/grillq.ts` — GQ-5 lineage question in the gate set; ids stay contract (the packs' four-id pin untouched)
- `pnpm bundle:verify` — "bundle verify: clean — 52 files, spec 31" (no payload change)
- `pnpm run docs` + `pnpm run docs:verify` — regenerated then fresh: the grill help page documents the five-question contract
- `pnpm run doctor` — 10/10 healthy; `node apps/cli/src/main.ts check` — exit 0

## failure-to-cause

- four runs red before green, each a real lesson: (1) the conformance read helper is record-scoped (it reads under the record dir beside the repo files) — my plain drift fixture and scaffold reads crashed with ENOENT until switched to readFileSync and record-dir-prefixed paths; (2) the tracker line rides stderr — the probe-unit number regex came up empty on stdout alone; (3) I asserted the wrong problem message (the scanner correctly distinguishes a pointerless row from a pointer the file never carries — my fixture covered only one); (4) grill's fail verdict exits 1, not 0.
- the studio-lineage pin was wrong-headed at first pass: v2 is a product repo and carries no docs/decisions — the honest pin asserts the absent behavior, and the repaired index (0012, 0013 rows) lives in the outer studio repo, recorded in this unit's preamble.
