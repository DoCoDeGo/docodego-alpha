# Getting started — five minutes

This walkthrough governs a toy project ("retry-webhook") end to end. Every
output shown is the real shape of the CLI's output.

## 0. Build the CLI

See the [README quickstart](../README.md#quickstart): `npm install`,
`npm run build`, then either `apps/cli/dist/docodego.js` (Node 22.6 or
newer — the engines floor `doctor` enforces) or the self-contained
`apps/cli/dist/docodego` binary.

## 1. Plant the record

In your project's root:

```sh
docodego init --mode review
```

This plants `.docodego/` (the record layer: four movements, sixteen
streams, tracker, statutes), `AGENTS.md` (the agent's entry point, at your
repo root), `.agents/skills/` (the default `product-team` profile's
skills), and `.docodego/skills-lock.json` recording every install with its
digest. `--mode` is the oversight contract recorded in the manifest:
`auto | review | guided | hands-on`. The record can also be born speaking
a dialect: `docodego init --vocabulary babok` re-voices the planted prose
— the stream lines, the law's movement glosses, the grill questions'
phrasing — and plants a glossary bridge at
`.docodego/.standard/vocabulary.md`. Words change, the contract does not:
paths, file names, statuses, commands, and ids are identical in every
vocabulary. Three ship built in — `plain` (the canonical voice used
throughout this walkthrough), `agile`, `babok` — and the choice, recorded
in the manifest, is never re-voiced after birth.

Everything is plain files — look around before doing anything else.

## 2. Capture an idea

```sh
docodego sketch retry-webhook-idea
```

A sketch is one file at near-zero ceremony, planted in
`01-document/01-discover/` as `sketch-retry-webhook-idea.md`:

```markdown
# sketch: retry-webhook-idea

## intent
What this is and why, in a sentence.

## evidence-of-running
What must be seen running for this sketch to count.

## verdict
open
```

## 3. Graduate it into a unit

```sh
docodego new retry-webhook --from-sketch retry-webhook-idea
```

`new` scaffolds the unit folder with a `spec.md` — the contract everything
else operates on — and appends a tracker line. Because the unit graduated
from a sketch, the scaffold carries the sketch's words: its intent becomes
the spec's intent, its evidence items become acceptance criteria. Fresh
from `--from-sketch`, it reads:

```markdown
---
name: retry-webhook
type: unit
status: draft
---

# retry-webhook

## intent

What this is and why, in a sentence.

## scope

In: graduated from sketch 01-document/01-discover/sketch-retry-webhook-idea.md.
Out: unchanged from the sketch.

## acceptance

- run retry-webhook-idea and record what was seen

## threats

- the biggest threat to landing -> its mitigation
```

Fill it in. Lazy sections are not a moral problem — they are a scoring
problem, next.

## 4. Get grilled

The grilling is the adversarial Q&A: four fixed gate questions plus one
hard question per acceptance criterion. Machines (or humans in a hurry)
drive it in two steps:

```sh
docodego grill retry-webhook --json > questions.json
# questions.json — schema docodego/grill/v1:
#   GQ-1  What does this unit do, in one sentence a stranger can verify?
#   GQ-2  What evidence proves each acceptance criterion actually ran?
#   GQ-3  What is the biggest threat to this unit landing — and its mitigation?
#   GQ-4  What did you deliberately leave out of scope?
#   GQ-AC1 … one per acceptance criterion
```

Then answer — one line per question, in order, no blanks:

```sh
cat > answers.txt <<'EOF'
Retries failed webhook deliveries up to five times with backoff.
The integration test transcript at proofs/retry-run.log shows each retry.
Biggest threat: poison messages retry forever → mitigated by the dead-letter cutoff.
Out of scope: signature verification of inbound webhooks.
Criterion: 'retries with backoff' — verified by the timestamps in retry-run.log.
EOF

docodego grill retry-webhook --answers answers.txt
```

The round appends to the unit's `grill.md` (append-only — newest block
wins), and a pass sets the unit's status to `grilled`. A failed round is
recorded too, and exits 1: the attempt is evidence either way.

## 5. Score it

```sh
docodego score retry-webhook
```

Five passes over the spec, summing to 100 — the breakdown lands in the
unit's `score.md`, visible to everyone:

| pass | max |
|---|---|
| completeness | 25 |
| unambiguity | 25 |
| testability | 25 |
| threat | 15 |
| anti-gaming | 10 |

A section still carrying the scaffold's placeholder text earns nothing, so
lazy specs stay below the floor by construction. The score sets status
`scored`. The score itself is not a gate — the floor (60) bites at
deliver.

## 6. Deliver — the gate

```sh
docodego deliver retry-webhook
# gate review for retry-webhook:
#   pass  G1  spec complete (frontmatter, intent, acceptance) — …
#   pass  G2  score >= 60 — total 74/100
#   pass  G3  grill verdict pass — latest verdict: pass
#   FAIL  G4  at least one existing proof path — no proofs.md
# exit 1 — nothing was written
```

G4 wants evidence of running: create `proofs.md` in the unit folder with
one markdown list entry per proof — `- <path> — what it shows` (a test
transcript, a built artifact, a screenshot — any file that exists on
disk), then deliver again. A bare path without the list dash does not
count. A pass appends `delivered.md`, appends the tracker line, sets
status `delivered`, and prints the gate line.

## 7. See where everything stands

```sh
docodego status                # the one-screen board
docodego status --epic <name>  # rollup for one epic's units (0 unit(s) here — this walkthrough has no epic)
docodego check                 # integrity: statuses ↔ markers, proofs, links
docodego lint                  # the record
docodego lint --self-check     # the rules themselves, audited
```

## Where to go next

- [The record format](record-format.md) — the full contract of what is
  where, for humans and harnesses that read without the CLI.
- [Versioning](versioning.md) — the two version axes, the bump guard, and
  how `docodego upgrade` moves a record forward without rewriting it.
- [Skills](skills.md) — profiles, the lockfile, and the supply-chain law.
- Every command's contract: `docodego <command> --help`. Every diagnostic:
  `docodego explain <code>`.
