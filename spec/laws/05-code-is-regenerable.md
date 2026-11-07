---
id: ST-5
title: Code Is Regenerable
pillar: compose
stream: enhance
severity: veto
enforced-by: lint — the spec version changes first; check — regenerated work re-runs every original acceptance test
introduced-in: 1.0.0
status: active
---

# Statute 5 — Code Is Regenerable

*Movement: Compose · Stream: enhance*

## The law

Published: "Preserve logic, not syntax. Regenerate from improved intent."

Completion †: "Preserve logic, not syntax. Regenerate from improved intent, or refactor, or
patch, in proportion to the change. Regenerable never means disposable."

## Violation

*Manually editing generated code "just this once".*

## Limits

The published sources disagreed ("disposable" against "does not mean disposable"), and the
framework's later version moved to a response in proportion to the change. Generation is not
compilation: the same spec can yield different code, so regenerated work is proved again in
full. Data, migrations and external contracts are never regenerated.

## Conformance

Checked today: the spec version changes before the regeneration; the record shows the
response in proportion to the change. Direction: the tool refuses regeneration whose
original acceptance tests were not re-run.
