---
name: 380-compose-log
type: unit
epic: 020-canon-debts
status: delivered
---

# 380-compose-log

## intent

Improvement item 15, first half — the compose room's integrity artifact.
The audit's finding: the four top-level directories are the record's
integrity summary, but compose means "nothing" or "everything" depending
on which prose the agent believed, and a handoff agent must crawl unit
folders to learn what was actually built. The fix gives compose one
gate-written artifact class with a named reader: `.docodego/02-compose/
compose-log.md`, appended by the deliver gate itself — one row per
delivered unit carrying the date, the unit, the spec hash it delivered
against, and the declared spec-vs-built deviations. Its readers are
named in the file's own header: the handoff agent (what was built, and
where built diverged from spec) and the build-honesty auditor. The
artifact is anchored at init, so an empty compose room truthfully means
"not there yet". The log is engine-owned like the tracker and the
delivery log — planted fresh from a template constant, never a boundary
row: a log that grows at every delivery would drift an embedded copy on
day one. The move is a record-contract change, so it pays the chain:
registry 19 → 20 (one create-only migration step), the transition hop,
and the spec version moves with the law set.

## scope

In: the template constant (header naming the readers, row grammar
`| date | unit | spec | deviations |`); init planting it create-only;
the deliver gate appending one row — spec sha16 recomputed at delivery
(the same binding G2 holds), the unit's `deviations:` frontmatter line
quoted verbatim, `none recorded` when absent, pipes escaped so the
grammar survives; migration 19→20 (create-only step, idempotent); the
bump chain (transition row v19→v20, spec 1.0.11, amendment row,
manifest recordVersion 20); the payload regenerated (boundary stays
52 rows — no allowlist change); conformance facts (the template ships,
init plants it, the gate writes the row both ways); this record eating
its own food — the live file planted create-only, 380's delivery as
row one. Out: the demo bundles (unit 390, IMP-15's second half), the
evidence ladder (unit 400, IMP-20), AGENTS.md/README prose (the file
is self-describing; its header does the teaching), the boundary
manifest and the sweep fact (no rows move), any retroactive backfill
of past deliveries (the log starts where it starts — history is not
rewritten to look complete).

## acceptance

- AC1 — the artifact is anchored: a fresh init plants
  `.docodego/02-compose/compose-log.md` whose header names both readers
  and states the row grammar — conformance fact, green every run.
- AC2 — the gate writes it: deliver on a passing unit appends exactly
  one row; the sha16 column matches the delivered spec's hash; a
  `deviations:` line in the spec frontmatter lands verbatim in the
  row; its absence lands `none recorded`; a pipe in the declaration is
  escaped — conformance facts covering all three shapes.
- AC3 — the ladder is honest: registry 19 → 20 contiguous, the
  transition mirror green with the new hop, record manifest 20, bundle
  verify clean (52 files, spec 20, boundary v2 — unchanged).
- AC4 — this record carries it: the live file exists with the template
  bytes, and this unit's own delivery is the log's first row.
- AC5 — the suite green at the new pairs: conformance, tsc, canon at
  spec 1.0.11.

## threats

- The log as a boundary row would drift the payload at every delivery —
  averted by design: engine-owned template, excluded from the embed,
  same as the tracker and the delivery log; the live file may grow rows
  forever without touching the shipped bytes.
- Verbatim discipline vs the table grammar: the declaration is quoted
  exactly as written; escaping `|` is mechanical encoding, not
  paraphrase — the row stays a row, the words stay the author's.
- A pre-20 record delivers with no log on disk (skipped upgrade):
  the gate's append creates the file from the template first — the
  appendTracker precedent, no row ever lost to a missing header.
