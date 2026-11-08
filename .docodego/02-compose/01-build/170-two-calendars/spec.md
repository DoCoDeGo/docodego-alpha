---
name: 170-two-calendars
type: unit
epic: 020-canon-debts
status: delivered
---

# 170-two-calendars

## intent

The CLI stamps every record date in UTC while the ruled law is the LOCAL
wall-clock date — on the founder's machine the two disagree by a day, so
gate-written rows and hand-written rows carried two different calendars in
one record. This unit makes one clock the only clock: every date the CLI
writes is the date on the writer's wall.

The defect is unanimous in the record (acceptance audit finding 3,
improvements R2-5 and R3-7, epic item 6) and the ruling exists: the record
standardizes on the local wall-clock date (docs/tooling-glossary.md,
"Two calendars"). What was missing was the investigation of the stamping
sites and the fix. The investigation is done — three sites, one clock:

1. `apps/cli/src/fsx.ts` `today()` — the central stamp: tracker rows and
   delivery-log rows (record-write), score reports, delivered.md, init's
   json, new's graduation note, retire's tombstone, audit's archive
   preamble + tombstone + radar rows, setback rows, grill's date line.
2. `apps/cli/src/record/template-docs.ts` — the grill template's
   `## grill <date>` header (its own `toISOString()` call, not today()).
3. `apps/cli/src/skills/lock.ts` — the upgrade-resumability tracker append
   (`appendTrackerLine`) ran its own `toISOString()` clock, duplicating the
   tracker stamp site with a second UTC clock.

The canon side (apps/spec) stamps no dates. The payload embeds no
generated dates. The skills lockfile carries no dates at all (verified:
its entries are name/version/source/integrity). The fix is therefore one
definition, local, and three sites deriving from it.

## scope

In: `fsx.today()` becomes the local wall-clock date; template-docs and
lock.ts drop their private UTC stamps and derive from it; conformance
proves the law's shape deterministically.
Out: no rewriting of historical rows (append-only — a row keeps the
calendar of the clock that wrote it); no timezone metadata in stamps (the
law is a plain local date, `YYYY-MM-DD`); no changes to apps/spec (it
stamps nothing); no TZ-dependent test gymnastics (the assertion must pass
on any machine in any timezone at any hour).

## acceptance

- AC1 — one clock: `fsx.today()` returns the local wall-clock date
  (local year/month/day getters, zero-padded `YYYY-MM-DD`), and both
  other stamp sites (template-docs, lock) call it instead of running
  their own clock — no `toISOString().slice(0, 10)` remains under
  apps/cli/src.
- AC2 — conformance proves the shape deterministically: `today()` equals
  the local-form date an independent local-clock computation produces for
  the same instant, and matches `YYYY-MM-DD` — an assertion that holds on
  a UTC machine (where local and UTC agree) and on any other, at any hour.
- AC3 — the stamped surfaces keep their contracts: a tracker row (written
  by record-write and by lock.ts's upgrade-resumability append) and a
  grill round header still carry a `YYYY-MM-DD`-shaped date (conformance
  asserts the today() shape, the tracker row shape, and the existing
  flows' exit 0).
- AC4 — history untouched: the fix edits clock logic only — no migration,
  no date rewrite, no payload change (bundle verify stays byte-identical;
  the drift gate red pre-commit is the disclosed a-spec7-naming precedent,
  and only if a payload byte moves, which this unit does not expect).

## threats

- Timezone-dependent tests — a test that only catches the defect at
  certain hours (evening UTC) or on certain machines would be flaky.
  Mitigation: AC2's assertion compares today() to an independent local
  computation of the same instant — implementation-shape-proofing, not
  clock-watching.
- The subtle break: a golden or conformance assertion silently pinning
  the UTC form. Mitigation: the investigation greps the suite for date
  assertions (none found — the only date literal is a perf fixture's
  filler row); if a hidden pin surfaces, it is updated to the law, not
  deleted.
- Scope creep into date FORMATS (adding time-of-day, timezone suffixes).
  Mitigation: the law names the local date only; formats stay
  `YYYY-MM-DD` everywhere.
