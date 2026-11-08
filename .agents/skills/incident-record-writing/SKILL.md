---
name: incident-record-writing
description: Turns failures into append-only postmortem records. Use after any production incident, lost work, destructive accident, or repeat miss - writes the record the 81-92% production-failure data says nobody writes - timeline, cause, contributing causes, the rule that changes - into the record layer, never a wiki page that rots.
version: 1.0.0
---

# incident-record-writing

The survey data is consistent: most production incidents recur because
the org never wrote down what happened in a form that binds the next
change. A docodego record already has the right shape for this: the
setback ledger (what happened, what it cost, what changed) and the
tracker (the dated, append-only log). This skill is the discipline for
filling them after an incident.

## The record - four parts, appended in order

1. **Timeline.** Dated facts only: what was observed, when, in what
   order. No interpretation in the timeline - interpretation has its own
   section and its own error rate.
2. **Cause, honestly scoped.** The technical cause AND the process cause
   (what made the technical cause possible: a missing guard, a skipped
   gate, an unread rule). "Human error" is where the analysis starts,
   not where it ends.
3. **What it cost.** Lost work, lost time, lost trust - with magnitudes.
   A cost nobody wrote down gets paid twice.
4. **The rule that changes.** One concrete, checkable change: a new
   check scan, a gate item, a rule file with an enforced-by. "Be more
   careful" is not a rule. The change lands as a unit or a rule file,
   and the incident record links it.

## The law the record already teaches

Append-only (nothing is rewritten, the past is not quietly improved);
records before claims (the incident record links its evidence); the
founder's words verbatim if any decision is quoted. The postmortem is a
record, not a memo - it is written for the stranger who hits this in a
year.
