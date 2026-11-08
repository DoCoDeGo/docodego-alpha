---
name: 130-grill-scaffold
type: unit
status: delivered
epic: 010-canon-spec-7
retired_on: 2026-11-08
was: 130-grill-scaffold
---

# 130-grill-scaffold

## intent

The grill's answers contract is the tooling quirk that bit hardest:
three failed rounds sit in this record, two independent agents hit the
same wall in the two-agent acceptance without conferring, and the
fleet audit called the contract "folklore" — reverse-engineered from
gate source. The investigation (Finding 7) priced the class and found
the twist: the structured GQ-keyed answers format shipped in v0.4.0
and round-trips fine; what is broken is discoverability and
diagnostics. The help text teaches only the legacy positional format,
the legacy parser silently pads short files and silently ignores
extra lines, and a failing round prints bare `verdict: fail` without
naming which questions went unanswered or how many answers were
expected. The unit makes the tool generate its own input and explain
its own refusals: `grill --scaffold <file>` writes the keyed skeleton
with every question's id and text under a contract-and-ephemeral
header (the agent fills in place — the merged-`\n` variant becomes
unwritable); a failing round names the empty ids and the expected
count, with the scaffold command as the suggested fix; `--help`
teaches both formats; and a regrill of a scored unit prints the hint
that grilling demotes it (the silent `scored → grilled` flip, IMP-17's
stopgap). Errors that name what they saw are the whole point: the
gate should refuse its own authors' answers the way it refuses
everyone else's — with the reason attached.

## scope

In: the `--scaffold <file>` value flag (writes the skeleton, prints
the fill-and-run line, records nothing), fail diagnostics (empty ids
+ expected count + scaffold suggestion, both formats), the grill
`--help` body documenting both formats and the scaffold, the
scored→grilled hint. Out: `docodego patch` (deferred to evidence per
Finding 7), the proof-path refusal listing its tokens (different
command, rides a later unit), TTY flow changes, verdict semantics
(what passes is untouched), AGENTS.md (no payload bump — this unit is
source-only; adopters gain it on the next cli update).

## acceptance

- AC1 — `grill <unit> --scaffold answers.txt` writes a keyed skeleton
  carrying every question id and its text under a header that states
  the contract and the file's ephemerality; comment lines do not
  parse as mapping lines; the command records no grill round and
  prints the fill-and-run line.
- AC2 — the all-filled scaffold answers a real round: parse errors
  zero, verdict pass, round-tripped through the same parser a
  hand-written file uses.
- AC3 — a scaffold with one answer deleted fails the round naming the
  missing id and the expected count; a legacy file two lines short
  also names the count (no more silent padding as the only signal);
  both outputs suggest the scaffold command.
- AC4 — `docodego help grill` (and the help registry) documents both
  answers formats, the scaffold, and the count contract (four fixed
  plus one per acceptance criterion).
- AC5 — regrilling a scored unit prints the demotion hint
  (scored → grilled; re-run score before deliver); no payload drift:
  bundle verify stays clean at spec 10, canon suite green.

## threats

- The scaffold teaching a format the parser then rejects — the
  generator and the parser must agree by construction. Mitigation: the
  scaffold emits exactly the GQ_KEY shape, and AC2's proof runs the
  scaffold output through the real parser on a real round.
- Diagnostics leaking into the record (the grill.md round must stay
  the evidence; hints live on stderr/stdout only). Mitigation: hints
  and diagnostics print to the streams, never append to files.
- The ephemeral header being ignored, scaffold files accumulating in
  records. Mitigation: the header states ephemerality; the studio
  hard rule 11 already carries the discipline; lint's DG-S005 catches
  stray root entries but a answers.txt inside a unit is harmless
  scaffolding — acceptable residue, disclosed here.
