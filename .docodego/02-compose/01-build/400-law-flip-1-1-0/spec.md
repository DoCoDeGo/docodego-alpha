---
name: 400-law-flip-1-1-0
type: unit
epic: 020-canon-debts
status: delivered
deviations: the sign command cannot sign amendment files (unit-scoped, launch-gated) — the sign-off lands in the founder-directed written form instead, with the mechanization named as direction
---

# 400-law-flip-1-1-0

## intent

One sentence: walk the founder-accepted EL-33 and EL-34 drafts into law as
spec 1.1.0 — the law files, the sign-offs, the log rows, the stamp — in the
one delivery unit how-to-amend requires, declaring the EL-32 reservation so
the landed files' citations resolve.

## scope

In: laws/33-statuses-move-through-gates.md and laws/34-the-launch-gate.md
landed byte-identical to the text their accepted drafts propose; the two
amendment files flipped from `status: draft` to `status: applied-in-1.1.0`
with sign-off sections filled per the founder's 2026-11-08 sign-off-form
directive (identity from git or system details, verbatim acceptance quote,
sha256 of the exact law text signed, secret-scan before storing, the
attestation limit stated); a Reserved-anchors declaration in the laws index
(EL-32 — the naming-law principle) and the verify pass honoring declared
reservations; two rows in the amendments log; the enforceability map gains
EL-33 and EL-34 rows; SPEC.md stamped 1.1.0; canon build artifacts current
at the commit.
Out: EL-18 (stays `status: draft` — the founder accepted the two siblings
only, and the batch's independence clause holds); any payload or
record-contract change (the spec tree ships through the canon CLI, not the
bundle allowlist — recordVersion stays 22, boundary stays 52 rows, allowlist
v2); any AGENTS.md edit (the loop and the launch/sign tiers are already
taught there); the naming decision itself (EL-32's law stays unwritten —
founder-owned).

## acceptance

- criterion one — both law files exist and their text is byte-identical to
  the blockquoted proposal in their accepted drafts; canon lint exits 0 and
  the law count rises 31 → 33.
- criterion two — canon verify exits 0 with both amendment files landed
  (no `status: draft` line): every ST/EL anchor they cite resolves, EL-32
  through the declared reservation; and a negative probe — a citation of an
  anchor that is neither active nor declared — still fails SP-V003.
- criterion three — the version circle closes: SPEC.md says 1.1.0, the
  log's last row says 1.1.0, canon build passes version sanity (never
  backwards, never a same-version content change) and rewrites the dist
  artifacts; canon doctor exits 0 — structure ok, index ok, version pair
  ok, mirror aligned — with the axes read side by side: payload 22 · cli
  0.8.0 · spec/ 1.1.0 · delivered 1.1.0.
- criterion four — each sign-off section carries the founder's acceptance
  quoted verbatim ("Accept both for signature"), the sign-off-form
  directive's terms, the environment's git/system identity, the sha256 of
  the landed law file it signs, the secret-scan note (scanned before
  storing, clean), and the attestation limit sentence; EL-18's file still
  reads `status: draft`.
- criterion five — the unchanged surfaces prove unchanged: bundle verify
  clean (52 files, spec 22, allowlist v2), conformance all green, tsc
  clean.

## threats

- the draft-exemption regex (`status:\s*draft`) gates both verify's anchor
  amnesty and build's structure exclusion — the landed status value
  (`applied-in-1.1.0`) must not match it, or the landed files silently keep
  draft treatment -> criterion two and three catch either direction.
- landed amendment files enter the structure hash for the first time, so
  the delivered manifest goes stale the moment the flip lands — canon build
  runs in this unit before the commit, and doctor's SP-F001 holds the gate.
- the sign-off's identity is environment-derived, not a typed legal name —
  the section states the derivation and the attestation limit (the record
  witnesses the act; it does not prove identity), quoting the founder's
  directive; nothing overstated.
- the reservation parser could quietly ignore a malformed row, turning a
  declared anchor back into a gap -> the declaration lives as a markdown
  table under a fixed heading, the negative probe in criterion two proves
  the mechanism distinguishes declared from undeclared, and the parser
  treats the section's presence as the declaration of record.
- EL-18's draft also proposes 1.1.0; when it lands later the version will
  already be delivered with a different structure, and SP-B002 will force a
  fresh bump — a future unit's mechanics, recorded here so nobody reads the
  proposal's version as a promise.
