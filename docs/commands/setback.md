# docodego setback

> Document a failing behavior the moment it bites; the audit escalates repeats.

## Usage

```
docodego setback <class> <text> | setback <class> --respond <text> | setback --list
```

## Contract

```
the failure ledger (04-govern/01-monitor/setbacks.md): one row per bite
of a class — `| date | class | count | text |`. Classes are stable
kebab ids minted at first occurrence (quirk-sed, grill-miscount); count
is machine-written: recurrences since the class's last response, archive
files scanned, so history survives rotation. --respond appends a count-0
row naming what you opened (quote a real path — a cycle or a unit) and
resets the class. --list prints per-class lifetime, since-response, and
the last response. No duplicate refusal: appending is the point.

the audit's GOV-006 reads this ledger: warn at two bites (repeated),
fail at three, with the finding naming the owed plan or research and
the commands to open one.

exit codes: 0 recorded · 2 usage

example:
  docodego setback quirk-sed "BSD sed misparsed the multi-expression script; reworked via node"
  docodego setback quirk-sed --respond "01-document/01-discover/cycles.md cycle 3"
  docodego setback --list
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
