## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Four message renderings from the test round's nits list: init's
planted count splits into record/agent/skills; status's counter
line is labeled "by current status"; new names the scaffolded unit;
check's green line states its scope. All renderings — the data was
already true; the words made it read wrong.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance pins assert the new wordings (the split planted line's
three counts; the label on the counter line; the unit named in
new's output; the scope in check's clean line) and the JSON shapes
stay byte-compatible (envelope pins already cover check/status/new
--json; the init --json created array is untouched).

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The split counts drifting from truth — each count derives from the
same array (or list) the planting loop fills, so the numbers cannot
disagree with what was written. Breaking the pinned old wordings —
grepped every pin that matched the old bytes and updated it in the
same unit. A JSON shape change — out of scope, pinned unchanged.
Payload drift — pure renderings in command files, bundle stays at
27.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Any payload or record-contract hop; JSON payload changes; the
founder-tier marker (held for the founder); score/scaffold work
(landed in 560); new nits not on the round's list (scope creep).

- GQ-AC1 asked: Criterion: 'init's planted line reports record files, agent files, and skills as separate counts (the numbers sum to what was planted).' — how is this verified end-to-end?
  answered: In a fresh scratch record, init's stderr carries a planted line
with three separate counts (record files under .docodego/, agent
files, skills) whose sum equals created.length plus the skills
list — and no bare "N file(s)" without the split.

- GQ-AC2 asked: Criterion: 'status's counter line carries the "by current status" label.' — how is this verified end-to-end?
  answered: status's counter line on the scratch record contains
"by current status" between the units total and the tier counts.

- GQ-AC3 asked: Criterion: 'new's human output names the unit id and the spec path together.' — how is this verified end-to-end?
  answered: new's stdout names the unit (e.g. "010-my-unit") and the spec path
together — a later command can be copy-pasted from the line.

- GQ-AC4 asked: Criterion: 'check's clean line states the verified scope (units + zero findings); its exit codes and JSON shape are byte-unchanged.' — how is this verified end-to-end?
  answered: check on a healthy record prints "record holds together" with the
unit count and "0 findings"; check --json's envelope is unchanged
(schema docodego/check/v1); exit codes unchanged.

- GQ-AC5 asked: Criterion: 'Full battery green: check, conformance, bundle verify clean at spec 27, pnpm run doctor, docs fresh, build 11/11.' — how is this verified end-to-end?
  answered: The battery in the committed state: check 0 errors, conformance
all green, bundle verify clean at spec 27, pnpm run doctor all
healthy, docs fresh, build 11/11 — each named in proofs.md.


verdict: pass
