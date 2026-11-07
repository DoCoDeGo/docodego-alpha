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

proof paths — the grammar, because it is law: from each proofs.md list item,
every backticked span and the first bare token are candidates; a candidate
counts as a path when it carries a '/' or ends in a file extension, with no
inner whitespace. Paths resolve against the repo root, the record root
(.docodego/), and the unit folder. Any honest shape works:
  - proof.txt — the unit test output
  - AC1 — the suite ran: `01-document/01-discover/<unit>/proofs/run.txt`

pass: appends delivered.md + a tracker line + a delivery-log row, sets
      status 'delivered'.
fail: prints the failed gates and records the attempt in the tracker —
      exit 1. The landing is never written on a red gate.

exit codes: 0 delivered · 1 gate fail (the attempt is recorded in the tracker; the landing is not written) · 2 usage · 3 corrupt

example:
  docodego deliver retry-webhook
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
