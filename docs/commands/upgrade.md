# docodego upgrade

> Move the record to this CLI's bundled record version — applies live, preserves your words as <file>.old, hides nothing.

## Usage

```
docodego upgrade [--apply] [--branch]
```

## Contract

```
flags:
  (none)    plan only: the diff (live / .old side-by-side) + migration notes
  --apply   run the plan: ordered version-keyed migrations, gates re-checked,
            manifest stamped, UPGRADE-NOTES.md appended (the one review
            surface, at the repo root)
  --branch  run the --apply work on branch docodego-upgrade-vX-to-vY and commit
            it there — test, then merge

law (ADR 0013): your units, tracker entries and dossier are never migrated
or overwritten; a file you modified takes the bundled update live and your
previous copy is preserved beside it byte-exact as <file>.old — never lost,
never hidden, never gitignored. the review deletes each .old (keep the
refresh) or restores it (revert); the CLI never deletes one. a record newer
than this CLI is refused politely.

exit codes: 0 (plan applied or nothing to do) · 1 a gate failed mid-migration · 3 corrupt

example:
  docodego upgrade && docodego upgrade --apply --branch
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
