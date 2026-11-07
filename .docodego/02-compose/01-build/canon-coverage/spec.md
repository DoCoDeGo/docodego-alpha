---
name: canon-coverage
type: unit
status: delivered
---

# canon-coverage

## intent

`canon coverage` turns the enforceability map from prose into data: every
law classified by what actually enforces it (command, gate, or named human
posture), a severity-weighted coverage score, orphan gates, and
`--impact <law-id>` — what loses enforcement if a law is repealed. It
exists now because the map's honest gaps (laws claiming enforcement nothing
performs) must surface mechanically, and because `amend` needs impact
before it lets anyone touch a law.

## scope

In: the `coverage` command with the classification, the weighted score
(veto 3, warn 1), orphan-gate detection, `--impact`; the spec touch-ups the
first run surfaces (enforced-by bindings aligned with observed reality,
no duty change) carried as a spec patch 1.0.1 through build's own refusal.
Out: `diff`, `amend`, `doctor`, `publish`; any new enforcement (coverage
reports, it does not gate — exit 0 is informational by design).

## acceptance

- AC1 — `canon coverage` exits 0 on the committed set and prints, per law:
  anchor, severity, mechanized yes/no, and its enforcers; the weighted
  score appears with its veto and warn split; a law with no command or gate
  lead is reported as not mechanized (never hidden).
- AC2 — `canon coverage --impact EL-21` exits 0 and names: the gates that
  law feeds, the spec files citing it, and the delivered units in this
  repository's record whose receipt rode those gates.
- AC3 — the first coverage run's real findings (EL-23 carrying no enforcer
  lead; EL-25 and EL-29 claiming `lint` where the honest state is
  direction-only) are fixed as spec patch 1.0.1: enforced-by bindings only,
  no normative text touched, amendment log row added, SPEC.md stamped
  1.0.1.
- AC4 — the patch rides build's own gates: the first build after the edit
  refuses (SP-B002, structure changed at 1.0.0), the bumped tree builds
  clean (exit 0, artifacts at 1.0.1).
- AC5 — no regression: lint, verify exit 0; `tsc --noEmit` clean; zero
  non-node imports; `--json` envelope `docodego-spec/coverage/v1`.

## threats

- coverage becoming a score to game (the metric becoming the target).
  Mitigation: coverage never gates — exit 0 informational; the score is
  reported with its veto split so a pretty total cannot hide an unmechanized
  veto law; the not-mechanized list is printed in full, never truncated.
- the patch drifting into normative edits without the founder. Mitigation:
  enforced-by bindings only; the amendment row says exactly that; statute
  words untouched.
- impact reading a record layer that may not exist. Mitigation: a missing
  record is reported calmly in the impact output (information), never a
  failure.
