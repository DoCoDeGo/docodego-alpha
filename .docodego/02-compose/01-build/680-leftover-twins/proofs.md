# proofs — 680-leftover-twins

- `pnpm -C apps/cli run -s conformance` — "conformance: all 495 checks green" (492 + 3 net: the leftover skill twin named with residual and skill-add guidance, the summary matching the disk at `twins remaining: 2 (carrying 4 differing line(s))`, no double counting of the plan twin)
- `apps/cli/src/commands/upgrade.ts` — after the plan-conflict reconciliation, a `walkFiles` sweep (skipping .git and node_modules dirs) accounts every leftover twin file on disk that the plan did not plant; the reconciled set excludes plan twins; skill twins get the `docodego skill add <name> --force` guidance
- `pnpm bundle:verify` — "bundle verify: clean — 52 files, spec 31" (no payload change)
- `node apps/cli/src/main.ts check` — exit 0
- `pnpm typecheck` — exit 0

## failure-to-cause

- first run: two 680 facts failed + two TS errors — cause: my double-counting fact used the products' twin path 01-discover/README.md.new but the fixture's plan twin lives at .docodego/README.md.new (count 0, fact false); and I expected the fixture README residual at 3 but the conflict block's appended edit adds a blank line, so the multiset count is 4. TS: `skillFiles`'s indexed access is `string | undefined` under the strict tsconfig — guarded with an explicit throw.
- the seeded skill byte-swap relies on one bundled sentence; if the bundle ever rewords it, the seed's guard throws loudly instead of silently pinning the wrong shape.
