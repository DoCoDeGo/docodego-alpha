---
id: EL-27
title: The mode invariants
pillar: govern
severity: veto
enforced-by: deliver — a named signer on every receipt; the halt tested and recorded on the trail
introduced-in: 1.0.0
status: active
---

# Engine law 27 — The mode invariants

## The law

Four things hold in every mode — hands-on, guided, review, auto:

1. **A named person owns every receipt.**
2. **Modes decide who signs, never whether anyone signs.**
3. **Any signer can halt the work.**
4. **The halt is tested,** not assumed.

A form that lets work ship without a named person's signature is not a form of the System.
The tested halt: stop the agents on purpose at a quiet moment; check every agent stopped,
half-done work is recorded and rolled back, and work resumes cleanly from the record; write
the result on the trail with the date. A team that has never tested its halt does not have
one yet, and should not run in auto until it does.

## Why

Modes are the control that scales governance with autonomy — without them, "auto" means
nobody is govern-ing. The invariants are what make every mode a governing mode.

## Violation

Auto mode with no tested halt; a receipt signed by a tool; a mode change that removed the
signer.

## Conformance

Direction: the mode is recorded per product, part or unit; each mode changes who must act at
each gate (auto: sign by exception, read the traces, halt tested); escalation signals
(falling first-pass rate, repeated drift, a security surface, an untried technology, rubber-stamp
reviews, an overloaded Governor) move work to a stricter mode until the signal clears. Modes
are not a ladder: a mature team runs all four at once and moves work in both directions.
