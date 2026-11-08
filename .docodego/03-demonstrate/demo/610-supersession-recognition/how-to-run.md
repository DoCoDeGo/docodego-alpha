# how to run

The demo is the honest loop: the gate names a repair, the record
takes it, the gate sees it.

## see it work

    node apps/cli/src/main.ts check 2>&1 | tail -2
    grep -c "^- supersession (2026" .docodego/02-compose/01-build/160-spec7-bundling/proofs.md
    node apps/cli/src/main.ts explain DG-C017 | grep "row the gate recognizes"

Expected: check walks 50 units with 0 findings — the drift lights
that warned since the rename are quiet, because the record spoke:
160 and 200 carry dated supersession rows declaring their
delivery-day evidence on purpose, and 150 cites the real fixture
paths. The explain page names the exact row form the gate
recognizes — contract and detector agree.

## run output

`conformance: all 467 checks green` — 2026-11-09, in the committed
state, recorded in the unit's proofs.md. The fixture holds all four
worlds: quiet before, warned after, quiet with the dated row,
warned with undated prose.

## visual evidence

none — a quiet check and a green suite are the show.
