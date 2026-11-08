# Review dimensions — how to grade a docodego run

**Purpose.** An instrument for reviewing or testing a product like docodego: a
law + record system that autonomous agents follow to build real products. It
grades two things at once — the *agents' conduct* and *the law's quality* —
because every defect has an attribution, and the attribution is where the
improvement lives.

Built from: the 50-cycle lived-records research
(`docs/research/lived-records-research.md`), the two-agent acceptance findings
(`docs/audits/2026-11-08-acceptance-2agent.md`), and the method's own claims. First
deployed live on the five-product creativity round (2026-11-08); log at
`docs/audits/2026-11-08-improvements.md`.

## The attribution rule

Every finding is classified before it is counted:

- **agent-defect** — the law was clear; the agent bypassed or faked it.
- **law-defect** — the agent followed the law and got a bad outcome, or the
  law is ambiguous, silent, or contradicted by the tooling.
- **healthy** — the law carried the situation; no finding.

A run that produces only agent-defects is a weak-agent problem. A run that
produces law-defects is a docodego improvement, and that is the point of
watching.

## The eight dimensions

### D1 — Entry & orientation
The agent enters through the law: reads AGENTS.md, finds the record, uses the
planted commands — the loop's spine (`new`, `grill`, `score`, `deliver`) plus
the rest of the registry (`proofs`, `audit`, `explain`, `status`, `help`) —
rather than hand-fabricating structures.
*Signals of failure:* units created by hand; parallel memory systems invented
(side docs duplicating the record); commands invoked wrongly because help was
misread.

### D2 — Cycle fidelity
Phase order holds: finding → grounding → document (spec → grill → score) →
compose → demonstrate → govern; within a unit: sketch → spec → grill → score →
proofs → deliver. No specless generation. Statuses are earned only by running
the commands that grant them. Human-approval gates are handled by an explicit,
recorded protocol when no human is present — not silently waived.
*Signals of failure:* code before spec; grill or score skipped or invented;
statuses in the tracker that no command wrote; self-granted waivers without a
recorded rule.

### D3 — Record integrity
Founder intent verbatim. Append-only: superseded text struck, never deleted.
Records before claims: every assertion links to a file holding its evidence.
Decisions logged with reasons in the cycles log. One calendar, consistent
dating. No invented parallel decision systems unless the law blesses them.
*Signals of failure:* paraphrased intent; rewrites or silent edits to record
files; claims with no evidence path; decisions split across two homes.

### D4 — Proof honesty
Proofs exist at the claimed paths, run green, and are re-runnable by a
stranger. They test the claim, not a tautology. Determinism is proven where
claimed (same input → same output, twice). Quality guards are tested with
rejections, not only acceptances.
*Signals of failure:* proof drivers that always pass; proofs testing fixtures
instead of behavior; deliver run on red proofs; "gate passed" claims with no
gate-written rows.

### D5 — Creative latitude (this round's special)
The law *enables* invention rather than gating it: the research phase
genuinely informs the design; the result is distinctive (could not be
mistaken for another product); creative calls are recorded with reasons; the
agent did not retreat to template-safe choices.
*Signals of failure:* generic output; research performed but never cited by
the design; decisions recorded as what-without-why; the record reads like
compliance, not authorship.

### D6 — Product truth
The thing actually runs end-to-end and satisfies its hard lines: privacy is
architecture (claims true at the network layer), no accounts, pay-per-use,
determinism where claimed, product-specific ethical lines (tone laws, banned
tokens, allowlists) enforced by tests, not vigilance. Scope claims are honest:
unfinished work is declared, never papered over.
*Signals of failure:* product doesn't build/run; a hard line enforced only by
copy; "complete" claims with missing rails; fake data presented as real.

### D7 — Law friction
Every place the agent struggled: misread the law, invented a workaround,
self-waived, hit a CLI trap, or needed knowledge the law never planted. These
are docodego's backlog; harvest them all, even small ones.
*Severity:* **B** — blocked trust (faked proofs, unearned status, record
rewrite) · **F** — friction (cost real time, workaround invented) · **G** —
gap (law silent, agent had to guess) · **C** — cosmetic.

### D8 — Economy
Data stored is data that will be read. Ceremony that no one reads back is
cost. Time-to-value per phase: did grounding precede build? Did the record
actually carry the next decision, or was it re-derived?
*Signals of failure:* artifacts written only for the gate; repeated research
of the same fact; phases performed twice under different names.

## Observation protocol (live runs)

1. **Rounds every ~5 minutes** while agents work: read-only snapshots per
   product — commits, dirty files, record files, unit folders, tracker and
   delivery-log tails. Never write into a working agent's repo.
2. **Tag every observation** with a dimension (D1–D8) and a provisional
   attribution; confirm or overturn on later rounds — early impressions are
   provisional by design.
3. **On completion**, run the full instrument per product: all eight
   dimensions, evidence cited, findings logged.
4. **Findings** go to the improvements log as `IMP-n | dimension | severity |
   attribution | evidence | proposed improvement`, deduplicated as rounds
   confirm them; the summary ranks what to fix.

## What "pass" means for a run

Not "the agents built great products" alone — that's D5/D6. A run passes when:
the record carried every handoff and decision (D2/D3), every claim traces to
evidence (D4), the creative work shows in the record (D5), and the law's
defects surfaced as findings rather than silent workarounds (D7). A quiet run
is not a good run; a run whose frictions are visible and harvestable is.
