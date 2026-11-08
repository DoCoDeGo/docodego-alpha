---
name: 010-canon-spec-7
type: epic
status: scored
---

# 010-canon-spec-7

## intent

Spec 7 is the seventh law-keeping batch: the normative areas the research
cycles commissioned, written into the spec tree and enforced where the
spec declares mechanical. The batch carries ten areas — the launch gate
and founder-signed tiers (the Part 11 / QP e-signature model from the
borrowed-trust research), rules planting, the nine-skill shelf (27
bundled / 9 authored, packs opt-in), the stack standard, the ICS 2.0
scorer per the founder's redesign ruling (verbatim, 2026-11-08: "we
should always strive to improve and do better, nothing is set in stone.
ICS in my opinion needs a significant uplift and redesign. Same goes for
other similar scorers grillers etc. We should be willing to add more
dimensions if they make sense responsibly."), the version transition
table, the governance pass, proof semantics, and status rails — plus the
surgical backlog the session accumulated: §12's init --force downgrade
Math.max, registry contiguity, vocabulary stomp guard, and DG-C002 (the
proof-path checker misreading schema identifiers as paths). The batch is
an epic because ten areas are ten delivery units: one commit each, the
spec tree amended per batch through canon's own cycle, and ICS 2.0
landing as a founder-review proposal, never a silent replacement — the
four-dimension form stays normative until the founder accepts.

## children (delivery order)

1. spec7-surgical — §12's three defects + DG-C002, each with a proof;
   small, first, because clean gates unblock everything after.
2. spec7-proof-semantics — proof semantics + status rails as law: what a
   proof is (a path that exists; failure is evidence), how statuses move.
3. spec7-ics-2 — the redesign proposal: satisfiability as a gate-level
   check, deterministic checks first, judged dimensions marked honestly
   as judged (CodeJudgeBench: LLM judges are unstable). Ends at founder
   review — acceptance is the founder's, not the loop's.
4. spec7-launch-gate — the launch gate law + founder-signed tiers
   (delivered → launch-passed → founder-signed), the e-signature model.
5. spec7-transition-table — the H2 versioning blueprint's transition law
   into the spec tree (the registry, skip-distance, the three axes).
6. spec7-shelf-and-stack — rules planting + the nine-skill shelf + the
   stack standard as law and CLI surface.
7. spec7-governance-pass — the governance pass law, closing the loop.

## scope

In: the seven children above, each through the full loop; spec-tree
amendments per law batch (canon amend → build → diff's suggested bump
honored or explicitly declared otherwise → doctor → publish into a
scratch site); the CLI gates enforcing what the spec declares mechanical.
Out: anything the founder has not commissioned (mission, naming, money,
taste stay founder-held); rewriting accepted law wholesale (amendments
are per-law, append-anchored); hosting the published site.

## acceptance

- AC1 — every child lands through the loop (spec → grill → score →
  proofs → deliver), one commit each, with its commissioning constraint
  recorded in its spec.
- AC2 — each law batch reaches the spec tree via the amendment cycle and
  the canon gates stay green after every landing: lint, verify, coverage,
  diff, build byte-identical, doctor green, publish clean into a scratch.
- AC3 — ICS 2.0 lands as a founder-review proposal with deterministic
  checks first and judged dimensions marked honestly; the four-dimension
  form remains normative until the founder accepts.
- AC4 — the surgical backlog is cleared: init --force downgrade, registry
  contiguity, vocabulary stomp guard, and the DG-C002 proof-path grammar
  each fixed with a proof.
- AC5 — the epic closes with a founder-facing summary of what changed in
  the spec tree, one page, plain English (statutes over jargon).

## threats

- Scope creep into a docs engine — the anti-goal. Mitigation: every new
  law names its enforcer in the spec tree; a law the tool cannot enforce
  at least names its conformance check; coverage stays at or above its
  current floor (83% weighted / 88% veto).
- ICS 2.0 drifting into unstable LLM-judge territory. Mitigation: the
  redesign constraint is in the intent, deterministic first, judged
  dimensions honest, founder review is the gate.
- Law text outrunning the CLI. Mitigation: each child's spec carries the
  enforcement mapping before the text is written; doctor and the coverage
  gate hold every landing.

## priority reorder (appended 2026-11-08 on the founder's second-sitting directive)

The founder's directive (verbatim:
`01-finding/founder-directive-2026-11-08-b.md` in the studio record;
findings: `docs/research/record-tooling-research-2026-11-08.md`)
commissioned three new children and reordered priority. Delivery order
is now:

1. spec7-surgical — ✅ delivered (e3b9aa5).
2. **spec7-naming** — ✅ delivered (ecd9a72): prefixes landed live, the
   rule planted in AGENTS.md, `docodego new` auto-assigns, record v10.
3. **spec7-audit** — ✅ delivered (ece771e): the RHA umbrella command
   with GOV-001..005, the checklist ledger, `--rotate` under the
   archive law, trace scanning archives.
4. **130-grill-scaffold** — NEW, promoted (cycle 95): `grill
   --scaffold` + fail diagnostics that name the missing ids and the
   expected count, both answers formats in --help, the scored→grilled
   hint. The quirk investigation (Finding 7) priced it: three failed
   grill rounds in the record, two independent agents bitten, total
   adopter exposure, S/M effort.
5. **spec7-bundling** — the allowlist inversion (a versioned
   payload manifest is the product/studio boundary) plus the six
   enforcement rules from the bundling investigation (retire step,
   restore-vs-create, mirror-refresh pairing, AGENTS.md version
   binding, pack-voiced AGENTS.md exclusion, `.new` lifecycle).
6. spec7-proof-semantics — scored, drafting pending (was child 2).
7. spec7-ics-2 (was child 3; the investigation strengthened the drift
   evidence: spec defines four dimensions with floors, tool ships five
   passes enforcing neither).
8. spec7-launch-gate (was 4) · 9. spec7-transition-table (was 5) ·
   10. spec7-shelf-and-stack (was 6) · 11. spec7-governance-pass (was 7).

The original children list above stands as the commissioning record;
this section supersedes its order only.
