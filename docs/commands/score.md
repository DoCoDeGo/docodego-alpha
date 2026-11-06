# docodego score

> Five ICS-lite passes over the spec; the visible breakdown lands in score.md.

## Usage

```
docodego score <unit> [--json]
```

## Contract

```
dimensions (sum to 100):
  completeness 25 · unambiguity 25 · testability 25 · threat 15 · anti-gaming 10
a section still carrying the scaffold's placeholder text is incomplete and
earns nothing — lazy specs stay below the floor by construction.

sets status 'scored'. the score itself is not a gate: the floor (60) bites
at deliver.

exit codes: 0 scored (any total; the breakdown shows it) · 2 usage

example:
  docodego score retry-webhook
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
