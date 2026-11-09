# delivered — 680-leftover-twins

## what landed

670 reconciled the plan's conflicts; the founder then walked the
products and found four twins where the summary said two. The fix:
after the plan reconciliation, the apply sweeps the record tree for
every remaining `.new` twin — whatever planted it — and counts it into
the walk summary, so the numbers match the disk:

- **Skill twins named with the lockfile-way guidance** — an installed
  skill at an older version is reported with its residual line count
  and `docodego skill add <name> --force` (when the kept copy is
  unmodified) or merge knowingly. Not the plan-conflict wording —
  the resolution differs.
- **No double counting** — plan-conflict twins stay in 670's
  taught-in-place reconciliation and are excluded from the sweep.
- **The summary matches the disk** — `twins remaining` and the
  residual line total now cover every twin on disk.

The pin seeds a skill twin exactly as a real old install leaves it;
if the bundle ever rewords the seeded sentence, the guard throws
instead of silently pinning the wrong shape.

## how to see it work

`pnpm -C apps/cli run -s conformance` — 495 green. On a real record:
`docodego upgrade --apply` and read the last line; every `.new` on
disk appears above it, counted.
## delivered 2026-11-10

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 71/100 — matches the recorded block (spec-sha 6b1b901829450e2e); latest verdict: pass; proof: apps/cli/src/commands/upgrade.ts · warning: 3 path-like span(s) do not resolve (.new, 01-discover/README.md.new, .docodego/README.md.new) — launch will refuse if they are proof paths
