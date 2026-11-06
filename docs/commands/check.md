# docodego check

> Record integrity: statuses match markers, delivered units hold proofs, links resolve.

## Usage

```
docodego check [--json]
```

## Contract

```
checks per unit: status claims have their markers (grill/score/delivered),
delivered units carry a proofs.md whose paths exist on disk, and epic/story
links name real units. findings are positioned (file:line:col).

exit codes: 0 record holds together · 1 errors found · 3 record corrupt

example:
  docodego check --json
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
