# proofs — 670-upgrade-honesty

- `pnpm -C apps/cli run -s conformance` — "conformance: all 492 checks green" (488 + 4 new 670 facts: walk-summary presence on the real walk (v1 → 31) in the conflict block's verifier, summary shape on the idempotent re-apply, residual counted in differing lines, lockfile recordSpecVersion == manifest)
- `apps/cli/src/commands/upgrade.ts` — the twin reconciliation after the migration loop (swept twins named `resolved in place`, surviving twins measured by a line-multiset count) + the `walk summary:` line; `stampVersion` stamps the skills lockfile's recordSpecVersion alongside the manifest
- `pnpm bundle:verify` — "bundle verify: clean — 52 files, spec 31" (no payload change — output honesty, not vocabulary)
- `node apps/cli/src/main.ts check` — exit 0
- `pnpm typecheck` — exit 0

## failure-to-cause

- first conformance run failed the new check — cause: I passed the expected exit and verifier to `run()` instead of `check()`; the harness treated `run`'s extra args as a type error and `check`'s exit as undefined.
- the hops pin failed on the idempotent apply (31 -> 31, zero steps) — cause: my block runs after the conflict block's apply already stamped 31; the real-walk summary is now pinned in the conflict block's verifier, the idempotent shape in my block.
