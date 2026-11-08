---
name: 120-spec7-audit
type: unit
status: delivered
epic: 010-canon-spec-7
---

# 120-spec7-audit

## intent

The founder asked for "a set of audit tools that uncover all the gaps
and rules to regularly run that." Today the checks exist piecemeal —
lint and check gate a delivery, but nothing sweeps the record for the
slow failure modes the fleet audits found by hand: status claims that
contradict verdicts, ledgers growing past their published bounds,
bloated comment blocks, and no persistent artifact of what was checked
and when. The unit ships `docodego audit` — one command, the whole
standing sweep, five stable check ids, an append-only checklist ledger
inside the record (`04-govern/01-monitor/checklist.md`), a tracker row
per run, exit 1 on any error-tier finding so a CI or a pre-flight
habit can hold the line. It also ships the rotation the size guard
points at: `--rotate` moves the oldest tracker/delivery-log rows to
archive files byte-identical (hash-verified) under the cycle-log
archive law — archived, never deleted — with a tombstone row, and
trace learns to scan archives so retired rows keep their coverage.
Human accountability needs a witness: the checklist ledger is the
record checking itself, on a schedule anyone can read.

## scope

In: the audit command (lint/check tallies; SVC — delivered units'
latest grill verdict must be pass; BSG — EL-29's published bounds
tracker ~600KB, grill ~100KB, plus delivery-log at 200KB declared;
CHS — HTML comment blocks over 400 chars in record files, warn-only,
judging form not author), the checklist template + auto-plant, the
`--rotate` mechanism, trace scanning archives, help-registry and
completions entries. Out: AGENTS.md changes (no payload bump this
unit — the checklist template is a source constant), the EL-29
enforced-by binding update (rides the law children), the wider tool
families (ECI/PFC/LMC/GDD — later children), code-comment hygiene
(studio CONTRIBUTING concern, not record law), auto-scheduling (the
command is the rule's muscle; running it regularly is AGENTS'
discipline, taught when the payload next changes).

## acceptance

- AC1 — on the healthy v2 record, `docodego audit` exits 0, prints
  per-check results with stable ids (GOV-001 lint, GOV-002 check,
  GOV-003 status-verdict coherence, GOV-004 bounded size, GOV-005
  comment hygiene), plants checklist.md on first run, appends one row
  per check, and appends one tracker row for the run.
- AC2 — on a broken scratch record (a missing required file and a
  frontmatter violation), audit exits 1 and names the error-tier
  findings; the healthy record still exits 0.
- AC3 — SVC: a scratch record with a delivered unit whose latest grill
  verdict is fail draws an error-tier SVC finding; a delivered unit
  with no verdict at all also errors; pass-verdict delivered units
  stay silent.
- AC4 — BSG warns (not errors) on a synthetic oversized tracker naming
  the file and its size against the bound; CHS warns on a record file
  carrying a comment block over the limit, naming the file.
- AC5 — `docodego audit --rotate` on a synthetic over-threshold
  tracker: the oldest block moves to tracker-archive-1.md
  byte-identical (read-back verified), a tombstone row lands in the
  live tracker, the newest rows stay live, `docodego trace` finds rows
  that only exist in the archive, and a second rotation numbers the
  next archive file.

## threats

- The sweep duplicating check/lint logic and drifting. Mitigation: the
  audit calls the same pass functions lint and check use — one grammar,
  two front doors.
- Rotation corrupting a ledger (the one destructive-adjacent act in
  the CLI). Mitigation: the block is moved byte-identical with
  read-back verification before the live file is rewritten; any
  mismatch aborts the rotation before anything changes; archives are
  never deleted.
- The checklist becoming noise. Mitigation: one row per check per run,
  stable ids, newest last — a time series to be read, not a log to be
  scrolled.
