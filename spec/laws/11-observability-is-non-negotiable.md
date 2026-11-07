---
id: ST-11
title: Observability Is Non-Negotiable
pillar: demonstrate
stream: deploy
severity: veto
enforced-by: lint — each deployed unit declares its signal and its watcher
introduced-in: 1.0.0
status: active
---

# Statute 11 — Observability Is Non-Negotiable

*Movement: Demonstrate · Stream: deploy*

## The law

Published: "You cannot govern what you cannot see. Every demonstrated output includes
telemetry."

Completion †: "You cannot govern what you cannot see. Every demonstrated output includes
telemetry: the named signal that shows it is working."

## Violation

"Treating observability as an optional add-on after demonstration."

## Limits

The second sentence, read literally, fails for a document, a library, a refactor with no
change in behaviour, or a local tool where telemetry would breach privacy. Every change can
name its signal, and the signal never has to watch a person.

## Conformance

Checked today: each deployed unit declares its signal and its watcher. Direction: the tool
cross-checks declared signals against wired actions (a signal with no action wired to it is
decoration).
