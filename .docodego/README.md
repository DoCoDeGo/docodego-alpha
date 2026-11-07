# .docodego — the record layer

This folder is the repository's memory: intent at the top, work underneath,
evidence everywhere. Read it before you touch code.

## Read in this order

1. `.standard/manifest.json` — what this record is (mode, versions, ring)
2. `AGENTS.md` at the repo root — the law you work under
3. `01-document/01-discover/intent.md` — the founding brief, verbatim
4. `01-document/` — current intent, sharpened into specs
5. `04-govern/01-monitor/tracker.md` — where the work actually stands
6. `04-govern/delivery-log.md` — what has actually landed

## The shape

Four movements, sixteen streams:

| movement | streams |
|---|---|
| 01-document — intent | 01-discover · 02-refine · 03-validate · 04-plan |
| 02-compose — the work | 01-build · 02-integrate · 03-enhance · 04-maintain |
| 03-demonstrate — the proof | 01-demo · 02-accept · 03-release · 04-deploy |
| 04-govern — the loop | 01-monitor · 02-measure · 03-retrospect · 04-improve |

Each stream folder carries a one-line README: what enters, who consumes it.
`01-discover/` also carries the record's roots: `intent.md` (the founding
brief, a verbatim record) and `cycles.md` (the numbered, append-only log of
research and decisions).

## The law, in short

- Records append. Nothing in here is rewritten, only continued; superseded
  text is struck, never deleted.
- A unit is done when its four gates pass: spec complete, score ≥ 60,
  grill answered, a proof that exists on disk.
- Evidence is a path in this repository that exists. No path, no claim.
- Failure is evidence too: a refused gate leaves its attempt in the
  tracker, and proofs may record what failed.

## Where the work stands

`04-govern/01-monitor/tracker.md` is the append-only ledger — newest entries
last. What has landed is in `04-govern/delivery-log.md`, one row per
delivered unit, appended by the gate itself. If a file and the tracker
disagree, the tracker wins.
