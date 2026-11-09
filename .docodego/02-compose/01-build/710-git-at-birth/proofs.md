# proofs — 710-git-at-birth

- `apps/cli/src/commands/init.ts` — the birth law: gitAvailable pre-flight before anything is planted (DG-U140 refusal), birthCommit (git init when needed, planted-paths-only staging chunked in fifties, handle-identity -c overrides, --no-verify, the honest partial-state refusal when the commit itself fails)
- `apps/cli/src/cli/help.ts` — the init help page teaches the birth (the exit-code line carries DG-U140; the behavior paragraph names ADR 0013 and the handle identity)
- `apps/cli/src/conformance/a6-teaches.ts` — the 710 pins: fresh-dir birth (.git + the commit's subject and author pinned verbatim), planted-only staging (the operator's seeded file never staged, proven by git diff --cached), the PATH-shim refusal (exit 1, DG-U140, the law line, nothing planted)
- `pnpm -C apps/cli run -s conformance` — "conformance: all 514 checks green"
- `pnpm bundle:verify` — "bundle verify: clean — 52 files, spec 32" (no payload change — the AGENTS.md init bullet's clause rides the next hop, recorded in the scope)
- `pnpm run docs` + `pnpm run docs:verify` — fresh (the init page regenerated)
- `pnpm typecheck` exit 0 · `docodego check` exit 0

## failure-to-cause

- two red runs: (1) the first birth placement ran the refusal AFTER planting — a lie ("nothing was planted" with the record on disk); the pre-flight moved to the top of run() and the commit stayed after planting, splitting the refusal by honesty; (2) the check helper takes the result object, not a boolean — the shim pin builds the Res shape.
- the shim pin exercises the refusal through the environment (a fake git on PATH that exits 127), not through a test hook — production code carries no escapes.
