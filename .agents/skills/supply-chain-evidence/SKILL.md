---
name: supply-chain-evidence
description: Records provenance for deliverables - commit hashes, level-of-effort, attestation. Use when packaging a delivery, handing work to a client or acquirer, or answering "who made this and can I trust it" - copies the SLSA/Sigstore and Trail of Bits cover-page discipline into the record so every deliverable carries its own chain of custody.
version: 1.0.0
---

# supply-chain-evidence

A deliverable without provenance is unadoptable: the acquirer's due
diligence reconstructs exactly this - AI footprint, human oversight,
level of effort - at five-figure rates. The record layer produces the
evidence as a byproduct; this skill assembles it into the deliverable's
cover page, the way Trail of Bits audit reports open with scope,
effort, and methodology.

## The cover page - assembled at packaging time

1. **Commit hashes.** The exact commits (or the diff range) the
   deliverable was built from, with the repository and the date. A
   deliverable that cannot name its own commits cannot be re-derived.
2. **Level of effort.** The record's own numbers: units, cycles,
   sessions, calendar span. Honest magnitudes, not marketing.
3. **Authorship map.** Per unit: authored-by (agent, named), verified-by
   (the instrument that ran - suite, conformance, visual driver),
   owned-by (the person who signed). Three different failure domains is
   the point - diversity of instruments, not the illusion of a second
   person.
4. **Verification chain.** Which gates ran (deliver, launch, sign), what
   they graded, and where their proofs live in the record.

## The SLSA instinct

Every claim above resolves to something checkable: a hash resolves to a
commit, a gate resolves to a proof file, a signature resolves to a
recorded founder decision. If a cover-page line cannot resolve, it does
not go on the cover page.
