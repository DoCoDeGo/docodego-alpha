---
name: 450-sign-flow
type: unit
status: delivered
---

# 450-sign-flow

## intent

The founder's ruling (2026-11-08, verbatim in cycles.md): signing a unit
must not demand typed personal details — `docodego sign` derives the
signer's identifier from the environment (git or system, the mechanism
`sign-off` already runs), shows the whole act, and takes one confirmation —
sign and approve — while every mention of "legal name" becomes "legal
identifier or handle", including the EL-34 law text, which amends through
the tree's own procedure.

## scope

In: `sign` gains derived identity + one-step confirmation (`--yes` for
non-interactive use; a declined or unconfirmable prompt appends nothing,
DG-U118); the wording sweep — help, args usage, explain pages (DG-U111
re-worded, DG-U118 added), the launch hint, `sign-off`'s "typed" line, the
payload's AGENTS.md template (recordVersion 23 → 24 with a teach step for
planted records, including the founder-directed mitigation: the `docodego
new` line gains the stream hint — implementation units take
`--stream 02-compose/01-build` — after this session's mis-homed scaffold),
this repo's AGENTS.md, USAGE/README; the EL-34 amendment
(1.2.3-EL-34: "a legal name, recorded verbatim" → "a legal identifier or
handle, recorded verbatim") walked through how-to-amend — scaffold, grill,
sign-off with the founder's verbatim words, law flip, log row, SPEC stamp,
canon build, dist in the commit; conformance updated and extended (derive
path, `--yes`, the non-TTY refusal, the re-worded receipt).

Out: who may sign (roles and the launch-passed precondition untouched); the
amendment sign-off flow (already derives identity); any other command's
identity handling; statutes and published words.

## acceptance

- AC1 — `docodego sign <unit>` with no `--by` signs a launch-passed unit:
  the receipt names the derived identifier and its kind (git or system),
  proven by a conformance check over a scratch record.
- AC2 — a typed `--by "<identifier>"` still overrides the derivation and
  is quoted verbatim in the receipt, proven by the existing conformance
  flow (fixture identity "Testy Founder") continuing green.
- AC3 — headless use stays first-class: `--yes` signs with no prompt, and
  a non-TTY run without `--yes` refuses with DG-U118 and appends nothing
  (the signatures ledger's line count asserted unchanged), proven by two
  new conformance checks.
- AC4 — the wording census: `grep -rn "legal name"` over apps/ spec/
  docs/ (sources, not dist) names only history files — accepted amendment
  text, migration teach records, this unit's own record — while help,
  args usage, explain pages (DG-U111 re-worded, DG-U118 added), the
  launch hint, sign-off's typed line, the payload template, this repo's
  AGENTS.md, USAGE, and the law all read "legal identifier or handle";
  both grep outputs land in proofs.md.
- AC5 — the EL-34 amendment chain verifies cold: canon lint, verify,
  doctor green with SPEC.md stamped 1.2.3 and the manifest rebuilt (dist
  rides the commit); the amendment file preserves the old words and its
  sign-off block carries the founder's words verbatim beside the sha256
  of the exact text signed; conformance green and bundle verify clean on
  the payload bump (spec 24); doctor's axes aligned (payload 24 · spec/
  1.2.3 · delivered 1.2.3).

## threats

- the confirmation prompt could gate scripts/CI that today call `sign
  --by` headlessly -> `--yes` is the non-interactive path, the refusal
  (DG-U118) names it, and conformance pins both directions so the
  migration is caught loudly, not silently
- wording drift between the payload template, planted records, and this
  repo's AGENTS.md -> the payload bump carries a teach step (the v22→v23
  precedent: pure insertion, customized copies keep their words), and
  bundle verify pins the payload boundary
- the law flip drifting from the CLI's actual receipt wording -> the
  amendment and the CLI change land in this one unit; AC4's grep and
  canon verify's command-vs-law check hold them together
