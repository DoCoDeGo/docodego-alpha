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

## 06 exit findings (over-fed trial, all 7 units launch-passed) — verified: check exit 0

22. **Proof-path repairs have no forward instrument (real law gap).**
    010 delivered with 10 unresolvable path spans; the fix is a file
    edit, but `delivered → delivered` is refused, so the record could
    not learn why the file changed — the tracker never recorded the
    repair. Candidate unit: a relink/amendment mechanism (or a
    repair-forward marker the tracker accepts).
23. **Deliver-gate warnings surface too late** — unresolved-path
    warnings hid in deliver's fine print, then launch refused; 7
    tracker ceremony rows recorded the same missing scaffold. Candidate:
    escalate deliver warnings; dedup repeated launch-attempt rows.
24. **Prose degraded to satisfy the checker** (corroborates 09's #17
    and 08's #12): `.report`, `navigator.share`, `AC3/AC8` all tripped
    the path grammar; the agent un-backticked legitimate prose. The
    checker is degrading the both-ends voice — the grammar needs a
    route/prose disambiguation, not prose edits.
25. **The scaffold is thinner than the score gate**: the proofs-path
    grammar (resolve from the unit folder) was discovered only through
    a deliver warning. Candidate: front-load the grammar in the
    scaffold header and `docodego new` output.
26. **Grill rewards prophecy, never marks plan changes**: verification
    answers are predictions; when the plan changed during build, one
    change rode a `deviations:` line, the rest live only in proofs
    prose. Candidate: a "verification revised at proof time" marker.
27. **Minor**: the sign tier's `--by`/`--name` distinction needed three
    re-reads of AGENTS.md; launch refusal ceremony rows (see 23).

## POSITIVE from 06's exit — the strongest outcome evidence yet

28. **Two bugs the law itself caught**: a canvas-determinism FAIL
    forced a real discovery (Chromium glyph warm-up, now handled by
    construction and recorded in 040's proofs); a static-call crash was
    caught by the browser proof. The subject's words: "The record
    earned its keep."
29. Honesty as design material throughout: unwired checkout explains
    itself instead of fake-selling; samples burned "SAMPLE PREVIEW —
    generation not configured"; the network-privacy claim is audited by
    its own e2e suite (nothing uploads — proven in the tests).

## The improvement plan (ranked; built through docodego's own loop)

The entire idea is to improve DoCoDeGo to its fullest extent — every
finding above is a unit in that direction. Rhythm: code-level fixes land
between trial waves (never mid-walk — a subject must run under one
law); law-level fixes (payload bytes) are built as units through the
loop itself and ride hops; after each landing the agentic suite re-runs
— the re-run is the proof the change fixed what it claimed.

**P0 — shapes every future run**
- First-paint legibility law (the quality assessment's systemic finding):
  the hero is fully legible without scroll, entrance animations settle
  ≤1.5s, ink-vs-sky contrast verified at multiple local times — proven
  by an e2e, not by hope (05/06/09 all regressed at first paint).
- Concurrency protocol: `docodego new` detects a live peer session and
  refuses to double-decompose (confirmed by 09's double-build). 
- Proof-quality floor at G4: proofs under proofs/, build outputs
  rejected as primary evidence (08's dist/index.html pass).
- Grill extractor: an acceptance criterion is one unit — never split on
  punctuation (05's 16-for-10 scaffold).
- Checker grammar: backticked prose, routes, and APIs are not proof
  paths (three agents degraded honest prose to appease it).

**P1 — law completeness**
- Wire the ux-strategy design gate into the loop phases: installed is
  not invoked — round 2's three agents all skipped the skill (named in
  the dispatch, still unread) and two entered site design without it.
  Candidate: `docodego new` for product units prints the design-gate
  requirement, or check flags UI units without research evidence.
- Evidence-folder escape hatch in the rules floor (founder docs are
  evidence, not units).
- AGENTS.md names it explicitly: agents never sign; the plan-approval
  waiver gets an agent-run form (07 waived it five times by charter).
- Grill rounds carry author identity; author changes are flagged.
- Relink/amendment for post-delivery proof-path repairs.
- `init` sets a repo-local git identity; append-only heading-count
  check.

**P2 — polish**
- Scaffold front-loads the path grammar; deliver warnings escalate;
  ceremony rows dedup; the Lighthouse minScore trap documented; sign
  `--by`/`--name` wording; the manifest's codeState either updates at
  gates or is retired as furniture (07's finding: five delivered units,
  still "new").

## 05 clean-rerun exit (first clean-trial exit, ~16:55) — verified: check exit 0

Three units, all launch-passed, 102 Vitest + 10 Playwright green,
`npm run verify` end-to-end, tree clean. New/corroborating findings:

30. **Spec edits after scoring trap the deliver gate** (corroborates
    the relink gap #6): an honest mid-run deviation produced a hash
    mismatch with no instruction on the forward path.
31. **Grill has no adversarial value for a solo agent** (corroborates
    07's author-identity finding #4-ext): every round self-answered;
    the `self-grilled` marker is honest but the round is ceremonial at
    solo stakes. The thresholds were crushed (≥98), which is the only
    reason the ceremony was safe.
32. Minor (new): the scaffold's threats section is silently worth ~15
    score points — the scaffold should say so.
33. Corroborated again: proofs-path parsing warns on prose; founder
    docs trip the floor (#8, #24).

## Comparison data point — 05 coached vs cold

- Over-fed (2 units, Three.js sky ambitions, storm-diary easter egg,
  Lighthouse 99/98/100/100, 22+17 tests): richer flair, deeper
  founder-doc integration.
- Cold (3 units, simpler decomposition, 102+10 tests, verify script,
  proactive node_modules hygiene): cleaner decomposition, faster
  (delivered first unit at 31 min), self-caught hygiene proactively.
- Round-closing assessment will build and serve BOTH and walk the
  experience — the founder's judge is the visitor, not the numbers.

## 07-r2 clean-rerun exit (third clean-trial exit, ~17:5X) — verified: check exit 0

Four units launch-passed (vs the over-fed trial's five — a leaner
decomposition the cold agent chose itself), 75 unit tests + 12 e2e,
Lighthouse 100/100/1.09s LCP, honest unfinished list (one real
reference for score calibration; the 3.76MB model kept over FLAIR's
3MB budget, recorded as an over-budget exception rather than excused).
New/corroborating findings:

34. **The grill scaffold suggests `.docodego/var/` for answers; the
    layout lint flags writing there** — the CLI contradicts its own
    lint (corroborates the var/ law thread).
35. **"One unit = one commit" cannot survive the gate order** —
    delivery rows append only at deliver, after all builds; per-unit
    commits break the shape. Candidate: name the commit cadence the
    gates actually enforce.
36. **plan.md human approval is unreachable autonomously** (extends
    the waiver-form candidate): the skill's "waive, warn once,
    proceed" works, but headless the warning is a formality.
37. **ICS 100/100 by phrasing alone, third confirmation** — the
    docodego-document skill says so itself; the law's load-bearing
    sentence is "re-measure every number".

## POSITIVE from 07-r2's exit

38. Tests-first discipline arrived unprompted in the clean trial
    ("RED first per unit criteria") — absent from the coached trial.
39. The visual-proof skill "earned itself": the agent extended the
    driver for uploads and read its own screenshots before claiming
    the real-face path took the ok branch.
40. The law verdict, in the subject's words: "sound spine, two rough
    edges — both recorded in the record, not just muttered."

## ROUND STATE: all five products settled

Every product now holds a completed trial: 05 clean (3/3),
06 clean (5/5), 07-r2 clean (4/4), 08 clean (1 delivered + honest
stop), 09 clean-reconciled (5/5 after the double-build). Preserved
coached builds: 05-overfed (2 delivered), 06-overfed (7/7),
07-trackhair (5/5, in place). The round-closing quality assessment
(build, serve, walk each; rank the visitor experience; coached vs
cold per product) is the next session's work, per the doctrine's
assessment protocol.

## Disqualified trials — preserved, never deleted

05/06/07 ran on the over-fed first-draft prompt (hard lines, creative
mandate, checklist — since cut by the minimal-prompt rule). Their runs
are NOT clean trials; their LAW FINDINGS stand (defects are defects
however the agent was fed).

**Preservation law (founder correction, 2026-11-10): completed work is
never deleted.** A rerun happens in a NEW COPY (a fresh init beside the
original), never a reset of the original. The over-fed builds are
preserved: 05 restored to `05-wardrobeclimate-overfed` (commit 885d9f4),
06 restored to `06-tryonface-overfed` (from its pre-reset reflog), 07's
over-fed build stays untouched in place — its clean rerun runs beside it
as `07-trackhair-r2`.

**Quality assessment:** which trial produced the best work is judged on
the **end-user experience** — build and serve each trial's product,
walk the core experience, and grade it (the suites and Lighthouse are
inputs, not the verdict). Every trial is assessed, including
disqualified ones: the comparison between coached and cold runs is part
of the answer to "does DoCoDeGo improve outcomes".
