# proofs — 470-dual-use

- AC1 — the inventory exists in the unit:
  `inventory.md` names twelve artifact families (conformance
  fixtures, spec-tree law, proofs, explain pages, demo bundles, the
  record layer, help bodies, migration teach text, vocabulary packs,
  the skills shelf, generated command docs, engine code), each with
  its primary use and either a declared second use naming its
  audience or an honest "none yet" (engine code — recorded as the
  open gap, not papered over). Every second audience is a person
  reading cold: the evaluating adopter, the cold reader of the
  standard, the contributor verifying, the blocked operator, the
  upgrader, the new contributor, the agent reading cold.
- AC2 — the fixtures demo is real and self-describing:
  `docs/fixtures-demo/README.md` curates fourteen byte-verbatim
  suite labels across four acts (the acts: one signature per act;
  the words: yours, never lost; the forward path: never trapped; the
  bytes: shipped is source), each glossed in plain words for a
  stranger reading cold. The page's verification needs no engine
  source: run the suite, each quoted label appears in its output; a
  missing label means the page drifted. The existing publish path is
  untouched — the page ships as the self-describing form the spec's
  scope allows (building a pipeline is out of scope).
- AC3 — the second use declared in the header, the suite unchanged:
  the README's opening lines state primary use and declared second
  use before anything else; the page is curation only — zero checks
  added or rewritten in conformance.ts (the fixtures family's
  first use is load-bearing and untouched), and the suite passes
  exactly as before: 381 checks green.
- AC4 — the teach is drafted and staged, not landed:
  `teach-staged.md` carries the verbatim section text ("The second
  use — anything built here works twice"), the insertion anchor (the
  loop-section closing line of the payload's AGENTS.md template,
  byte-captured at implementation), and the migration sketch (one
  teachDualUse anchor-teacher riding SW-080's v24→v25 hop —
  present-sentinel skip, a .new sibling for customized records,
  idempotent re-upgrade). No payload byte moved in this unit:
  bundle verify clean at spec 24, structure 84668fbecc05 unchanged.
- AC5 — the suite stays green, the gate row is green: conformance
  381 green (no new checks — the demo set mechanizes no new rule),
  `tsc --noEmit` clean in both apps, bundle verify untouched. The
  cycle rhythm runs on this unit too: the metrics gate over this
  unit's own delta passes with zero code delta —

  > METRICS GATE PASS — +0 added / −0 retired (credit 0) · 85
  > file(s), 0 new · ceiling new≤250 growth≤40

  The first green gate row (460's row carries the birth refusal);
  the delta line rides this unit's tracker row. The demo set, the
  inventory, and the staged teach are record-and-docs bytes — the
  gate correctly measures code, and this unit added none.
