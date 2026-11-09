# delivered — 630-sign-dialog

## what landed

The sign confirmation speaks the founder's three verbs (the ruling,
2026-11-09): the interactive prompt is now
`sign and approve? [y]es / [e]dit identity or role / [n]o` —

- **approve** signs the act as shown.
- **edit** asks a typed identifier and a role (empty keeps the current),
  re-resolves the identity through the one resolver, shows the amended
  act, and confirms it once — the confirming act for a provisional
  marker is now one dialog away.
- **reject** — and any non-approve answer at either ask — appends
  nothing (DG-U118 stands).

The guardrail the founder named holds: the CLI stays the asker. A
harness renders the CLI's question — the whole act, evidence hashes
included — as the dialog; the AGENTS.md sign bullet now teaches that
contract ("a harness may render the prompt as a dialog, but the CLI's
question is the act: render it whole"). The receipt and ledger shapes
are byte-unchanged; `--yes` and the headless refusals stand; the batch
keeps its single approve/reject ask (per-unit amend is the picker path).

## where

- `apps/cli/src/commands/sign.ts` — the dialog in signOne (showAct
  closure, three-answer grammar, the edit arm, act/roleMarked computed
  after the dialog), `parseConfirm` exported for pins
- `apps/cli/src/cli/help.ts` — the sign section speaks the three verbs
- `apps/cli/src/conformance/a3-tiers.ts` — three grammar pins (485 total)
- `apps/cli/src/versioning/migrations.ts` — the v30 -> v31 entry +
  `teachSignDialog` (anchor-matched on the picker sub-bullet's tail)
- `AGENTS.md` (live + payload) — the sign bullet's dialog sub-bullet
- `canon/record/version-transition.md` — the v30 -> v31 mirror row

## how to run

Interactive (a TTY — or a harness rendering the prompt as a dialog):
`docodego sign <unit>` — the act shows whole, then answer
y / e (identifier, role, confirm the amended act) / n.
Headless: `docodego sign <unit> --yes`. Batch:
`docodego sign --all` (one ask) or `docodego sign --all --yes`.
## delivered 2026-11-09

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 70/100 — matches the recorded block (spec-sha cd6cfcd79ea7fdc0); latest verdict: pass; proof: canon/record/version-transition.md
