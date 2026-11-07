---
id: ST-15
title: Security by Design
pillar: govern
stream: monitor
severity: veto
enforced-by: deliver — G1 (a threat section in every spec); G2 (threat coverage meets its floor)
introduced-in: 1.0.0
status: active
---

# Statute 15 — Security by Design

*Movement: Govern · Stream: monitor*

## The law

Published: "Every specification includes a threat model. No exceptions."

Completion †: "'No new attack surface' is an answer; silence is not."

## Violation

"Starting spec writing without a threat model section."

## Limits

A full threat model for a typo fix is ceremony out of proportion to risk. The completion sets
the smallest honest answer and keeps the absolute. A sketch answers the threat question when
it graduates; in an emergency, it is asked straight after the patch.

## Conformance

Checked today: the spec gate refuses a spec with no threat section (G1) and a score below
the threat floor of 15 of 25 (G2, no dimension at zero). Direction: the tool prompts the
threat question at graduation.
