# Publishing — every channel, the processes, the record

Recorded: 2026-11-07, during the v0.7.1 go-public rollout. Updated as
channels land.

This page is the one authoritative record of how docodego reaches its
users: where it is published, how each channel was set up, what changes on
each release, and what happened along the way. Law: no token, key, or
secret value ever lives in this repository, this file, or chat — secrets
exist only as GitHub Actions secrets (referenced here by name, never
value).

## Channel status

| channel | where | status | proven how |
|---|---|---|---|
| npm (unscoped) | [docodego](https://www.npmjs.com/package/docodego) | **live** — 0.7.1 | `npx docodego --version`, `pnpm dlx docodego --version` from the live registry |
| npm (org mirror) | [@docodego/cli](https://www.npmjs.com/package/@docodego/cli) | **live** — 0.7.1 | `npx @docodego/cli --version` from the live registry |
| Homebrew | [DoCoDeGo/homebrew-tap](https://github.com/DoCoDeGo/homebrew-tap) | **live** — 0.7.1 | `brew install docodego/tap/docodego` + `brew test docodego` on macOS arm64 |
| install script | `install.sh` (repo root) | **live** — 0.7.1 | full run: resolve → download → verify → install → execute |
| Scoop | [DoCoDeGo/scoop-bucket](https://github.com/DoCoDeGo/scoop-bucket) | **published, unproven** | manifest schema-correct, hashes pinned; no Windows host here yet |
| Nix | `flake.nix` (repo root) | **published, unproven** | four systems pinned to release sha256s; no nix host here |
| AUR | `packaging/aur/PKGBUILD` | **staged** — needs Arch account | blocked on founder account + SSH key |
| Winget | `packaging/winget/` | **staged** — needs PR | blocked on `winget validate` + PR to microsoft/winget-pkgs |
| GitHub Releases | [releases](https://github.com/DoCoDeGo/docodego-alpha/releases) | **live** — since v0.6.x | release + 3-OS smoke matrix in CI |

## npm

The primary channel — `npx docodego` / `pnpm dlx docodego` is the front
door of the README quickstart.

- **Org**: [npmjs.com/org/docodego](https://www.npmjs.com/org/docodego)
  (account `docodego-owner`). Org creation is website-only — the registry
  API has no org-create endpoint (`PUT /-/org/<name>` returns 404); this
  was confirmed empirically during setup.
- **Packages** (claude / opencode pattern — one artifact, two names):
  - `docodego` — unscoped, primary. bin `docodego` → `dist/docodego.js`.
  - `@docodego/cli` — scoped org mirror; the org page lists nothing
    without it.
- **Manifest**: `apps/cli/package.json` carries the publish fields
  (`bin`, `files`, `engines: >=22.6`, `publishConfig.access: public`,
  `repository`, `keywords`). `files` locks the tarball to the built bundle —
  74 kB packed, zero runtime dependencies. npm normalizes bin paths: use
  `dist/docodego.js`, not `./dist/docodego.js` (the `./` form gets the bin
  stripped with a publish warning — found in the v0.7.1 dry-run).
- **CI**: the `npm` job in `.github/workflows/release.yml` publishes both
  packages on every fresh release. Design law: it does NOT rebuild — it
  downloads `docodego.js` from the freshly published GitHub release,
  verifies it against the release's own `sha256sums.txt`
  (`verify-checksums.mjs`), and publishes that exact artifact. What npm
  serves is byte-identical to what GitHub Releases serves. The job chains
  after `smoke`, so npm only ever sees a release whose binaries ran for
  real on all three platforms. Both publishes carry `--provenance`
  (GitHub OIDC; `id-token: write`).
- **Secret**: `NPM_TOKEN` (repository secret on
  `DoCoDeGo/docodego-alpha`). Two bootstrap tokens were cycled through chat
  during setup — treat both as burned and rotate them at
  npmjs.com → Access Tokens; issue the replacement directly with
  `gh secret set NPM_TOKEN -R DoCoDeGo/docodego-alpha` so it never passes
  through chat again.
- **Name reservation quirk**: the registry holds a `0.0.0-stage` stub
  version on both names (npm's placeholder for a claimed-but-unpublished
  name). Harmless — `latest` is always the real release. Machines that
  fetched metadata during the stub window hold a stale packument; the
  one-time fix is `rm -rf ~/Library/Caches/pnpm` (npm's cache self-heals
  within minutes). Fresh machines never see it. Symptom if you hit it:
  pnpm resolves `0.0.0-stage` and fails with "numeric field was not a
  number" on the stub tarball.
- **First-publish walk** (used for 0.7.1; CI repeats it from now on):

  ```sh
  cp README.md LICENSE apps/cli/          # npm-page files; remove after publish
  cd apps/cli
  npm publish --dry-run --userconfig <npmrc-with-token>   # inspect the tarball
  npm publish --userconfig <npmrc-with-token>             # unscoped docodego
  # scoped mirror from the same artifact:
  mkdir -p /tmp/mirror/dist && cp dist/docodego.js /tmp/mirror/dist/
  cp README.md LICENSE /tmp/mirror/       # plus a package.json with name @docodego/cli
  cd /tmp/mirror && npm publish --userconfig <npmrc-with-token>
  rm apps/cli/README.md apps/cli/LICENSE  # keep the tree clean
  ```

## Homebrew

- **Tap**: [DoCoDeGo/homebrew-tap](https://github.com/DoCoDeGo/homebrew-tap)
  — `Formula/docodego.rb` with arm + intel stanzas and a livecheck block.
- **Install**: `brew install docodego/tap/docodego` — one line, auto-taps.
- **Proven**: full install + `brew test docodego` green on macOS arm64,
  v0.7.1.
- **The bare-name question** (`brew install docodego`): verified on
  Homebrew 7.0.12 — bare names resolve against homebrew-core plus the
  user's own tapped taps. `docodego` is not in core, so fresh machines get
  "No available formula"; machines that have the tap get a *trust refusal*:
  Homebrew refuses to load a bare-name match from an untrusted third-party
  tap (anti-typosquatting — any tapped tap could otherwise hijack a common
  name). One-time fix per machine: `brew trust docodego/tap`, after which
  plain `brew install docodego` installs (verified: trust → bare install →
  0.7.1 runs). Universal bare-name installs would require homebrew-core
  inclusion — a notability-gated milestone deliberately not chased yet.
- **homebrew-core**: deliberately not pursued yet (notability bar); own-tap
  first is the standard indie-CLI path.

## Scoop (Windows)

- **Bucket**: [DoCoDeGo/scoop-bucket](https://github.com/DoCoDeGo/scoop-bucket)
  — `bucket/docodego.json`, `checkver: github` autoupdate; each update's
  hash is read by regex from the release's own `sha256sums.txt`, so Scoop
  verifies against the sums the release ships.
- **Install**: `scoop bucket add docodego https://github.com/DoCoDeGo/scoop-bucket && scoop install docodego`.
- **Proven**: manifest pushed; not yet executed on a Windows box (no
  Windows host here) — validate on first use; the release smoke already
  proves the exe itself runs.

## Nix

- **Flake**: `flake.nix` at the repository root — four systems
  (x86_64/aarch64 × linux/darwin), each pinned to the release binary and
  its sha256.
- **Run**: `nix run github:DoCoDeGo/docodego-alpha`.
- **Proven**: not executed locally (no nix on the build machine); schema is
  minimal and the hashes are the release's own.

## AUR (Arch Linux)

- **Staged**: `packaging/aur/PKGBUILD` — `docodego-bin` (AUR convention
  for prebuilt binaries), x86_64, sha256 pinned to the release sums.
- **Blocked on**: an Arch account with an SSH key registered (founder
  action).
- **Publish walk** (once the account exists):

  ```sh
  git clone ssh://aur@aur.archlinux.org/docodego-bin.git aur-docodego-bin
  cp packaging/aur/PKGBUILD aur-docodego-bin/
  (cd aur-docodego-bin && makepkg --printsrcinfo > .SRCINFO)
  git -C aur-docodego-bin add -A && git -C aur-docodego-bin commit -m "0.7.1"
  git -C aur-docodego-bin push
  ```

## Winget (Windows)

- **Staged**: `packaging/winget/` — the three v1.6.0 manifests
  (`DoCoDeGo.docodego{,.locale.en-US,.installer}.yaml`), portable exe,
  sha256 pinned to the release sums. Package id: `DoCoDeGo.docodego`.
- **Blocked on**: a PR to `microsoft/winget-pkgs` — validate first with
  `winget validate` on a Windows box, copy the manifests to
  `manifests/d/DoCoDeGo/docodego/<version>/`, open the PR. Merge timing is
  external to this repository.

## Install script

- **File**: `install.sh` at the repository root.
- **Behavior**: resolves the latest release via the GitHub API, downloads
  the platform binary plus `sha256sums.txt`, verifies before anything
  touches disk outside a temp dir, installs to `PREFIX/docodego`
  (default `~/.local/bin`).
- **Usage** (README quickstart):
  `curl -fsSL https://raw.githubusercontent.com/DoCoDeGo/docodego-alpha/main/install.sh | sh`
- **Proven**: full run on macOS arm64 against v0.7.1 — download verified,
  binary executed.
- **Windows**: intentionally out of scope for the script — Scoop and the
  winget manifest cover Windows.

## The per-release checklist

What changes where when a new version ships. The release workflow fires on
any push to `main` that carries a new `apps/cli/package.json` version.

| channel | action per release | who |
|---|---|---|
| GitHub Releases | nothing — automatic (build, cross-compile, checksums, publish) | CI |
| 3-OS smoke | nothing — automatic (downloads, verifies, executes every asset) | CI |
| npm (both names) | nothing — automatic (publishes the checksum-verified release artifact with provenance) | CI |
| Scoop bucket | nothing — `checkver: github` autoupdates; hashes read from the new release's sums | nobody |
| Homebrew tap | bump `version` + two darwin `sha256` values in `Formula/docodego.rb` | manual now; CI candidate (needs a fine-grained PAT — `GITHUB_TOKEN` cannot push cross-repo) |
| Nix flake | bump `version` + four `sha256` values in `flake.nix` | manual now; same CI candidate |
| AUR | bump `pkgver` + `sha256sums_x86_64` in `packaging/aur/PKGBUILD`, push per the walk above | founder/CI after the account exists |
| Winget | new manifest directory per version at PR time to microsoft/winget-pkgs | per-PR |

## Handle and claim map

**Ours, verified** — **docodego.com (the official homepage, live over
HTTPS)** · YouTube `@docodego` ·
GitHub org `DoCoDeGo` · npm org `docodego` + both packages · Discussions on
the alpha repo · ghcr.io namespace (org-included).
Defensive option: `docodgo.com` (the common typo) is unregistered — cheap
to squat.

**Verified available, unclaimed** — domains docodego.dev / .io / .org ·
Bluesky `docodego.bsky.social` · Mastodon `@docodego@mastodon.social` ·
dev.to/docodego · Docker Hub `docodego` namespace · Homebrew core name.

**Unverified (bot-blocked, 30-second manual checks)** — X `@docodego` ·
Reddit r/docodego · LinkedIn company page · Discord `discord.gg/docodego`
vanity (claimable only after creating a server).

**Not applicable** — PyPI / crates.io / RubyGems (Node CLI, not
Python/Rust/Ruby); Product Hunt / Hacker News are launch-day actions, not
claims.

## Process log

The record of the rollout, in order. Values of tokens are never recorded —
see the secrets law at the top.

- **2026-11-07** — handle availability verified: npm `docodego` and
  `@docodego/docodego` free (registry 404s), docodego.io/.org free (whois),
  docodego.dev free (RDAP 404), docodego.com ours, Bluesky/Mastodon/dev.to
  free, Docker Hub namespace empty, Homebrew core name free. Discussions
  enabled on the alpha repo.
- **2026-11-07** — Homebrew formula written and locally checked against
  the v0.7.1 release sums; tap repo `DoCoDeGo/homebrew-tap` created and
  pushed; `brew install docodego/tap/docodego` executed for real — install
  and `brew test` green.
- **2026-11-07** — first npm token (pasted in chat) tested: E401 against
  the registry — dead on arrival (truncated, revoked, or IP-restricted;
  never diagnosed further, treated as burned).
- **2026-11-07** — `apps/cli/package.json` rewritten for publishing:
  `private` removed, bin moved to the built artifact, `files`/`engines`/
  `repository`/`keywords`/`publishConfig` added. Dry-run caught npm
  stripping the `./`-prefixed bin — fixed to `dist/docodego.js`.
- **2026-11-07** — founder created the npm org on the website (registry
  API cannot) and supplied a fresh token; `NPM_TOKEN` repository secret
  set. Token verified via `npm whoami` → account `docodego-owner`.
- **2026-11-07** — published `docodego@0.7.1` (unscoped, dry-run first)
  and `@docodego/cli@0.7.1` (staged mirror) from the v0.7.1 release
  artifact. Verified live: `npx docodego`, `pnpm dlx docodego`,
  `npx @docodego/cli` all print `docodego cli 0.7.1 · record spec 5`.
- **2026-11-07** — diagnosed the stale-packument effect: machines that
  queried the names during the stub-only window resolve `0.0.0-stage`
  until their package-manager cache clears; fix recorded above. Fresh
  machines unaffected.
- **2026-11-07** — `install.sh` written and proven end-to-end on macOS
  arm64 against v0.7.1. Scoop bucket repo created and pushed. `flake.nix`,
  `packaging/aur/PKGBUILD`, and the three winget manifests staged, pinned
  to the v0.7.1 release sums.
- **2026-11-07** — release.yml gained the `npm` job (after-smoke,
  released-artifact, provenance). README quickstart switched from
  build-from-source to the live channels; Status section updated (install
  channels no longer open questions). Commits `d17917e` + `161f185`
  pushed (no version bump — no release fired).
- **2026-11-07** — Homebrew bare-name behavior verified on Homebrew
  7.0.12: third-party taps are untrusted for bare-name installs until
  `brew trust docodego/tap` (anti-typosquatting); trust → bare install
  proven, documented in the README, this file, and the tap's README.
- **2026-11-07** — `docodego.com` adopted as the official homepage (live,
  HTTPS, Cloudflare) across all packaging metadata: npm manifest, Homebrew
  formula, Scoop bucket, Nix flake, AUR PKGBUILD, winget locale manifest,
  README tagline, the GitHub repo sidebar, and the org profile.
  GitHub-release URLs stay where they are — they are the artifact store,
  not the homepage. Timing note: npm pins manifest metadata per version,
  so the published 0.7.1 pages keep the GitHub link until the next
  release carries the new `homepage` field. Defensive note: `docodgo.com`
  (the typo variant) is unregistered — cheap to squat.
- **2026-11-07** — this file expanded into the standing publishing record.

## Founder actions left

1. Rotate both chat-exposed npm tokens; set the replacement straight into
   the secret (`gh secret set NPM_TOKEN -R DoCoDeGo/docodego-alpha`).
2. Arch account + SSH key → the AUR walk above (then hand CI the key).
3. `winget validate` + PR to microsoft/winget-pkgs.
4. Optional claims: defensive domains (.dev/.io/.org), Bluesky, Mastodon,
   dev.to, Docker Hub; manual 30-second checks for X, Reddit, LinkedIn,
   Discord.
5. Later automation: cross-repo release bumps for the tap and flake need
   one fine-grained PAT stored as a secret (`GITHUB_TOKEN` cannot push
   outside the repo). Scoop needs nothing — autoupdate.
