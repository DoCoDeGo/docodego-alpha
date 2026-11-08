# The record format

This is the contract of the `.docodego/` record layer — everything needed
to read (or write) a record without the docodego CLI. The CLI is how a
record stays true; the format is why any harness can read it.

Conventions: paths below are relative to the record root `.docodego/`.
Files are UTF-8 markdown. Machine-readable identity lives in YAML-style
frontmatter (`---` fenced, one `key: value` per line) at the top of a file.

## Layout

```
.docodego/
  README.md                     the front door — where things stand, what to read next
  skills-lock.json              installed craft, with digests (schema below)
  01-document/                  movement: intent sharpened into plans (DO)
    01-discover/                the record's roots live here:
      intent.md                 the founding brief — verbatim, reader-contracted
      cycles.md                 the numbered, append-only cycle log
      02-refine/ 03-validate/ 04-plan/
  02-compose/                   movement: the increment, kept shippable (CO)
    01-build/ 02-integrate/ 03-enhance/ 04-maintain/
  03-demonstrate/               movement: working proof and release (DE)
    01-demo/ 02-accept/ 03-release/ 04-deploy/
  04-govern/                    movement: the loop closed (GO)
    delivery-log.md             one row per delivered unit, appended by the gate
    01-monitor/
      tracker.md                the append-only event table
    02-measure/ 03-retrospect/ 04-improve/
  .standard/                    reference, not record — never edited in place
    manifest.json               the record's self-description (schema below)
    statutes.md                 the sixteen statutes
    tech-radar.md               the radar
    guidelines/                 pattern guidelines (provenance-local; never bundled)
```

Each stream folder carries a `README.md` stating its producer-consumer
contract. `<stream>/<unit>/` folders are units (below). Sketches live
directly in a stream as `sketch-<kebab>.md`. Nothing else belongs in a
stream — `DG-N003` — with two engine-planted exceptions in
`01-discover/`: `intent.md` and `cycles.md`, the record's roots (planted
by `init` and `upgrade`, create-only, and never unit content).

## Movements and streams

The folder numbers carry the order. Four movements, four streams each:

| movement | streams |
|---|---|
| `01-document` (DO) | `01-discover` · `02-refine` · `03-validate` · `04-plan` |
| `02-compose` (CO) | `01-build` · `02-integrate` · `03-enhance` · `04-maintain` |
| `03-demonstrate` (DE) | `01-demo` · `02-accept` · `03-release` · `04-deploy` |
| `04-govern` (GO) | `01-monitor` · `02-measure` · `03-retrospect` · `04-improve` |

Full stream addresses are `<movement>/<stream>`, e.g.
`01-document/01-discover`. Type homes: an epic lives in
`01-document/01-discover`, a story in `01-document/02-refine` (`DG-F005`).

## Units

A unit is a folder `<stream>/<name>/` (name kebab-case, `DG-N001`)
containing `spec.md` and the marker files its status earns. The spec:

```markdown
---
name: retry-webhook        # must equal the folder name (DG-F003)
type: unit                 # unit | epic | story (DG-F004)
epic: onboarding           # optional link; kebab-case unit name (DG-F006)
story: first-login         # optional link
status: draft              # draft | grilled | scored | delivered (DG-F004)
---

# <name>

## intent          — one sentence: what and why now
## scope           — In: … / Out: …
## acceptance      — "- criterion" list; observable and countable
## threats         — "- threat → mitigation" list
```

### Statuses are earned

`status` is written by commands, never by hand (`DG-F004`, `DG-C003`):

| status | earned by | marker file it requires |
|---|---|---|
| `draft` | `new` (the minted state) | — |
| `grilled` | `grill` (verdict pass) | `grill.md` |
| `scored` | `score` | `score.md` |
| `delivered` | `deliver` (all gates green) | `delivered.md` + `proofs.md` |
| `launch-passed` | `launch` (the launch gates) | `launch.md` |
| `founder-signed` | `sign` (strict tiers: launch-passed first) | `signature.md` |

Statuses move only along the machine (`record-write.ts`'s transition
table): forward moves legal, a landing (`delivered` and above) is
terminal, and exactly one backward move exists — a grill FAIL verdict
on a landed unit demotes it to `grilled`, with a `demoted` tracker row.
A second `deliver` is refused (`DG-U041`): one landing, one row.

`check` verifies the claims: a delivered unit must hold a `proofs.md`
whose paths exist on disk, a `grilled`/`scored` unit must hold its marker,
a status outside the vocabulary fails (`DG-C015`), and every epic/story
link must name a real unit (`DG-C*`).

### Marker files

- **`grill.md`** — append-only; newest block wins. One block per round:

  ```markdown
  ## grill 2026-11-07

  - GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
    answered: Retries failed webhook deliveries up to five times with backoff.
  …
  verdict: pass
  ```

- **`score.md`** — the public breakdown:

  ```markdown
  # score — <unit> — <date>

  | pass | max | scored |
  |---|---|---|
  | completeness | 25 | … |
  | unambiguity | 25 | … |
  | testability | 25 | … |
  | threat | 15 | … |
  | anti-gaming | 10 | … |
  | total | 100 | … |

  total: <n>/100
  spec-sha: <16 hex>
  floor: 60 — deliver refuses below the floor.
  ```

  Scores append: a re-score writes a new dated block, the last block
  wins, and each block binds the spec it scored by `spec-sha` — the gate
  recomputes the score and the sha, so a spec edited after scoring (or a
  hand-edited `total:`) fails G2 instead of landing on a borrowed verdict.

- **`proofs.md`** — list items naming proof files; the grammar (because it
  is law): from each item, every backticked span and the first bare token
  are candidates, and a candidate counts as a path when it carries a `/` or
  ends in a file extension, with no inner whitespace. Narration contributes
  nothing. At least one extracted path must exist on disk at
  `check`/`deliver` time (`DG-C001`, `DG-C002`). Paths resolve against the
  repo root, the record root, and the unit folder. Any honest shape works:

  ```markdown
  - proof.txt — the unit test output
  - AC1 — the suite ran: `01-document/01-discover/<unit>/proofs/run.txt`
  ```

- **`delivered.md`** — appended by `deliver` per landing: the gates that
  passed and the details. Append-only. A red gate writes nothing here —
  the refusal lands in the tracker instead.

### Sketches

`<stream>/sketch-<kebab>.md` (`DG-N002`) — three sections: `intent`,
`evidence-of-running`, `verdict:` (starts `open`). Graduated by
`docodego new <unit> --from-sketch <name>`.

## intent.md and cycles.md (`01-discover/`)

The record's roots, planted by `init` and by the v5→v6 migration
(create-only). **`intent.md`** is the founding brief, verbatim: nothing in
it is paraphrased, and any passage may be quoted as the founder's words
exactly as given. Superseded intent is struck, never deleted.
**`cycles.md`** is the numbered, append-only log of research and decision —
one dated entry per cycle (`## Cycle <n> — <name> (<date>)`), archived in
batches to `cycles-archive-N.md` beside it when the live file grows. The
CLI never writes either file; they are the human and agent record of *why*
the work exists.

## tracker.md (`04-govern/01-monitor/`)

The record's timeline. Appended, never rewritten; one row per event —
including refused gate attempts (`gate-refused`), so the record can
reconstruct the attempts and not only the landings:

```markdown
| date | unit | event | evidence |
|---|---|---|---|
| 2026-11-08 | retry-webhook | delivered | 02-compose/01-build/retry-webhook/delivered.md |
| 2026-11-08 | retry-webhook | gate-refused | G4 failed — no proof path exists on disk… |
```

## delivery-log.md (`04-govern/`)

One row per delivered unit, appended by the gate itself — the loop's
closing record:

```markdown
| date | unit | gates | proof |
|---|---|---|---|
| 2026-11-08 | retry-webhook | G1,G2,G3,G4 | proof: 02-compose/01-build/retry-webhook/proofs/run.txt |
```

Follow-up rows for the same unit record what was learned
(`passed_first_attempt`, `human_correction`, the lesson) — appended, never
edited.

## manifest.json (`.standard/`)

The record's self-description — the engine refuses to run without it
(`DG-R002`):

| field | meaning |
|---|---|
| `mode` | the oversight contract: `auto \| review \| guided \| hands-on` |
| `codeState` | detection: `new \| growing \| mature` |
| `pattern` | the pattern specialization (e.g. `compiler-passes`) |
| `ring` | stability ring (e.g. `stable`) |
| `recordVersion` | the record spec version this record speaks (integer) |
| `detect` | `{ gitDepth, tests, ci }` — what init detected |

## skills-lock.json

```json
{
  "version": 1,
  "recordSpecVersion": 3,
  "installed": [
    { "name": "docodego-grill", "version": "1.0.0",
      "source": "bundled", "integrity": "sha256:…" }
  ]
}
```

`source` is `"bundled"` or the git URL a remote skill came from;
`integrity` is the sha256 over every file of the skill folder. The CLI
re-verifies digests on `skill list` and fails on mismatch (`DG-K001`).

## The laws

1. **Append, never rewrite.** Superseded text is struck, quoted, or
   archived — the trail must replay.
2. **Statuses are earned.** Commands write markers; hands do not.
3. **Claims carry evidence paths.** A claim without a path is a wish.
4. **Upgrades are create-only.** `docodego upgrade` adds missing scaffold,
   never edits or removes your content; a file you modified receives the
   new version side-by-side as `<file>.new`.
5. **The record reads without the CLI.** If this page and the record
   disagree, the record wins — and one of them is wrong, which is a bug to
   report.
