---
id: ST-4
title: Simplicity of Spec
pillar: document
stream: refine
severity: veto
enforced-by: lint — a size limit per unit; criteria pointing at different decisions flagged as a likely split
introduced-in: 1.0.0
status: active
---

# Statute 4 — Simplicity of Spec

*Movement: Document · Stream: refine*

## The law

Published: "Complexity in a specification signals unclear intent. Simplify before
proceeding."

Complete as published.

## Violation

"Adding requirements without reviewing whether existing ones still apply."

## Limits

Some complexity belongs to the problem (payments, tax, medical rules). Split the complexity
you can; name and keep the complexity that belongs to the problem. "Signals" is honest: a
sign, not a proof. Most specs fit on one page; a spec of many pages is usually several
stories.

## Conformance

Checked today: a size limit per unit; acceptance criteria pointing at different decisions
are flagged as a likely split. Direction: the tool suggests a split when criteria cluster.
