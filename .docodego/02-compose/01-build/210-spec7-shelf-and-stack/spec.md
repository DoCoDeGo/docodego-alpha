---
name: 210-spec7-shelf-and-stack
type: unit
epic: 010-canon-spec-7
status: delivered
---

# 210-spec7-shelf-and-stack

## intent

The epic's child names three things as one unit: rules planting, the
nine-skill shelf, the stack standard — "as law and CLI surface." The
research decided the shelf (27 bundled / 9 authored, packs opt-in), the
rules layer (five invariant rules, each with reader / fails-when /
enforced-by, a rule without a living enforcer is furniture), and the
stack standard (web ⇒ TypeScript end-to-end, one package manager,
typecheck in the verify path). Today the payload ships nine method skills,
no rules at all, and nothing checks a stack. This unit lands the nine
authored skills, plants the rules layer, and wires the two mechanical
rules into `check` — the craft floors from the audit's Tier 2 and the
authored half of the decided shelf.

## scope

In: nine authored skills at `.agents/skills/` (six bundled:
security-baseline-for-ai-code, destructive-action-guard,
reward-hacking-detection, supply-chain-evidence, incident-record-writing,
docs-publishing; three auto-add class: tech-stack, docodego-payments,
research-verify — shipped in the payload, planted on trigger or explicit
`skill add`, never by default; trigger-precise descriptions per the shelf
hard rule); a `auto-add` class in the skill index and `skill list`;
`.agents/rules/` — five invariant rule files + the README map, planted by
init and carried by the upgrade plan; `check` gains the tree scans (rules
floor DG-C010, stack scan DG-C008, untracked-source scan DG-C009 —
warnings with file evidence); explain pages for the three codes; the law
in the spec tree (`spec/record/the-shelf.md` — the shelf policy, the rules
layer, the stack standard); the trail links it; the canon tree bumps to
1.0.4 (1.1.0 stays reserved for the pending amendment batch);
recordVersion 14 (migration notes the shelf + rules; rules ride the
upgrade plan create-only; AGENTS.md teaches the layer); the transition
table gains its v13→v14 row (200's hop-for-hop fact demands it).
Out: the thirteen craft-skill ports toward the decided 27 (a later pass);
the auto-add trigger machinery and profile changes (skills join no
profile this unit); the packs registry; launch-gate checklist items; new
EL laws (the law-ification rides the 1.1.0 amendment batch with founder
sign-off).

## acceptance

- AC1 — the nine authored skills exist with trigger-precise descriptions
  (each names when to use it), version 1.0.0, grounded in the research
  findings they answer; PROVENANCE.md carries their rows; the bundle
  regenerates with all nine and `docodego skill list` shows them, the
  three auto-add ones marked.
- AC2 — `.agents/rules/` holds the five invariant rules + README, each
  rule with reader / fails-when / enforced-by frontmatter; init plants
  them and the upgrade plan carries them create-only.
- AC3 — `docodego check` runs the tree scans: a rule whose enforced-by
  names nothing live is furniture (DG-C010); plain-JS source beside a
  typed stack warns (DG-C008); untracked source files warn (DG-C009);
  all three are warnings with file evidence, never errors.
- AC4 — the law lands: `spec/record/the-shelf.md` states the shelf policy
  (27 bundled / 9 authored / packs opt-in, the trigger-precision hard
  rule, the ~8-skill dispatch floor), the rules layer and its furniture
  doctrine, the stack standard; the trail links it; canon lint/verify
  stay green; the tree bumps to 1.0.4 with the log row closing SP-V004's
  circle.
- AC5 — recordVersion 14: the bundled template bumps, MIGRATIONS gains
  the contiguous hop (notes record the shelf + rules), the transition
  table gains the v13→v14 row, and the conformance suite binds the new
  surfaces (index classes, scan fixtures) hop for hop with the registry.

## threats

- Bloat — nine skills of filler posing as craft. Mitigation: the shelf
  hard rule (trigger-precise description or it does not bundle) is AC1's
  check, and each skill body names its evidence discipline, not vibes.
- Rules as furniture — planting rules whose enforcers do not exist.
  Mitigation: the two mechanical rules' enforcers ship in the same unit
  (DG-C008/009); the two launch-gate-adjacent rules declare `practice:`
  with their named instruments — the floor accepts practice, nothing
  else.
- Version-axis confusion — recordVersion 14 touching the reserved 1.1.0
  spec batch. Mitigation: canon moves 1.0.3 → 1.0.4 (patch), 1.1.0 stays
  free; AC4 asserts the pair closes.
