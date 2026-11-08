# how to run

The demo is the shape, not a feature: the suite runs exactly as
before — one command, one green count — while the tree now shows
where each area lives.

## see it work

    pnpm -C apps/cli run -s conformance
    ls apps/cli/src/conformance/
    node apps/cli/src/main.ts metrics report | head -8

Expected: the same verdict line the suite has always printed —
`conformance: all 461 checks green` — and, new, a conformance/
module directory whose largest file (a7, 389 lines) sits far under
the old single file's 1585. `docodego metrics report` no longer
lists conformance.ts among the largest files: the file every unit
used to grow is now a 36-line composer that never grows.

To verify the move was verbatim: the unit's proofs/ carries the
label list captured before and after the split — diff them; the
diff is empty.

## run output

`conformance: all 461 checks green` — 2026-11-09, recorded in the
unit's proofs.md with the label lists.

## visual evidence

none — a green suite and a smaller largest-file list are the show.
