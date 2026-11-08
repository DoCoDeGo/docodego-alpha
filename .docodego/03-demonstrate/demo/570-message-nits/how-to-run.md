# how to run

The demo is the four lines, before-and-after the same commands every
user already runs.

## see it work

    docodego init
    docodego new demo-unit --stream 02-compose/01-build
    docodego status | head -2
    docodego check

Expected, in order: init's planted line splits its counts (record
files, agent files, skills — no bare total); new's line reads
"unit 010-demo-unit scaffolded — spec: <path>"; status's counter
line reads "units N — by current status: draft …"; check's green
line states the walk ("N unit(s) walked, 0 findings").

## run output

`conformance: all 461 checks green` — 2026-11-09, recorded in the
unit's proofs.md.

## visual evidence

none — the four lines are the show.
