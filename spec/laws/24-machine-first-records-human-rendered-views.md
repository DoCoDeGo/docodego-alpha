---
id: EL-24
title: Machine-first records, human-rendered views
pillar: record
severity: warn
enforced-by: design law — views are rendered from the record, never hand-maintained beside it
introduced-in: 1.0.0
status: active
---

# Engine law 24 — Machine-first records, human-rendered views

## The law

The trail is append-only plain files the team owns. Readable views — boards, summaries,
sites — are rendered from the record. The record is the truth; the view is a picture of it.

## Why

Two copies of the truth drift. A hand-maintained dashboard becomes a second, quieter record
that nobody audits — and then the audited one is the lie.

## Violation

A status board edited by hand; a summary document that restates the record without pointing
at it.

## Conformance

Checked today: `status` renders from the record on demand. Direction: every rendered view
carries the hash of the record state it was rendered from.
