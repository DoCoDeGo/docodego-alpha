---
reader: every agent writing or reviewing source in this repo
fails-when: plain-JS source files sit beside a typed stack, or no typecheck runs in the verify path
enforced-by: check:stack-scan
paths:
  - "**/*.js"
  - "**/*.ts"
  - "**/*.tsx"
---

# The stack defaults to the industry's

Web product means TypeScript end-to-end, one package manager, accepted
framework tooling, and `tsc --noEmit` (strict) in the verify path.
Creativity belongs to the product's face. Plain JavaScript beside a
typed stack is the founding failure this rule exists to prevent —
`docodego check` warns on it (the stack scan) and the warning cites
this file.
