# The rules layer

*A rule without a living enforcer is furniture — and the repo can tell
the difference mechanically.*

Every rule file carries three fields: who reads it, what failure it
prevents, and what holds it (`enforced-by`). The floor is mechanized:
`docodego check` validates the frontmatter and the enforced-by target —
a target that names nothing live lists the rule as furniture.

| rule | enforced-by | verdict |
|---|---|---|
| standard-stack-default | `check:stack-scan` | enforced (warning) |
| no-untracked-source | `check:untracked-scan` | enforced (warning) |
| reduced-motion | practice — the launch-auditor checklist's reduced-motion item | practice |
| privacy-at-network-layer | practice — the launch-auditor checklist's privacy item | practice |
| interruption-safety | practice — AGENTS.md hard rule 9 | practice |

Deliberately not planted: verbatim-intent and records-append (already
the planted AGENTS.md honesty law — a rule that repeats a law is
duplicated law); look-before-closing (lives in docodego-demonstrate step
4 and the launch gate's visual evidence); local-gate-over-ci (studio
furniture, not product law).

Deletion is human-confirmed: rules are law, and auto-deleting law is an
interruption-safety violation by definition.
