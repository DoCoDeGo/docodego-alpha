# how to run

The demo is the catch-up: the law file now says what the machine
does — read the two passages side by side with the amendment that
authorized them.

## see it work

    sed -n '/reversible encoding/p' spec/laws/34-the-launch-gate.md
    sed -n '/concealment from the casual read/p' spec/laws/34-the-launch-gate.md
    sed -n '/^status:/p' spec/amendments/1.2.5-EL-34.md
    grep -n "1.2.5" spec/SPEC.md spec/amendments/log.md | head -3

Expected: the founder-signed paragraph names the versioned reversible
encoding; the honest-limit paragraph carries the repriced sentence;
the amendment reads `applied-in-1.2.5`; SPEC.md stamps 1.2.5 and the
log row quotes the founder's words verbatim.

Then the consistency sweep:

    pnpm canon verify
    pnpm run doctor

Expected: canon re-derives the chain clean at 1.2.5 (51 files,
33 laws); the doctor is 9/9 healthy on record v27 with the bundled
spec current.

## run output

`conformance: all 445 checks green` — 2026-11-09, recorded in the
unit's proofs.md with the byte-comparisons.

## visual evidence

none — the side-by-side sed is the show.
