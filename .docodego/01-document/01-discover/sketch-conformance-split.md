# sketch: conformance-split

## intent

Debt named by 490's metrics-gate refusal (DG-U120, +53 against a 40
ceiling): apps/cli/src/conformance.ts is the tree's largest file
(1495 lines, 17 decls, longest span 572) and every unit adds its
checks to it — the suite is the product's living documentation, so it
grows forever, and a single file grows with it until the ceiling
refuses every unit.

The surgical shape: split the conformance script into per-area
modules (lifecycle, payload/versioning, skills, vocabulary, sign,
metrics, …), each exporting a `blocks(ctx)` that receives the shared
helpers (run/check/fact/write, MAIN, scratch handles) from a thin
conformance.ts that only composes. The suite stays one command
(`npm run -s conformance`) with one green count; each area's checks
move as-is — a mechanical re-homing, not a rewrite, and the 428 pins
must stay green byte-for-byte after the move.

## evidence-of-running

- `npm run -s conformance` still reports exactly 428 checks green
  (or more, never fewer) after the split.
- conformance.ts itself shrinks below the size gate's line ceiling;
  the per-area modules each sit well under it too.
- The metrics gate passes with no declared coverage — the debt is
  retired, not covered again.

## verdict

open — a candidate for the next build-stream unit; it retires debt
and earns retirement credit under the founder's balance directive.
