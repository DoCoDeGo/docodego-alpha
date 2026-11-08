# how to run

The demo is the ruling: who signed is visible, and one authored
text governs the hops.

## see it work

    sed -n 1,8p .docodego/02-compose/01-build/600-twin-text-founder-marker/signature.md
    grep -c "provisional" .docodego/04-govern/signatures.md
    pnpm -C apps/cli run -s conformance 2>&1 | tail -1

Expected: this unit's own founder signature — signed by the
environment's encoded identity — carries the provisional marker on
its role line ("provisional — a derived identity signed; the
confirming act is a named-person founder signature"); the ledger
shows the marker on derived rows and none on typed ones (the a3
pins hold it both ways in fixtures); the suite is green with the
mirror pin live. This record is the demo: the act is on file.

## run output

`conformance: all 465 checks green` — 2026-11-09, in the committed
state, recorded in the unit's proofs.md. The mirror pin (hop for
hop and word for word) fails the suite if the canon table or the
registry moves alone.

## visual evidence

none — a marked receipt and a green suite are the show.
