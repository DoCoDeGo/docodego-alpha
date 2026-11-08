# the teach, staged — "the second use" section for AGENTS.md

Status: **staged, not landed.** Per the spec (AC4) and the held-chain
rule: the AGENTS.md "second use" teach rides the SW-080 payload batch
(recordVersion 25), not a bump of its own. No payload byte moves in
this unit — `bundle:verify` stays at spec 24 and this file is the
draft's home until that batch opens.

## The section text (verbatim, as it will ship)

```markdown
## The second use — anything built here works twice

Dual use is structural practice here, not a slogan: every artifact
family names its second audience or honestly records that it has
none (the inventory: `.docodego/02-compose/01-build/470-dual-use/inventory.md`).
The worked pairs: the conformance fixtures prove the engine and their
curated set demos it (`docs/fixtures-demo/`); the proofs bind
evidence at deliver and teach a cold contributor how to verify; the
spec tree governs the build and `canon publish` renders it as the
public site; the explain pages fix refusals and gloss the law.

Before delivering: ask whether what you built teaches someone who
was not in the room. If yes, name the second audience where the
artifact lives. If no, say so — a recorded "none yet" beats an
invented audience.
```

## The insertion point (anchor)

In the payload's AGENTS.md template (`apps/cli/src/bundled/`, the
record README's how-to-work section), insert immediately **after**
the section that ends with the loop's RE step — the anchor bytes are
the current template's closing line of the "the loop" section (the
exact byte string is captured at implementation time from the
shipped template; the migration's anchor-teacher matches on it, so
customized records keep their words and receive the section as a
`.new` sibling — the established conservative contract).

This repo's own AGENTS.md gets the same section, hand-placed after
its "The loop" section, in the same SW-080 batch (the repo's copy is
the template's source of truth for the wording above).

## The migration step (sketch)

- Migration `v24 -> v25` (rides SW-080's recordVersion 25 hop, one
  `teachDualUse` anchor-teacher beside SW-080's own transforms):
  - notes: the founder's cycle-6 dual-use ruling (verbatim from
    cycles.md) + the inventory and fixtures-demo paths;
  - anchor: the loop-section closing line in the shipped v24
    template; present-sentinel: the "second use" heading (a record
    already taught is skipped); absent both: the section lands as
    `AGENTS.second-use.new.md` beside the customized original;
  - no record-file transforms — the teach is the only move.
- Conformance at that batch: the v25 block pins the teach (the
  fixture's fresh record carries the section; a customized record
  gets the `.new` sibling; re-upgrade is idempotent).
