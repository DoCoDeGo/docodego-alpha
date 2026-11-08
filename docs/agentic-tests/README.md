# Agentic tests — docodego's own acceptance suite

**What this is.** A rerunnable test of the law itself: fresh-context agents,
given nothing but a planted record and a product brief in essence-form, build
real products through the loop. The products are the instrument's *load*; the
thing under test is whether the planted law carries invention, handoffs, and
honesty without a human in the room.

**Design principles** (each earned the hard way):

1. **Briefs give the destination, never the route.** Product essence, the
   anxious question it answers, price anchor, hard ethical lines — and an
   explicit creativity mandate. No page shape, no engine spec, no flair, no
   stack. (A pre-scripted brief measures transcription, not the law.)
2. **Network on, real tooling.** Offline arenas pre-decide the architecture.
3. **One planted repo per product, one fresh-context agent per repo** —
   handoffs across agents are tested by letting records, not chats, carry.
4. **Grading is two-sided.** Every finding attributes to *agent* (law clear,
   bypassed) or *law* (ambiguous, silent, self-contradicted). A quiet run is
   not a pass; a run whose frictions surface as harvestable findings is.

## Running it

```sh
scripts/agentic-setup.sh <arena-dir>     # plants one repo per brief
```

Then, for each repo, spawn a fresh-context agent whose task prompt is the
shared shell in `directive.md` wrapping the brief from `briefs/<product>.md`.
Observe live with the instrument in `docs/process/review-dimensions.md` (~5-minute
read-only rounds; findings to an improvement log like
`docs/audits/2026-11-08-improvements.md`); on completion, grade each product against
all eight dimensions and cite evidence per finding.

## Pass criteria (for the law, not the products)

- Every delivered unit's claims trace to re-runnable evidence; the gate's
  refusals, where they occurred, are recorded and were honored.
- `check` and `lint` green on every final tree; founder intent verbatim in
  every `intent.md`; append-only held under any supersession.
- Each agent's report names its unfinished work honestly.
- Findings are attributed; law-defects are promoted to a ranked improvement
  list; agent-defects are distinguishable from law-defects by the record
  alone.
- **The fork test:** where the law offers a structure (homes, streams,
  statuses), agents either follow it without penalty or deviate with a
  recorded deviation — never silently, and never diverging into records the
  tooling cannot see.

## After the run

Findings → surgical law changes → version bump (record spec / AGENTS.md /
skills per their own rules) → **re-run this suite**. The suite is the proof
the changes fixed what they claimed to fix; no law change ships on argument
alone.
