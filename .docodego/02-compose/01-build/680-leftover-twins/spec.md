---
name: 680-leftover-twins
type: unit
status: founder-signed
---

## intent

670 made the upgrade walk honest about plan conflicts — but the
founder immediately caught what it missed: every walked product held
FOUR `.new` twins while the summary claimed two. The skill-teach path
(`plantSkill` in skills/lock.ts) plants twins beside installed skills
at older versions, and the reconciliation only walked plan conflicts.
The summary undercounted the merge burden by exactly the files a real
operator would trip over. The fix: after reconciling plan conflicts,
sweep the record tree for every remaining `.new` twin, whatever
planted it — count each into the summary's twins-remaining and
residual totals, and name skill twins with the lockfile-way guidance
(`docodego skill add <name> --force` when the kept copy is unmodified,
else merge knowingly) instead of the plan-conflict wording. The
summary must match the disk.

## scope

In: `upgrade.ts` apply() — the post-reconciliation leftover sweep
(reusing `walkFiles`, skipping `.git` and `node_modules`; plan-conflict
twins excluded via the reconciled set); a2-edges pins (a seeded skill
twin is named with residual and skill-add guidance; the summary shape
counts it). Out: `plantSkill` itself (its plant-time message was true
when printed; changing its contract would ripple into `skill add`);
auto-updating skills (force is the operator's act); plan-conflict
reconciliation (670's, already landed); the payload (no bundled bytes
change — bundle:verify must stay clean).

## acceptance

- A `.new` twin the plan did not plant (a skill install at an older
  version) is named in the apply output with its residual line count
  and the `docodego skill add <name> --force` guidance.
- The walk summary's `twins remaining` count and `carrying N differing
  line(s)` total include leftover twins — the numbers match the disk.
- Plan-conflict twins are not double-counted (the reconciled set
  excludes them from the sweep).
- The battery is green; bundle:verify stays clean (no payload change).
