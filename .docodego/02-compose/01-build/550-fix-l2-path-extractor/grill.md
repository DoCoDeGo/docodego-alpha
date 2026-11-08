## grill 2026-11-09

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Launch's L2 re-check counted backticked non-path spans (version
strings like 1.3.0) as file paths because PATH_LIKE accepts a
purely numeric tail as an extension — deliver accepted them, launch
declared them vanished. One shared extractor feeds both gates, so
the fix lands once and the gates agree by construction.

- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Conformance pins pin the exact regression: a proofs item mixing a
real backticked path with version strings extracts only the path;
the honest shapes (bare first token, backticked span, label-path,
envelope-schema skip, trailing punctuation, directory tokens) keep
extracting; the deliver warning fires for a dangling path-like span
and stays silent on a resolving proofs.md. Battery green after.

- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Overfitting to version strings alone — mitigated by naming the
principle (a separator-less token needs a letter-bearing
extension), not the example. Breaking honest shapes — the pin set
enumerates them and the full suite must stay green. A warning that
blocks — scoped non-blocking, pinned exit 0. Payload drift — out of
scope, no bundled file changes, bundle:verify clean at 27 pins it.

- GQ-4 asked: What did you deliberately leave out of scope?
  answered: A record-version hop (no record paths change); a proofs.md scaffold
or score-whys (held backlog, own batches); a founder-tier marker
(held for the founder); renaming or relocating the extractor (the
fix is inside it, callers untouched).

- GQ-AC1 asked: Criterion: 'A proofs.md list item citing a real backticked path plus version strings (`1.3.0`, `2.10.5`) extracts exactly the real path — the strings are not proof candidates, at deliver AND launch (the gates agree).' — how is this verified end-to-end?
  answered: proofPaths on a fixture item "`src/run.txt` — patch to 1.3.0 then
2.10.5" returns exactly src/run.txt; the same fixture through the
deliver gate's G4 and the launch gate's L2 extraction path resolves
identically (both call the shared extractor).

- GQ-AC2 asked: Criterion: 'Existing honest shapes still extract: bare first token, backticked span, label-then-path, the envelope-schema skip, trailing punctuation, directory tokens.' — how is this verified end-to-end?
  answered: The pin suite for honest shapes stays green: bare first token,
backticked span, label-then-path, docodego/<cmd>/v1 skip, trailing
punctuation strip, bare directory skip.

- GQ-AC3 asked: Criterion: 'Deliver warns (exit 0) when a path-looking span resolves to nothing; a fully-resolving proofs.md warns nothing.' — how is this verified end-to-end?
  answered: Deliver on a proofs.md whose path-like span misses the disk prints
a warning naming the span and exits 0; a resolving proofs.md prints
no such warning.

- GQ-AC4 asked: Criterion: 'Full battery green: check, conformance (all pins, count grows), bundle:verify clean at spec 27, pnpm run doctor, docs fresh, build 11/11.' — how is this verified end-to-end?
  answered: check 0 errors; conformance all green with the new pins; bundle
verify clean at spec 27; pnpm run doctor 9/9; docs fresh; build
11/11 — each observed and named in proofs.md.


verdict: pass
