# docodego explain

> The page for a diagnostic code: what it means, the law behind it, how to fix it.

## Usage

```
docodego explain <code> | docodego explain --list | docodego explain <family>
```

## Contract

```
arguments:
  <code>     an exact diagnostic code (e.g. DG-F004) — prints its page
  <family>   a prefix (e.g. DG-F or DG-U) — prints every code in the family
  --list     every code with its one-line summary

exit codes: 0 · 2 unknown code

example:
  docodego explain DG-F004
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
