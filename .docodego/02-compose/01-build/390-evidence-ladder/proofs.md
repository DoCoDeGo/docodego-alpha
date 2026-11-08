# proofs — 390-evidence-ladder

- AC1 — the registry ships with declared strengths: four types
  (suite-run, test-transcript, screenshot, session-recording), each a
  one-line strength description, exported from the bundled payload —
  `proofs/conformance.txt`, fact "the evidence registry ships with
  declared strengths, described never ranked" (343 checks green at
  HEAD).
- AC2 — the checker holds the ladder: a proofs.md declaring
  `[evidence: vibe]` is flagged DG-C019 (drift warning, the registry
  named, exit 0 — errors alone fail check); the declared type checks
  clean with no DG-C019; the same unknown declaration in a demo
  how-to-run.md is flagged naming the bundle's own path —
  `proofs/conformance.txt`, checks "an unknown evidence declaration is
  flagged", "a declared registry evidence type checks clean", "the demo
  bundle is scanned too".
- AC3 — the grammar is taught where evidence lives: the demo scaffold's
  visual-evidence section names the declaration form and the registry;
  the payload AGENTS.md carries the sentence; the teach fixture proves
  inserted-in-shipped-v21-bytes, idempotence, customized-copies-kept —
  `proofs/conformance.txt`, facts "the demo scaffold teaches the
  declaration grammar", "the payload's AGENTS.md teaches the
  declaration sentence", "the evidence teach …".
- AC4 — the ladder is honest: registry 21 → 22 with the teach step, the
  transition mirror green with the v21→v22 hop, record manifest 22,
  bundle verify clean (52 files, boundary v2 — unchanged) —
  `proofs/conformance.txt`, `proofs/bundle.txt`.
- AC5 — the pages match: the DG-C019 explain page generated, docs
  drift-free — `proofs/conformance.txt`, check "generated docs match
  their registries".
- AC6 — the suite green at the new pairs: conformance green, tsc clean,
  canon no-drift at spec/ 1.0.13 · delivered 1.0.13, payload spec 22 —
  `proofs/conformance.txt`, `proofs/tsc.exit`, `proofs/canon.txt`,
  `proofs/bundle.txt`.

Deliverable commit first (the drift gates hold at HEAD — the 290
precedent); the proofs were captured green at that HEAD and this
record commit follows them. This unit's compose-log row carries its
declared deviation (the browser-contention half stays out) — the
380 contract's first live use.
