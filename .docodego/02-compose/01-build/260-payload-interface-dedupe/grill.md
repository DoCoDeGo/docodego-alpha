## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit moves Payload and SkillIndexEntry to a single declaration in types.ts; bundle.ts imports them (dropping its own copy AND the hand-copied block in the emitted template); the regenerated payload.ts imports and re-exports them; conformance facts pin the once-only law.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by a conformance fact counting interface declarations across the three files (types.ts 1, bundle.ts 0, payload.ts 0); AC2 by a fact on payload.ts's import line plus bundled/index.ts untouched; AC3 by bundle --verify clean with identical data; AC4 by tsc + conformance + canon green — proofs capture each.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: The regeneration riding a content change. Mitigation: the manifest rows and hashes recompute from the same live folders; bundle --verify and the drift gates name any data difference; specVersion stays 14.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: VocabularyPack (already single), the payload FILE manifest, any record migration, and payload data changes — all out.
- GQ-AC1 asked: Criterion: 'AC1 — the interfaces are declared exactly once: types.ts holds `SkillIndexEntry` and `Payload`; bundle.ts and payload.ts hold no `interface Payload` / `interface SkillIndexEntry` declaration text — proven by a conformance fact over the three files.' — how is this verified end-to-end?
  answered: the fact greps types.ts (one match), bundle.ts (zero), payload.ts (zero) for 'interface Payload' and 'interface SkillIndexEntry' — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — the generated payload.ts imports the types from ../types.ts and re-exports them, and its consumers are untouched — conformance fact + `bundled/index.ts` unchanged.' — how is this verified end-to-end?
  answered: the fact asserts payload.ts contains 'import type { Payload, SkillIndexEntry } from "../types.ts"' and bundled/index.ts keeps importing from ./payload.ts — proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — the regenerated payload's DATA is byte-identical to the old (same files, hashes, specVersion 14): `bundle --verify` clean, and the bundle's own shape checks green.' — how is this verified end-to-end?
  answered: bundle --verify prints clean, 51 files, spec 14 — proofs/bundle.txt.
- GQ-AC4 asked: Criterion: 'AC4 — tsc green (the compiler now watches the single declaration), conformance green, canon lint/verify green.' — how is this verified end-to-end?
  answered: tsc exit 0, conformance all green, canon lint/verify clean — proofs/tsc.txt, proofs/conformance.txt, proofs/canon.txt.

verdict: pass
