---
id: EL-23
title: Verifiable by a stranger
pillar: demonstrate
severity: veto
enforced-by: check — proofs record what ran and what came back; growth: the recorded command beside the output, re-runnable by anyone
introduced-in: 1.0.0
status: active
---

# Engine law 23 — Verifiable by a stranger

*Pillar: demonstrate — a stranger can re-run the proof and see the same thing.*

## The law

A proof on the trail can be re-run by someone who does not trust the author: an auditor, a
client, a colleague from another team. They can run it again and see the same result, or see
that it differs. "A report asks you to believe its author. A record lets you check."

## Why

Trust that depends on the author's honesty is not evidence. The stranger-check is the
strongest form of the proof laws: seen to fail, bound to the exact work, and re-runnable by
someone with no stake in the answer.

## Violation

A proof whose command cannot be reconstructed from the record; results that live only in a
conversation.

## Conformance

Checked today: `check` verifies proof paths exist. Direction: proofs carry the recorded
command alongside the output, so a stranger's re-run is one line.
