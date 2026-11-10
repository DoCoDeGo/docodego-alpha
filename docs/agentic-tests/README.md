# Agentic tests — docodego's own acceptance suite

**What this is.** A rerunnable test of the law itself: fresh-context agents,
given nothing but a planted record and a short brief, build real products
through the loop. The products are the instrument's *load*; the thing under
test is whether the planted law carries invention, handoffs, and honesty
without a human in the room — and whether it **improves outcomes** while
**living up to its promises**.

**The promises under test** (each observable; source in parentheses):

- repositories become *teachable* to agents — a cold agent reads the
  planted law and works correctly, unprompted (decision record 0001);
- no implementation before a scored spec; no delivery without a proof
  that exists — the walk order holds (the gate law);
- every principle's violations are caught or named (the sixteen statutes);
- upgrades apply live and hide nothing — previous copies preserved,
  nothing gitignored (founder ruling, units 690);
- the founder reads whole: context first, plain English, acronyms
  spelled out, concise, questions answered before work (founder
  ruling, unit 720);
- records are born under version control (founder ruling, unit 710).

**Design principles** (each earned the hard way):

1. **Briefs give the destination, never the route.** Briefs are authored
   **on the fly at dispatch time** — never pre-written per product. A
   brief is one or two sentences; the feature or improvement may be
   **large**; the idea must be **complex enough** to exercise the law
   (a trivial ask measures nothing). A new product idea is a brief too:
   starting fresh gets the full walk like everything else — starting
   new is not an exemption. (A pre-scripted brief measures
   transcription, not the law.)
2. **Network on, real tooling.** Offline arenas pre-decide the architecture.
3. **One planted repo per product, one fresh-context agent per repo** —
   handoffs across agents are tested by letting records, not chats, carry.
   The agent enters with **minimal background context**: the repository
   and the brief, nothing else.
4. **Grading is two-sided.** Every finding attributes to *agent* (law clear,
   bypassed) or *law* (ambiguous, silent, self-contradicted). A quiet run is
   not a pass; a run whose frictions surface as harvestable findings is.

## Running it

**Subjects run as opencode processes, not harness children.** One
headless process per repository, output captured to a log:

```sh
cd <arena>/<product>
opencode run "<the directive shell, wrapped around the brief>" > run.log 2>&1
```

Real processes, real logs, true cold starts — and the log is what the
monitoring rounds read.

**Popups and questions — the four classes and their handlers:**

| class | handler |
|---|---|
| opencode's own permission prompts (edit, bash) | dispatch with `--auto` — auto-approve what is not explicitly denied; the subject is the agent's conduct, not the permission gate |
| questions the agent asks in its output | headless has no answerer: the stall is caught by the monitoring round; note the finding (agent asked instead of deciding-and-recording — or law defect if AGENTS.md never said the founder is absent), then nudge the same session once (`opencode run --continue`): "founder absent — decide and record"; the nudge is itself logged as an orchestrator intervention |
| prompts from tools the agent invokes (npx, git editor, vendor CLIs) | headless hygiene on dispatch: `CI=1 GIT_TERMINAL_PROMPT=0 GIT_EDITOR=true`; a tool that still demands interactivity is a brief finding (the founder's rules require runnable, provable products) |
| prompts from our own CLI | none by law: `sign` refuses headless without `--yes` — a cold agent cannot sign for the founder, and recording that refusal is a pass of the tiers law |

Dispatch form (the whole hygiene in one line):

```sh
cd <arena>/<product> && CI=1 GIT_TERMINAL_PROMPT=0 GIT_EDITOR=true \
  opencode run --auto "<directive shell wrapped around the brief>" > run.log 2>&1
```

**How a product repo is initialized (explicit, no improvising):** the
setup script runs OUR codebase's CLI with the product repo as the
working directory —

```sh
cd <product-repo>
node --experimental-strip-types <v2>/apps/cli/src/main.ts init --profile product-team
```

`init` is the whole birth: it plants the record layer, and git init +
the birth commit happen inside it (records are born under version
control — no manual git steps). From the engine checkout itself,
`pnpm docodego <command>` is the same CLI for engine-side work.

**The monitoring rule — always in force, and realtime.** Monitoring is
a **watchdog subagent**, not a sampler. One watchdog covers the running
subjects with a 60-second internal cadence — process liveness, log
growth, new commits, record-phase movement — keeping timestamped notes,
and it **exits immediately on a critical finding**: a subject dying
early, a stall (no log growth and no commits for 10 minutes), a refusal
loop, or an agent asking a question to the void. The exit wakes the
orchestrator at the moment of the problem, not at the next sample; the
orchestrator relays the alert, consolidates the notes into the issue
list, and dispatches the next watchdog. Coverage is continuous for as
long as subjects run. With nothing critical, the watchdog exits after
~30 minutes with a consolidated per-subject report. The watchdog is an
instrument, not a subject: it observes read-only — logs, git state,
record files — and never writes to a product repository or runs
mutating commands.

**The minimal-prompt rule.** The directive shell is environment facts
and the brief — nothing else (see directive.md). If a run seems to
need a coaching paragraph, the finding is that the planted law does
not teach it; add the law, never the paragraph.

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
