# how to run

The demo is the conformance sign-off block: a fixture record, a
scaffolded amendment, one sign-off command — then the record layer
shows the act.

## see it work

From the repository root (the pins live in the v24 sign-off block of
`apps/cli/src/conformance.ts`):

    pnpm conformance

Or by hand, in any scratch directory:

    docodego init
    docodego sign-off spec/amendments/<amendment>.md --quote "Accept" --by "Ada Lovelace"
    cat .docodego/04-govern/signatures.md
    cat .docodego/04-govern/01-monitor/tracker.md

Expected: the amendment's pending block is replaced by the receipt
(quote verbatim, law hash, scan-clean line, attestation limit), the
signatures ledger gains a row keyed by the amendment id with act
`amendment-signed`, the tracker gains its row — and a second sign-off
of the same amendment refuses (DG-U115) having appended nothing. With
no record layer, the command dies with the record fatal before
anything is written.

## run output

`conformance: all 434 checks green` — 2026-11-09, recorded in the
unit's proofs.md; cli302–305 pin the rows byte-exact.

## visual evidence

none — the ledger row is the show.
