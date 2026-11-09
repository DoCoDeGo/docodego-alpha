# proofs — 640-go-public-surface

- `head -3 CODE_OF_CONDUCT.md` / the file itself — the Contributor Covenant v2.1, canonical text from contributor-covenant.org (fetched 2026-11-09), one placeholder filled (enforcement → the private-advisory channel SECURITY.md already names); the canonical v2.1 markdown endpoints 404'd twice (contributor-covenant.org/version/2/1/code_of_conduct.md, two raw.githubusercontent paths) — the text was taken from the canonical HTML page instead, structure reconstructed to the standard markdown
- `CODEOWNERS` — one rule, `* @DoCoDeGo` (the org account is the only confirmed owner; the founder's personal handle stays unknown per the privacy law)
- `.github/ISSUE_TEMPLATE/bug.yml`, `.github/ISSUE_TEMPLATE/feature.yml`, `.github/ISSUE_TEMPLATE/config.yml` — YAML forms; bug collects version/platform/command+output/expectation, feature collects problem-before-solution; config routes security to the advisory URL and enables blank issues
- `gh api -X PUT repos/DoCoDeGo/docodego-alpha/branches/main/protection` — **applied, not refused**: `allow_force_pushes: false`, `allow_deletions: false`, `required_conversation_resolution: true`; direct pushes stay legal (enforce_admins false, no PR gate — a solo founder's flow is not bureaucracy-fenced)
- verified-present before building (the 430 law): `SECURITY.md` (private advisory channel), `CONTRIBUTING.md` (the loop) — untouched, one claim one home
- `node apps/cli/src/main.ts check` — exit 0 (the record law is untouched; these files live outside the payload boundary)

## failure-to-cause

- three 404s fetching the Covenant markdown — cause: the canonical URLs have moved (the repo EthicalSource/contributor-covenant also unresolved); fell back to the canonical HTML page and reconstructed the markdown structure verbatim in content.
