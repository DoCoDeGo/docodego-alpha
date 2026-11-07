---
id: EL-26
title: Gates near the machine, pictures near the person
pillar: govern
severity: warn
enforced-by: design law — gates are exit codes and envelopes; what people see are pictures, not verdicts
introduced-in: 1.0.0
status: active
---

# Engine law 26 — Gates near the machine, pictures near the person

*Pillar: govern — machines gate the work; people judge it.*

## The law

The tool's gates apply to the work — tests, proofs, the integrity of the record — never to a
person. What the tool shows people are pictures, not verdicts.

## Why

A gate that scores the signer has become surveillance with a linter. Machines gate the work;
people judge the work; the interface keeps the two apart.

## Violation

A gate that refuses based on who is running it; a dashboard that renders a person as a
number.

## Conformance

Checked today: exit codes and the JSON envelope carry gate verdicts about the record;
`status` renders pictures of the work. Direction: rendered views carry no per-person metrics
(EL-28), by construction.
