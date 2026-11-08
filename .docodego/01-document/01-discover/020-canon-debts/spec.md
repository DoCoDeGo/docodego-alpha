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

## the mapping (kept current — AC1)

Landed 2026-11-08 by 230-debt-improvement-dispositions. One row per
item, one status each: **landed** (where), **drafted** (which draft
owns it), **founder** (the founder decides), **unowned** (candidate
home named), **declined** (the reason). Children update rows as they
land; a row never sits silently between states.

### the six clusters

| # | cluster | owner / state |
|---|---|---|
| 1 | fleet launch-blockers (12 L items) | the five product records own their bugs; the founder owns the boundary ceremonies — the instruments shipped (launch 190, sign/tiers 200, coherence 220); open there, not here |
| 2 | go-public execution | founder-owned (name decision — EL-32 reserved — org name, commit identity swap) plus the studio install story; near-launch sequencing |
| 3 | improvement-log remainders | disposed below by 230-debt-improvement-dispositions; the unowned rows name their homes |
| 4 | cli debt cluster | done — 240-cli-debt-cluster (cc08584): the status machine lands teeth — terminal landings, grill-required scores bound by spec-sha, recomputed gates, DG-C015 vocabulary, dynamic board counts, absolute-path teaching, the doubled-210 repair; the deep remainder named: item 9 to the ICS 2.0 proposal (180), strikes (11) and proof classification (4/5/19b) to future children, rails (21/29) to the EL-33 draft |
| 5 | reference-doc TODOs | done — 250-reference-doc-triage: 29 threads enumerated as they stand today (the map's 41/7/10/20 snapshot predated spec-7) and triaged — ship-now 4 (payload-interface dedupe, planted-prose sweep, doctor vocabulary check, install TOCTOU — named small children), launch-gate 14 (each feeding cluster 2 with a named owner), declined 10 with reasons; the docs untouched |
| 6 | two calendars | done — 170-two-calendars (canon-spec-7 epic) |

### the improvement items (IMP-1..7, IMP-10..23)

| IMP | status | citation |
|---|---|---|
| 1 plan-approval protocol | founder | nothing ships until the founder bounds what an agent may auto-approve; the source doc's `plan-approval:` tracker row is the ready form |
| 2 decisions home | landed | the planted AGENTS.md names cycles.md "the numbered log of research and decisions" (AGENTS.md, decisions line) |
| 3 planted .gitignore | unowned | no .gitignore in the payload boundary (bundle.manifest.json); candidate: the cluster-4 child |
| 4 gate-row fraud claim | declined | overturned by the source doc itself — the rows were gate-written, no fraud; lesson recorded there |
| 5 structure improvisation | declined | resolved into IMP-6 by the source doc (03's structure was the streams prose, not improvisation) |
| 6 streams fork, canonical home | landed | the type home is the one home: TYPE_HOME / DEFAULT_STREAM (record/streams.ts), `new` plants there (commands/new.ts), one scanner renders any home |
| 7 one unit-scanner | landed | the parse-once architecture is the fix: record/load.ts loads the units once; check, status, trace, deliver all read the same AST |
| 10 canonical event order + repair rule | unowned | no order law in the tree or the planted AGENTS.md; candidate: a small law child |
| 11 hard/guidance registers | unowned | founder directive, large; candidate: its own law child ahead of the 1.1.0 amendment batch |
| 12 score hash + reuse warning | unowned | score writes no hash (commands/score.ts); adjacent to the ICS 2.0 proposal (180-spec7-ics-2) but not inside it |
| 13 solo-grill honesty | unowned | grill records rounds but marks no self-grilled flag; candidate: a grill-law child |
| 14 warning drift/prose classes | unowned | check warnings carry no triage class; candidate: a small check child (with the node --test nit for the prove docs) |
| 15 integrity map (compose-log, demo bundles) | drafted | the status-rails draft (EL-33, reserved 1.1.0) owns "status answers could-this-ship"; the compose-log and demo-bundle mechanics ride a later child |
| 16 post-delivery staleness | unowned | check has no stale-proofs warning (DG-C002's wording only); candidate: a check child |
| 17 grill drops scored | unowned | the status machinery stands; the mitigation note ships (commands/grill.ts, the re-run hint, from 130-grill-scaffold) |
| 18 diagnostics carry the fix | landed | the explain registry: every DG code has a page with the concrete fix (passes/explain.ts; DG-U013 names the stream-path shape) |
| 19 scratch out of the record root | landed | docodego-visual-proof: "Scratch lives in var/" (its SKILL.md); DG-S005 held — the law worked, the default was fixed |
| 20 evidence-type ladder | unowned | no registry; visual-proof is the practice instrument, not the ladder; candidate: a demonstrate-law child (natural host: IMP-15's demo bundles) |
| 21 gate rows committed home | unowned | practice holds in this record (gate rows ride the unit's commit) but no planted law states it; candidate: a one-line AGENTS.md law child |
| 22 research's legal home | unowned | 01-discover/research/ still impersonates a unit to the structure pass; candidate: a structure-pass exemption child |
| 23 visual evidence layer | landed | shipped same day per the source doc: docodego-visual-proof bundled, planted by the product-team and platform-team profiles |
