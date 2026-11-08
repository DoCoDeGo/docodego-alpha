# docodego audit

> The standing sweep: the record checking itself, five stable checks, one ledger.

## Usage

```
docodego audit [--rotate] [--json]
```

## Contract

```
runs GOV-001 lint · GOV-002 check · GOV-003 status-verdict
coherence (a delivered unit's latest grill verdict must be pass) ·
GOV-004 bounded size (tracker ~600KB, grill ~100KB, delivery-log
200KB — the bounds EL-29 publishes) · GOV-005 comment hygiene (bloated
HTML comment blocks, warn-only). every run appends one row per check
to the checklist ledger (.docodego/04-govern/01-monitor/checklist.md,
planted on first run) and one tracker row — the time series is the
point: run it regularly, read the trend.

--rotate splits ledgers past their row bound: the oldest rows move
byte-identical (read-back verified, sha256 printed) into
tracker-archive-N.md / delivery-log-archive-N.md, a tombstone row
stays behind, and trace scans archives — archived, never deleted.

exit codes: 0 all pass (warnings inform, never fail) · 1 a failing
check or a failed rotation · 3 record fatal

example:
  docodego audit
  docodego audit --rotate
  docodego audit --json
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
