# how to run

## see it work

1. Scratch record: `docodego init`, edit one planted file by one line,
   `docodego upgrade --apply` — the file is refreshed in place, your
   bytes sit beside it as the .old copy, and UPGRADE-NOTES.md at the
   repo root carries a dated section with the review options.
2. `docodego upgrade` (plan only) shows live versus .old side-by-side.
3. The conformance suite's 690 block replays the whole arc — conflict,
   skill refresh, accounting, restore, the hop — in one run:
   `pnpm -C apps/cli run -s conformance` (510 green).
4. A record still at v31 takes the hop: the ignore file drops the .new
   rule in place, AGENTS.md teaches the new law, leftover .new twins
   are named for the review.

## run output

proofs.md quotes the gates and the walk summary; the law lives in
apps/cli/src/versioning/plan.ts and upgrade.ts, the teach in
apps/cli/src/versioning/migrations.ts.

## visual evidence

none — the suite and the notes file are the demo.
