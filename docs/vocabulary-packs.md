# Vocabulary packs

Status: **landed in v0.7.0 (record spec 5).** Three packs ship built in —
`plain`, `agile`, `babok` — embedded in the CLI as authored data at
`apps/cli/vocabularies/<name>.json`, validated at bundle time by
`src/record/vocabulary.ts` (one law, three enforcement points: the bundle
gate refuses an invalid pack, conformance asserts every shipped pack passes
and plants byte-identically, and grill/init consume packs only through its
type). `init --vocabulary <pack>` is the only entry: the dialect is chosen
at birth, recorded in the manifest, and never re-voiced.

## What a pack is

A vocabulary pack is a **dialect for the record layer**. The structure is
fixed — four movements, sixteen streams, four gates, one tracker — but the
words that greet the reader can change. A solo builder should not have to
translate "sprint review" in their head; a business analyst should meet
"elicit, analyse, specify" where they expected "discover, refine, plan".

The record's streams were named agile-first from the start (option 01 of the
process-model research — a note that, as a defect, ended up planted as the
record's front door; fixed in the same round). The research documented
**eight** industry frames, each mapped to an adoption audience; three ship
built in, the other six stay as proven on-demand examples:

| pack | ships | who it speaks to | dialect |
|---|---|---|---|
| `plain` | built in | a solo builder and their agent | no ceremony — intent, proof, a loop that keeps you honest |
| `agile` | built in | product owners | the ceremonies named: refinement, planning, review, retro |
| `babok` | built in | business analysts | elicit, analyse, specify, verify, validate, approve (BABOK v3) |
| `dual-track` | on demand | product managers | discovery track / delivery track — nothing enters build unvalidated |
| `waterfall` | on demand | management | requirements → design → implementation → V&V → maintenance, baselines and change control |
| `double-diamond` | on demand | designers | discover, define (the signed brief), develop, deliver — iterate, iterate, iterate |
| `lean-startup` | on demand | founders | build–measure–learn; validated learning as the unit of progress |
| `itil` | on demand | enterprise IT | service transition under change control; the improvement register with owner + review date |
| `dora` | on demand | engineering management | the four keys — thin, evidence-based, person-blind |

The six on-demand packs live in the studio research record
(`temp/research/v2/vocabularies-on-demand/`). Promoting one is: drop the
JSON into `apps/cli/vocabularies/`, pass the validator (the build fails
otherwise), bump the record spec, no code change. Nine built-in dialects
would bloat the init decision without earning it.

Every pack's words come from the research's own recorded vocabulary tables
(`temp/research/process-models/`, studio repo) — the source's own words,
not invented ones.

## The law: words change, the contract does not

In **every** pack, byte-identical:

- **Paths** — `.docodego/01-document/01-discover/` and all sixteen; the CLI
  composes them from `src/record/streams.ts`, so packs can't move them even
  by accident.
- **File names** — `spec.md`, `grill.md`, `score.md`, `proofs.md`,
  `delivered.md`, `tracker.md`, `skills-lock.json`.
- **Statuses** — `draft`, `grilled`, `delivered`.
- **Command names and flags** — `new`, `grill`, `score`, `deliver`, `trace`,
  `doctor`…
- **Question ids** — `GQ-1…GQ-4` and `GQ-AC<n>`; phrasing may differ, ids
  never. `lastVerdict` parses the `verdict:` line, not the wording, so grill
  records stay machine-readable in any dialect.
- **Diagnostic and exit codes** — `DG-*` and every exit code.
- **Schemas** — manifest and lockfile fields (the manifest gains exactly one
  optional field, `vocabulary: <name>` — additive, absent in canonical
  records).
- **Spec section headers** — `## intent`, `## scope`, `## acceptance`,
  `## threats`. The passes parse these; they are contract, not vocabulary.
- **The sixteen statutes** — recorded verbatim, founder text. A pack never
  re-voices them; it plants a companion glossary beside them
  (`.standard/vocabulary.md`).

## What a pack carries

`apps/cli/vocabularies/<name>.json` — pure data, strict schema (unknown
fields are violations, so a typo cannot ship silently):

| slot | overrides | constraint |
|---|---|---|
| `summary` | audience positioning, shown at init | non-empty |
| `law` | the pack's restatement of the law | non-empty |
| `movements.<id>.gloss` | the human gloss on each AGENTS.md movement line | exactly the 4 movements |
| `streams.<id>` | each stream's one-line README | exactly the 16 ids; must keep `[Phase] … · producer: X → consumer: Y`; every numbered reference must resolve |
| `gateQuestions.GQ-*` | the four gate questions' phrasing | exactly `GQ-1…4` |
| `glossary` | dialect ↔ canonical bridge, planted as `.standard/vocabulary.md` | ≥ 10 entries |

The validator (`src/record/vocabulary.ts`, zero dependencies) imports the
real `ALL_STREAMS` from `src/record/streams.ts` rather than restating the
ids: one source of truth, code and packs cannot disagree. It proved itself
during review: all nine packs pass; a deliberately broken pack fails with
26 targeted violations. Pairwise, the nine voices are distinct — nine
distinct gate-question sets, nine distinct stream voices — with only three
stream lines shared anywhere, all near-universal moments ("cut the
release", "production tells the truth").

## Honest limits (v1)

- The **CLI's own output voice stays canonical** — `doctor`, `score`,
  `deliver` print their current English regardless of pack. Packs re-voice
  the *planted record*, not the tool's stdout. Re-voicing tool output is a
  possible later increment, deliberately out of scope.
- The glossary bridges words; it does not translate records. A tracker
  written under `plain` reads perfectly under `agile` — the paths, ids, and
  statuses are shared — but the prose accents differ. That is a feature:
  dialects are per-record choices, not per-entry switches.
- **Adoption is init-time only** (record spec 5). An existing record is
  never re-voiced — `init --force --vocabulary` is refused with
  "chosen at birth". The conservative option (a) from the review plan was
  taken; an in-place `docodego vocabulary <pack>` remains a possible,
  small, append-only later increment if the founder ever asks for it.
- Packs don't rename anything a machine keys on. That is the whole point.

## How it landed (record spec 5)

1. **Bundling.** Authored JSON at `apps/cli/vocabularies/` is validated and
   embedded into the payload by `scripts/bundle.ts` — the packs travel
   inside `docodego.js` and every binary, the same way the record templates
   already travel. Because bundled content changed, the bump guard applied:
   `recordVersion` 4 → 5.
2. **`init --vocabulary <pack>`** — optional flag; no flag = the canonical
   voice, byte-identical to v0.6.0's plant (checked by conformance). Plants
   the pack's stream READMEs, patches the freshly planted AGENTS.md movement
   glosses (a user-customized AGENTS.md is never touched), plants
   `.standard/vocabulary.md`, records `vocabulary` in the manifest.
   `grill` asks the pack's phrasing of GQ-1…4 under the canonical ids.
3. **Conformance** — ~20 new checks: pack lineup exactly `[agile, babok,
   plain]`; validator passes per pack; exact 16-stream and 4-id coverage;
   `init --vocabulary babok` plants byte-for-byte; AGENTS.md glosses carry
   the pack's words with tags intact; statutes untouched; grill re-voices
   under `GQ-1`; unknown pack exits 2; existing-record pack refused; the
   default plant carries no vocabulary key and asks the canonical question.
4. **The front door fix rode the same spec bump** — `.docodego/README.md`
   is now the record index (read order, shape, law, tracker pointer), not a
   research note. Migration 4 → 5 is a documented no-op: no paths change,
   your words are yours.
