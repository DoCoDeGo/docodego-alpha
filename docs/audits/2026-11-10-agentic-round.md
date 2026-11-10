# 2026-11-10 — agentic round: findings log (live)

The effectiveness test's improvement log. Each finding: what happened,
attribution (agent / law / brief), and its disposition. Findings become
surgical law changes, then the suite re-runs.

## FIXED in-round (surgical)

1. **Grill scaffold message lied about the count** — said "four fixed"
   while the contract is five (GQ-5 landed in 700; the help page was
   fixed then, this line was missed). Found by the 05 agent, confirmed
   in source (grill.ts:44). Fixed this round.

## OPEN — candidate units (law defects)

2. **Grill extractor splits an acceptance criterion on punctuation** —
   an AC ending in "(…)." was parsed into two questions (16 scaffolded
   for 10 criteria), one mangled to a fragment. The agent worked around
   it by rewording; the parser must treat a list item as one unit.
3. **The rules floor has no evidence-folder escape hatch** — the
   founder's brief copies (pure evidence) planted in the record tripped
   DG-F001/DG-S005. The research exemption exists but is narrow; the
   law needs a recorded way to keep evidence folders (frontmatter mark
   or non-NNN-folder rule) without weakening the floor.
4. **Append-only has no tooling** — a deleted heading was repaired by
   hand within minutes; the invariant held only because the agent
   caught it. Candidate: a check that headings never lose count, or an
   append mode in the harness edit path.

## POSITIVE (the law held)

5. `deviations:` frontmatter carried a real precedence call cleanly
   into the unit record (Three.js vs FLAIR precedence) — good law.
6. The L5 demo-bundle gate refused an unfilled scaffold and its message
   taught the fix — "the best-behaved gate in the set" (subject's words).
7. Launch-time proof-path resolution caught a pseudo-path in an earlier
   unit's proofs; the refusal message named the exact span.

## ATTRIBUTION pending clean reruns

8. 08-glowmonth's double-authoring collision (parallel subagents over
   one worktree, ~25/30 minutes lost) — agent defect primarily;
   candidate law defect: no rule against parallel authoring in one
   worktree. Watch the clean reruns: if cold single-threaded agents
   don't collide, it stays an agent defect; if the law's silence invites
   it, it graduates.

## 08 exit findings (first clean-trial exit, ~15:45)

The run DELIVERED and launch-passed one unit (153 unit tests + 32 e2e
green, Lighthouse 100/100/1.4s LCP) — with a collision history it
reported bluntly. New law findings:

9. **G4 passed on the weakest possible evidence** — with mis-rooted
   proof paths, the deliver gate accepted `dist/index.html` (a build
   artifact) as a proof. A proof path that merely exists is not
   evidence of the criterion. Candidate: a proof-quality floor (proofs
   under proofs/, evidence-kind declarations required, build outputs
   rejected as primary evidence).
10. **`grill` absorbed two rounds from two authors silently** — the
    collision era produced two grill rounds with no authorship flag.
    Append-only absorbed it (good), but a round authored by a
    different identity than the last should be named on the record.
11. **Path resolution is dual-rooted and surprised the agent twice** —
    proof paths resolve against repo root AND `.docodego/`; writing
    `docodego/…` instead of `.docodego/…` failed silently. Candidate:
    one resolution rule, documented in the scaffold header.
12. **Cosmetics**: DG-C002 flags slash-laden prose as paths; the scorer
    counts "One sentence:" as template residue inside a legitimate
    answer.
13. **Worktree leftover**: the sibling's `08-glowmonth-landing`
    worktree is registered (f179493, detached) — evidence of the
    collision, kept for review; diff-and-keep-one is the founder's
    decision.

## POSITIVE from 08's exit

14. **The tiers law held under a cold agent**: the launch output taught
    "the next tier is a person", the agent did not attempt `sign`, and
    said so unprompted.
15. **Append-only absorbed the collision**: the trail — including both
    collision snapshots — replays clean; the agent's own words: "the
    trail, including the collision, replays clean."

## 09 exit findings (second clean-trial exit, ~15:50) — the concurrency defect, confirmed by evidence

The headline: **two founder-agents built this product simultaneously in
one repository** — and the record absorbed it. Five units launch-passed
across two parallel decompositions (010-closet-engine /
010-closet-map-core, 020-rail-flair / 020-site-and-flair,
030-passive-context), a supersession verdict recorded, `check` exit 0
at HEAD ("record: launch tiers passed; parallel-run reconciliation
recorded").

**Root cause, owned:** my orchestration. The first 09 dispatch was
killed by pkill during the popup-protocol pivot — but `opencode run`
without `--standalone` connects to the background service, and the
session survived the process kill. The redispatch then created a second
live session on the same repository. Orchestration defect; the fix is
doctrine: dispatch with `--standalone` (a killed process is a killed
session), and never redispatch without verifying the old session is dead.

**The law finding it confirmed (the round's most valuable evidence):**

16. **No concurrency protocol — CONFIRMED critical.** No lock, claim,
    or heartbeat exists: two agents delivered five units covering the
    same seams and the law had nothing to say until a human-read
    reconciliation. Candidate unit: a claim/lock/heartbeat mechanism
    (or at minimum, `docodego new` detecting a live peer session and
    refusing to double-decompose).
17. **Gate grammar fights prose** (corroborates 9/12): backticked spans
    containing `/` are read as proof paths even when they name routes.
18. **Founder-docs vs the unit scanner** (corroborates 3): verbatim
    brief copies stored beside intent.md trip lint.
19. **The scorer cannot check arithmetic — field-confirmed twice**: a
    quiz-differentiation bug scored 100/100 undetected. Known
    limitation ("the scorer checks grammar, never truth"), now with
    production evidence; candidate: re-measure requirements enforced at
    grill.
20. **Minor**: Lighthouse `minScore: 90` means 0.9 (a perfect 100
    "failed" the first config); `docodego new` after a crashed run
    silently diverges from the dead run's plan.

## POSITIVE from 09's exit

21. **The record absorbed a double-build honestly**: append-only held,
    the supersession verdict is recorded, five launch-passed units are
    each grilled, scored, evidenced, and `check` is green at HEAD. The
    worst-case stress test of the honesty law passed.

## Disqualified trials

05/06/07 ran on the over-fed first-draft prompt (hard lines, creative
mandate, checklist — since cut by the minimal-prompt rule). Their runs
are not clean trials; their LAW FINDINGS stand (defects are defects
however the agent was fed). 05's repo is reset to birth for its clean
rerun; 06/07 reset when they exit.
