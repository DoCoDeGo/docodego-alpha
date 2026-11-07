---
id: EL-22
title: Proof is bound to the exact work it proves
pillar: demonstrate
severity: veto
enforced-by: deliver — G4; the receipt cites the spec version and the exact state the proof ran against
introduced-in: 1.0.0
status: active
---

# Engine law 22 — Proof is bound to the exact work

*Pillar: demonstrate — evidence must name the exact work it proves.*

## The law

A proof belongs to the exact thing it proves: the exact state of the code or document it ran
against, named in the record. The receipt cites the spec version it was built against.

## Why

"Proof that ran" is only evidence if you know what it ran on. A proof re-run against
tomorrow's work proves nothing about today's.

## Violation

A receipt citing no spec version; a proof recorded without the version it ran against.

## Conformance

Checked today: the deliver gate records the four gates' findings on the receipt. Direction:
spec frontmatter carries a version; receipts cite it (a receipt that cannot cite a spec
version is the gap this law closes).
