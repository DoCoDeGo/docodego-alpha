# how to run

Filled by the agent at demonstration time; read by the founder's
"show me it working" and the launch auditor (an unfilled scaffold
refuses the launch gate). Write how a cold reader sees this unit work.
Scratch captures live in var/ or here as paths — the honesty law
recognizes paths, not pasted binaries. One honest line is a valid fill:
"the suite is the demo" is a show.

## see it work

The sweep removed code and docs drift; the demo is that the tree it
left behind runs green and the record's census reads zero. Four
commands, from the repository root:

1. `npm run conformance` — the law's suite: **all 363 checks green**
   (355 before the sweep; the two tool fixes landed with their cover).
2. `npm run bundle:verify` — the payload boundary held: **clean — 52
   files, allowlist v2**. No batch touched a payload file.
3. `node --experimental-strip-types apps/spec/src/main.ts doctor` —
   **canon doctor · no drift** — no law tree moved, so no bump chain
   was owed.
4. `node --experimental-strip-types apps/cli/src/main.ts check` —
   **record holds together, exit 0, 0 errors, 0 warnings**. This unit
   opened with 24 standing warnings (20 DG-C018 status-flip artifacts,
   2 DG-C019 teaching false positives, 2 DG-C002 stale paths); the
   census now reads zero.

And to see the removals themselves: `npm run -s typecheck` compiles
both apps with `noUnusedLocals` — the flag that found fourteen more
dead imports after the audits went home.

## run output

Captured at the deliverable HEAD, in the unit's proofs folder:

- `.docodego/02-compose/01-build/430-refactor-sweep/proofs/census-after.txt` [evidence: suite-run]
- `.docodego/02-compose/01-build/430-refactor-sweep/proofs/conformance.txt` [evidence: suite-run]
- `.docodego/02-compose/01-build/430-refactor-sweep/proofs/bundle-verify.txt` [evidence: suite-run]
- `.docodego/02-compose/01-build/430-refactor-sweep/proofs/doctor.txt` [evidence: suite-run]
- `.docodego/02-compose/01-build/430-refactor-sweep/proofs/tsc.txt` [evidence: suite-run]
- `.docodego/02-compose/01-build/430-refactor-sweep/proofs/dead-symbols-gone.txt` [evidence: suite-run]

## visual evidence

none — the suite is the demo. The sweep's visible product is a smaller
tree and a clean census; the six captures above are that, on disk.
