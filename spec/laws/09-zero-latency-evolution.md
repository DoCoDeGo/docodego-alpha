---
id: ST-9
title: Zero-Latency Evolution
pillar: demonstrate
stream: accept
severity: veto
enforced-by: check — time from acceptance to deployment measured; a unit waiting with no stated reason flagged
introduced-in: 1.0.0
status: active
---

# Statute 9 — Zero-Latency Evolution

*Movement: Demonstrate · Stream: accept*

## The law

Published: "Changes demonstrate as fast as validation permits. No artificial delay."

Complete as published.

## Violation

"Keeping a fixed release day after removing the need for one."

## Limits

"Zero-latency" in the name overstates it; the principle corrects it. Staged rollouts, canary
releases and regulated change windows are validation, not artificial delay.

## Conformance

Checked today: time from acceptance to deployment is measured; a unit waiting with no stated
reason is flagged. Direction: the tool reports acceptance-to-deploy latency per unit.
