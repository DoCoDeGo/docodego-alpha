---
id: ST-12
title: Atomic Delivery
pillar: demonstrate
stream: release
severity: veto
enforced-by: check — each release item maps to one accepted unit and its receipt
introduced-in: 1.0.0
status: active
---

# Statute 12 — Atomic Delivery

*Movement: Demonstrate · Stream: release*

## The law

Published: "The unit of delivery is the specification: all or nothing."

Complete as published.

## Violation

"Bundling multiple spec outputs into a single delivery unit."

## Limits

Teams on a shared trunk ship code dark behind flags on purpose; code dark behind a flag the
spec names is not partial state. A large spec delivered all or nothing becomes a big batch,
so keep units small enough that "all" is small. An emergency patch is its own unit.

## Conformance

Checked today: each release item maps to one accepted unit and its receipt. Direction: the
tool refuses a release whose items do not resolve to delivered units.
