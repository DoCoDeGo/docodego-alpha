# how to run

The demo is the disagreement ending: a proofs.md that cites version
strings no longer trips the launch gate.

## see it work

    docodego init
    docodego new path-demo --stream 02-compose/01-build
    … walk the tiers, proofs.md citing:
      - the run: `src/demo.txt`
      - outputs: `1.3.0`, `2.10.5`
    docodego launch path-demo

Expected: L2 counts 1 proof path (src/demo.txt) — the version
strings are prose about outputs, not phantom evidence, so nothing
"vanishes". And a genuine typo (`src/dmeo.txt`) now warns at
deliver: "warning: 1 path-like span(s) do not resolve … launch will
refuse if they are proof paths" — caught at write time, exit 0.

## run output

`conformance: all 450 checks green` — 2026-11-09, recorded in the
unit's proofs.md; the regression pin names the test-round scenario
verbatim.

## visual evidence

none — the clean L2 line is the show.
