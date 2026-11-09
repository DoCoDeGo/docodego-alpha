# proofs — 630-sign-dialog

The working state showed the expected drift-gate baseline (the bundle gate
reads HEAD); every gate below ran in the committed state after the hop
commit.

- `pnpm typecheck` — exit 0 (cli + canon, pre-hop)
- `node apps/cli/src/main.ts upgrade --apply` — "updated AGENTS.md (the sign bullet teaches the dialog)" · "manifest.recordVersion -> 31"
- `pnpm bundle` — "bundle: wrote payload.ts + manifest.json — 52 files, structure 84668fbecc05, 18 skills, boundary v2" (2 changes: AGENTS.md rule lines + declared specVersion 30 -> 31)
- `canon/record/version-transition.md` — v30 -> v31 mirror row appended by the registry parse (notes verbatim, `; `-joined)
- `pnpm -C apps/cli run -s conformance` — "conformance: all 485 checks green" (482 + 3 dialog-grammar pins: approve, edit, reject-everything-else)
- `pnpm bundle:verify` — "bundle verify: clean — 52 files, spec 31, structure 84668fbecc05"
- `pnpm run docs` — "docs generated — 25 files under docs/"; `pnpm docs:verify` — "docs fresh — 25 generated files verified, 0 orphans"
- `pnpm run doctor` — "9/9 checks healthy · exit 0 — all healthy"
- `pnpm run build` — "  ok " count 11 (artifacts + all deliverable checks)

## failure-to-cause

- `upgrade --apply` printed "manifest.recordVersion -> 30" and exited 0-shaped-but-wrong on the first run — cause: the upgrade's target is the payload's declared specVersion (bundled/index.ts reads PAYLOAD.specVersion), and the payload still declared 30; the hop order is bump the declared version, upgrade the live record, then `pnpm bundle` re-stamps from the live manifest.
- the signOne `identity` guard edit matched signAll's twin block first — cause: both commands share the resolveIdentity complaint text; disambiguated with the signOne-only trailing context (the specHash line).
