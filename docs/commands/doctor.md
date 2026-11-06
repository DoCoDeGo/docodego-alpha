# docodego doctor

> Support triage: environment, record health, lockfile, and version axes in one standing checklist.

## Usage

```
docodego doctor [--json]
```

## Contract

```
checks: node (engines >=22.6) · git on PATH · record layer · manifest ·
  record version vs the bundled spec · record check pass · lint · rule
  registry self-check · skills lockfile (digests re-verified, as 'skill list'
  does).

doctor never demands a healthy record to run: a missing or corrupt record
is reported as a failed check line, never a fatal exit — doctor never
exits 3. a repo with no record layer yet is reported calmly and still
exits 0; 'docodego init' plants one. an available record upgrade is
information, not a finding — 'docodego upgrade' moves the record.

exit codes: 0 all healthy (or only the record layer is missing) · 1 a check
that ran failed · 2 usage

example:
  docodego doctor
  docodego doctor --json
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
