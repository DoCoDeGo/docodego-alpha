# docodego lint

> The rule tree over the record: structure, frontmatter, naming.

## Usage

```
docodego lint [--self-check] [--json]
```

## Contract

```
flags:
  --self-check  validate the rule registry itself before it judges anything
  --json        emit docodego/lint/v1 with the findings array

every finding cites its rule id — 'docodego explain <id>' explains it.

exit codes: 0 nothing to report · 1 findings · 3 record corrupt

example:
  docodego lint --self-check
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
