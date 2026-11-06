# sketch: parser-fuzz

## intent

Feed the parser broken input on every build so a crash can never land.

## evidence-of-running

`npm run fuzz` exits 0 with two thousand mutated inputs and a golden compare.

## verdict

open
