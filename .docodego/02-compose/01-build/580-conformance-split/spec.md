---
name: 580-conformance-split
type: unit
status: founder-signed
---

# 580-conformance-split

## intent

Retire the DG-U120 metrics-gate debt (recorded by 490, +53 over the
40 ceiling): `apps/cli/src/conformance.ts` is the tree's largest
file (1585 lines, 55 section markers, 461 checks) and every unit
appends its pins to it — the suite is the product's living
documentation, so it grows forever, and one file grows with it. The
shape: split the script into a shared helpers module plus seven
per-area modules (lifecycle, edges-and-fixture, tiers,
record-law, rooms-and-teaches, teaches-and-gates, contract-surface),
each exporting `area(ctx)`, composed by a thin `conformance.ts` that
keeps the scratch/fixture setup, the ordered awaits, and the tail
summary. The move is mechanical and verbatim: every check label,
assertion, and execution order stays byte-identical; future units
append to their area's module (each well under the ceiling) instead
of one ever-growing file.

## scope

In: the split — `apps/cli/src/conformance/helpers.ts` (paths, Res,
run/runRaw/read/write, check/fact with the shared counters, Ctx,
summary), seven area files under `apps/cli/src/conformance/` with
slices moved verbatim (unindented inside their area function), the
composer rewrite of `conformance.ts` (scratch + fixture setup,
ordered awaits, rmSync tail), per-area import computation by
identifier scan (noUnusedLocals is on), and rewriting in-slice
dynamic-import specifiers `("./x")` → `("../x")`. The fixture
creation (orig lines 359–364) hoists to the composer so every area
after a1 can hold it — pure setup, no checks, no output, order
preserved. Out: any check label, assertion, count, or ordering
change (the 461 pins must stay green with identical labels); any
engine or payload change (bundle stays at spec 27); suite command
changes (`node --experimental-strip-types src/conformance.ts`
unchanged); re-formatting the moved slices.

## acceptance

- Typecheck green; the suite runs as one command and reports exactly
  461 checks green — every label byte-identical to the pre-split
  run (diff the label list before/after).
- The composer and every area module sits well under the metrics
  gate's line ceiling; doctor reports the DG-U120 debt retired.
- Full battery green: check 0 errors, conformance 461, bundle:verify
  clean at spec 27, pnpm run doctor all healthy, docs fresh, build
  11/11.
