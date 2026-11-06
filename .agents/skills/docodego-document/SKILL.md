---
name: docodego-document
description: Use when authoring or revising specs for features, improvements, bugfixes, or refactors. Guides the multi-file spec (spec.md, assurance.md, deliverables.md), scores spec.md with the ICS scorer, iterates to the gate, then runs adversarial grilling.
version: 1.0.0
---

# docodego-document — specification discipline (DO)

*Reference: the planted framework, [.docodego/.framework/](../../../.docodego/.framework/README.md); the unit shape the standard defines is vendored at [.docodego/.standard/](../../../.docodego/.standard/README.md).*

Author intent precisely enough for AI to act on. Specs describe WHAT the user experiences, never HOW the code works. You are a participant, not a scribe: push back, surface ambiguities the author hasn't noticed, replace vague qualifiers with measurable language, and propose failure modes the threat model missed.

## Before authoring

1. Read the unit contract — `.docodego/03-rising/README.md` — and the phase's existing units; they are the laws every spec inherits.
2. Read neighboring specs for naming and dependency conventions.
3. Unfamiliar domain or library? Write `explore.md` first (shared scratchpad, never a source of truth). For genuinely unknown territory: a time-boxed spike — throwaway code that feeds the spec, deleted before CO.

## Required documents by category

| Category | spec.md | assurance.md | deliverables.md |
|---|---|---|---|
| `features/` | required | required | required |
| `improvements/` | required | required | required |
| `bugfix/` | optional | required | optional |
| `refactor/` | optional | required | required |

Optional sections are included when triggered **or explicitly declared inapplicable — silence is not omission** (the Declared Omission Rule).

`knowledge/` is the fifth directory under `new/` — terse single-file factual notes about libraries and external APIs. Reference material, not intent: no spec structure, no ICS scoring.

## spec.md — lean intent (this file is ICS-scored)

Frontmatter: `version`, `owner`, `status: draft`. Sections:

- **Intent** — one paragraph, what and why, ≥ 50 words
- **Uses** — bare references to existing files only; never invent
- **Behavioral Flow** — user does X → Y happens
- **Acceptance Criteria** — one line each, measurable: numbers, units, thresholds
- **Failure Modes** — ≥ 3, each ≥ 15 words, each carrying a recovery keyword: falls back, retries, alerts, degrades, escalates, timeout, rollback, failover, rate limit…
- **Out of Scope** — ≥ 50 words

**Banned vague qualifiers** (the scorer penalizes them): fast, scalable, robust, should, appropriate, efficient, simple, easy, flexible, seamless, proper, handle, support, ensure, various, typically, may, might, could. Not "handles errors appropriately" but "returns HTTP 400 with error code `INVALID_INPUT` when the domain field is missing."

| Implementation (wrong here) | Intent (right here) |
|---|---|
| "Check localStorage for theme" | "Returning user sees saved preference" |
| "Persist to localStorage" | "Choice remembered across sessions" |

## assurance.md — the critical document

Sections: Test Strategy · Acceptance Criteria (each one-liner expanded to GIVEN/WHEN/THEN) · Edge Cases · Integration Assurance (what must not break) · Regression Signals (what to re-verify later).

- Criteria are testable behaviors, not code: "theme persists across reloads," not "localStorage key set."
- Structural checks (typecheck passes, directory removed) are **not** criteria — they belong in deliverables "Done When." The test: would you write a test for it (assurance) or run a CLI command (done-when)?
- Bugfixes: the bug becomes a regression-test criterion. Refactors: characterization tests prove behavior preserved.

## deliverables.md — the shortest file

Delivery Units (what ships, not how) · Delivery Rules (one unit = one commit; commit format — process only, no tech prescriptions) · Done When (criteria checked, tests pass, structural gates). Implementation decisions happen during CO, never here.

## The gate loop

1. Score with the CLI:

   ```bash
   docodego score <path-to-spec.md>
   ```

2. **Gate: overall ≥ 60, Threat Coverage ≥ 15, no dimension at 0.** Below → fix (thin sections expanded; numbers added for testability; recovery keywords added for threat; vague words replaced) and re-score. Never proceed on a failing spec. The author cannot be the sole scorer; solo practitioners treat 55–65 as "revise."

3. **Re-measure every number in the spec before grilling.** The scorer checks grammar, never truth (see "What the score cannot see" below). For each figure in a criterion — a count, a line total, a workspace list, a percentage — run the command that produces it and paste the result into `explore.md` or the grilling record. **A number inherited from a research report, a prior spec, or a subagent's summary is not measured**; re-running it is the only thing that makes it so. Then check each criterion is falsifiable by naming, in one clause, the observation that would fail it. A criterion nothing can fail is scored as high as one that bites.

4. Grill: run the grilling round on the unit and record it — `docodego grill <unit>`; the round reads the spec, its `Uses` foundations, and the actual code, then returns pointed questions with "why it matters". Answer every question, update the files, re-score if spec.md changed, and show the user the full Q&A.
5. Report: "Specs grilled, ICS <score>/100, files updated. Another grilling round, or move to compose?"

### What the score cannot see

**The gate is necessary and not sufficient. A spec can reach 100/100 while being factually unsatisfiable** — measured in practice, when a spec scored 100/100 and the grilling then found five criteria that no run could satisfy, four of them carrying figures that were simply wrong.

- **Testability matches comparison vocabulary, not testability.** The scorer's measurable patterns look for `at least N`, `equals N`, `no more than N`, `within N`, `absent`/`present`/`empty`, an operator before a digit, a digit with a unit, or a CLI exit code (`exits 0`, `exit 2`). A criterion carrying a bare integer ("names 4 tiers") scores as unmeasurable; the same claim as "the count of named tiers equals 4" scores full marks. In the measured case the dimension moved **6/25 → 25/25 with no claim changed**. Phrase criteria in that vocabulary because it is clearer, but **never treat the rise as evidence of anything**, and never invent a unit to buy points.
- **The scorer cannot check arithmetic or facts.** It read "at least 1 421 measured lines" (the true count was different) and "at least 18 workspaces" (there were fewer) as full-credit measurable language.
- **The scorer cannot detect a vacuous criterion.** "The difference between the two sets exceeds 0" scored full marks while both sides were, as written, always equal.
- **Threat Coverage matches recovery *keywords*.** A failure mode ending "… or the build fails" scores; one describing a real rollback in different words does not. Write the mode for the reader, then confirm a keyword is present.

So: **fix what the issues list names, then stop.** If a dimension only rises when the wording changes, the spec did not improve — go and re-measure instead.

## Common mistakes

| Mistake | Fix |
|---|---|
| Implementation detail in spec | spec = user-facing intent only |
| Structural checks in assurance | Move to deliverables Done When |
| Not pushing back | Add edge cases actively; grilling is mandatory |
| Inventing Uses references | Reference only files that exist |
| Full ceremony for a simple bugfix | A bugfix needs assurance (prove the fix), not a three-ring spec |
| Skipping the scorer | Never declare a spec ready without the score |
| Chasing 100/100 by rewording | The score measures phrasing; re-measure the numbers instead |
| Quoting a figure from a report or an agent | Re-run the command that produces it before it enters a criterion |
| A criterion nothing can fail | State the observation that would fail it, or delete it |
