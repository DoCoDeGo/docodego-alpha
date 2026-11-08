# docodego grill

> The adversarial Q&A: fixed gate questions plus one per acceptance criterion.

## Usage

```
docodego grill <unit> [--answers <file>] [--scaffold <file>] [--by <who>] [--json]
```

## Contract

```
the count contract: FOUR fixed questions plus ONE per acceptance
criterion in the unit's spec — a five-criterion unit asks nine.

flags:
  --scaffold <file> write the answers skeleton: every question's id and
                    text under a contract header. fill one answer per
                    GQ id, then grill with --answers. the file is
                    ephemeral — delete it after the round.
  --answers <file>  two formats, detected by content:
                    structured — 'GQ-1: answer' keyed lines (any order,
                    first wins); end a line with | for a multi-line block
                    legacy      — one answer per line, in question order
                    (empty line = fail; a file short of the count fails
                    with the missing ids named — a miscount is never a
                    silent pad)
  --json            without --answers: emit the questions as docodego/grill/v1
                    with --answers: emit the verdict envelope (expected
                    count and empty ids included)

the round appends to <unit>/grill.md (append-only; the last verdict wins).
a pass sets status 'grilled' — regrilling a scored unit demotes it back
(the hint prints; re-run score before deliver). a fail records the failed
round and exits 1 — the attempt is evidence either way.

exit codes: 0 pass · 1 fail (recorded) · 2 usage / no TTY · 3 record corrupt

example:
  docodego grill retry-webhook --scaffold answers.txt
  docodego grill retry-webhook --answers answers.txt
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
