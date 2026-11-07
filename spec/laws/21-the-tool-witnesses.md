---
id: EL-21
title: The tool witnesses
pillar: demonstrate
severity: veto
enforced-by: deliver — G4; growth: the tool runs the proof and records its output
introduced-in: 1.0.0
status: active
---

# Engine law 21 — The tool witnesses

*Pillar: demonstrate — proof differs from assertion by a witness.*

## The law

Evidence counts as proof only if the tool ran it and recorded its output. Pasted output is a
note, not proof.

## Why

A screenshot of a passing build proves that someone once had a passing build. The witness is
what makes proof different from assertion — and it is the line between a record that checks
and a report that asks for trust.

## Violation

A proofs file whose entries nobody ran; deliver passing on a pasted log.

## Conformance

Today, honestly: `proofs.md` is written by whoever did the work, and G4 asks only that a
named path exists — "a proof on disk is a careful note, which a stranger re-checks by running
it again." The direction is witnessed proofs: the tool runs the proof, keeps its output, and
binds it to the exact work (EL-22). Until then this law is the contract the tool grows into,
and the practice says so.
