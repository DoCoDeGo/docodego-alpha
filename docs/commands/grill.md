# docodego grill

> The adversarial Q&A: fixed gate questions plus one per acceptance criterion.

## Usage

```
docodego grill <unit> [--answers <file>] [--json]
```

## Contract

```
flags:
  --answers <file>  one answer per line, in question order (empty line = fail)
  --json            without --answers: emit the questions as docodego/grill/v1
                    with --answers: emit the verdict envelope

the round appends to <unit>/grill.md (append-only; the last verdict wins).
a pass sets status 'grilled'; a fail records the failed round and exits 1 —
the attempt is evidence either way.

exit codes: 0 pass · 1 fail (recorded) · 2 usage / no TTY · 3 record corrupt

example:
  docodego grill retry-webhook --json > questions.json
  docodego grill retry-webhook --answers answers.txt
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
