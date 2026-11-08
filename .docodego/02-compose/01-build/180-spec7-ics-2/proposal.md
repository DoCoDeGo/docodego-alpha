# ICS 2.0 — the redesign proposal

Status: **proposal — awaiting founder acceptance.** Nothing here is
adopted. The loop's own gate delivered this document; only the founder can
turn a section of it into commissioned work.

Commission (founder, verbatim, cycles.md cycle 2, 2026-11-08): *"we should
always strive to improve and do better, nothing is set in stone. ICS in my
opinion needs a significant uplift and redesign. Same goes for other
similar scorers grillers etc. We should be willing to add more dimensions
if they make sense responsibly."*

## 1 — the drift, stated precisely

The two sides disagree on the Intent Clarity Score's shape, and the code
enforces only a fraction of what either claims.

**The normative side** — apps/spec/dist/SPEC.md line 54: *"the Intent
Clarity Score (completeness, testability, unambiguity, threat coverage; at
least 60 of 100 to build, at least 15 of 25 on threat coverage, no
dimension at zero)"* — four dimensions, three floors:

| F1 | total ≥ 60 of 100 |
|----|-------------------|
| F2 | threat coverage ≥ 15 of 25 |
| F3 | no dimension at zero |

**The shipped side** — apps/cli/src/passes/score.ts: five passes with
five different maxima:

| pass | function | max | line |
|---|---|---|---|
| completeness | `completeness()` | 25 | score.ts:67 |
| unambiguity | `vagueness()` | 25 | score.ts:98 |
| testability | `testability()` | 25 | score.ts:121 |
| threat | `threat()` | 15 | score.ts:133 |
| anti-gaming | `gaming()` | 10 | score.ts:140 |

Three named divergences:

1. **Shape.** Four dimensions (spec) vs five passes (tool). The tool's
   anti-gaming pass exists nowhere in the normative text.
2. **Maxima.** The spec's floor F2 says "15 of 25" — the threat dimension
   is normatively worth 25. The tool's threat pass maxes at 15, so the
   spec's own floor is unreachable in the shipped form: a tool-perfect
   spec scores 100 with threat at exactly 15, never 25.
3. **Floors.** Of the three normative floors, the delivery gate enforces
   exactly one (G2, deliver.ts:2 — "score >= 60", which is F1). F2 and F3
   are enforced by neither the scorer (it enforces nothing; it is a
   calculator) nor the gate (it reads only the total). The spec's threat
   floor and its no-zero floor are prose today.

Also worth naming: what "threat coverage" measures. The tool's threat
pass awards full marks for *a non-empty threats section* — one threat
with a mitigation phrase scores the same as ten real ones. The spec's
floor implies a coverage idea (15 of 25) the implementation never
approximates.

## 2 — the redesign principles

Three principles, in priority order. They are the proposal's spine; the
sections after them apply them.

### 2.1 — satisfiability is a gate, not points

The score's deepest failure is invisible to it: a spec can measure 100/100
and carry criteria no run could ever satisfy. Points reward grammar; they
cannot reward truth. The redesign promotes satisfiability from an
implicit hope to an explicit gate:

- **Definition.** Every acceptance criterion names an observation that
  could fail it — a command whose output could differ, a file that could
  be absent, a count that could land low. If no imagined observation
  could distinguish the criterion passing from failing, the criterion is
  unsatisfiable-as-written.
- **The refusal rule.** Any unsatisfiable criterion ⇒ gate refusal,
  regardless of the total. 100/100 with one unsatisfiable criterion does
  not build. This is the gate the score's floor always pretended to be.
- **Worked example (this repo's own record).** 160-spec7-bundling's
  drafts carried "the mirror refresh derives from payload bytes (hand
  constant deleted)" — satisfiable (the constant's absence is observable
  in the file). Contrast a criterion like "the bundling is robust and
  clean" — no observation could fail it, so it gates nothing; under the
  refusal rule it would bounce the spec back to the author with the
  reason named, not silently ride a high total.

Mechanization note: satisfiability detection starts deterministic
(negative scan for the known non-observable shapes: no verb, no object,
no comparison class) and stays honest about its limit — a deterministic
scan cannot prove satisfiability, only catch recognizable
unsatisfiability. The deep form stays with the grill round's per-criterion
questions (which already ask "how is this verified end-to-end").

### 2.2 — deterministic checks first, and only deterministic checks gate

Everything greppable or parseable is checked deterministically and
reported as a fact. Sections present, placeholders from the scaffold
still speaking, observable verbs in criteria, threats carrying
mitigations, duplicated blocks, floor arithmetic — these are not
judgments and must never be presented as if they were. In the redesign,
**only deterministic checks gate.** A spec builds or refuses on facts.

### 2.3 — judged work is labeled as judged

Some dimensions genuinely involve reading prose for meaning — that work
is judgment, and the report must say so. Two honest forms:

- **Judged-proxy (deterministic).** The check is a deterministic proxy
  for a judgment (a vague-word list for unambiguity). It gates only as
  itself — a wordlist hit is a wordlist hit — and is labeled so a
  stranger sees the proxy, e.g. `unambiguity (proxy: wordlist) 25/25`.
- **Advisory (LLM or human read).** A real read of intent quality or
  threat realism belongs to an LLM or human reader. CodeJudgeBench's
  finding — LLM judges are unstable — means such reads never gate and
  never merge into the gated number. They report as advisory lines
  (`advisory — intent reads as clear (llm, unverified)`) that a human
  weighs. Nothing advisory can block a build, and no advisory line can
  silently upgrade itself.

The redesigned score report separates the three tiers by construction:

```
score 87/100 — floor 60
  gates      satisfiable-criteria: pass · placeholders: none · duplicates: none
  facts      completeness 25/25 · threat coverage 25/25 (2 threats, mitigations named)
  proxies    unambiguity (proxy: wordlist) 22/25 — "eventually"x1, "some"x1
  advisory   intent reads as clear (llm, unverified) — not gating
```

A stranger reads the shape and knows exactly what the machine verified,
what it proxied, and what it merely read.

## 3 — the incumbent, classified

| incumbent pass | max | class | disposition in the redesign |
|---|---|---|---|
| completeness | 25 | deterministic (fact) | stays; a fact line |
| unambiguity (`vagueness`) | 25 | judged-proxy (wordlist) | stays, honestly labeled a proxy |
| testability | 25 | deterministic proxy (observable-verb scan) | split: the observable scan stays a proxy; deep satisfiability moves to the 2.1 gate |
| threat | 15 | deterministic but vacuous (non-empty ⇒ full marks) | redesign required: max to 25 per the normative text; scoring must discriminate (threats with named mitigations, weighted, not presence-only) |
| anti-gaming (`gaming`) | 10 | deterministic (fact) | stays as a fact/gate (duplicated blocks), exits the scored dimension set |

The vacuity in the threat row is the sharpest finding: a pass that
cannot distinguish one real threat from ten placeholder ones is not
measuring coverage, it is measuring file layout.

## 4 — dimension-addition criteria, and candidates

The founder commissioned "more dimensions if they make sense
responsibly." Responsibility needs a bar. A candidate dimension joins
only with all four:

1. **Written definition** — what it measures, one paragraph, no thesaurus.
2. **A check** — deterministic, or an honestly-labeled proxy per 2.3.
3. **A disposition** — a floor (gating) or advisory (non-gating), chosen
   on purpose.
4. **A unique failure mode** — a bad spec it catches that no existing
   dimension catches, with an example.

Candidates (presented, not adopted — each is a founder decision):

- **evidence-plan linkage.** Each criterion maps to the surface that will
  prove it (a command, a file, a suite). Catches: criteria that are
  satisfiable in principle but name no proving surface — the "proofs
  invented at delivery time" smell. Disposition: floor (deterministic:
  every criterion line carries a verifiable surface token).
- **scope-exclusion honesty.** The Out scope names at least one concrete
  refusal. Catches: units whose scope is a universe ("everything the
  feature needs") — the unbounded-unit smell. Disposition: floor
  (deterministic: out-scope section present and non-generic).
- **reversibility.** The unit names what gets torn out if it is wrong
  (files, flags, record rows). Catches: irreversible-feeling changes
  sneaking in unreviewed. Disposition: advisory first (deterministic
  presence check is easy; judging adequacy is not).
- **cost-of-verification.** The unit states roughly what proof costs
  (suite minutes, fixtures needed). Catches: specs whose acceptance is
  affordable to claim but expensive to run — the never-re-run spec.
  Disposition: advisory.

Declined-for-now (stated so the refusal is visible): style dimensions
(tone, length — no unique failure mode), team-process dimensions (the
record measures the work, not the workers — the spec's own "Not a
ranking" law).

## 5 — the migration path

Two named options; the founder picks one (or amends).

**Option A — spec-shape alignment (small, honest, now).** The tool is
brought to the spec, then the floors are enforced: threat max 15 → 25
(with discriminating scoring, not presence-only); anti-gaming leaves the
scored set and becomes a delivery-gate check; the gate enforces all three
normative floors (F1 total, F2 threat, F3 no-dimension-at-zero). Nothing
else moves. Cost: a day of scorer + gate work and a conformance round.
Gain: the shipped tool and the normative text become the same object;
the two dead floors wake up. The deeper redesign (2.1–2.3) remains a
follow-up.

**Option B — the full redesign (the principles above).** The report
becomes tiers (gates / facts / proxies / advisory); satisfiability
becomes a gate-level refusal; threat scoring discriminates; the score
stays a diagnostic over a gate set that refuses on facts. Cost: the
scorer, the gate, the report shape, conformance, the help text, the
canon text amendment (spec patch) — a full child of its own with its own
grill round. Gain: the score stops pretending; every number's nature is
visible; the floor lies become impossible.

Sequence note: A is a strict subset of B's first milestone. Doing A now
and B later loses no work; B alone leaves the floors dead for as long as
B takes.

**The gate family path (grill, coverage — "same goes for other similar
scorers grillers etc.").** The same three principles apply as scrutiny
questions, not a redesign in this child: which grill checks are
deterministic (question count, per-AC coverage, author≠griller) vs
judged (question quality)? Does coverage gate or report? Follow-up
children, one per gate, commissioned only after the founder picks an ICS
direction — the ICS decision is the template the other gates inherit.

## 6 — the founder decision points

One sitting, seven answers:

1. **Direction:** Option A now (align + enforce floors), Option B
   (full redesign), or A-then-B?
2. **Threat maxima:** confirm threat coverage is normatively worth 25
   (the floor "15 of 25" implies it) — yes/no?
3. **Anti-gaming:** leave the scored set and become a gate fact —
   confirm?
4. **Satisfiability gate:** adopt the refusal rule (unsatisfiable ⇒
   refuse regardless of total) — yes/no? (Needed for B; harmless
   without it.)
5. **Report shape:** adopt the four-tier labeled report (gates/facts/
   proxies/advisory) — yes/no?
6. **Dimensions:** which of the four candidates (evidence-plan linkage,
   scope-exclusion honesty, reversibility, cost-of-verification) are
   commissioned, at which disposition (floor/advisory)? Any to add?
7. **Gate family:** commission the grill/coverage scrutiny children
   after the ICS direction lands — yes/no?

Until answered, the incumbent five-pass form ships unchanged, and the
canon text remains the normative side (its 1.0.2 note already says the
tool's output is the incumbent being redesigned).
