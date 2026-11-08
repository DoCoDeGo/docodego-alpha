# proofs — 260-payload-interface-dedupe

- AC1 — the types are declared once: the conformance facts count
  declarations across the three files (types.ts 2, bundle.ts 0,
  payload.ts 0) — the "payload types are declared once" facts in
  `02-compose/01-build/260-payload-interface-dedupe/proofs/conformance.txt`.
- AC2 — the generated payload imports the shared types
  (`import type { Payload, SkillIndexEntry } from "../types.ts"`,
  payload.ts line 6) and re-exports them; its consumer
  bundled/index.ts is untouched — the "imports the shared types" fact,
  same capture.
- AC3 — the regenerated payload's data is unchanged: bundle verify
  clean, 51 files, spec 14, structure hash identical —
  `02-compose/01-build/260-payload-interface-dedupe/proofs/bundle.txt`.
- AC4 — tsc green (the compiler now watches the one declaration),
  conformance 279 green, canon lint/verify green —
  `02-compose/01-build/260-payload-interface-dedupe/proofs/tsc.exit`,
  `02-compose/01-build/260-payload-interface-dedupe/proofs/conformance.txt`,
  `02-compose/01-build/260-payload-interface-dedupe/proofs/canon.txt`.
