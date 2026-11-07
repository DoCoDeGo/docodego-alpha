---
id: ST-6
title: Resilience Over Robustness
pillar: compose
stream: maintain
severity: veto
enforced-by: lint — a fix cites its spec change; every deployed unit has a rollback path
introduced-in: 1.0.0
status: active
---

# Statute 6 — Resilience Over Robustness

*Movement: Compose · Stream: maintain*

## The law

Published: "Design for reconstruction. Rebuilding is safer than maintaining brittle
systems."

Complete as published.

## Violation

"Adding defensive code to handle cases not in the spec."

## Limits

Rebuild components, not data; full rewrites carry well-known risk. Guarding code the threat
model names is design, not clutter, and statute ST-15 asks for it.

## Conformance

Checked today: a fix cites its spec change; deployed units carry a rollback path. Direction:
the tool flags defensive additions whose guard no criterion names.
