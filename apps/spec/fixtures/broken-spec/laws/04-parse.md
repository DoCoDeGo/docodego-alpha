---
id: ST-4
title "Parse Recovery" — this line has no colon, so it must be skipped
pillar: document
severity: veto
enforced-by: deliver — the fixture gate
introduced-in: 1.0.0
status: active
---

# Parse Recovery

One malformed frontmatter line must not blind the whole check: the parser
reports it positioned, then keeps parsing — title is missing (SP-L003),
everything else still reads.

## The law

Error recovery is the difference between a check and a crash.
