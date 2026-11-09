# how to run

## see it work

1. `pnpm -C apps/cli run -s conformance` — 495 green; the a2 block
   seeds a skill twin exactly as an old install leaves it, applies,
   and pins: the twin named with residual, the skill-add guidance,
   the summary matching the disk, no double counting.
2. On any real record mid-merge: `docodego upgrade --apply` — every
   `.new` on disk appears in the output and the final `walk summary:`
   total equals the disk's twin count and residual lines.

## run output

proofs.md quotes the gates; the pinned summary shape lives in
apps/cli/src/conformance/a2-edges.ts (680 block).

## visual evidence

none — the suite is the demo.
