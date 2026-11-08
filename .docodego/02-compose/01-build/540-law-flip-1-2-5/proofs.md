# proofs — 540-law-flip-1-2-5

The flip, proven by byte-comparison against the amendment and the
green battery in the working state (the record's delivered index and
doctor re-read HEAD, so their "current" lines name this state from
this unit's commit forward — the same delivered-baseline rule as
before; the flips themselves are in the working tree and every gate
that reads spec/ directly ran green on them now).

- AC1 — the law text: `spec/laws/34-the-launch-gate.md` now reads,
  in the founder-signed paragraph, "recorded as a versioned
  reversible encoding of it, never as it stands", and in the
  honest-limit paragraph, "An encoded identifier is concealment from
  the casual read, not cryptography: it reads plainly to whoever asks
  the CLI, and a reader who declines the CLI can reverse it in one
  step — it hides the identity from a scan, not from an
  investigator." Both passages were copied from the amendment's
  "What changed" block; the fingerprint wording and the
  privacy-not-anonymity sentence no longer appear in the law file,
  and both remain quoted in
  `spec/amendments/1.2.5-EL-34.md` — the old text is kept, never
  deleted.
- AC2 — the paper trail: the amendment's frontmatter reads
  `status: applied-in-1.2.5` with the founder's receipt block
  byte-untouched (their words "Signed Off" verbatim, the
  fingerprint-era identity line standing as recorded);
  `spec/SPEC.md` line 5 stamps **Version:** 1.2.5 (and canon build
  kept the stamp — the version line is read, not overwritten);
  `spec/amendments/log.md` carries the 1.2.5 row with the acceptance
  words verbatim and the "wording, no duty change" note.
- AC3 — the index and the mirror: `canon lint` clean (51 files,
  33 laws), `canon build` rebuilt SPEC.md, the law index, and the
  manifest, `canon verify` re-derived the chain clean at 1.2.5. The
  statutes mirror recompiled byte-identical — as scoped, law wording
  below the statute layer does not move the mirror, so the payload
  (spec 27) is untouched: bundle:verify clean at 52 files, no second
  source change at the declared version. The doctor is 9/9 healthy
  (record v27, bundled spec v27 current); `check` exits 0 with two
  pre-existing drift warnings (DG-C017) on older proofs that name
  files committed after their delivery day — recorded here honestly,
  recapture rides its own unit if the founder wants it.
- AC4 — the battery in the working state: conformance all 445
  green, bundle:verify clean at spec 27, docs fresh (25 files),
  build 11/11 gates, `pnpm run doctor` 9/9. One tooling note
  recorded: `pnpm doctor` is pnpm's own builtin health check — the
  record's doctor is `pnpm run doctor` (same collision class as
  `pnpm docs`, journaled).
