# proofs — 510-pnpm-migration

The switch, proven by the release gate itself: the full `pnpm build`
chain ran end-to-end under pnpm and reported `build: 11/11 gates
green` — bundle (bump guard), bundle --verify, typecheck (tsc through
pnpm's symlinked node_modules — the threat's exact site), toolchain
bun 1.4.4, both compiles, and four smokes through the built artifacts
(js and binary: --version, init, skill list) — `[evidence:
suite-run]`.

- AC1 — a fresh install reproduces the toolchain: node_modules was
  removed and `pnpm install --frozen-lockfile` rebuilt it (Done in
  199ms, typescript 7.0.2 resolved), `pnpm typecheck` passed for both
  apps, and the workspace bin link works —
  `pnpm exec docodego --version` reports `docodego cli 0.9.0 · record
  spec 26`. One migration fix surfaced here: pnpm does not auto-link
  every workspace package's bin the way npm did — the root now
  declares `docodego: workspace:*` so the link is intentional, not
  inherited — `[evidence: suite-run]`.
- AC2 — the release gate: `build: 11/11 gates green` (output pinned
  above), artifacts emitted and hashed (docodego.js 428.7 KB, binary
  85.4 MB) — `[evidence: suite-run]`.
- AC3 — the battery, every invocation through pnpm scripts:
  `pnpm check` exit 0, `pnpm conformance` reports all 428 checks
  green, `pnpm bundle:verify` clean (52 files, spec 26, structure
  84668fbecc05), `pnpm doctor` reports All checks passed at zero
  errors — the delegation itself is proven by the same battery run —
  `[evidence: suite-run]`.
- AC4 — the tree facts: the npm lockfile is gone from disk (asserted
  by absence), `pnpm-lock.yaml` and `pnpm-workspace.yaml` are
  committed, the root scripts carry no npm --prefix delegation, and
  neither workflow file runs an npm install — ci.yml and release.yml
  both gain the pnpm setup action (v4) and `cache: pnpm` on setup-node,
  with the bun setup action retained (the build compiles the
  binary). The settings live in `package.json` (packageManager pin
  pnpm@12.14.0) and `.github/workflows/ci.yml` — `[evidence:
  suite-run]`.

## the publish job, untouched

release.yml's second job (npm publication from the proven release)
keeps npm — publishing to the registry was not the founder's concern
and the proven artifact, not a pnpm rebuild, is what publishes.
