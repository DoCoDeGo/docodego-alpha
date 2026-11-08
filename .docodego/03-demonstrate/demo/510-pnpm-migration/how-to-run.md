# how to run

The release gate is the demo: the switch's proof is `pnpm build`
running its eleven-gate chain — including tsc through pnpm's symlinked
node_modules and the binary compile through bun — ending in smokes
that run the built artifacts themselves. Second use: the chain's
reporter doubles as a contributor's map of what a release proves.

## see it work

From the repository root:

    pnpm install --frozen-lockfile
    pnpm build
    pnpm conformance
    pnpm exec docodego --version

Expected: the install resolves from the committed pnpm-lock.yaml in
sub-second warm-cache time; build reports `11/11 gates green` with the
artifact hashes; conformance reports all 428 checks green; the bin
link reports the CLI version. `pnpm doctor` reads zero errors.

## run output

`build: 11/11 gates green` · `conformance: all 428 checks green` ·
`docodego cli 0.9.0 · record spec 26` — 2026-11-09, recorded in the
unit's proofs.md.

## visual evidence

none — the release gate is the demo.
