# proofs — 450-sign-flow

- AC1 — the derived path signs: conformance check "sign passes with no
  --by — the identifier derives, declared headless" over a scratch
  record walked to launch-passed; the receipt names an environment
  identity and its kind and carries no typed line. Evidence: the
  conformance run — `[evidence: suite-run]`
  `apps/cli/src/conformance.ts` (the v13 derived-unit block).
- AC2 — the typed identifier still overrides and is quoted verbatim:
  conformance checks "sign passes with a typed identifier, declared
  headless", "the receipt quotes the signer verbatim", "the receipt
  names the typed identifier as typed". Evidence: the conformance run —
  `[evidence: suite-run]`.
- AC3 — headless stays first-class: "sign without --yes on a headless
  run refuses (DG-U118)" plus "the unconfirmed signature planted
  nothing" (the ledger file never created), and the second-signature
  refusal (DG-U113) unchanged. Evidence: the conformance run —
  `[evidence: suite-run]`.
- AC4 — the wording census, run 2026-11-08:
  `grep -rn "legal name"` over apps/ spec/ docs/ AGENTS.md .agents/
  (dist excluded) — every surviving hit is history or the teach's own
  byte-anchor: migrations.ts:158 and :557 (the shipped-v13 teach and
  additions blocks — rewriting them falsifies what older records were
  taught), migrations.ts:260/:388/:395 (the v24 migration's own notes
  and SIGN_LINE_ANCHOR, which must hold the shipped-v23 bytes to
  recognize them), version-transition.md:75 (the v24 row describing
  the rewording), the accepted amendment texts (1.1.0-EL-33-new.md,
  1.1.0-EL-34-new.md — never edited), log.md:36 and 1.2.3-EL-34.md (the
  amendment quoting the before → after and the founder's verbatim
  words). Live surfaces — help.ts, args.ts, explain.ts, launch.ts,
  sign.ts, sign-off.ts, the payload AGENTS.md template, this repo's
  AGENTS.md, docs/commands/* (regenerated) — all read "legal identifier
  or handle". Evidence: the census output above, reproducible by the
  grep — `[evidence: suite-run]`.
- AC5 — the amendment chain verifies cold: canon lint · 49 file(s) · 33
  law(s) · 0 error(s); canon build · 48 file(s), 33 law(s), structure
  c50483391af9… · SPEC.md, law-index.json, manifest.json; canon verify
  · 20 live CLI command(s) · 0 error(s); the sign-off line "SIGNED-OFF
  spec/amendments/1.2.3-EL-34.md — 2026-11-08 · system identity · law
  sha256 16f8161bafc1… · pending block replaced" — the founder's words
  verbatim in the amendment file, scan clean. Evidence: the canon
  runs — `[evidence: suite-run]`; the amendment file itself is the
  signed artifact.

Declared limit: the interactive confirmation prompt ("sign and
approve? [y/N]") cannot run headless — the suite pins the refusal and
the --yes paths around it; the prompt path was exercised by hand at
delivery and refused correctly on a declined answer (nothing appended).

Known gap declared, not fixed here: `canon diff` compares frontmatter
fields, so a body-only wording amendment reports "no changes" — the
scaffold's "canon diff hands you this list" over-promises for exactly
this amendment's shape. Candidate row for the next catalog or the
SW-080 bump batch; not widened in scope mid-unit.
