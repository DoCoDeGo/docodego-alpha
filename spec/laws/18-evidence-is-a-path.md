---
id: EL-18
title: Evidence is a path
pillar: record
severity: veto
enforced-by: check — evidence links resolve; lint — claims carry paths
introduced-in: 1.0.0
status: active
---

# Engine law 18 — Evidence is a path

## The law

Every claim on the trail points at its evidence — a file that holds it. A claim with no
evidence is marked as assumed, or it is not written. "Records before claims": if the record
does not exist, write it first.

## Why

The question moves from "who remembers?" to "where is it written?" Meetings that used to
argue about what happened can look it up. A claim with no path is a rumour with formatting.

## Violation

A tracker line with no evidence field; a decision recorded without its reason.

## Conformance

Checked today: `check` verifies proof paths named in the record exist. Direction: lint
resolves every evidence path in every record file.
