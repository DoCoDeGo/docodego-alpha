## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The repository's package manager becomes pnpm — workspace file,
lockfile (imported from package-lock with exact versions), root
script delegation, CI plumbing with cache: "pnpm" — with the
installed dependency set unchanged and the runtime untouched.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The full `pnpm build` release gate (bundle, bump guard, drift
verify, typecheck, bun compile, smoke through the built artifacts),
a fresh `pnpm install --frozen-lockfile` reproducing the toolchain,
the workspace bin link asserted, and the record battery (check,
conformance, bundle:verify, doctor) green — each named in proofs.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: pnpm's symlinked node_modules breaking the build's explicit tsc path
resolution or the npx bin link. Mitigation: the release gate runs
end-to-end under pnpm as the unit's proof, and the bin link is
asserted after install — both failure sites are on the proof path,
not beside it.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Any runtime change (Node stays the runtime, bun stays build-time),
dependency version bumps, payload or record changes, and rewriting
historical record files that mention npm runs (they are history —
the switch is forward-looking; only README dev-setup lines and CI
move).

- GQ-AC1 asked: Criterion: '`pnpm install --frozen-lockfile` reproduces the toolchain from the committed pnpm-lock.yaml: typecheck, conformance, and the workspace bin link all work from a fresh install.' — how is this verified end-to-end?
  answered: Remove node_modules and package-lock from the equation and run
`pnpm install --frozen-lockfile` fresh; then `pnpm typecheck` green,
`pnpm exec docodego --version` through the workspace bin link, and
the file listing showing no package-lock.json — the reproduction is
the proof.

- GQ-AC2 asked: Criterion: '`pnpm build` — the full release gate chain (bundle → bump guard → drift verify → typecheck → bun compile → smoke) — passes end to end under pnpm.' — how is this verified end-to-end?
  answered: `pnpm build` runs its own gate chain and exits 0 — the chain's
reporter prints each gate (bundle, bump guard, drift verify,
typecheck, compile, smoke); proofs pins the output tail.

- GQ-AC3 asked: Criterion: 'The battery holds: record check green, conformance green at its count, bundle:verify clean, doctor at zero errors.' — how is this verified end-to-end?
  answered: The battery after the switch: record check green, conformance green
at its count, bundle:verify clean at spec 26, doctor at zero errors
— all invoked through pnpm scripts, proving the delegation itself.

- GQ-AC4 asked: Criterion: 'No package-lock.json remains in the tree; the root scripts contain no npm --prefix delegation; both workflow files name no npm install.' — how is this verified end-to-end?
  answered: The tree facts: no package-lock.json on disk, no npm --prefix in
package.json scripts, no `npm install` in either workflow file, and
pnpm-lock.yaml + pnpm-workspace.yaml committed — a grep-level
assertion recorded in proofs.


verdict: pass
