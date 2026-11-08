---
name: 510-pnpm-migration
type: unit
status: launch-passed
---

# 510-pnpm-migration

## intent

The founder's ruling (cycle 8, verbatim: "I think pnpm will speed up
installs with cache: \"pnpm\""): the repository's package manager
switches from npm to pnpm. The motive is stated — install speed, and
the `cache: "pnpm"` leg in the setup-node CI step, which needs a
pnpm-lock.yaml to exist. This is the mechanical migration: one lockfile
format, workspace declaration, script delegation, and CI plumbing move
together; nothing about what is installed changes (two devDependencies:
@types/node, typescript).

## scope

In: `pnpm-workspace.yaml` (apps/*); the lockfile migrated via
`pnpm import` (exact versions preserved from package-lock.json, which
is then removed); root scripts' delegation switched from
`npm --prefix apps/cli` to `pnpm -C apps/cli`; the direct-node scripts
(docodego, canon, check, status, doctor) unchanged; a
`packageManager` pin in the root package.json (corepack + CI
action-setup read it); ci.yml and release.yml switched (pnpm
action-setup → setup-node with `cache: "pnpm"` →
`pnpm install --frozen-lockfile` → the same gates via pnpm); README
dev-setup lines. Out: any runtime change (the CLI still runs on Node;
bun stays the build-time compiler); no version bumps of dependencies;
no record or payload change.

## acceptance

- `pnpm install --frozen-lockfile` reproduces the toolchain from the
  committed pnpm-lock.yaml: typecheck, conformance, and the workspace
  bin link all work from a fresh install.
- `pnpm build` — the full release gate chain (bundle → bump guard →
  drift verify → typecheck → bun compile → smoke) — passes end to end
  under pnpm.
- The battery holds: record check green, conformance green at its
  count, bundle:verify clean, doctor at zero errors.
- No package-lock.json remains in the tree; the root scripts contain
  no npm --prefix delegation; both workflow files name no npm install.

## threats

- The biggest threat to landing: pnpm's symlinked node_modules layout
  breaking the build's tsc resolution (build.ts walks
  node_modules/typescript/bin/tsc explicitly) or the workspace bin
  link that makes `npx docodego` work. Mitigation: run the FULL
  `pnpm build` (the release gate) as this unit's proof, not just the
  battery — it exercises typecheck resolution and the built artifacts'
  smoke path; and assert the bin link after install.
