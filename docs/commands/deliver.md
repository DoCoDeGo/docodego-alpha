# docodego deliver

> The gate. Four decisions; only an all-green gate writes anything.

## Usage

```
docodego deliver <unit>
```

## Contract

```
gates:
  G1  spec complete (frontmatter, intent, acceptance)
  G2  score >= 60 (the floor)
  G3  grill verdict pass (the last recorded round)
  G4  at least one proof path in proofs.md that exists on disk

pass: appends delivered.md + a tracker line, sets status 'delivered'.
fail: prints the failed gates and commits nothing — exit 1.

exit codes: 0 delivered · 1 gate fail (nothing committed) · 2 usage · 3 corrupt

example:
  docodego deliver retry-webhook
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
