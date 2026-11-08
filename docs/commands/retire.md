# docodego retire

> Move a delivered unit to system/behavioral/ as a named behavior — done is a place.

## Usage

```
docodego retire <unit> [--as <behavior>] [--dry-run] [--json]
```

## Contract

```
the gate: only a delivered unit retires (DG-U101), and every proof path
in its proofs.md must still resolve (DG-U102) — evidence moves with the
unit; unresolvable proof does not.

the move: the unit folder is copied to
.docodego/system/behavioral/a-<behavior>/ file by file, each file read
back and byte-compared before the source is removed (a mismatch aborts
with the tomb removed and the source untouched). The tomb's spec.md gains
`retired_on:` and `was:` in its frontmatter; citations of the old stream
path inside the tomb's proofs.md and delivered.md are re-addressed to the
new home. The tracker gains a follow-up row (the original name, so trace
still finds the history) and the delivery log a 'retired' row.

--as names the behavior explicitly (kebab-case, DG-U103); the default is
the unit name minus its number. A second retire onto an existing tomb is
refused (DG-U104) — the tomb is final. The retired number is retired with
the unit: 'docodego new' never reuses it (tracker history is scanned).
trace follows the unit into the tomb; status shows the tombstone count.

exit codes: 0 retired · 1 tomb already exists · 2 usage or gate refusal

example:
  docodego retire 010-first-unit --dry-run
  docodego retire 010-first-unit
  docodego trace 010-first-unit
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
