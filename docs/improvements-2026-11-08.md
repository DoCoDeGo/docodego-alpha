# Improvement log — five-product creativity round (2026-11-08)

Live observation of five autonomous founder-agents building portfolio products
00–04 in parallel under the planted law (record spec 6, AGENTS.md v3, CLI
0.8.0 on `core-loop`, bundle verified clean). Instrument:
`docs/review-dimensions.md`. Rounds every ~5 minutes, read-only; findings
deduplicate as later rounds confirm them. Attribution: **agent** (law clear,
agent bypassed) / **law** (law ambiguous, silent, or self-contradicted) /
**healthy**. Provisional findings name their falsifier and are confirmed or
overturned by later rounds.

Arena: `/Users/code/Documents/private/docodego/docodego-test-products/` —
00-finessetry · 01-swatchship · 02-bodyarchetype · 03-grademyfit · 04-planmyskin.
Pre-run verification: all five repos planted AGENTS.md v3.0.0, record v6,
skills 2.0.0 ×6 (`init` from the branch build; `bundle --verify` clean) — the
law under test is the branch law, not a stale artifact.

## Round log

### R0 — first sweep (agents ~15 min in)

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R0-1 | 01 | Agent self-granted an "autonomy waiver" on the compose skill's plan-approval step — a human-approval gate — with no law-defined protocol for founder-absent runs. | D2 | **law** (no autonomous-run protocol for human gates) | **F** |
| R0-2 | 00 | Agent invented `docs/decisions/` ADR layer (4 ADRs) — decisions now in two homes (ADRs + cycles.md). | D3 | **law** (silent: no rule on where decisions live) | F |
| R0-3 | 03 | Top-level `docs/`; unit folders not visible at the law's unit home. | D1 | provisional — *falsifier: locate the units* | ? |
| R0-4 | 02 | A unit folder named `research` exists — research material inside a unit folder. | D2 | provisional | ? |
| R0-5 | 04 | Claims "delivery gate passes" on 2 units, but no rows visible where I looked. | D4 | provisional **agent** — *falsifier: read the stream trackers* | **B**? |
| R0-6 | 01 | `node_modules/` tracked; 16 dirty files. Hygiene not in the planted law. | D7 | **law** (no planted .gitignore) | G |
| R0-7 | 00 | Placeholders struck before re-spec; payment call recorded with real checkout named as known-unfinished rail. | D3/D6 | healthy | — |
| R0-8 | 03 | Research cycle cites concrete design consequences (reveal ≤1.5s, no h-scroll at 375px, self-hosted fonts). | D5 | healthy | — |
| R0-9 | 02 | Runtime network-allowlist guard planned; verification gap recorded as unfinished. | D6 | healthy | — |
| R0-10 | all | Phase order intent → research → spec → build held in 00/02/03/04; 01 spec-grinded all four units in one commit. | D2 | provisional | — |

### R1 — +5 min

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R1-1 | 01 | Fixed hygiene — via **git history rewrite** ("untrack toolchain from history") on a record-carrying repo. Destructive act done casually; the interruption-safety law was never consulted (it lives in the studio AGENTS.md, not the planted one). | D3 | **law** (planted law has no hygiene + no destructive-act rule; agent had to invent, chose rewrite) | **F** |
| R1-2 | 01 | Creative build landed: "the fan, the fitting-room light test, identity, prices, render honesty" — distinctive interaction invented, not template. | D5 | healthy | — |
| R1-3 | 03 | `feat(server)` no-account identity + anti-abuse voting, 13 tests — but still no visible unit home. | D2 | provisional → see R2 | — |
| R1-4 | 04 | 23 dirty files — mid-build on the third unit. | — | — | — |
| R1-5 | 01 | Two repair commits: "re-score after grilling (canonical status order)" and "restore cycle numbering order (header lost in an edit)". The append-only law held, but only via repair — the header was lost first. | D3/D7 | **law** (canonical order ambiguity; edits to record files are risky and the law is silent on repair) | G |

### R2 — +10 min — **the streams fork discovered**

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R2-1 | 01/03/04 | Units live at `.docodego/02-compose/01-build/<unit>/` (01 also `02-integrate/`, 03 one at `01-document/04-plan/`), NOT at `01-discover` where `new` plants by default. The streams prose — which the acceptance already flagged as promising more than the flow uses — sent 3 of 5 agents to the stream path. All gate events (new-unit, gate-refused, delivered) are at those homes. | D1/D2 | **law** (two legal-looking unit homes; agents fork on which text they read first) | **F — top finding** |
| R2-2 | 01/04 | `check` exit 0 with stream-home units — but `status` shows `01-discover —` : **the delivered units are invisible to the record's own map.** A cold follow-up agent reading `status` would conclude no work exists. | D1/D7 | **law** (CLI incoherence: check scans stream homes, status cannot see them) | **F** |
| R2-3 | 03 | `check` exit 1: DG-C003 — `pro-fit-report` (hand-placed at `04-plan`) claims `scored` with no `grill.md`. The checker caught a real gap the agent left. Agent still working (repo dirty). | D4 | **agent** (status claimed past a missing artifact) — checker working as designed | — |
| R2-4 | 04 | Tracker shows the full honesty loop autonomous: `new unit → gate-refused (G4 — proofs.md holds no path entries) → delivered`. The gate refused, the refusal text taught the proofs grammar, the agent fixed and delivered. No human. | D4 | healthy — **the strongest positive of the round** | — |
| R2-5 | all | Gate-written rows dated 2026-11-07 (UTC) vs founder wall-clock 11-08 — the two-calendars defect from the acceptance, recurring in every new record. | D3 | **law** (known, unfixed, recurring) | F |
| R2-6 | 00 | `color-engine` now **delivered**, `the-atelier` scored — the discipline path (default `new` home) at the same stage as the stream path. Both readings "work"; the records just look different. | D2 | **law** (fork consequence: cross-repo divergence) | — |

### R3 — +15 min — first agent completes (00 finessetry)

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R3-1 | 00 | **Completed**: 2 units delivered at the *discover* home (G1–G4, 100/100 ×2), one self-contained HTML artifact, CSP `connect-src 'none'`, 22 engine tests, cross-process determinism proof, six stage screenshots, honest unfinished list (till unwired, synthetic-faces-only, 4 seasons not 12). Creative calls recorded as ADRs and cited constantly. | D2/D3/D5/D6 | healthy — strongest full-loop evidence yet | — |
| R3-2 | 00 | Agent independently reports the streams contradiction *from the discipline path*: "the default is wrong" — first-person confirmation of IMP-6. | D1/D2 | **law** (IMP-6 confirmed by both paths) | **F** |
| R3-3 | 00 | **"A score of 100 is not a truth score"** — its first spec scored 100/100 with placeholder thresholds that fixture math then proved unfittable; ICS-lite measures shape, not correctness; the recorded 100 briefly certified a wrong table; score was reused across a materially revised spec with no marker. | D4 | **law** (score semantics overclaim) | **F** |
| R3-4 | 00 | **"The grill is self-review in disguise"** — solo agent writes spec, answers grill, records pass: the form of adversarial independence without the substance. | D2 | **law** (grill semantics overclaim in solo runs) | **F** |
| R3-5 | 00 | Proof-grammar grades prose: literal "AC1..AC6" text parsed as a path candidate → DG-C002 (acceptance finding #2, now reconfirmed by a second independent agent). | D7 | **law** (grammar scoped wrong) | F |
| R3-6 | 00 | `check` warning triage cost: no way to distinguish "prose drift" warnings from "real drift" warnings without `explain` per code. | D7 | **law** (warning classes not marked) | G |
| R3-7 | 00 | Tracker/delivery rows stamped 2026-11-07 vs working date 11-08 — third independent confirmation of the two-calendars defect. | D3 | **law** (R2-5 confirmed) | F |

### R4 — +20 min (timed snapshot; metric bug noted)

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R4-1 | 01 | **season-quiz delivered** — via commit "backtick proof paths so the gate reads them". The grammar friction now *shapes prose*: agents write stilted proofs to satisfy the parser. Third independent confirmation (acceptance #2, R3-5, now behavioral adaptation). | D4/D7 | **law** (IMP-5 confirmed at behavior level) | F |
| R4-2 | 00 | Final state clean: 8 commits, 0 dirty, check exit 0; last commit is "clean proof grammar" — an end-of-run repair of the same friction. | D4 | healthy (repaired) with **law** root cause | — |
| R4-3 | 03 | DG-C003 (grillless `scored` unit) **still unresolved** 30+ min after the checker caught it; agent active (5 dirty, new feat(feed) commit with NSFW blocklist + 8 tests). Watching whether the agent repairs unprompted. | D4 | **agent** (live) | — |
| R4-4 | 02 | No commits since R0, 9 dirty — 30+ min in build on the single unit. Slowest mover; watch for stall. | — | — | — |
| R4-5 | 04 | No commits since R0, 23 dirty — big-bang unit risk (report-experience). | D2 | provisional **agent** (unit slicing) | — |
| R4-6 | obs | Orchestrator metric bug: `grep -c delivered delivery-log.md` matched a legend line, not data rows — final review counts real `| date |` rows. Recorded so the instrument stays honest. | — | orchestrator | — |

### R8 — +40 min — 01 swatchship completes

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R8-1 | 01 | **Complete**: 4/4 units delivered at stream homes, scores 99–100, 43 unit tests + 44 headless browser checks, `check`+`lint` exit 0, tree clean. Stripe wiring proven to the door (503→502→402 ladder over real stripe-node, gate proven both ways); a live test charge honestly named as needing the founder's key. Webhook gap stated, not hidden. Render honesty as a design element. | D2/D4/D5/D6 | healthy — full-loop pass on the stream path | — |
| R8-2 | obs | **R1-1 overturned**: history was never rewritten — hashes continuous (`f79965f → 85ddfd1 → cc27c82`); the "untrack toolchain from history" commit was a follow-up tree-untrack with a misleading message. Instrument lesson recorded: commit messages can lie; verify hashes before attributing destructive acts. IMP-3's substance (no planted hygiene) stands regardless. | — | orchestrator | — |
| R8-3 | 01 | **`grill` flips spec status `scored` → `grilled`, silently dropping the score below the gate** until `score` re-runs. Cost a re-score; predictable but silent. The status machine fights its own canonical order. | D2/D7 | **law** — new: IMP-17 | F |
| R8-4 | 01 | `deliver`'s error (DG-U013) doesn't name the stream-path shape; the agent **read CLI source** to proceed. | D7 | **law** — IMP-18 (error messages must carry the fix) | F |
| R8-5 | 01 | Verify scratch defaulted *into `.docodego/`*; lint (DG-S005) caught it — the law held, the default was wrong. Fixed to `var/visual`. | D3/D7 | **law** — IMP-19 (tooling defaults must never point into the record root) | G |
| R8-6 | 01 | Grammar (4th independent confirmation: backtick-only G4) + UTC dates (5th). | D7 | **law** (IMP-5, R2-5 confirmed) | F |

**R0-5 overturned** — 04's "gate passes" was earned; the rows live at the
stream tracker/home I didn't look in. Lesson recorded in the instrument: a
provisional finding must locate the unit's home before judging, and
`01-document`-only views are not the whole record.

**R0-3 resolved** — 03's units were at `02-compose` (the streams prose), not
hand-fabricated elsewhere; the top-level `docs/` remains a small D7 item.

### R5 — +25 min — the integrity-map sweep (founder directive)

Founder observation: the four top-level directories are the record's
integrity summary — "we have to ensure all of the four document compose
demonstrate and govern are meaningful." Sweep of actual contents:

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R5-1 | all | **03-demonstrate holds 4 files in every product — the stream READMEs.** Nobody ever wrote an artifact there. The phase is inert scaffolding. | D8/D1 | **law** (folder wired to no tooling, no artifact class, no reader) | **F** |
| R5-2 | 00/02 | 02-compose: READMEs only (units live in 01-document). On 01/03/04: units' whole lifecycle inside compose/01-build. The same directory means "nothing" or "everything" depending on which prose the agent believed. | D1/D8 | **law** (IMP-6's fork, seen at map level) | **F** |
| R5-3 | 04 | Invented the `knowledge/` growth path unprompted (`01-document/knowledge/`) — first live exercise of a growth path the law only names. | D3 | healthy | — |
| R5-4 | design | Diagnosis: the unit lifecycle is a single-folder pipeline — units never migrate across phases — so top-level rooms only fill by agent improvisation, and improvisation diverges. The map summarizes which README the agent read, not the product. | — | **law** | — |

### R6 — +30 min

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R6-1 | 01 | Third delivery (3 rows); checkout under construction (17 dirty). `check` still green at the stream home. | D2 | healthy | — |
| R6-2 | 03 | Moderation landed (report button, review queue, audit log, 7 tests); dirty down to 1. But **DG-C003 persists** — `pro-fit-report/` holds only `score.md` + `spec.md`, still claiming `scored`. If it finishes red, the finish protocol ("check must pass") collides with the missing-artifact fact. | D4 | **agent** (live) | — |
| R6-3 | 02 | Alive, not stalled: fresh `dist/` build, sources newer than package.json. But `node_modules/` untracked-**unignored** — IMP-3 recurring; risk of repeating 01's late history-rewrite. | D7 | **law** (IMP-3, second live recurrence) | G |
| R6-4 | 04 | **Post-delivery edits to a delivered unit**: `src/scan/engine.ts` and `src/scan/types.ts` modified while building `report-experience`. Scan-engine's gate passed at commit time; the current tree may no longer satisfy its recorded proofs. The acceptance's finding #4 (no supersession rule for delivered code) recurring live. | D4/D2 | **law** (no post-delivery-edit rule; the gate is silent about staleness) | **F** |

### R7 — +35 min

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R7-1 | 01 | **All four units delivered** (storefront, season-quiz, season-carry, checkout), tree clean, `check` green. Checkout: Stripe test-mode with fail-closed confirm + secret-key build gate — the no-accounts/privacy hard lines shaped the design. | D2/D6 | healthy — first likely-complete product on the stream path | — |
| R7-2 | 03 | Endgame with red `check`: dirty 2, DG-C003 unrepaired. The finish protocol ("check must pass") vs the missing grill.md — whichever way it resolves is evidence. | D4 | **agent** (live) | — |
| R7-3 | 02/04 | Both ~55 min without commits. 02: 9 dirty, 0 deliveries, one giant unit (MediaPipe pose pipeline is heavy). 04: 24 dirty and growing — the big-bang pattern now firmly established. | D2 | provisional **agent** (unit slicing / session shape) | — |

### R9 — +45 min — 04 planmyskin completes

| # | repo | observation | dim | attr | severity |
|---|---|---|---|---|---|
| R9-1 | 04 | **Complete**: 3/3 units delivered (100/98/99), 34/34 tests, privacy enforced by making network calls *throw* in tests + built-dist scan (0 external refs), copy file behind a 19-token lint gate, closed allowlist ritual generator; grill caught a real dead-path defect (turmeric step unreachable) before build. Honest unfinished list: payment is a labeled stub, real-device camera unproven, real-skin calibration untested. | D2/D4/D5/D6 | healthy | — |
| R9-2 | 04 | **IMP-16 confirmed first-person**: the copy gate banned a token *after* scan-engine delivered containing it; the agent made an honest amendment (fix commit + cycle entry) but "the law never says whether a delivered unit's proofs/spec may acknowledge post-delivery code changes. They now describe a key the code no longer contains." | D4 | **law** (IMP-16 upgraded: confirmed with the exact artifact-level defect) | **F** |
| R9-3 | 04 | proofs.md's required format (`- <repo-relative-path> — description`) was "discovered by refusal, not written anywhere" — IMP-5's mechanism, now precise: the spec lives only in the gate's refusal text. | D7 | **law** (IMP-5 confirmed) | F |
| R9-4 | 04 | no-TTY grill answering (`answers.txt`) reverse-engineered from gate source — the answers-file contract is folklore. | D7 | **law** (acceptance #8 recurring; fold into IMP-1's protocol work) | G |
| R9-5 | 04 | **Visual evidence has no home**: live browser re-verification was contended by concurrent agents; the agent converted the claim into a deterministic test — stronger evidence, chosen unilaterally. The law recognizes file paths only and "a screenshot-vs-test substitution is a judgment call it doesn't adjudicate." | D4/D5 | **law** — new: IMP-20 (an evidence-type ladder for visual claims; also: concurrent agents contend for one browser) | G |
| R9-6 | 03 | Fifth unit delivered (5 rows); dirty 1 — endgame. DG-C003 **still unrepaired** (`pro-fit-report/` = `score.md` + `spec.md` only). | D4 | **agent** (live) | — |
| R9-7 | 02 | ~65 min without a commit; 10 dirty; 0 deliveries; `check` green. Now the lone giant-unit builder — alive (fresh dist last probe) but the session shape puts everything on one delivery event. | D2 | provisional **agent** | — |

## Findings (deduplicated, ranked)

- **IMP-20 (D4/D5, G, law)** — Visual claims have no evidence ladder: the law recognizes file paths only, so "verify in the browser" either becomes an unadjudicated screenshot-vs-test substitution (04 chose the test, unilaterally) or goes unproven; concurrent agents also contend for one browser pane. *Improvement:* an evidence-type registry — screenshot paths, test-transcript paths, and recorded browser sessions are all legal evidence with declared strength; the demonstrate phase (IMP-15's `demo/<unit>/` bundles) is its natural home.






- **IMP-15 (D1/D8, F, law) — the integrity-map design** *(founder directive; record-spec-7 candidate)*. The four top-level directories are the record's integrity summary, but two of the four rooms are inert: demonstrate holds only stream READMEs in all five products; compose means "nothing" or "everything" depending on which prose the agent believed. Root cause: units are born whole in one folder and never migrate, so rooms fill only by improvisation. *Fix:* each room gets one gate-written artifact class with a named reader — document: the why (intent, cycles, specs); **compose: `compose-log.md`, gate-appended at deliver (unit, spec hash, build summary, spec-vs-built deviations — reader: the handoff agent, the build-honesty auditor)**; **demonstrate: `demo/<unit>/` bundles written at deliver (run output, screenshots, how-to-run — reader: the founder's "show me it working", the launch auditor)**; govern: the trail. Anchored at `init`, so an empty room truthfully means "not there yet." Side benefit: the map goes uniform across products regardless of where unit working-folders live — the fork's worst harm dissolves, and unit placement becomes guidance (IMP-11) while the map stays law.

- **IMP-16 (D4/D2, F, law)** — Post-delivery staleness: 04 modified delivered-unit code (`scan/engine.ts`) while building a later unit; the unit's recorded proofs passed at delivery time but say nothing about the current tree. *Improvement:* a post-delivery edit rule — either the gate re-verifies affected units on `check` (stale-proofs warning), or the law requires a recorded supersession row (like 01's re-score) when delivered code changes.

- **IMP-17 (D2/D7, F, law)** — The status machine fights its own order: `grill` flips a spec `scored` → `grilled`, which drops the recorded score below the gate until `score` re-runs — silent, and it cost 01 a re-score. *Improvement:* grill preserves `scored` (or the gate accepts `grilled+scored`); statuses move forward, never sideways.
- **IMP-18 (D7, F, law)** — `deliver`'s DG-U013 error doesn't name the stream-path shape it wants; 01's agent read CLI source to proceed. *Improvement:* diagnostics carry the concrete fix (expected path form), per `explain`'s own standard.
- **IMP-19 (D3/D7, G, law)** — Tooling defaults pointed scratch into the record root (lint DG-S005 caught it — the law held, the default was wrong). *Improvement:* tool-generated scratch defaults to `var/` outside `.docodego/`.
- **IMP-1 (D2, F, law)** — No founder-absent protocol for human-approval
  gates. Compose requires plan approval by a human; an autonomous agent must
  either stop or self-waive. 01 self-waived in the first 15 minutes. Will
  recur in every autonomous run. *Improvement:* define it in the law — e.g.
  `plan-approval: auto` recorded in the tracker with rationale, bounded to
  what may be auto-approved, verified by `check` whenever compose ran in an
  agent-only session.
- **IMP-6 (D1/D2, F, law) — the streams fork.** Two legal-looking unit homes
  (the READMEs' streams vs `new`'s discover default); 3/5 agents forked to
  streams, 2 stayed at discover; all gates pass either way; the records
  diverge structurally. The acceptance's finding #1 (streams prose vs flow)
  is now proven consequential, not cosmetic. *Improvement:* the law picks one
  canonical home and the prose tells the truth; if streams stay, `new`
  plants where the prose says work happens, and every reading command renders
  any home.
- **IMP-7 (D1/D7, F, law)** — CLI incoherence behind IMP-6: `check` validates
  units at stream homes while `status` cannot see them — the record map lies
  by omission, and the map is exactly what a cold handoff agent reads first.
  *Improvement:* one unit-scanner shared by `check`/`status`/`trace`;
  status renders units wherever they live, with their home named.
- **IMP-2 (D3, F, law)** — Decisions have no blessed home in the product law;
  agents import foreign conventions (00 invented ADRs; 03 hand-placed a unit
  at `04-plan` because the prose let it). *Improvement:* one line in AGENTS.md
  naming where decisions live (cycles log, optional blessed ADR pattern), and
  what streams are *for* — or remove stream placement from the prose.
- **IMP-3 (D7, G, law)** — Repo hygiene rediscovered by every agent from scratch; 01's fix was a follow-up untrack commit (its message misleadingly said "from history" — verified: hashes continuous, no rewrite). *Improvement:* planted `.gitignore`
  (node_modules, dist, .env, OS cruft) from `init`; and commit messages in record repos state facts, not drama.
- **IMP-10 (D7, G, law)** — Canonical status/order ambiguity: 01 had to
  re-score after grilling to fix "canonical status order", and repaired a
  lost cycles.md header — append-only held, via repair. *Improvement:* the
  law states the canonical event order (sketch → spec → grill → score →
  proofs → deliver) and the repair rule for damaged record files.
- **IMP-11 (all dims, law) — the hard/guidance split** *(founder directive + converging evidence)*. The law does not say which of its rules are **invariants** (violations break trust) and which are **guidance** (defaults a competent agent may deviate from with a recorded reason). Every major finding of this round is that ambiguity biting: streams (structure forced where no one reads it), score (a checklist dressed as truth), statuses (display ritual), grill (independence theater in solo runs). *Improvement:* split the planted law into two marked registers — **invariants**: verbatim intent, append-only, records-before-claims, earned statuses (command-written only), proof paths real and re-runnable, gate refusals honored — and **guidance**: unit home, artifact layout, ADR pattern, phases' depth, score as a completeness checklist. Guidance deviations require one recorded line (`deviation: <what> — <why>`), not a waiver ritual.
- **IMP-12 (D4, F, law)** — Score reuse: a materially revised spec inherits the old 100 with no marker; the number then certifies content it never graded. *Improvement:* `score` writes the spec's content hash; `check` warns when a delivered unit's spec hash no longer matches its recorded score.
- **IMP-13 (D2, F, law)** — Solo-grill honesty: the law should say plainly that a single-agent grill is a self-grilled round (recorded as such), or require the round to carry evidence (each question answered with a path, not prose) — the *form* of independence must not be recorded as the fact of it.
- **IMP-14 (D7, G, law)** — `check` warning classes: mark each warning as `drift` (real) or `prose` (cosmetic) so triage doesn't cost an `explain` per code. Also: `node --test test/` fails under strip-types (needs explicit files) — minor tooling nit for the prove docs.
- **IMP-5 (resolved)** — 03's structure was the streams prose, not improvisation; folded into IMP-6.
- **IMP-4 (overturned)** — 04's gate rows were gate-written (tracker shows
  `gate-refused` then `delivered`; `check` green). No fraud. The instrument's
  false-positive lesson: verify the unit's home before judging.

## Healthy signals so far (the law working)

- **The refusal loop taught without a human** (04): gate-refused → grammar
  learned from the refusal text → fixed → delivered.
- **Creative latitude is real** (01's fitting-room light test; 03's
  ink-on-paper identity with measurable criteria; 00's ADR'd decisions and
  struck placeholders; 02's network-allowlist privacy shape) — withheld
  prompts did not starve the builds; research is visibly informing design.
- **Honest scope unprompted**: 00 names real checkout as the known unfinished
  rail; 02 records the payment-verification gap; 01 labels renders as renders.

## Summary for founder review

*(rewritten at the end of the run; rounds above are the evidence)*

The round's name is now "the streams fork": the law's own prose offers a
second unit home, agents take it legally, and the CLI's map (`status`) cannot
see what its integrity layer (`check`) blesses — so a record can be valid and
invisible at once. IMP-6 + IMP-7 are the round's headline fix; IMP-1
(founder-absent gates) remains the deepest autonomous-run gap; hygiene
(IMP-3) and canonical order (IMP-10) are cheap plants. One live agent-defect
(03's grillless `scored` unit, DG-C003) — the checker caught it; watching
whether the agent repairs it unprompted.
