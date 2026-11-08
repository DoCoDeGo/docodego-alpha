## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit adds one bullet to the planted AGENTS.md's honesty-law section ("Gate rows ride the unit's commit"), teaches it to existing records via a teachGateRowsHome step in a 15-to-16 migration (anchor + insert, idempotent, customized copies kept), and pays the bump chain: record manifest 16, transition-table row, spec 1.0.7 + amendment row, payload regen.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by a conformance fact reading the payload's AGENTS.md row for the bullet; AC2 by a conformance fixture running the teach step over a shipped-v15 AGENTS.md (inserted, idempotent on re-run) and over a customized one (kept, .new rides); AC3 by the mirror fact (transition table == registry) plus bundle verify clean at record 16; AC4 by conformance + tsc + canon at the 1.0.7 pair — proofs/conformance.txt, proofs/bundle.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Teaching silently rewriting a customized AGENTS.md. Mitigated: the teach contract is copied from teachNamingLaw — exact anchor match or kept-untouched with the scaffold as .new; the fixture holds both branches.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Any new DG code or check (the governance grades already enforce), the other unowned IMP items, and any change to the gate itself — out.
- GQ-AC1 asked: Criterion: 'AC1 — the planted AGENTS.md carries the bullet in the honesty-law section, and the regenerated payload ships it (a conformance-reachable fact: the payload's AGENTS.md row names "Gate rows ride").' — how is this verified end-to-end?
  answered: the fact asserts the payload's AGENTS.md row includes "Gate rows ride" — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — an existing record learns the law without spam: the teach step inserts the bullet after the "Failure is evidence" bullet in a shipped-v15 AGENTS.md, is idempotent (re-run keeps), and keeps a customized AGENTS.md untouched (the scaffold riding as .new) — mirror-image of teachNamingLaw, proven by a conformance fixture.' — how is this verified end-to-end?
  answered: the fixture runs teachGateRowsHome both ways (v15 bytes learn; customized kept) — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the ladder is honest: migration registry 15 → 16 contiguous, the transition table carries the hop (the mirror fact stays green), the record manifest declares 16, bundle verify clean at the new pair.' — how is this verified end-to-end?
  answered: the transition-mirror fact green with the new row; bundle verify clean 51 files spec 16 — proofs/conformance.txt, proofs/bundle.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite green: conformance, tsc, canon lint/verify/doctor at the new version pair (spec 1.0.7 · delivered 1.0.7).' — how is this verified end-to-end?
  answered: proofs/tsc.txt, proofs/canon.txt at the 1.0.7 pair.

verdict: pass
