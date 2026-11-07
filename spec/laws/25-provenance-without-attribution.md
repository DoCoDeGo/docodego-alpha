---
id: EL-25
title: Provenance without attribution by default
pillar: record
severity: veto
enforced-by: lint — every act records person or agent; tool and model names opt-in
introduced-in: 1.0.0
status: active
---

# Engine law 25 — Provenance without attribution by default

## The law

The record says whether a person or an agent did each thing — because only a person can
answer for the work. Tool and model names are opt-in (some teams must record them, for legal
reasons); by default the record says "agent" and moves on. "Your trail should outlive every
tool used to make it."

## Why

Tools change every few months; a record full of their names ages badly. The question that
matters is whether a person acted, not which machine.

## Violation

A receipt with no person/agent provenance; a trail littered with model names nobody asked
for.

## Conformance

Direction: every tracker line and receipt carries a provenance field; lint flags acts that
do not. This law is written down now so the field exists before the volume arrives.
