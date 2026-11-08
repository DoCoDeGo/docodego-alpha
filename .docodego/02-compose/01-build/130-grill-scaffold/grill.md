## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Ships grill --scaffold plus fail diagnostics: the tool generates its own input — a keyed skeleton with every question id and text under a contract-and-ephemeral header — and a failing round names the empty question ids and the expected count with the scaffold command as the fix; help teaches both answers formats and a regrill of a scored unit prints the demotion hint.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: A scaffold round-trip on a real unit, an all-filled scaffold delivering verdict pass through the real parser, a one-answer-deleted scaffold and a short legacy file both failing with the missing ids and expected count named, the help body captured, and a scored-unit regrill showing the hint — all in proofs/.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The generator teaching a format the parser then rejects. Mitigation: the scaffold emits exactly the GQ_KEY shape and AC2's proof runs the scaffold output through the real parser on a real round.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: docodego patch (deferred per Finding 7), the proof-path refusal listing its tokens, TTY flow changes, verdict semantics, and AGENTS.md — source-only, no payload bump.
- GQ-AC1 asked: Criterion: 'AC1 — `grill <unit> --scaffold answers.txt` writes a keyed skeleton carrying every question id and its text under a header that states the contract and the file's ephemerality; comment lines do not parse as mapping lines; the command records no grill round and prints the fill-and-run line.' — how is this verified end-to-end?
  answered: The scaffold command writes the keyed skeleton with all nine ids and their texts under the contract header, records no round, and prints the fill-and-run line, and its comment lines never parse as mapping lines.
- GQ-AC2 asked: Criterion: 'AC2 — the all-filled scaffold answers a real round: parse errors zero, verdict pass, round-tripped through the same parser a hand-written file uses.' — how is this verified end-to-end?
  answered: An all-filled scaffold round-trips through the real parser with zero errors and delivers verdict pass on a real grill.
- GQ-AC3 asked: Criterion: 'AC3 — a scaffold with one answer deleted fails the round naming the missing id and the expected count; a legacy file two lines short also names the count (no more silent padding as the only signal); both outputs suggest the scaffold command.' — how is this verified end-to-end?
  answered: A scaffold with one answer deleted fails the round naming that id and the expected count, and a legacy file two lines short names the count too, both suggesting the scaffold command.
- GQ-AC4 asked: Criterion: 'AC4 — `docodego help grill` (and the help registry) documents both answers formats, the scaffold, and the count contract (four fixed plus one per acceptance criterion).' — how is this verified end-to-end?
  answered: The grill help body documents both answers formats, the scaffold, and the count contract of four fixed questions plus one per acceptance criterion.
- GQ-AC5 asked: Criterion: 'AC5 — regrilling a scored unit prints the demotion hint (scored → grilled; re-run score before deliver); no payload drift: bundle verify stays clean at spec 10, canon suite green.' — how is this verified end-to-end?
  answered: Regrilling a scored unit prints the scored-to-grilled demotion hint with the re-run-score advice, and bundle verify stays clean at spec 10 with the canon suite green.

verdict: pass
