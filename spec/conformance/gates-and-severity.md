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

> **The ICS ruling (founder, 2026-11-08, verbatim):** asked whether the law
> is the four-dimension form or the five-pass form, the founder declined to
> pick and ruled: *"we should always strive to improve and do better,
> nothing is set in stone. ICS in my opinion needs a significant uplift and
> redesign. Same goes for other similar scorers grillers etc. We should be
> willing to add more dimensions if they make sense responsibly."* The
> redesign is commissioned as spec 7's ICS 2.0 track — dimensions that make
> sense, added responsibly, with the grilling and the other gates under the
> same scrutiny. Until a redesign is accepted, the four-dimension form
> stays normative here; the tool's five-pass output is the incumbent being
> redesigned, not the law.

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
