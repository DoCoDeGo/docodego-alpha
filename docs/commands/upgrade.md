# docodego upgrade

> Move the record to this CLI's bundled record version — create-only, never rewriting yours.

## Usage

```
docodego upgrade [--apply] [--branch]
```

## Contract

```
flags:
  (none)    plan only: the diff (copy / .new side-by-side) + migration notes
  --apply   run the plan: scaffold refresh, ordered version-keyed migrations,
            gates re-checked, manifest stamped
  --branch  run the --apply work on branch docodego-upgrade-vX-to-vY and commit
            it there — test, then merge

law: your units, tracker entries and dossier are never migrated or
overwritten; a file you modified receives the new version side-by-side as
<file>.new. a record newer than this CLI is refused politely.

exit codes: 0 (plan applied or nothing to do) · 1 a gate failed mid-migration · 3 corrupt

example:
  docodego upgrade && docodego upgrade --apply --branch
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
