---
reader: the agent composing UI surfaces
fails-when: an animated surface ships and prefers-reduced-motion still renders motion
enforced-by: practice: the launch-auditor checklist's reduced-motion item — emulated-context evidence in the unit's proofs
paths:
  - "**/*.tsx"
  - "**/*.css"
---

# Reduced-motion is a collapse, not a suggestion

`prefers-reduced-motion` collapses every animated element to its final
static state. Verify in an emulated reduced-motion context; a claim
without the context is unverified. The instrument is the launch-auditor
checklist's reduced-motion item — the proof is a screenshot or driver
transcript from the emulated context, named in the unit's proofs.md.
