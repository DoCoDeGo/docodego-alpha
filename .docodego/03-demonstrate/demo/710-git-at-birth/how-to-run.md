# how to run

## see it work

1. Empty directory: `docodego init` — the tree is planted, git is
   initialized, and `git log --format=%s %an` shows the birth commit
   authored by the record's handle identity — no global git config
   involved.
2. An existing repository with your own staged file: `docodego init
   --force` — git diff --cached shows only the planted paths were
   committed; your staged file stays yours.
3. Break git (a PATH shim that exits 127) and run init in an empty
   dir: refusal DG-U140 — "records are born under version control" —
   and nothing is planted.
4. The conformance suite's 710 pins replay all three acts:
   `pnpm -C apps/cli run -s conformance` (514 green).

## run output

proofs.md quotes the gates; the law lives in
apps/cli/src/commands/init.ts (gitAvailable pre-flight, birthCommit).

## visual evidence

none — the suite and git log are the demo.
