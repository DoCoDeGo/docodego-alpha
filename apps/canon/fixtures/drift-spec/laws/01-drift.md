---
id: ST-1
title: Contract Drift
pillar: document
severity: veto
enforced-by: deploy — the stream runs it
introduced-in: 1.0.0
status: active
---

# Contract Drift

A law whose enforced-by names `deploy` — a stream name, not a command any
binary registers. Verify must catch this mechanically: the whole point of
reading the live CLI registry is that this file cannot pass by hope.

## The law

Enforcement names real gates or it names nothing.
