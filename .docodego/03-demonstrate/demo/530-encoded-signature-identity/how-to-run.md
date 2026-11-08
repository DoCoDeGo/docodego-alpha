# how to run

The demo is the reveal: a signature row that reads opaque in the file
and names its signer through the CLI — the exact property the founder
ruled ("only reveal it when needed").

## see it work

From any directory (no record layer needed):

    docodego whoami
    docodego whoami --decode "enc:v1:QWRhIExvdmVsYWNl"

Expected: the first prints the identity this environment derives (git
or system), its kind, and the exact `enc:v1:` token a signature would
store — the file shows the token, the CLI shows the person. The second
prints `Ada Lovelace` — any team member can decode any row by hand.

Then the signed side, in any scratch record:

    docodego init
    docodego new my-unit --stream 02-compose/01-build
    … walk the tiers …
    docodego sign my-unit --yes
    cat .docodego/04-govern/signatures.md

Expected: the signed-by cell carries the `enc:v1:` token — nothing
raw, no salt created — and `docodego whoami --decode "<that token>"`
names the environment. An `fp:v1` value from an old record refuses
decoding: one-way by design, standing as recorded.

## run output

`conformance: all 445 checks green` (committed state) — 2026-11-09,
recorded in the unit's proofs.md; cli306–309 pin the reveal surface.

## visual evidence

none — the decode is the show.
