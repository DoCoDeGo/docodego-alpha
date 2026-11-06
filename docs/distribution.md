# Distribution — channels, processes, secrets policy

Recorded: 2026-11-07, during the v0.7.1 go-public rollout.

This page documents how docodego reaches its users. Law: no token, key, or
secret value ever lives in this repository, this file, or chat — secrets
exist only as GitHub Actions secrets (referenced here by name, never value).

## npm

The primary channel — `npx docodego` / `pnpm dlx docodego` is the front door
of the README quickstart.

- **Org**: [npmjs.com/org/docodego](https://www.npmjs.com/org/docodego)
  (account `docodego-owner`). Org creation is website-only — the registry
  API has no org-create endpoint (`PUT /-/org/<name>` returns 404); this
  was confirmed empirically during setup.
- **Packages** (claude / opencode pattern — one artifact, two names):
  - [`docodego`](https://www.npmjs.com/package/docodego) — unscoped,
    primary. bin `docodego` → `dist/docodego.js`.
  - [`@docodego/cli`](https://www.npmjs.com/package/@docodego/cli) — scoped
    org mirror; the org page lists nothing without it.
- **Published**: 0.7.1 on 2026-11-07, manually (first publish), from the
  v0.7.1 release artifact.
- **Manifest**: `apps/cli/package.json` carries the publish fields
  (`bin`, `files`, `engines: >=22.6`, `publishConfig.access: public`,
  `repository`, `keywords`). `files` locks the tarball to the built bundle —
  74 kB packed, zero runtime dependencies.
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
  within minutes). Fresh machines never see it.
- **Verification performed**: `npx docodego --version`,
  `pnpm dlx docodego --version`, and `npx @docodego/cli --version` all
  resolve 0.7.1 from the live registry and print
  `docodego cli 0.7.1 · record spec 5`.

## Homebrew

- **Tap**: [DoCoDeGo/homebrew-tap](https://github.com/DoCoDeGo/homebrew-tap)
  — `Formula/docodego.rb` with arm + intel stanzas and a livecheck block.
- **Install**: `brew install docodego/tap/docodego`.
- **Proven**: full install + `brew test docodego` green on macOS arm64,
  v0.7.1.
- **Release bump**: update `version` and the two darwin `sha256` values in
  the formula from the release's `sha256sums.txt`. Automation candidate —
  a CI job can push the bump per release, but cross-repo pushes need a
  fine-grained PAT secret (`GITHUB_TOKEN` cannot write to another repo).
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
- **Release bump**: version + four hashes from `sha256sums.txt`, bumped
  together.
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

  Update `pkgver` + `sha256sums_x86_64` at each release; CI can automate
  the push once an AUR deploy key exists as a secret.

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

## Handle and claim map

**Ours, verified** — docodego.com (registered 2022) · YouTube `@docodego` ·
GitHub org `DoCoDeGo` · npm org `docodego` + both packages · Discussions on
the alpha repo · ghcr.io namespace (org-included).

**Verified available, unclaimed** — domains docodego.dev / .io / .org ·
Bluesky `docodego.bsky.social` · Mastodon `@docodego@mastodon.social` ·
dev.to/docodego · Docker Hub `docodego` namespace · Homebrew core name.

**Unverified (bot-blocked, 30-second manual checks)** — X `@docodego` ·
Reddit r/docodego · LinkedIn company page · Discord `discord.gg/docodego`
vanity (claimable only after creating a server).

**Not applicable** — PyPI / crates.io / RubyGems (Node CLI, not
Python/Rust/Ruby); Product Hunt / Hacker News are launch-day actions, not
claims.

## What fires automatically now

A push to `main` with a new `apps/cli/package.json` version runs the full
gate chain, publishes the GitHub release with all platform binaries, proves
every asset on three operating systems, then publishes npm — both package
names, from the checksum-verified release artifact, with provenance.

## Founder actions left

1. Rotate both chat-exposed npm tokens; set the replacement straight into
   the secret (`gh secret set NPM_TOKEN -R DoCoDeGo/docodego-alpha`).
2. Arch account + SSH key → the AUR walk above (then hand CI the key).
3. `winget validate` + PR to microsoft/winget-pkgs.
4. Optional claims: defensive domains (.dev/.io/.org), Bluesky, Mastodon,
   dev.to, Docker Hub; manual 30-second checks for X, Reddit, LinkedIn,
   Discord.
5. Later automation: cross-repo release bumps for the tap, bucket, and
   flake need one fine-grained PAT stored as a secret (`GITHUB_TOKEN`
   cannot push outside the repo).
