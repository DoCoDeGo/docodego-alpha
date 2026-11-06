# docodego trace

> Everything recorded about one unit, replayed on one timeline.

## Usage

```
docodego trace <unit> [--json]
```

## Contract

```
reads the unit's own trail — spec, grill rounds and their verdicts,
the score, the proofs that still exist, the deliveries — plus the
tracker rows naming it, oldest first. read-only: trace writes nothing.

an event the record holds no date for renders as '—' (created is one);
a bare draft still shows its created line — that is honest.

exit codes: 0 found · 2 unknown unit · 3 record corrupt

example:
  docodego trace retry-webhook
  docodego trace retry-webhook --json
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
