# proofs — 480-sign-identity-privacy

The consent split, proven over scratch records: every acceptance
criterion runs through the conformance suite (413 checks green) with
a fixture-controlled salt — the expected fingerprint computed in
fixture code with the same scrypt params and pinned byte-for-byte, so
no random output is ever pinned (AC8). The command pair is the
reproduction: `npm run -s conformance` and, for the payload hop,
`bundle:verify` plus `doctor` (axes printed, not inferred).

- AC1 — the derived path stores a fingerprint, never the raw string:
  conformance facts "the derived receipt stores the exact
  fixture-salted fingerprint" (byte-equality against the
  fixture-computed hex), "the derived receipt names no raw environment
  identity" (the ladder's raw string appears nowhere in the receipt),
  "the ledger carries the typed row and the fingerprint rows side by
  side", and "the --system receipt names no raw system identity". The
  receipt, the ledger row, and the tracker carry only
  `fp:v1:`-shaped values for derived signs — `[evidence: suite-run]`.
- AC2 — typed identifiers stay verbatim, by either flag, and are
  secret-scanned: "sign --name stores the typed identifier verbatim",
  "the --name receipt is byte-identical in shape to the --by receipt"
  (the alias is byte-identical behavior), and the new check "a
  secret-shaped --name identifier is refused too — the scan covers the
  typed source, whichever flag carried it" (DG-U114, nothing stored),
  beside the existing --by pins that stayed green unchanged —
  `[evidence: suite-run]`.
- AC3 — `--system` forces the environment identity: "sign --system
  stores the system fingerprint, exact hex, clause named" — the
  receipt carries the fingerprint of `user@host` computed in fixture
  code and names the kind `system` (git skipped) —
  `[evidence: suite-run]`.
- AC4 — one signer, one source: "sign --name and --system together is
  a usage refusal (DG-U111), nothing appended" plus the fact "the
  refused conflict appended nothing" (the ledger line count unchanged)
  — `[evidence: suite-run]`.
- AC5 — linkable within a record, unlinkable across records: "a
  second derived sign-off in the same record carries the same
  fingerprint" (one salt per record, so one environment reads as one
  fingerprint) and "the same environment in a second record (different
  salt) fingerprints differently" — the second fixture signs the same
  environment under a different salt and the fingerprint differs —
  `[evidence: suite-run]`.
- AC6 — sign-off mirrors the surface: "without --by the receipt names
  the derivation kind (git or system), fingerprinted, and the limit"
  (exact fp pinned), the existing `--by`/verbatim pin stays green,
  "a secret-shaped --name identifier is refused too", and "the
  sign-off salt is used, not regenerated" (the fixture's salt bytes
  identical after the run) — `[evidence: suite-run]`.
- AC7 — the honest clause travels with the attestation: the fact "the
  fingerprint clause appears wherever a signature shows — the ledger
  template, both help bodies" (SIGNATURES_TEMPLATE's header, the sign
  and sign-off help bodies), and "the fingerprinted receipt carries
  the honest clause" (the receipt itself: privacy, not anonymity — it
  resists a stranger's lookup, not a determined guesser) —
  `[evidence: suite-run]`.
- AC8 — deterministic pins: both exact-hex facts compute scrypt in
  fixture code over the fixture-written salt (32 hex, pre-written
  before the first derived sign); the "used, not regenerated" facts
  for both sign and sign-off assert the salt bytes are unchanged after
  every act — the pins are byte-equality, and the one pattern pin
  (fp:v1: shape) rides beside them — `[evidence: suite-run]`.
- AC9 — the amendment ordering holds: the scaffold
  `canon/amendments/1.2.4-EL-34.md` exists in this unit (status draft)
  with the consent-split wording; its Why cites the founder's verbatim
  addendum (cycles.md, unit 480); the founder's sign-off is the named
  next act — the law text lands only on that signature (the 450
  precedent: the flow shipped in 450, the law's rewording 1.2.3
  followed the person's recorded acceptance). Until then the receipt's
  own fingerprint clause governs what the record claims. The design
  trail: `.docodego/01-document/01-discover/research/sign-identity-privacy.md`
  (the consent-split report, recorded verbatim) —
  `[evidence: suite-run]`.
- AC10 — the payload hop lands whole, and the census holds the line:
  v25 carries teachSignIdentity + the second-use teach; the census
  then caught the staged section carrying studio-side citations (dead
  references in a planted record) after the v25 declaration — the
  bundle guard refused a second source change at a declared version,
  so the correction is declared and real: v26's repair teach swaps the
  planted dead-path lines for the clean text (v25-planted records
  re-teach; customized copies keep their words; both pinned in
  conformance — "the v26 repair swaps the planted dead paths for the
  clean text", "the repair is idempotent", "the repair keeps a
  customized AGENTS.md untouched"). version-transition.md carries the
  v24→v25 and v25→v26 rows (the hop-for-hop mirror fact green);
  bundle verify clean — 52 files, spec 26; doctor healthy with payload
  26 aligned. SW-023's twin-text dedup stays held (its site map is its
  own batch, still owed). The planted section differs from 470's
  staged draft exactly by dropping the two studio-side paths — the
  census's shipped-paths fact is the binding. Mistake 5 (the census
  firing after the declaration) is recorded in the cycles ledger with
  its mitigation — `[evidence: suite-run]`.

The cycle rhythm, on this unit's own delta: the gate refuses, verbatim
(baseline = the 460-after snapshot; 470 added no apps code):

> error[DG-U120]: cli/src/conformance.ts grew +139 lines — the growth
> ceiling is 40 (surgical changes: extract, split, or cover the
> addition with --retires)

The measured delta: 85 files/12,889 lines before, 86 files/13,279
after (+390; the one new file, identity.ts, is under the derived
ceiling — the growth check is the binding one). The refusal rides the
tracker row with the declared coverage: the founder's directive ordered
the consent split into existence, and the suite's growth (+139) IS the
enforcement's growth — the pinned teach contracts, the exact-hex
fingerprints, and the repair facts are the lines added. The held
refactor debts (SW-023, SW-078) are the recorded retirement that pays
against this balance in later cycles.

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.
