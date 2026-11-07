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

**R0-5 overturned** — 04's "gate passes" was earned; the rows live at the
stream tracker/home I didn't look in. Lesson recorded in the instrument: a
provisional finding must locate the unit's home before judging, and
`01-document`-only views are not the whole record.

**R0-3 resolved** — 03's units were at `02-compose` (the streams prose), not
hand-fabricated elsewhere; the top-level `docs/` remains a small D7 item.

## Findings (deduplicated, ranked)

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
- **IMP-3 (D7, G, law)** — Repo hygiene rediscovered by every agent from
  scratch; 01's fix was a git history rewrite on a record-carrying repo, a
  destructive act no planted rule gates. *Improvement:* planted `.gitignore`
  (node_modules, dist, .env, OS cruft) from `init`; one law line: after the
  record exists, history rewrite requires the inventory-and-recover ritual.
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
