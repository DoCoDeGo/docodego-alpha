---
reader: every agent committing work in this repo
fails-when: source-like files sit untracked in git, or a stranger cannot clone and run the verify path
enforced-by: check:untracked-scan
paths:
  - "**/*.ts"
  - "**/*.js"
  - "**/*.py"
  - "**/*.go"
---

# Everything is committed, or it does not exist

A verify path that depends on untracked files is not reproducible by a
stranger — the audit found stub package.json files untracked beside
committed node_modules. Deps are pinned, the lockfile is committed,
`engines` is declared, and `git status` is clean of source-like files.
`docodego check` warns on untracked source (the untracked scan) and the
warning cites this file.
