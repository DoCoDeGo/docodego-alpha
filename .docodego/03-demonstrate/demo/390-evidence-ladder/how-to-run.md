# how to run

Filled by the agent at demonstration time; read by the founder's
"show me it working" and the launch auditor (an unfilled scaffold
refuses the launch gate). Write how a cold reader sees this unit work.
Scratch captures live in var/ or here as paths — the honesty law
recognizes paths, not pasted binaries. One honest line is a valid fill:
"the suite is the demo" is a show.

## see it work

The suite is the demo. Run the conformance suite and watch the ladder
hold — the DG-C019 checks in the v2n block:

    node --experimental-strip-types apps/cli/src/conformance.ts

Expected: `conformance: all N checks green`, including "an unknown
evidence declaration is flagged (DG-C019 warning, registry named)" and
"the demo bundle is scanned too, and names its own path". Or see one
flag live: declare `[evidence: anything]` in any proofs.md and run
`docodego check` — the warning names the registry.

## run output

`proofs/conformance.txt` — the suite's green tail at the delivered HEAD
(343 checks).

## visual evidence

none — the suite is the demo. (`[evidence: suite-run]` on
`proofs/conformance.txt` — deterministic, the recorded green of the
project's own suite.)
