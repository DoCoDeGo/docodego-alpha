---
id: ST-10
title: Feedback Closes the Loop
pillar: demonstrate
stream: demo
severity: veto
enforced-by: lint — every demo record states what it taught; every feedback item has an owner
introduced-in: 1.0.0
status: active
---

# Statute 10 — Feedback Closes the Loop

*Movement: Demonstrate · Stream: demo*

## The law

Published: "Deployment telemetry informs the next specification cycle."

Complete as published, read with a gloss.

## Violation

"Reading demonstration metrics without asking what they mean for the spec."

## Limits

"Deployment telemetry" is too narrow for the stream it governs; the most useful feedback is
often a remark at a demo, an incident or a grilling question, and some work never deploys.
Telemetry here means any evidence from use. The System's own laws limit what may be
collected about people (EL-28). IRAF's feedback stage is not optional: a unit without
feedback has not finished its loop.

## Conformance

Checked today: every demo record states what it taught; every feedback item has an owner.
Direction: the tool refuses to close a unit whose feedback stage is empty.
