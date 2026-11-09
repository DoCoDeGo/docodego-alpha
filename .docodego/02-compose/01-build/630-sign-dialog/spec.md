---
name: 630-sign-dialog
type: unit
status: scored
---

# 630-sign-dialog

## intent

The founder's ruling: signing should not be a manual terminal
activity — where the harness supports it, the confirmation should
surface as a popup with simple approve / amend / reject options.
The law's answer: the CLI already owns the question, so the grammar
grows and harnesses render it. The interactive prompt speaks three
answers — approve (sign as shown), edit (supply a typed identifier
or role, see the amended act, confirm it once), reject (nothing
appended, DG-U118) — and the AGENTS.md sign bullet teaches the
contract harnesses render: the CLI's question is the act, show it
whole. The guardrail holds: the CLI stays the asker; `--yes` and
the headless refusals are untouched; the receipt shape stays
pinned; a batch keeps its single approve/reject ask (per-unit
amend is the picker path).

## scope

In: the confirmation dialog in `apps/cli/src/commands/sign.ts`
(three-answer prompt, the edit path re-resolving identity/role and
confirming the amended act once, the `parseConfirm` grammar helper
exported for pins); the help text; the AGENTS.md sign bullet (the
payload hop 30 → 31: migration entry, teach, mirror row, the live
record upgraded, bundle rebuilt); a3 pins on the grammar. Out: the
batch contract (approve/reject only); the receipt and ledger shapes;
`--json`; the headless rails (DG-U118 refusals stand); sign-off.

## acceptance

- The interactive prompt offers approve / edit / reject; edit asks
  typed identifier and role (empty keeps current), re-shows the
  amended act, and one confirmation closes it; reject appends
  nothing. The grammar helper parses all three verbs plus the
  legacy y/yes/N forms (pins).
- The headless world is byte-unchanged: `--yes` signs, non-TTY
  without `--yes` refuses DG-U118, `--json` unchanged.
- The AGENTS.md sign bullet teaches the three answers and the
  render-whole rule; the payload hops 30 → 31 cleanly; the battery
  is green in the committed state.
