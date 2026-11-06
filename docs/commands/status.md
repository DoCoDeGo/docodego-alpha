# docodego status

> The one-screen board: every unit, its stream and status, epic/story rollups.

## Usage

```
docodego status [--json] [--epic E] [--story S]
```

## Contract

```
flags:
  --epic <name>   narrow the board to the units linked to one epic
  --story <name>  narrow to one story
  --json          emit docodego/status/v1 with rows and rollups

exit codes: 0 · 3 no record

example:
  docodego status --epic delivery-reliability
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
