# how to run

The suite is the demo: cli287–cli301 build scratch records, rename
scaffolded units to reach four-digit names, and run the real binary
through the whole numbering contract — assignment past 1000, the
tracker-only tomb, numeric listing order, the naming pass, pre-numbered
recognition, and the retire identity. Second use: the fixtures are a
publishable script of the numbering law — an adopter can read
`apps/cli/src/conformance.ts` cli287–cli301 as the specification of
what their unit folders do past 999.

## see it work

From the repository root:

    npm run -s conformance

Expect the final line `conformance: all 428 checks green` (or more,
never fewer). The numbering facts are the cli287–cli301 labels; every
check spawns `apps/cli/src/main.ts` against a scratch record, so the
demonstration is the shipped command path, not a mock.

To see the defect this unit fixed, check out the parent commit and run
the same block: the assignment past a live four-digit unit refuses
with DG-U012 forever, because the old scanner (`\d{3}`) could not see
the `1000-…` folder it had just created.

## run output

`conformance: all 428 checks green` — 2026-11-08, recorded in the
unit's proofs.md (AC1–AC6) with the named cli-labels.

## visual evidence

none — the suite is the demo.
