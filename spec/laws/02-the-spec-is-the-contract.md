---
id: ST-2
title: The Spec Is the Contract
pillar: document
stream: plan
severity: veto
enforced-by: deliver — G1, G2, G3 (build refuses a spec below the floor or not approved)
introduced-in: 1.0.0
status: active
---

# Statute 2 — The Spec Is the Contract

*Movement: Document · Stream: plan*

## The law

Published: "Every interaction begins with a structured, approved specification."

Completion †: "Sketches are free until they graduate."

## Violation

"Starting composition from a verbal brief."

## Limits

"Every interaction", read literally, covers questions, spikes, sketches and one-line fixes,
and nobody works that way. The published small-team form is the honest one: a spec for a
small task may be a paragraph with three acceptance criteria. In an emergency the spec
follows the patch (ST-1).

## Conformance

Checked today: nothing enters the build without a spec that has passed its gate — the
deliver gate refuses an incomplete spec, a score below the floor, or a grilling that did not
pass. Direction: approval by a named person recorded in the spec frontmatter.
