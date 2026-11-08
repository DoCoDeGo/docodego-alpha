# how to run

The canon pair is the demo: this unit is the law's own amend procedure
(how-to-amend steps 4–6) run over a founder-signed amendment — the same
flow an adopter's standard follows when their owner accepts an
amendment. Second use: the amendment file doubles as the tutorial — a
cold reader sees the before-words, the after-words, the founder's
verbatim acceptance, and the fingerprinted receipt in one file.

## see it work

From the repository root:

    node --experimental-strip-types apps/spec/src/main.ts build
    node --experimental-strip-types apps/spec/src/main.ts verify
    node --experimental-strip-types apps/cli/scripts/compile-statutes.ts --check
    npm run -s check

Expected: build delivers the index at 1.2.4 (structure 2442837c0b65…),
verify re-derives the chain with 0 errors, the statutes page matches the
canon, and the record check is green. `docodego doctor` reads zero
errors once the amendment set's commit has landed (the baseline defers
to HEAD — that refusal before the commit is the machinery enforcing
together-or-not-at-all).

## run output

`canon build · 50 file(s), 33 law(s), structure 2442837c0b65…` ·
`canon verify · 50 file(s) · 33 law(s) · 21 live CLI command(s) ·
0 error(s), 0 warning(s)` · `statutes page matches the canon` ·
`check: record holds together.` — 2026-11-08, recorded in the unit's
proofs.md.

## visual evidence

none — the canon pair is the demo.
