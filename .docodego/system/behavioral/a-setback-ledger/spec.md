---
name: 140-setback-ledger
type: unit
epic: 010-canon-spec-7
status: delivered
retired_on: 2026-11-08
was: 140-setback-ledger
---

# 140-setback-ledger

## intent

The founder commissioned a rule, verbatim (outer repo,
founder-directive-2026-11-08-b.md, third message, cycle 97): "one of
the rules I want is to immediately be able to document repeated
failing behavior and triggering some form of plan or research to
prevent that from happening - also think long term". Today nothing
performs it: the journal habit fired only retroactively (cycle 95's
evidence — the sed class bit three times before anyone wrote it down),
grill and gate fails record themselves but environment-class failures
happen outside every surface the record reads, and the shell
discipline adopted in cycle 95 is text hoping behavior follows it.
The record should not depend on the founder watching. The unit builds
the mechanism, not the memory: `docodego setback <class> <text>`
documents a failure occurrence in one command at failure time;
`--respond` records the owed response and resets the class's counter;
`--list` makes classes discoverable at capture time (typo'd
near-duplicates surface when minting, not at audit); and `docodego
audit` gains GOV-006 — setback recurrence — warning at the second
bite (the founder's literal "repeated") and failing at the third (the
house's 3+ promotion precedent) with a finding that names the owed
work and hands over copy-paste scriptlets for both response surfaces.
Long term is structural, not aspirational: the ledger rotates under
the archive law, is bounded, and its counts scan archives so history
survives splits.

## scope

In: the `setback` command (append form, `--respond` form, `--list`,
`--json`), the engine-owned `setbacks.md` template planted lazily
beside `checklist.md` in `04-govern/01-monitor/`, the bundle denylist
entry, audit GOV-006 (warn at 2, fail at 3, copy-paste scriptlets,
path-existence check on the last response), `--rotate` gains
setbacks.md AND closes the checklist's promised-but-unwired
rotation (a header-law debt found while reading), GOV-004's BOUNDS
gains both ledgers (setbacks 100KB, checklist per its header), the
help/args/completions/explain registrations (DG-U090 usage, DG-U091
class naming), and `docs/commands/` regeneration — including the
missing `audit.md` page (generator drift, fixed while there). Out:
`docodego patch` (deferred to evidence), auto-capture of shell
failures via wrappers (environment-invasive; the ledger will prove
or disprove whether discipline suffices), auto-written escalation
rows (the tool suggests, a human declares — cycles are a judgment
surface), AGENTS.md (the honesty-law bullet rides the next payload
bump rather than forcing one — declared here, so the absence is
declared, not silent), time-window decay on counts (since-response
counting already decays most of it; add a window only if GOV-006
proves noisy — the tuning valve is named and closed).

## acceptance

- AC1 — `docodego setback <class> <text>` appends
  `| date | class | count | text |` to
  `04-govern/01-monitor/setbacks.md`, planting the engine-owned
  template when absent (no init change, no record bump), counting
  recurrences since the class's last count-0 row across live rows AND
  `setbacks-archive-*.md`; one tracker row appends per run; the class
  is kebab-validated (exit 2, DG-U091, explain page) and missing
  arguments exit 2 (DG-U090); no duplicate refusal — appending is the
  point; `--json` emits `docodego/setback/v1`.
- AC2 — `docodego setback <class> --respond <text>` appends a count-0
  row whose text names the opened cycle or unit; subsequent
  recurrences count from that row; the response row is the machine-
  parseable reset (no new file, append-only throughout).
- AC3 — `docodego setback --list` prints per class: lifetime count,
  recurrences since last response, and the last-response pointer (or
  "none") — near-duplicate classes are visible at capture time.
- AC4 — `docodego audit` gains GOV-006 setback recurrence: warn at 2
  recurrences since the last response, fail at 3+ (exit 1) with the
  detail naming the class, the count, the last response (or "none"),
  and copy-paste commands for both escalation surfaces (a cycles.md
  entry; `sketch` → `new --from-sketch`); a response row naming a
  path that does not exist warns (no path, no claim); the checklist
  row's evidence column carries the ledger path; proofs include the
  failure cases — GOV-006 fires at 2, fires at 3, stays silent after
  a respond row, re-fires after a post-response recurrence.
- AC5 — the ledger scales: `audit --rotate` moves setbacks rows under
  the archive law (byte-identical, sha256 read-back verified before
  mutation, tombstone appended, archives scanned for counts); GOV-004
  gains the setbacks bound (100KB); the checklist's promised rotation
  and bound are wired in the same stroke (the header already promises
  it); bundle verify stays clean (spec 10, 36 files — the template is
  engine-owned and the ledger is denylisted); canon suite, conformance,
  and `docs --verify` green after.
- AC6 — the rule is discoverable and cannot drift: COMMAND_HELP page,
  USAGE list, completions, and `docs/commands/setback.md` all carry
  the command; the missing `docs/commands/audit.md` is regenerated;
  explain pages exist for DG-U090/DG-U091 and no invented pages.

## threats

- Cry-wolf noise — a threshold that fires too often trains everyone to
  ignore it. Mitigation: graduated tiers (warn informs, fail forces),
  the respond reset as the decay mechanism, and the window parameter
  explicitly deferred with its reopening condition named.
- Counter-gaming — a respond row without doing the work resets the
  count and silences the audit. Mitigation: AC4's path-existence check
  (the GOV-003 coherence precedent: the record cannot contradict its
  own artifact) — the row must name a cycle or unit path that
  resolves.
- Ledger pollution — one row per stumble instead of per bite of a
  class turns the ledger into noise. Mitigation: help text and the
  template header define the unit of record as the class occurrence;
  `--list` shows near-duplicates at mint time so `quirk-sed` and
  `sed-quirk` converge instead of splitting.
