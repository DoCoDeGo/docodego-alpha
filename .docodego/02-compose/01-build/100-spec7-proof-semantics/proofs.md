# proofs — 100-spec7-proof-semantics

- AC1 — the scaffold: `canon amend EL-18 --as 1.1.0` wrote
  `canon/amendments/1.1.0-EL-18.md` carrying the law's anchor, the
  delivered baseline's structure hash (ba9b542a66c9…), and the three
  questions (what changed, why, what risk — EL-30); the drafted text
  answers all three, and the amendment names the pending state in its
  own header (it changes nothing by itself).
- AC2 — the five proof semantics carried and grilled: the amendment's
  What changed carries the five semantics as the proposed law text
  (resolves · reproducible · failure-is-evidence · narration-is-not-
  claim · guards baseline the delivered state); twelve questions from a
  non-author, every answer recorded, six revisions applied and listed:
  `canon/amendments/1.1.0-EL-18.md` (## Grilling)
- AC3 — the status-rails new-law draft reaches the same bar: ten
  questions, every answer recorded, six revisions applied — including
  the real correction that retirement stamps the tomb rather than
  minting a status — with its enforceability named exactly (which gate
  sets which status, what detects gate-less moves today, what will
  refuse them, and which unit carries it):
  `canon/amendments/1.1.0-EL-33-new.md` (## Grilling)
- AC4 — the tree stays green with the proposals present: canon lint
  0 errors, canon verify 0 errors, build byte-unchanged at the
  delivered 1.0.2 structure hash ba9b542a66c9… (draft amendments
  excluded from the tree identity — a pending proposal is not the
  delivered surface), doctor no drift, tsc clean:
  `02-compose/01-build/100-spec7-proof-semantics/proofs/canon-lint.txt`,
  `02-compose/01-build/100-spec7-proof-semantics/proofs/canon-verify.txt`,
  `02-compose/01-build/100-spec7-proof-semantics/proofs/canon-build.txt`,
  `02-compose/01-build/100-spec7-proof-semantics/proofs/canon-doctor.txt`,
  `02-compose/01-build/100-spec7-proof-semantics/proofs/tsc-spec.txt`
- AC5 — the pending state named plainly: the founder is asked to accept
  or decline two independent texts — the EL-18 amendment (five proof
  semantics) and the EL-33 new law (statuses move through gates).
  Nothing flips on this unit's delivery: the tree stays at 1.0.2, the
  chain is unextended, and the flip + log row + 1.1.0 bump commit
  together only on acceptance (`docodego sign` records it; EL-19 keeps
  the words verbatim beside the signed text's hash). Record integrity
  holds alongside:
  `02-compose/01-build/100-spec7-proof-semantics/proofs/record-check.txt`,
  `02-compose/01-build/100-spec7-proof-semantics/proofs/record-lint.txt`

## Notes

- The verify gap this unit filled: SP-V003 refused any draft amendment
  citing its proposed law id — a new-law draft could never coexist with
  a green tree. Draft amendments (frontmatter status: draft) are now
  exempt from the active-anchor check; the same exemption was added to
  the shared tree-structure hash so build and doctor keep agreeing with
  verify (one rule, three readers, no drift). The flip brings the file
  into the hash together with the version bump — the landing stays
  guarded.
- EL-32 is reserved for the naming-law principle by the 2026-11-08
  ruling; the status-rails draft takes EL-33 and says so in its header.
- The two drafts are independent by construction (separate files,
  separate sign-offs); accepting one does not force the other.

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.
