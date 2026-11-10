# 2026-11-10 — quality assessment, round 1 (end-user experience at first paint)

The founder's judge: the visitor. Method: every clean trial built and
served (all five built clean, served over local HTTP), the landing page
loaded in a real browser at desktop width, evening local time, screenshotted
after a dwell. Evidence: `screenshots-2026-11-10/` (ten captures: first
pass and re-checked with dwell).

## The ranking (first paint is the test)

| rank | trial | verdict at first paint |
|---|---|---|
| 1 | **07-trackhair-r2 (cold)** | Fully legible instantly; the ledger theme carries real information; CTAs unmistakable; flair subtle. 75 unit + 12 e2e green, Lighthouse 100/100/1.09s. The best first paint of the round. |
| 2 | **08-glowmonth (cold)** | Fully legible, distinctive, confident ("30 days. One plan. Built from your face."); 153 unit + 32 e2e green, Lighthouse 100/100/1.4s. One delivered unit of a larger planned decomposition — honestly stopped. |
| 3 | **06-tryonface (cold)** | 5/5 units delivered and launch-passed, 27 unit + 13 e2e green — but the hero sits behind its defog effect until scroll: the landing promise is illegible at first paint. A recorded design choice that fails the make-them-come-back test at the front door. |
| 4 | **09-wardrobemap (cold, reconciled)** | 5/5 units launch-passed after absorbing a double-build — but the landing is washed-out at rest (hero and swatches near-invisible until scroll), same class as 06. |
| 5 | **05-wardrobeclimate (cold)** | The living sky renders beautifully — and the hero text stays dark-ink on the dark evening sky: critically low contrast at first paint at this hour. The visitor squints. |
| — | preserved coached builds | 06-overfed: 7 units, richest feature set, legible captures. 05-overfed: the living-sky ambitions, Lighthouse 99. 07-trackhair (original): 5 units, legible. |

## The finding the round exists to produce

**First-paint legibility is a systemic defect of the cold trials**
(05, 06, 09 — three of five), caused by entrance fades/fogs and
time-of-day ink choices that were never *checked at the visitor's eye*.
Each agent's e2e asserted content presence, not visibility. The
improvement is law, not luck: the ux-strategy skill's flair section
must require — and an e2e must prove — that the hero is fully legible
at first paint without scroll, that entrance animations settle inside
~1.5 seconds, and that ink-vs-sky contrast is verified at multiple
local times. Candidate unit, P0-adjacent (it shapes every visitor's
first impression).

## The comparison the founder asked for (coached vs cold)

- **Feature richness:** the coached builds reached further (06-overfed:
  7 units incl. a beard studio and poll cards; 05-overfed: storm-diary
  easter egg) — the extra paragraphs of the first-draft prompt pushed
  scope.
- **Honesty and hygiene:** the cold trials matched or beat the coached
  ones — 05-clean self-caught the node_modules class proactively;
  06-clean's gates caught two real bugs; both stopped honestly at the
  founder-sign tier.
- **First paint:** mixed — 07-r2 (cold) beat every build; 05-clean and
  09-clean regressed on contrast/visibility. The variance itself is the
  finding: the law does not yet guarantee the first impression, and the
  ux-strategy fix (above) is how it will.

## Promise-keeping (spot-audit summary)

Walk order held in every trial; statuses were earned at gates; every
trial stopped honestly at the founder-sign tier; launch refusals were
honored and repaired; no fabricated claims surfaced in any report.
The one structural break of the round (09's double-build) was absorbed
by the record and traced to an orchestration defect, owned and fixed
in doctrine.
