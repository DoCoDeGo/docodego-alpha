---
name: 020-canon-debts
type: epic
status: draft
---

# 020-canon-debts

## intent

The founder asked whether pending work had been recorded in docs and
forgotten. It had: the issues catalog holds twelve launch-blockers
found across the five built products; the go-public checklist holds
thirty-nine open owner items; the improvement log holds twenty-three
dispositions of which several never landed; the record-integrity,
cli-law, and dogfood audits hold fix-lists partially absorbed; and the
reference docs (distribution, skills, vocabulary-packs) carry open
markers. None of it was wired into the loop — recorded, then
invisible. This epic is the organization: every debt becomes a child,
every child walks spec → grill → score before implementation, nothing
stays floating in a doc. The docs keep the detailed evidence; this
epic owns the work.

## scope

The six clusters below, each to be scaffolded as a child when picked
up (spec + grill before code, per the loop). This epic does not
modify the source docs — they are the evidence base; children cite
them.

## acceptance

- AC1 — every open item in the five source docs maps to exactly one
  child here (or to a canon-spec-7 child), with the mapping table
  kept current as children land.
- AC2 — no child is implemented without a scored spec (the gate
  enforces this; the epic only organizes).
- AC3 — the mapping is re-audited by `docodego audit` runs over time:
  a debt re-found in a source doc without an owner is a sweep finding.

## the debt map (2026-11-08, from the source docs)

1. **fleet launch-blockers** — the twelve L items in
   `docs/audits/2026-11-08-issues-catalog.md` (payment-integrity bugs,
   broken core paths, agent-signed boundaries, a record-layer
   verification contradicted by its own artifact). Mostly the five
   PRODUCTS' own bugs plus governance ceremonies (founder signatures
   where agents signed their own boundaries). Owner: studio + product
   records.
2. **go-public execution** — the unchecked items in
   `docs/go-public-checklist.md` (name decision, org name, commit
   identity swap, canonical links, install story, announcement
   surface). Mixed owners (you/us), sequencing near launch.
3. **improvement-log remainders** — IMP items in
   `docs/audits/2026-11-08-improvements.md` with open dispositions
   (triage needed: some landed via spec7 children, some were
   superseded, some are real and unowned).
4. **cli debt cluster** — open items from
   `docs/audits/2026-11-08-record-integrity-audit.md`,
   `docs/audits/2026-11-08-cli-law-audit.md`,
   `docs/audits/2026-11-08-dogfood.md` (the proof-path refusal
   tokens piece), plus stale markers in `docs/record-format.md`,
   `docs/architecture.md`, `docs/review-dimensions.md`.
5. **reference-doc TODOs** — `docs/distribution.md` (41 markers),
   `docs/skills.md` (7), `docs/vocabulary-packs.md` (10),
   `docs/enhancements.md` (20) — triage into: ship-now, launch-gate,
   or decline-with-reason.
6. **two calendars** — the local-date standardization (ruled
   2026-11-08; investigate the stamping sites, then spec the fix).

## threats

- The epic becoming a second place for work to hide. Mitigation: AC1's
  mapping table is the single owner list; a child here is either being
  worked, done, or declined-with-reason — never parked silently.
- Triage-by-bulk (sweeping items into done without evidence).
  Mitigation: each cluster child investigates its own source doc
  before touching anything; dispositions cite what landed and where.
