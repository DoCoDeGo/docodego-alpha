## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Ruled: the confirmation surfaces as the harness can show it —
approve / amend / reject — with the CLI staying the asker. The
grammar lands in the prompt itself; harnesses render the CLI's
question (the whole act) as the dialog. Amend means what the
founder needs it to mean at the founder tier: switch to a typed
identifier or adjust the role, then confirm the amended act once —
which is also the confirming act the provisional marker names.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: The suite cannot spawn a TTY, so the interactive loop is pinned
through its grammar: `parseConfirm` is exported and its branches
are facts (approve/edit/reject plus the legacy y/yes forms). The
headless rails already have pins (DG-U118, --yes) and stay
byte-unchanged — their facts re-run green. The edit path's
identity re-resolution goes through resolveIdentity, whose typed
shape is already pinned.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The amended act is shown again and confirmed once — the law's
one-confirmation-per-shown-act, not two confirmations of one act:
the edit produces a new shown act. Reject at either ask appends
nothing (DG-U118, the existing refusal). The batch keeps one
ask: amend is per-unit by design (the picker path), and a batch
edit would be ambiguous about which unit changed. The payload
hops because the AGENTS.md sign bullet must teach harnesses the
render-whole rule — the teach anchors on the picker sub-bullet.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Trusting a harness-asserted "approved" flag without the
interactive path (the CLI asks, always); changing the receipt or
ledger shapes; auto-reprompting on a bad answer (any
non-approve answer declines honestly — nothing appended);
touching sign-off or the batch amend.

- GQ-AC1 asked: Criterion: 'The interactive prompt offers approve / edit / reject; edit asks typed identifier and role (empty keeps current), re-shows the amended act, and one confirmation closes it; reject appends nothing. The grammar helper parses all three verbs plus the legacy y/yes/N forms (pins).' — how is this verified end-to-end?
  answered: signOne's confirmation block: three-answer prompt; the edit arm
asks identifier and role (empty keeps), re-resolves through
resolveIdentity, re-shows the amended act, confirms once;
reject/anything-else declines with nothing appended.

- GQ-AC2 asked: Criterion: 'The headless world is byte-unchanged: `--yes` signs, non-TTY without `--yes` refuses DG-U118, `--json` unchanged.' — how is this verified end-to-end?
  answered: a3 facts: parseConfirm maps y/yes→approve, e/edit→edit,
n/anything→reject; the legacy declined-at-prompt pin still green;
--yes and non-TTY refusals byte-unchanged.

- GQ-AC3 asked: Criterion: 'The AGENTS.md sign bullet teaches the three answers and the render-whole rule; the payload hops 30 → 31 cleanly; the battery is green in the committed state.' — how is this verified end-to-end?
  answered: AGENTS.md's sign bullet gains the three answers and the
render-whole rule (teach anchor-matched, mirror row appended by
the registry parse); bundle:verify clean at 31; doctor healthy;
the battery green in the committed state.


verdict: pass
