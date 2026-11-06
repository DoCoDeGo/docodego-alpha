---
name: broken-frontmatter
this line has no colon and is skipped with a diagnostic
type: unit
status: draft
---

# broken-frontmatter

## intent

One malformed frontmatter line becomes a diagnostic; the fields around it
still parse and the body is untouched.

## acceptance

- the malformed line is reported with a position, not swallowed
- `name`, `type`, and `status` are still readable after the skip
