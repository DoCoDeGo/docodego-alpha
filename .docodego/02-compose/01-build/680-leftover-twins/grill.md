## grill 2026-11-10

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: 670's promise was that the walk summary matches the disk. The
founder walked into the products and found four twins where the
summary said two — the skill-teach path plants twins outside the
plan, so the reconciliation never saw them. A summary that
undercounts by the exact files the operator must resolve is the
same dishonesty 670 closed. The sweep closes it for every planter,
seen and unseen: whatever planted a twin, the twin is counted.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Pins on the a2 fixture: seed a skill twin (kept copy one line off
the bundled bytes, twin = bundled bytes) in `.agents/skills/`, run
apply, and pin three facts — the output names the twin's path, the
output carries the `docodego skill add <name> --force` guidance,
and the summary's exact shape reports the combined totals (2 twins
remaining carrying 3 differing lines: README's 1 + the skill's 2).
Plus typecheck, full conformance, bundle:verify clean, check green.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The skill twin's wording differs from the plan-conflict wording
because the resolution differs: a skill copy is lockfile-managed —
the current way is `skill add <name> --force`, not hand-merging.
The kept copy's possible hand-edits are honored by the conditional
wording ("if yours is unmodified"). Force stays the operator's act;
the CLI never auto-updates a skill. Plan twins keep 670's taught-
in-place wording. The reconciled set prevents double counting.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Changing plantSkill's contract (ripples into `skill add`, and its
plant-time message was true when printed); auto-forcing skill
updates (the words are the operator's); counting orphans or
plan-conflict twins twice (the reconciled set and the kept-file
guard handle both); a smarter twin classifier (one regex for the
skill name is enough — the sweep's honesty is in counting, not
classifying).

- GQ-AC1 asked: Criterion: 'A `.new` twin the plan did not plant (a skill install at an older version) is named in the apply output with its residual line count and the `docodego skill add <name> --force` guidance.' — how is this verified end-to-end?
  answered: End-to-end: seed `.agents/skills/docodego-loop/SKILL.md` (bundled
bytes with one line changed) and `SKILL.md.new` (bundled bytes) in
the fixture, run upgrade --apply, capture stdout, and pin that it
names `.agents/skills/docodego-loop/SKILL.md.new` with a residual
count — the seeded state is exactly what a real older-version skill
install leaves on disk.

- GQ-AC2 asked: Criterion: 'The walk summary's `twins remaining` count and `carrying N differing line(s)` total include leftover twins — the numbers match the disk.' — how is this verified end-to-end?
  answered: End-to-end: on the same captured stdout, pin the summary's exact
shape — `twins remaining: 2 (carrying 3 differing line(s))` — the
README plan twin (1 line) plus the seeded skill twin (2 lines: one
kept-only, one twin-only), proving leftovers are counted into the
totals and the totals match the disk.

- GQ-AC3 asked: Criterion: 'Plan-conflict twins are not double-counted (the reconciled set excludes them from the sweep).' — how is this verified end-to-end?
  answered: End-to-end: the README twin appears exactly once in the output
(the reconciled set excludes it from the sweep) — pinned by
counting occurrences in the captured stdout; the skill twin
likewise appears once (it is not in the plan).

- GQ-AC4 asked: Criterion: 'The battery is green; bundle:verify stays clean (no payload change).' — how is this verified end-to-end?
  answered: End-to-end: pnpm typecheck exit 0; conformance all green;
pnpm bundle:verify clean at spec 31 (no payload change);
docodego check exit 0 — all four quoted in proofs.md.


verdict: pass
