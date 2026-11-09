# delivered — 640-go-public-surface

## what landed

The go-public checklist's remaining `us` items, each verified against
the tree before building:

- `CODE_OF_CONDUCT.md` — the Contributor Covenant v2.1, canonical text,
  enforcement routed to the private-advisory channel SECURITY.md
  already names (no second contact point invented).
- `CODEOWNERS` — `* @DoCoDeGo`; the org account is the only confirmed
  owner, and the founder's personal handle stays unknown on purpose.
- `.github/ISSUE_TEMPLATE/` — bug form (version, platform, exact
  command+output), feature form (the problem before the proposal),
  config (security → advisories, blank issues enabled).
- Branch protection on `main` **applied** via the API: no force-pushes,
  no deletions, conversation resolution required. Direct pushes stay
  legal — the solo founder's flow is not fenced behind PR bureaucracy.
- Verified present and deliberately untouched: SECURITY.md, CONTRIBUTING.md.

## how to see it work

- `cat CODEOWNERS` — the one rule. `head -20 CODE_OF_CONDUCT.md` — the
  Covenant. `gh api repos/DoCoDeGo/docodego-alpha/branches/main/protection`
  — the live policy on GitHub.
- `node apps/cli/src/main.ts check` — exit 0; the payload boundary
  never saw these files (no hop).
## delivered 2026-11-09

- gates: G1, G2, G3, G4 all passed
- detail: frontmatter, intent and acceptance in place; recomputed 69/100 — matches the recorded block (spec-sha 7295becc178178bb); latest verdict: pass; proof: .github/ISSUE_TEMPLATE/bug.yml · warning: 2 path-like span(s) do not resolve (feature.yml, config.yml) — launch will refuse if they are proof paths
