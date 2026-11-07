# Gates and severity

*What must pass before work moves, and what happens when it does not.*

## The delivery gates

`docodego deliver` is the gate. All four must pass; any fails, it lists the gates and writes
nothing:

| Gate | Checks |
|---|---|
| **G1** | the spec is complete — every section present or its absence declared (the Declared Omission Rule) |
| **G2** | the Intent Clarity Score is at least 60 of 100 |
| **G3** | the latest grilling passed — every question answered |
| **G4** | `proofs.md` names at least one path that exists |

### The Intent Clarity Score

Scored across four dimensions — completeness, testability, unambiguity, threat coverage —
out of 100. At least **60 of 100** to build; at least **15 of 25** on threat coverage; **no
dimension at zero**. Unreplaced template text earns no completeness points. Thresholds may be
calibrated; floors may not. Form is scored; perception (does it look and feel right?) is
judged beside it, never by the tool. The score is a gate, not a target — "a team that likes
numbers will raise its scores and skip the grilling. The score is a floor; the grilling reads
for truth. Do both."

> **Open conformance question (founder to rule, spec 7):** the canon carries two forms — this
> four-dimension score (Guide G9.2; the canon receipt "score 78, threat 19"), and a five-pass
> form in the tool appendix (completeness 25, unambiguity 25, testability 25, threat 15,
> anti-gaming 10). This spec encodes the four-dimension form as normative, with
> satisfiability admitted as a gate-level check (unsatisfiable criteria fail) rather than a
> scored dimension. If the founder rules otherwise, this section is amended and the change
> list records it.

### Exit codes and the envelope

Across every command: **0** success · **1** a gate, check, lint or grilling failed · **2** a
usage error · **3** the record is missing or corrupt. With `--json`, one object: `schema`
(`docodego/<command>/v1`), `ok`, and `data` or `error` (a code, a message, `diagnostics`
beside it — severity, rule code such as `DG-C002`, message, file/line/column). A result goes
to standard output; an error envelope, `ok` false, to standard error.

## Severity

| Severity | Meaning | Effect |
|---|---|---|
| **veto** | the law is absolute; violating it voids the unit's evidence | a gate, check or lint finding of this severity blocks delivery |
| **warn** | the law names a posture or a threshold; violations are recorded | findings surface on the trail and in review; they do not block |

Severity lives in each law's frontmatter and is enforced by the gates named there.

## What the tool cannot check

It cannot check understanding — it can require an explain-back and see that it is there;
whether the signer understood is theirs to answer. It cannot judge perception, whether a
screen is clear or a sentence kind. It cannot decide which problem is worth solving, which
idea to set down, or who should sign. Those stay with people, in every mode — which is the
point.

## The two live signals

Two signals stay live in every team, wired with three things — the line, the action when it
is crossed, and who takes it: **first-pass acceptance** and **how fast drift is noticed**.
"A signal with no action wired to it is decoration." Resist adding more: everything else a
tool can count is a check that passes or fails.
