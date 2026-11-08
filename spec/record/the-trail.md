# The trail

*The append-only record kept beside the work: the System's system of record.*

## What the trail holds

Five kinds of thing:

| Kind | What it holds |
|---|---|
| **intents** | the epics, stories and specs, with their versions |
| **decisions** | each with its reason and the name of whoever made it |
| **proofs** | what ran, against which version of the work, with what results |
| **receipts** | each unit's last act, signed |
| **lessons** | what each unit and each retrospect taught |

Append-only means nothing is rewritten (EL-17). "That is what lets a stranger trust the
record: nobody, including its author, can quietly improve the past."

## The record on disk

Planted at the root of the repository, beside the work:

```
AGENTS.md                 the law: how any agent works here
.agents/
  skills/                 the craft: one folder per installed skill
  agents/                 presets: reviewer · researcher · tester
.docodego/
  README.md               the record's own index, read first
  skills-lock.json        the installed skills, each with a fingerprint
  .standard/              statutes.md · manifest.json · tech-radar.md   (reference, never edited in place)
  01-document/            01-discover · 02-refine · 03-validate · 04-plan
  02-compose/             01-build · 02-integrate · 03-enhance · 04-maintain
  03-demonstrate/         01-demo · 02-accept · 03-release · 04-deploy
  04-govern/              01-monitor · 02-measure · 03-retrospect · 04-improve
    01-monitor/tracker.md the trail, appended and never rewritten
```

The sixteen streams are all planted with one-line READMEs; each stream holds nothing until
its first unit arrives — planted folders are structure, not work.

## Unit files, earned as the work earns them

A unit stays in the one stream it belongs to; its progress lives in its `status`
(draft → grilled → scored → delivered):

- `spec.md` — frontmatter: `name` (matching the folder), `type`, `version`, optional `epic`
  and `story` links, `status`. Four sections: intent, scope, acceptance, threats. *The
  version field is required by EL-22: a receipt must be able to cite the spec version it was
  built against.*
- `grill.md` — each grilling round appended: every question, every answer and a verdict.
- `score.md` — the latest score with its breakdown.
- `proofs.md` — paths to the evidence, each with what ran and what came back (EL-23).
- `delivered.md` — the receipt, appended when the gate passes.

## What a receipt looks like

The canon receipt, nine lines:

```
Receipt: repairs-ref-01, unit
Spec: repairs-ref v1.1 (grilled: 11 questions, all answered; score 78, threat 19)
Proofs: 6 tests, each seen failing first, all passing
        against the exact version of the work they were run on;
        re-run with the recorded command
Perception: reference checked on two phone sizes and a desktop by the housing officer
Taught: the text provider can take 40 seconds; close to the one-minute line, so watch it
Mode: review
Signed: the product owner, who can explain the change
```

"A tool can write most of it. Only the last line must be a person's act." A signer who
cannot explain the change does not sign. Doubt belongs beside the signature — "signed;
concerned that…; story filed" — it makes the receipt stronger, and it is the most useful line
in it for whoever comes next.

## Sketches, and the states between

A sketch is a single file, `01-document/01-discover/sketch-<name>.md`, with three sections:
intent, evidence of running, and a verdict that starts as open. It graduates with
`docodego new <unit> --from-sketch <name>`.

Ideas set aside carry states, and the states differ:

- **held** — with a named trigger ("a vague trigger never fires"), a reserve, a signal to go,
  a stopping point, and the date last reviewed; reviewed quarterly.
- **released** — "Not held, not waiting: released. The category matters. Held ideas keep
  taking attention; released ones do not."
- **set down** — with what it taught, written ("three specific sentences"), filed where the
  next discover will find it.

Re-walk discipline: "Do not re-read the old walk first. Walk the layers again, fresh, and
only then compare… The differences are the data." The old walk stays — a conversation with
yourself across time, not a judgement carved once.

## Records before claims

"Every claim on the trail points at its evidence" (EL-18). "A claim with no evidence is
marked as assumed, or it is not written."

## Provenance without attribution

The trail records whether a person or an agent did each thing; tool and model names are
opt-in (EL-25).

## Bounded and indexed

Short files, one subject each, an index that says what is where; long history split by
period with a summary at the top (EL-29). A fresh session should load what it needs in one
go.

## Versions

Three version axes move side by side — the record contract, the tool, the published law —
and only one of them migrates. What versions what, the registry law, skip-distance, and
every hop the record has shipped: [the version transition table](version-transition.md).

## The cold start

The best test of a trail: give a newcomer, or a fresh agent, the repository and the record
and nothing else, and ask them to do a real, small task. Where they get stuck is a gap in the
record. Fill it. Run the test before any handover, and now and then without one. "A team that
passes it has a record that depends on nobody's memory, including yours."

## Handing on

A handover is a unit like any other: a packet small enough to read in one sitting, proved by
a cold start, and signed by both the person handing on and the person receiving. "Ownership
moves on the record, never by assumption." The test: can they carry on without calling the
person who left?
