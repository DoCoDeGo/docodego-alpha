---
id: EL-33
title: Statuses move through gates
pillar: record
severity: veto
enforced-by: check — a status is read against its gate's record; the CLI is the only status writer
introduced-in: 1.1.0
status: active
---

# Engine law 33 — Statuses move through gates

*Pillar: record — the rails the loop runs on are record, not convention.*

## The law

A delivery unit's status is written by the gate that earned it, and by
nothing else. The chain is draft → grilled → scored → delivered, and
each step's command — grill, score, deliver — sets the status when its
own gate passes and records the evidence beside it (the grill round,
the score breakdown, the delivered receipt). Retirement and withdrawal
are commands too: retirement moves the unit to its tomb and stamps it
(`retired_on`, `was`) — it does not mint a new status value. A status
that moved backward or forward without its gate's record on file is
not a status: it is a rewritten record (EL-17), refused.

## Why

Statuses are the loop's rails — every rollup, gate, and audit reads
them as facts. A status that a hand can set is a fact a hand can
forge: draft work presented as delivered skips every check that
delivers guard. The rails hold because the writer is the checker.

## Violation

Frontmatter edited from draft to delivered by hand; a delivered unit
with no grill round or score on file; a unit un-delivered by editing
its frontmatter instead of recording why.

## Conformance

Checked today: the CLI commands are the only writers (grill, score,
deliver, retire each act through their gates, evidence recorded
beside); `check` re-reads statuses against the gate records — a
delivered unit without its delivered.md is a finding; the audit's
GOV-003 cross-checks delivered units against their grill verdicts.
Direction: a status transition table enforced by check — every gate-
less move refused by the machine, not just detectable — specified as
a delivery unit in the record's debt map, landing with its own unit.
