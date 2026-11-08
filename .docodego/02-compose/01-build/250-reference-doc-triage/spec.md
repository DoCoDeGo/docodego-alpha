---
name: 250-reference-doc-triage
type: unit
epic: 020-canon-debts
status: delivered
---

# 250-reference-doc-triage

## intent

Cluster 5 of the debt epic: the four reference docs' open threads —
enhancements.md's twenty-item backlog, distribution.md's unproven and
staged channels, skills.md and vocabulary-packs.md — enumerated as they
stand today and triaged into exactly three buckets: ship-now (small,
owned, this epic can name the child), launch-gate (owed before
go-public; feeds the go-public cluster), declined (with the reason,
usually the doc's own recorded decision). The debt map's snapshot
counts (41/7/10/20) predate spec-7's landings; this child records what
is actually open now. The four docs are evidence: nothing in them
changes; the triage lands here and in the epic's mapping row.

## scope

In: an item-by-item triage of enhancements 1–20, distribution's open
channel rows (Scoop unproven, Nix unproven, AUR staged on a founder
account, Winget staged on a PR, the manual Homebrew bump, the
unverified announcement surface) and skills/vocabulary-packs' open
threads (none in skills; two deliberately-later re-voicing notes in
vocabulary-packs); the triage table landed in the unit's record and
the epic mapping row updated to done. Out: implementing any triaged
item (each named item keeps or gains its own owner — founder
ceremonies stay with the founder, engineering items become named
future children); editing any of the four source docs; re-counting
history (the map's snapshot stands as recorded, corrected by this
unit's enumeration).

## acceptance

- AC1 — the triage table covers every open thread found today:
  enhancements 1–20 each with exactly one bucket, distribution's open
  channel rows each with exactly one bucket, skills.md and
  vocabulary-packs.md each with an explicit nothing-open or
  declined-with-reason row.
- AC2 — every bucket row cites its evidence: a doc line for the item's
  current state, an owner (founder / studio / a named future child)
  and, for declined rows, the reason (shipped, deliberately deferred —
  with the doc's own words where they exist).
- AC3 — the four source docs are untouched: git status and git diff
  over docs/enhancements.md, docs/distribution.md, docs/skills.md,
  docs/vocabulary-packs.md show no change from this unit.
- AC4 — the epic's cluster-5 mapping row flips to done citing this
  unit; the launch-gate rows visibly feed cluster 2 (go-public) so no
  launch-owed item sits in two places with two owners.

## threats

- Triage-by-bulk — sweeping unchecked boxes into buckets without
  reading them. Mitigation: the enumeration was done item-by-item
  against today's docs; AC2's citation rule makes each row checkable.
- Double-owning with the go-public cluster — the launch-gate bucket
  must hand items TO cluster 2, not hold them. Mitigation: AC4's
  feed-visibly rule; the table names the receiving owner per row.
- Scope creep into engineering — "ship-now" tempts building. The unit
  triages; the children build.
