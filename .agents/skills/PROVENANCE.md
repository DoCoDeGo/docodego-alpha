---
version: 1.0.0
status: vendored copy — read-only; the upstream governs every change
upstream: the docodego project's skill family — the template source this seed was vendored from
updated: 2026-11-03
---

# Provenance — .agents/skills

This folder is a seed planted by `docodego init`: the core loop's skills,
genericized from the docodego project's own skill family so an adopter's
agent can run the method from the first minute. It is not a fork: one
upstream, read-only copies.

- **Upstream** — the docodego project's skill family. It carries the full
  twelve-skill set; this seed carries the eight skills a fresh plant needs
  (the front-door locator, the loop's four, and the Arc's Finding and
  Grounding). The lifecycle skills beyond the core loop (`docodego-promote`,
  `docodego-nurturing`, `docodego-leaving`, `docodego-beyond`) live upstream:
  a fresh plant never enters their phases. A project that needs a seed skill
  to say something different raises that against the upstream; it does not
  rewrite the seed in place.
- **Version** — the frontmatter above identifies the snapshot. `docodego
  upgrade` refreshes this folder under the same law as the vendored
  references: files at the shipped version are never rewritten, an adopter's
  drifted bytes are preserved beside the refreshed file as `<name>.upstream`,
  and a folder that carries no version line is the adopter's own — never
  claimed, never written.
- **Scope of an upgrade** — this folder and the `AGENTS.md` beside it. No
  record the project owns is ever written by an upgrade.
