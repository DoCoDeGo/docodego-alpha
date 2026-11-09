# delivered — 650-enhancements-triage

## what landed

All 19 open boxes dispositioned in `docs/process/enhancements.md` —
every one in exactly one state, nothing unowned:

- **ruled/verified done today**: 1 (name stays), 2 (distribution live:
  npm unscoped + org mirror with provenance, brew tap real, binaries +
  installer), 8 (branch protection + CODEOWNERS, 640), 11 (one-command
  install live)
- **done by earlier children**: 9 (260), 13 (290), 14 (270), 15 (280)
- **small win implemented here**: 7's verifiable half — the workflow
  least-privilege pin: three conformance facts assert release.yml's
  permission blocks byte-exactly and ci.yml's default read-only
  surface; widening the write surface now fails the suite. 488 green.
- **ship-now, own units pending pickup**: 5 (transcript gate), 6
  (threat pass on parsing semantics), 16 (Windows symlink refusal at
  the collector)
- **launch-gates**: 3 (binary size spike), 12 (binary attestations —
  npm provenance already live)
- **founder-at-launch**: 4 (trademark), 10 (skill repo URL), 20 (demo
  recording)
- **deliberate declines, standing**: 17, 18, 19 (the record's own v1
  rulings — on-demand increments, the design working)

## how to see it work

`tail -40 docs/process/enhancements.md` — the table.
`pnpm -C apps/cli run -s conformance` — 488 green including the three
"650:" facts.
