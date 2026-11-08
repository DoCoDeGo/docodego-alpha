---
name: 230-debt-improvement-dispositions
type: unit
epic: 020-canon-debts
status: delivered
---

# 230-debt-improvement-dispositions

## intent

The debt epic's AC1 demands the mapping: every open item in the five
source docs maps to exactly one owner, with the table kept current as
children land. Six weeks of spec-7 delivery (eleven children, e3b9aa5
through 2f213ca) landed, drafted, or superseded large parts of the
improvements round's fix list — but nothing records which. The record
is about to lie by omission: a reader of the improvements doc cannot
tell what landed, what a draft law owns, what a founder must decide,
and what is genuinely unowned. This child investigates every IMP item
against the shipped CLI and spec tree and writes the dispositions plus
the epic's mapping table — the single owner list the epic's AC1
requires.

## scope

In: an IMP-by-IMP disposition of every improvement item the round
recorded — IMP-1..7 and IMP-10..23 (the doc's own numbering skips 8
and 9), `docs/audits/2026-11-08-improvements.md` — each disposition
citing its evidence (the command, the code site, the child commit, or
the draft law that owns it) and carrying exactly one status — landed
(with where), drafted (which EL draft owns it), founder (the founder
decides), unowned (named, for a later child to pick up), or declined
(with the reason); the mapping table appended to the debt epic
(`020-canon-debts/spec.md`) covering all six clusters — cluster 6
marked done via 170-two-calendars, cluster 1 mapped to its product
records and founder ceremonies, cluster 2 to its founder-owned items,
clusters 4 and 5 to the children still to scaffold; the two
resolved/overturned items (IMP-4, IMP-5) recorded as such.
Out: implementing any unowned item (each gets its own child, spec and
grill first); modifying the source docs (they stay untouched — the
dispositions cite them); the EL-18/33/34 amendment batch (drafts stay
drafts until the founder's 1.1.0 sign-off).

## acceptance

- AC1 — the debt epic carries the mapping table: all six clusters
  present, every IMP row (IMP-1..7, IMP-10..23) carrying exactly one
  disposition status and an evidence citation (a code site, a child
  commit, a draft law, or a founder decision owed).
- AC2 — every "landed" disposition's citation is verifiable now: the
  named command, code site, or conformance fact exists in this repo
  (spot-verified by grill, provable by grep).
- AC3 — every "unowned" item is stated as a candidate child with its
  cluster named — nothing lands in the table as open without a named
  next home, and nothing is marked done without its commit.
- AC4 — the source docs are untouched (git shows no diff under
  docs/audits/ from this unit) and the epic file is the only spec-tree-
  adjacent file modified beside this unit's own record.

## threats

- Triage-by-bulk — sweeping items into "landed" without evidence. The
  epic's own threat, named: every landed row carries the citation, and
  AC2 makes grill test the citations by grep.
- The mapping going stale the day after it lands. Mitigation: the
  table lives in the epic the children update as they land (AC1's
  "kept current" duty is the epic's own acceptance, not this child's
  invention); this child lands the table's initial truth.
- Paraphrasing the source doc's findings. Mitigation: dispositions
  cite; they do not restate — each row is one status, one citation,
  one clause of why.
