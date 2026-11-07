# The two-agent acceptance — the planted law, graded by strangers

**Date:** 2026-11-08 · **CLI under test:** 0.8.0 on `core-loop` (record spec 6)
· **Method:** a pre-initialized repository (`docodego init`, nothing else), a
standing end-user brief, and three sequential work sessions carried out by
context-isolated agents (A → B → A′). No agent saw another's conversation or
this document; the record layer was each agent's only inherited memory. The
orchestrator's only interventions were environment facts (repo path, CLI
invocation, runtimes, no network) and two founder-in-the-loop answers at
session boundaries.

**The product:** `palette-scan` — scan photos and portrait crops, extract
dominant colors, match them to twelve named UI tokens with a distance
number, and show exactly which token mappings changed after a rebrand.
Stack choice was left to the agents, as the brief required.

**The arena:** `/private/var/folders/.../T/opencode/acceptance/product` —
4 deterministic PNG fixtures (median-cut- friendly: solid, two-tone,
gradient, portrait-crop), `data/tokens.json` with 12 near-but-not-equal
tokens, planted record v6.

## Verdict

**Pass.** Three cold sessions shipped four delivered units —
`palette-scan-dominant-colors`, `palette-scan-token-match`,
`palette-scan-default-match`, `palette-scan-rebrand-diff` (grill pass,
scores 98–100, proofs 36/81/54/79 checks, all drivers re-run green) — with
every handoff answered by the record alone. `check` and `lint` are green on
the final tree; the tool runs end-to-end: scan → match by default,
`--no-match` escape, baseline save/compare, and the rebrand drill prints
exactly `signal-red  #b03229 -> #c14a35`, one line, after a token hex edit.

What the test was for — the honesty layer — held under all three sessions:
the founding brief and the founder's follow-up answer were recorded
verbatim; the stack choice landed in the cycle log with reasons (Python
over Node, argued, with the runner-up named); supersession (session two's
opt-in design reversed by session three's founder answer) was handled as
struck reasoning plus new cycles, never rewrites; a real tool bug (JSON
mode printing unparseable diff lines) was caught by a proof driver, not
shipped silently.

## The findings — the law, graded bluntly

Every finding below was reported *independently* by at least one agent
with no knowledge of the others' reports; two agents hit the same defects
without conferring, which is itself evidence the defects are real.

1. **The streams prose promises more than the flow uses.** AGENTS.md and
   the stream READMEs present sixteen streams as work homes; `docodego new`
   plants the whole unit in `01-document/01-discover/` and it lives there
   birth-to-gate. Coherent implementation, unkept prose (agent A #1).
2. **Proofs.md grammar mines prose.** `deliver --help` says candidates come
   from *list items*; the checker flags backticked path-like spans *anywhere*,
   so honest notes like ``its `failure-modes.txt` `` raise DG-C002 warnings
   from narration (agent B #3, agent A′ #2). Doc and behavior must match:
   either scope extraction to list items or fix the doc.
3. **Two calendars in one record.** The CLI stamps UTC; the founder's wall
   clock is a day ahead. Gate-written rows and hand-written cycles
   disagree, and the law names the tracker the winner while its clock is
   the wrong one (agents A #3, B #2, A′ #3 — unanimous).
4. **No rule for superseding a delivered default.** When the founder
   flipped session two's opt-in decision, session one's delivered ACs
   pinned the now-changed default output. The append law governs prose, not
   proof-driver code; agents resolved it by judgment (minimal driver edit +
   dated note + tracker row + cycle entry — defensible, but invented twice
   independently, differently) (agent B #4, agent A′ #1, #4).
5. **`lint --self-check` is a trap** — the law never says which invocation
   is *the* lint (agent A #2).
6. **Grill answers are positionally fragile** — unlabeled lines map to
   questions by count; a miscount records honest answers to wrong questions
   (agents A #5, B —, A′ #5). Labeled answers (`GQ-3: …`) would make
   recorded rounds self-verifying.
7. **Commit discipline is not in the law.** Each agent inferred
   Conventional-Commits-per-unit from history; the law should state it
   (agent A′ #3).
8. **Research instruments vs gate-judged proofs are indistinguishable.**
   Pre-spec measurement scripts live in `proofs/` beside what G4 judges
   (agent B #5); the ephemeral-artifact law should name them.
9. **Grill answers file disposition unstated** — agents deleted theirs per
   the ephemeral spirit; the law should say so (agent B #6).
10. **`the becoming` placeholder records an open state without naming its
    question** — a stranger cannot know what is being waited on (agent
    A′ #4).
11. Cosmetic: G4 echoes one proof when many exist (A #7); tracker paths
    spell without the `.docodego/` prefix while proofs spell with it
    (A #6).

## What held without argument

Append-only under three supersession events; records-before-claims (both
session-two agents *measured* before building — cycle 3's geometry table,
session two's predicted mappings); the gate refused nothing dishonest and
wrote every landing; `--help` and `explain DG-C002` carried agents through
the proof grammar without orchestrator help; and the record's warning
about session one's non-byte-stable driver (cycle 3) was inherited and
acted on correctly by the orchestrator's own verification — the record
taught *me*, which is the product working on its own authors.

## Where this leaves the backlog

Findings 1–4 are law-text or gate-text changes (AGENTS.md, stream READMEs,
check/doc alignment, a supersession rule); 5–10 are small, surgical
additions to planted text and one grill output change. None blocks the
core loop — three strangers just ran it, twice handoff-to-handoff, with
zero orchestration beyond founder answers at session boundaries.
