---
id: EL-17
title: Records append
pillar: record
severity: veto
enforced-by: check, lint — rewrite detection; superseded text archived, never deleted
introduced-in: 1.0.0
status: active
---

# Engine law 17 — Records append

*Pillar: record — the trail grows by adding, never by rewriting.*

## The law

The record grows by adding, never by rewriting. When a spec changes, the new version is
added and the old one kept. When a decision is reversed, the reversal is a new decision with
its own reason. Superseded text is archived, never deleted.

## Why

"Nobody, including its author, can quietly improve the past." That is what lets a stranger
trust the record — and what makes the trail a system of record rather than a story.

## Violation

An edited spec file with no archived predecessor; a reversed decision that replaced its
original instead of appending.

## Conformance

Checked today: the tracker is appended and never rewritten by the tool; `check` flags
records whose history cannot be read. Direction: rewrite detection across all record files.
