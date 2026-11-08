---
name: 110-spec7-naming
type: unit
status: delivered
epic: 010-canon-spec-7
---

# 110-spec7-naming

## intent

Names carry order — the founder's rule, extended to the layer that lost
it. Every structural element of the record is numbered (streams, laws,
cycles, briefs); the units inside the streams were not, so a cold
reader of `01-build/` read an alphabetical listing that told a false
story (amendments before foundations). The unit renames the live
record to `NNN-` sequence prefixes in tracker order (step of ten, so a
late unit takes the gap it needs), teaches the rule where agents read
it (AGENTS.md, planted to every adopter), makes the CLI assign the
next number automatically (`docodego new` — an agent cannot guess
wrong), and warns on unprefixed folders (lint, warn-severity: the
convention migrates, existing adopter records are not broken). The
studio docs get the honest variant: dated audits move to date-LEADING
names under `docs/audits/` (the old date-as-suffix sorted by title,
not time), evergreen reference stays unprefixed behind a read-order
index — numbering a sequence that does not exist would fake order, not
restore it. Human readability is human accountability: the folder
listing is the only index that survives a clone, so the order of work
must live in the name.

## scope

In: the rename of ten units + the epic (frontmatter identity, proof
citations as addressing corrections, tracker disclosure row — rows and
verdicts untouched); the DG-N004 lint rule + explain page; the `new`
auto-assign; the AGENTS.md paragraph + record declared v10 + the
v9→v10 migration (in-place teach for shipped-v9 records, keep + .new
for customized); the docs/audits move + index. Out: renaming the
tracker/delivery-log ledgers (rotation is spec7-audit's), renaming
anything in `spec/` (the law tree is already numbered correctly),
retroactively renumbering delivered.md row text (append-only).

## acceptance

- AC1 — the live record reads in build order: ten unit folders and the
  epic carry NNN- prefixes matching tracker order; check exits 0
  (frontmatter identity holds; proof citations resolve); the tracker
  carries a dated renumbering row; tracker and delivery-log ROWS are
  byte-untouched.
- AC2 — `docodego new` assigns the next prefix automatically in a
  scratch record (010-, then 020-), and honors an explicitly-prefixed
  name.
- AC3 — lint warns DG-N004 on an unprefixed unit folder in a scratch
  record; the v2 record lint runs clean (all prefixed); the rule
  registry self-check holds and the explain page exists.
- AC4 — AGENTS.md teaches the naming law, the record declares v10, and
  the v9→v10 migration is proven both ways: a shipped-v9 record's
  AGENTS.md gains the paragraph in place with the stray .new removed;
  a customized AGENTS.md is kept with the refreshed copy riding as
  .new.
- AC5 — docs/ reads in order: audits date-leading under `audits/`,
  cross-references updated, the index README states the scheme; no
  regression: tsc clean, canon suite exit 0, record check/lint exit 0,
  bundle green at declared 10.

## threats

- Renaming evidence paths breaks delivered units' proof resolution —
  the biggest blast radius. Mitigation: citations corrected as
  addressing (same targets, new names) before check runs; check exit 0
  is the gate; the tracker row discloses the correction.
- The auto-assign colliding with an existing folder. Mitigation: the
  existing-folder refusal (DG-U012) runs after prefix computation; the
  error names the final prefixed name.
- AGENTS.md migration mangling a customized adopter file. Mitigation:
  the v4→v5 anchor law — insert only after the exact movements-list
  line; no anchor, no edit, the refreshed copy rides as .new.
