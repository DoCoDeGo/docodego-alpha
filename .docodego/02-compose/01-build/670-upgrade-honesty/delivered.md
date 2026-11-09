# delivered — 670-upgrade-honesty

## what landed

`upgrade --apply` now tells the truth about its own walk:

- **Twin reconciliation** — every plan conflict is checked against
  reality at the end of the run: a twin the sweep removed (because a
  migration brought the kept copy current) is reported as
  `resolved in place (twin swept)` — no more stale merge burdens; a
  twin that survives is reported with its residual size in differing
  lines and the honest instruction: `merge or delete knowingly`.
- **The walk summary** — one line: hops crossed, migration steps
  applied, twins resolved in place, twins remaining (carrying N
  differing lines).
- **The lockfile stamp** — `skills-lock.json`'s `recordSpecVersion`
  now follows the manifest on every apply; a lockfile can no longer
  state a version the record outgrew.

The v31 test round's findings (stale conflict lines, invisible
residuals, no summary, stale lockfile) are each closed by the
corresponding piece above. Residuals are never auto-merged — the words
are the operator's; the CLI only counts.

## how to see it work

`pnpm -C apps/cli run -s conformance` — 492 green; the a2 conflict-law
fixture's walk prints the summary live, and the 670 block pins its
shape. On any real record: `docodego upgrade --apply` and read the
last line.
## delivered 2026-11-10

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 72/100 — matches the recorded block (spec-sha adff743bbd3d4d27); latest verdict: pass; proof: apps/cli/src/commands/upgrade.ts
