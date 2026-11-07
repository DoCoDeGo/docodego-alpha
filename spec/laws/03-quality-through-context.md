---
id: ST-3
title: Quality Through Context
pillar: document
stream: discover
severity: veto
enforced-by: check — evidence links resolve; lint — assumptions marked assumed or evidenced
introduced-in: 1.0.0
status: active
---

# Statute 3 — Quality Through Context

*Movement: Document · Stream: discover*

## The law

Published: "AI produces correct output when context is complete. Ambiguity causes defects."

Completion †: "Complete context is necessary, never sufficient: prove the output."

## Violation

"Blaming the AI model when the spec was the problem."

## Limits

As published, the line stated a necessary cause as a sufficient one. Models still err with
full context, and more text can make results worse. Asking what the brief left out is the
first question, not the only one. A sketch may run on thin context; the unit it graduates
into may not.

## Conformance

Checked today: assumptions are marked assumed or evidenced; evidence links resolve (EL-18).
Direction: the tool flags claims on the trail whose evidence path is missing.
