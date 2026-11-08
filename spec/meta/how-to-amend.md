# How to amend

*The System amends the way its record does: by appending. Law files are never edited in
place.*

## The procedure

1. **Scaffold.** `canon amend` creates the amendment file in
   [../amendments/](../amendments/) with the law's anchor, the current version's hash, and
   the three questions an amendment must answer: what changed, why, and what risk it
   answers (EL-30). The scaffold is a starting point, never a verdict.

2. **Grill it.** The amendment gets the same treatment as a spec: ten to fifteen hard
   questions from someone other than its author, every question answered. An amendment
   that cannot survive its own grilling does not proceed.

3. **The owner signs.** `docodego sign-off` records the decision — the words
   verbatim, beside the sha256 of the exact text signed (EL-19), with the
   identity derived from git or system details (or a typed `--by`), and the
   words scanned for secrets before anything is stored (a secret-shaped
   match refuses the act — verbatim text is stored whole or not at all).
   A form that lets work ship without a named person's signature is not a
   form of the System — and an amendment is the highest-stakes work the
   System ships. (`docodego sign` signs a delivery unit at the launch
   tier; amendment sign-offs are this command's act.)

4. **Two sides flip.** The amended law's file gains the new version with `amended-in` (or
   `withdrawn-in`), keeping its anchor forever; the old text moves to the amendment file,
   never deleted (EL-17). Both sides happen in one delivery unit, or neither does.

5. **The chain extends.** The amendment records the previous version's hash so
   `canon verify` can re-derive the chain from 1.0.0 to now (EL-20: hashes detect, humans
   declare).

6. **The log grows.** One row in [../amendments/log.md](../amendments/log.md): version,
   date, what changed and why, word counts before → after. Word-counted change lists are
   the habit the Guide keeps, so this spec keeps it too.

## Version bump rules

The spec's version is its own semver axis, independent of the payload's `specVersion`
(which stamps which spec a tool's bundled payload carries) and of any CLI's version. Three
axes; nobody may infer one from another (EL-20).

| Bump | When | Example |
|---|---|---|
| **MAJOR** | published statute words change, or a law's normative meaning reverses | a statute's published line reworded; a veto becomes warn |
| **MINOR** | a new law, a new gate, or a normative addition to an existing law | a new engine law; a floor introduced |
| **PATCH** | completions, limits, typos, non-normative clarification, wording that carries no new duty | a limits section gains a case; an example corrected |

The published statute words (ST-1…ST-16) change rarely, and each change is recorded word
for word, with the reason.

## Special duties

- **Anti-capture.** An amendment touching the Anti-Capture section of
  [../SPEC.md](../SPEC.md) must state, for each of the five, how it still holds after the
  change. If any of the five would no longer hold, the amendment does not proceed.
- **Build order.** `canon build` must pass (lint, verify, version sanity) before an
  amendment is committed. `canon doctor` runs before any payload-changing amendment rides
  a release.
- **One delivery unit.** The amendment file, the law file's flip, the log row, and the
  rebuilt index commit together, or not at all.
