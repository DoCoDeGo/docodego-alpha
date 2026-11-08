---
name: docodego
description: The docodego front door. Use when starting work without a clear phase, when the user seems lost or unsure what to do next, or when routing between lifecycle phases (finding, grounding, promoting, building, nurturing, leaving, harvest). Routes to the Arc family (product/portfolio scale) or the loop family (spec scale).
version: 2.0.0
---

# docodego — where are you?

*Reference: the record index, [.docodego/README.md](../../../.docodego/README.md).*

docodego is the discipline of bringing thought into action with the thread of oversight and accountability unbroken. Every action traceable to a thought; every thought traceable to a life; every consequence owned by a person.

The entry question is not "what's the task?" — it is **"where are you?"** Locate the person and the work on the arc, then route.

## The locator

| The person says (or shows) | Where they are | Route to |
|---|---|---|
| "I don't know what to build" / restless, searching, lost | The Finding | `docodego-finding` |
| "I have an idea — is it any good?" / "should I commit?" | The Grounding | `docodego-grounding` |
| "The idea is grounded — let's start" | Grounding→Rising seam | `docodego-promote` *(upstream)* |
| "Build/spec/implement this" (repo exists, thing is growing) | The Rising | `docodego-loop` |
| "It's live — keep it healthy" / maintenance, pruning, drift | The Nurturing | `docodego-nurturing` (posture, upstream) + `docodego-loop` (work) |
| "I'm tired / it's time / I got an offer" | The Leaving | `docodego-leaving` *(upstream)* |
| "It's over — what did it all mean?" | Beyond | `docodego-beyond` *(upstream)* |

The lifecycle skills marked *(upstream)* are not in the planted seed — a fresh repository never enters their phases. Work that reaches them reads the record's own law first and raises for the full family. If the work is clearly spec-scale (author, implement, verify, govern), skip the locator and go straight to `docodego-loop`, which routes within the loop family.

## The two families, two modes

| | Loop family | Arc family |
|---|---|---|
| Skills | `docodego-loop`, `-document`, `-compose`, `-demonstrate`, `-govern` | `docodego-finding`, `-grounding`, plus the lifecycle set upstream (`-promote`, `-nurturing`, `-leaving`, `-beyond`) |
| Scale | spec (days) | product / portfolio (seasons, years) |
| Mode | **verdicts** — scores, gates, exit codes | **pictures** — walks, placements, questions |

**Mode discipline (never violate):** scores never migrate up (no numeric verdict on an idea, a phase, or a life); vagueness never migrates down (no contemplative language where a binary criterion belongs).

## The thread

Every phase produces a record that cites backward (where this came from) and forward (where it went): finding record → walk → promotion → specs → behavioral docs → leaving record → harvest. In a repository planted with the loop, these records live in the document streams: the founding intent verbatim and finding records in `01-document/01-discover/`, walks in `02-refine/`, everything else under its movement. A project may grow Arc directories (`01-finding/` … `06-beyond/`) when its scale earns the fuller structure — upgrade never removes what a record grows. An idea with no repository yet keeps its records in an ideas folder of the maker's choosing until a repository exists to hold them. If you touch a phase record, keep its links intact — an unlinked record is a broken thread.

## Rules

- The integrity question ("can you stand behind it?") belongs to the human. Arc skills ask and record; they never answer it.
- The Arc is opt-in depth. If the user only wants engineering work, the loop family stands alone — do not impose Arc ceremony.
- When in doubt about phase, ask the locator question directly: "Where are you with this — still deciding, committed and building, keeping it alive, or winding it down?"
