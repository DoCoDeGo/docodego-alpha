---
name: 640-go-public-surface
type: unit
status: delivered
---

# 640-go-public-surface

## intent

The go-public checklist's remaining `us` items, verified against the
tree first (the 430 law): SECURITY.md already names the private
advisory channel and CONTRIBUTING.md already teaches the loop — they
stand. What is missing is the community surface a public repo is
expected to answer before launch: CODEOWNERS (one line — the org owns
every path), a code of conduct (Contributor Covenant v2.1, the
standard, with the advisory channel as the enforcement contact), and
issue templates (a bug form that asks for the honest facts: version,
OS, command, output; a feature form that asks for the problem before
the solution). Branch protection on `main` is attempted with the
maintainer token and recorded honestly if the API refuses — an attempt
refused is a finding, not a silence.

## scope

In: `CODEOWNERS`, `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1),
`.github/ISSUE_TEMPLATE/{bug.yml,feature.yml,config.yml}`, the
branch-protection attempt via `gh api` and its outcome recorded in the
unit. Out: SECURITY.md and CONTRIBUTING.md (verified present and
correct — one claim, one home); README (install story already covers
npm, binaries, brew, scoop — verified live: npm registry latest 0.7.2,
tap `docodego/tap/docodego` real at 0.7.1); the founder-owned items
(trademark stance, 1.0 bar, announcement).

## acceptance

- The three surface files exist and are correct: CODEOWNERS names the
  org for every path; the CoC is the Covenant, unmodified in its
  commitments; both templates collect facts, not opinions.
- `docodego check` stays at 0 errors (the record law is untouched —
  these files live outside the payload boundary).
- The branch-protection attempt is recorded with its true outcome —
  applied, or refused with the reason.
