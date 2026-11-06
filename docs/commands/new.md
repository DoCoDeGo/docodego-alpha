# docodego new

> Scaffold <stream>/<unit>/spec.md from the embedded template and append a tracker line.

## Usage

```
docodego new <unit> [--type unit|epic|story] [--epic E] [--story S] [--stream <stream>] [--from-sketch <name>]
```

## Contract

```
flags:
  --type <t>        unit (default) | epic | story — the type's home stream is enforced
  --epic <name>     link the unit to an epic (frontmatter epic:)
  --story <name>    link the unit to a story
  --stream <s>      one of the sixteen streams (default: the type's home)
  --from-sketch <n> graduate a sketch: its intent and evidence become the spec's
  --json            emit docodego/new/v1 on stdout

type homes: epics live in 01-document/01-discover · stories in 01-document/02-refine.
names are kebab-case; an existing unit is never overwritten (exit 1).

exit codes: 0 created · 1 unit already exists · 2 usage · 3 sketch referenced but missing

example:
  docodego new retry-webhook --epic delivery-reliability
  docodego new delivery-reliability --type epic
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
