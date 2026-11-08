---
name: 620-sign-picker
type: unit
status: founder-signed
---

# 620-sign-picker

## intent

The founder's ruling: `docodego sign` without a unit shows the
unsigned — the units sitting at launch-passed, the strict tier
waiting on the founder — and allows selection, including an all
option. The picker is the interactive world: a numbered list, pick
by number or name, or "all"; empty cancels and appends nothing.
`--all` names the batch expressly (headless: `--all --yes`); the
batch shows every act and asks once, then signs each in name order,
continuing past individual refusals and failing if any failed. The
laws hold unchanged: tiers strict (only launch-passed is signable),
one signature per act, the whole act shown, one confirmation, the
founder-tier marker riding derived signings, and `--json`'s shape
fixed (it needs one named unit). Nothing to sign is said honestly
and exits 0.

## scope

In: the orchestrator in `apps/cli/src/commands/sign.ts` (picker,
`--all`, batch, the `askLine` prompt helper, the `markedRole` hoist
shared by single and batch display); `--all` in the flag parser and
Args; the DG-U119 usage page (sign without a target, headless) and
the USAGE line; the help text; the AGENTS.md sign bullet gaining
the picker sentence (payload hop 29 → 30: migration entry, teach,
transition row, the live record upgraded, bundle rebuilt);
conformance pins (headless refusals, the batch, the marker on batch
receipts). Out: the confirmation law (one prompt closes one shown
act — the batch shows all acts and asks once, which is the same
law at batch size); the status value set; the `--json` envelope;
sign-off (it keeps its own contract).

## acceptance

- `docodego sign` on a TTY lists the launch-passed units numbered
  and accepts a number, a name, or "all"; empty input appends
  nothing. `sign --all --yes` signs every launch-passed unit,
  printing each SIGNED line, receipts and ledger rows carrying the
  marker on derived signings; a second target-less run says there
  is nothing to sign and exits 0.
- Headless with no target refuses with DG-U119 naming the
  contract; `--json` with no named unit refuses the same way (the
  envelope is unchanged); `--all` with a unit name is a usage
  refusal.
- The AGENTS.md sign bullet teaches the picker; the payload hops
  29 → 30 cleanly (bundle:verify, doctor axes, upgrade on the live
  record); full battery green in the committed state.
