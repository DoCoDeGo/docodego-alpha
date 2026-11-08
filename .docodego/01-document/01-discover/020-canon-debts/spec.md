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
| 5 | reference-doc TODOs | done — 250-reference-doc-triage: 29 threads enumerated as they stand today (the map's 41/7/10/20 snapshot predated spec-7) and triaged — ship-now 4, launch-gate 14 (each feeding cluster 2 with a named owner), declined 10 with reasons; the docs untouched. Ship-now landings, all four done: payload-interface dedupe (260-payload-interface-dedupe), doctor vocabulary check (270-doctor-vocabulary-check), install TOCTOU (280-install-toctou), planted-prose sweep (290-planted-prose-sweep — the record contract moved to 15, the sweep is a conformance gate) |
| 6 | two calendars | done — 170-two-calendars (canon-spec-7 epic) |

### the improvement items (IMP-1..7, IMP-10..23)

| IMP | status | citation |
|---|---|---|
| 1 plan-approval protocol | founder | nothing ships until the founder bounds what an agent may auto-approve; the source doc's `plan-approval:` tracker row is the ready form |
| 2 decisions home | landed | the planted AGENTS.md names cycles.md "the numbered log of research and decisions" (AGENTS.md, decisions line) |
| 3 planted .gitignore | landed | 370-planted-ignore: .docodego/.gitignore joins the boundary (52nd row, allowlist v2) — var/ the scratch home, *.new the upgrade's conflict copies, the comments teaching both; record contract 19 |
| 4 gate-row fraud claim | declined | overturned by the source doc itself — the rows were gate-written, no fraud; lesson recorded there |
| 5 structure improvisation | declined | resolved into IMP-6 by the source doc (03's structure was the streams prose, not improvisation) |
| 6 streams fork, canonical home | landed | the type home is the one home: TYPE_HOME / DEFAULT_STREAM (record/streams.ts), `new` plants there (commands/new.ts), one scanner renders any home |
| 7 one unit-scanner | landed | the parse-once architecture is the fix: record/load.ts loads the units once; check, status, trace, deliver all read the same AST |
| 10 canonical event order + repair rule | landed | 310-event-order: the loop paragraph names the status events (new → grill → score → deliver) and the refused-gate path (attempt recorded, re-enter at the refused step, repaired forward) — record contract 17, taught in place |
| 11 hard/guidance registers | unowned | founder directive, large; candidate: its own law child ahead of the 1.1.0 amendment batch |
| 12 score hash + reuse warning | landed | 350-score-reuse: check warns DG-C018 when a scored or delivered unit's spec hash no longer matches its recorded score — the same last-block-wins extraction the G2 gate reads (the score hash itself shipped with 240's binding) |
| 13 solo-grill honesty | landed | 340-grill-mode: every grill round names its mode — self-grilled by default, --by <who> for a named answerer; the form of independence is never recorded as the fact of it |
| 14 warning triage classes | landed | 360-warning-classes: every warning renders its triage class — drift (a real gap) or prose (cosmetic wording; the C002 family) — classified at the detector, unclassified reads drift; the node --test nit investigated moot |
| 15 integrity map (compose-log, demo bundles) | landed | 380-compose-log: `02-compose/compose-log.md` gate-appended at deliver (date, unit, delivered spec hash, declared deviations; readers: the handoff agent, the build-honesty auditor), record contract 20; 010-demo-bundles: `demo/<unit>/` bundles scaffolded at deliver, filled before launch — the launch gate's L5 refuses the unfilled scaffold (readers: the founder's "show me it working", the launch auditor), record contract 21; both rooms anchored at init, engine-owned templates, boundary untouched |
| 16 post-delivery staleness | landed | 320-stale-proofs: check warns DG-C017 when a delivered unit's cited evidence carries commits after the delivery day (commit dates, clone-safe; the unit's own folder excluded; git-absent records skip) |
| 17 grill drops scored | unowned | the status machinery stands; the mitigation note ships (commands/grill.ts, the re-run hint, from 130-grill-scaffold) |
| 18 diagnostics carry the fix | landed | the explain registry: every DG code has a page with the concrete fix (passes/explain.ts; DG-U013 names the stream-path shape) |
| 19 scratch out of the record root | landed | docodego-visual-proof: "Scratch lives in var/" (its SKILL.md); DG-S005 held — the law worked, the default was fixed |
| 20 evidence-type ladder | landed | 390-evidence-ladder: the registry (suite-run, test-transcript, screenshot, session-recording — each with a stated strength, described never ranked); a proof or demo-bundle path may declare `[evidence: <type>]`; the checker flags declarations outside the registry (DG-C019, drift) at any status; the honesty law's evidence bullet teaches the sentence, taught in place (record contract 22); the substitution judgment stays the reader's — the browser-contention half is declared out in the spec's own deviation line |
| 21 gate rows committed home | landed | 300-gate-rows-home: the honesty law gains "gate rows ride the unit's commit" (record contract 16, taught in place by the migration, customized copies kept) |
| 22 research's legal home | landed | 330-research-home: the checker exempts 01-discover/research/ (first-class non-unit — grounding notes never impersonate units again) and the stream README names the home; record contract 18 |
| 23 visual evidence layer | landed | shipped same day per the source doc: docodego-visual-proof bundled, planted by the product-team and platform-team profiles |

## close-out note (appended 2026-11-08)

Every unowned IMP row is now landed: 3, 10, 12, 13, 14, 16, 21, 22
(this stretch: 290-planted-prose-sweep, 300-gate-rows-home,
310-event-order, 320-stale-proofs, 330-research-home, 340-grill-mode,
350-score-reuse, 360-warning-classes, 370-planted-ignore — earlier:
260, 270, 280). The record contract moved 14 → 19 and the spec tree
1.0.5 → 1.0.10 with it, each hop declared and mirrored. What remains
in the table stays out by design: IMP-1 and IMP-11 are founder
directives (only the founder decides), IMP-15 and IMP-20 ride the
EL-33 demonstrate-law batch reserved for 1.1.0, clusters 1 and 2
belong to the product record and the founder, and R10-5 (scorer
satisfiability) is its own thread, separate from the landed IMP-12.
The epic stays open as long as those rows are — its owned work is
done.

**Addendum (appended 2026-11-08, the founder answered):** Cycle 4 came
back the same day, in the popup, verbatim. IMP-1: auto by task, limited
to this repo — a ruling of the record layer, nothing shipped. IMP-11:
the register split accepted as law — its unit follows. R10-5: ICS 2.0
owns satisfiability. EL-33/EL-34: accepted for signature — and the
sign-off form answered too (git/system identity, secrets scanned before
storing, a tool to mechanize). 400-law-flip-1-1-0 walked the two drafts
into the law tree as spec 1.1.0: the law files byte-identical to their
accepted proposals, the amendment files applied with the founder-directed
sign-offs, the EL-32 reservation declared in the laws index (verify
honors declarations, still refuses undeclared anchors — the negative
probe proves the difference), two log rows, two map rows, the stamp.
EL-18 stays draft — accepted siblings only. The record contract and the
boundary did not move: the spec tree ships through the canon CLI, not
the bundle allowlist; payload 22, boundary 52, allowlist v2 throughout.

**Addendum (appended 2026-11-08, unit 410):** IMP-11's acceptance
landed — the two registers taught in place (AGENTS.md, pure insertion),
guidance deviations on one recorded line (the 380 form, 390's first
live use), the v22→v23 teach under the standing contract, record
contract 22 → 23, spec tree 1.2.0, boundary untouched. IMP-1's first
live use rides the same unit: the tracker's plan-approval row (auto,
bounded, rationale, repo-only).

**Addendum (appended 2026-11-08, "finish everything"):** the founder
reopened the stay-out rows, and the lawfully walkable ones re-entered.
IMP-15 is the founder's own commissioned design (the audit specifies it
fully), so its mechanics are agent work: 380-compose-log landed the
compose half (record contract 19 → 20, spec 1.0.10 → 1.0.11), and
010-demo-bundles landed the demonstrate half — `demo/<unit>/` bundles
scaffolded at deliver, the launch gate's L5 refusing the unfilled form
(record contract 20 → 21, spec 1.0.11 → 1.0.12). The integrity map's
two rooms are no longer inert. 400 carries the evidence ladder
(IMP-20). What stays out stays out for the same reason as before:
IMP-1 and IMP-11 are founder decisions — the agent prepares the
research-and-questions package in cycles.md, never the answer — and
EL-33/EL-34 remain drafts until the founder accepts and signs. R10-5
stays recorded as a thread of the ICS 2.0 redesign, not a mechanism
invented solo.
