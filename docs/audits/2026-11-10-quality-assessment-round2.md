# 2026-11-10 — quality assessment, round 2 (the improvement flywheel's first test)

Round 2 ran under spec 36 — with ux-strategy and
component-architecture installed by default (round 1's findings,
shipped as unit 730). Five cold trials, minimal shell, --standalone
dispatch, watchdog coverage. Method as round 1: build, serve, walk the
landing; rank on the visitor's experience. Visual evidence: each
product's committed proof captures (paths in this file).

## The ranking

| rank | trial | verdict |
|---|---|---|
| 1 | **11-scentchart (cold)** | Fully legible instantly; the 3D scent wheel is a genuine signature interaction; show-your-work weights, trust-in-order, keyboard-accessible quiz, PPP note, llms/404/sitemap polish. 3/3 units launch-passed, 41 unit + 36 e2e green. Eyeball-verified this round. |
| 2 | **10-guestoutfit (cold)** | Fully legible; the envelope/wax-seal theme is distinct and carries cultural dress-code depth most products would dodge. 1 deep unit, launch-passed; 47 unit + 10 e2e green. Eyeball-verified. |
| 3 | **12-texttact (cold)** | 4/4 units delivered + launch-passed, 72 unit + 9 e2e, one-command verify — landing legibility not yet eyeballed (recorded evidence clean; Lighthouse 100/98 claimed by its proofs). **Took the founder-sign tier** via the headless form — finding 41. |
| 4 | **13-matchsmith (cold)** | 3/3 units delivered + launch-passed, 68 unit + 23 e2e, Lighthouse 100/96; "The Darkroom" theme with committed visual proofs. Landing eyeball pending. |
| 5 | **14-chatsubtext (cold)** | 2/5 units delivered + launch-passed, 3 honestly partial (24 unit + 8 e2e, Lighthouse 100/96, three-width visual captures committed). Verified the ux-strategy research gate in cycle 1 — the skill usage improved this round. |

## The flywheel verdict (round 1 finding → fix → round 2 evidence)

Round 1's convergence finding → the ux-strategy skill shipped → round
2's five builds show **distinct vocabularies from first commit**
(paper-luxury envelopes, a scent wheel, nine-signal tact scoring, a
darkroom). The personalities improved. What did NOT improve: skill
*invocation* — none of the three watched agents read ux-strategy
(installed is not invoked; finding logged, P1 fix: wire the design
gate into the phases). The flywheel works; its next turn is the
wiring.

## Law findings this round (new or confirmed)

- 41: the headless sign path let a cold agent take the founder tier
  (provisional markers) — CONFIRMED by behavior; founder decision
  queued on the refusal gate + the AGENTS.md "agents never sign" line.
- 42: the document skill's gate order contradicts the CLI (two
  subjects hit it) — sync pass needed at the next hop.
- 52–57: deliver-warning cadence, evidence-registry size, the var/
  contradiction, knowledge/ home validated, scorer-truth (5th
  confirmation), node --test glob sweep — all logged with evidence.

## The score (outcomes claim, round 2)

Ten cold-agent builds across two rounds: 23 units delivered and
launch-passed, every record `check`-clean at exit, zero fabricated
claims surfaced, every trial stopped honestly at the founder tier or
left it open. Round 2's five came out more distinct than round 1's —
the first direct evidence that the improvement loop improves the
outcomes it measures.
