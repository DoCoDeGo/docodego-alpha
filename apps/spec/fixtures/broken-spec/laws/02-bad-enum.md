---
id: ST-2
title: Bad Enum
pillar: document
severity: fatal
enforced-by: deliver — the fixture gate
introduced-in: 1.0.0
status: active
---

# Bad Enum

A law whose severity is not veto or warn — lint must refuse the invented
value, because severity semantics are load-bearing (veto blocks; warn does not).

## The law

NEVER accept an enum value the schema does not declare.
