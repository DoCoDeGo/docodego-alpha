# Going public — the launch checklist

Status: **alpha**. This repo is public already, but it is not *launched* —
no announcement, no install story, no community surface. This checklist is
what stands between here and that. Owners: **you** = the founder decides;
**us** = the maintainers (agents included) do it; **done** = already true.
Nothing here blocks alpha users from building from source today.

## 0. Identity and naming

- [ ] **you — the name.** "docodego" is a working title (ADR 0001 says so).
  Before launch it stops being changeable: npm, homebrew, domains, search.
  Decide once, then rename everywhere in one commit.
- [ ] **you — org name.** The GitHub org is `DoCoDeGo` (casing deliberate?).
  Any rename should happen with the name decision, not after.
- [ ] us — swap the placeholder commit identity
  (`docodego <docodego@users.noreply.github.com>`) for the identity you
  want on the public history. Rewriting history after launch is worse than
  doing this before.
- [ ] us — canonical links: decide whether the repo, a docs site, or a
  domain is the first URL every doc points at; make all references agree.

## 1. Legal

- [x] LICENSE — MIT, "The docodego authors" (founder picked).
- [ ] you — trademark stance: claim it (™ suffices at this scale) or
  disclaim it in the README footnote. Silence is a decision too.
- [ ] you — contributor terms: DCO (`Signed-off-by`, lightweight) vs CLA
  (heavier). For an alpha with few contributors, DCO is the usual call.
- [ ] us — audit bundled content for third-party rights: the skills and
  statutes are first-party written; verify nothing quotes licensed text.
- [ ] us — SECURITY.md links a real reporting channel (a GitHub
  security advisory is fine; a dead email is not).

## 2. Security review (pre-announcement audit)

- [x] Skills supply chain: lockfile digests, opt-in remote sources,
  `doctor` re-verifies digests.
- [ ] us — threat-pass over `skill add --from <git-url>`: path traversal in
  skill folders, symlinked files inside a cloned skill, hooks/scripts
  inside skill content (should be inert text — prove it), clone URL
  schemes (file://, ssh with options).
- [ ] us — threat-pass over record parsing (the parser is fuzzed for
  crashes; now check *semantics*: can a crafted record make `deliver`
  pass gates falsely, or `upgrade` write outside the repo?).
- [ ] us — secret scanning on the repo; ensure no token ever transits the
  workflows (only `GITHUB_TOKEN`, least privilege: `contents: write` on
  release only).
- [ ] us — enable branch protection + CODEOWNERS (see §4).
- [ ] us — state the no-telemetry law in SECURITY.md explicitly (privacy
  posture is a security answer).

## 3. Correctness gates (what "alpha" still owes 1.0)

- [x] Conformance (138 checks), parser fuzz + goldens, docs drift gate —
  all green on ubuntu, macOS, Windows.
- [ ] us — **execute the shipped binaries**, not just compile them: CI
  proves the bytes exist; nobody has run the windows/linux artifacts on
  real machines. Add a release smoke job (or a maintainer ritual: download
  each asset, run `--version` + `init` + `skill list`, check sha256).
- [ ] us — one full dogfood: build a real tiny project's record with the
  released binary only (no source), end to end, on all three OSes.
- [ ] us — upgrade-day rehearsal: plant a record with v0.3.0, upgrade it
  across every migration to current, verify nothing lost. A new user who
  starts now will need exactly this path.
- [ ] you — decide the 1.0 bar publicly (what does 1.0 promise? stability
  of the record contract is the honest axis: "records planted by 1.x
  upgrade cleanly forever").

## 4. Repository surface

- [ ] us — branch protection on `main` (require CI green; no force pushes).
  Until then the repo trusts every writer — acceptable solo, not at
  launch.
- [ ] us — issue templates (bug report with `doctor --json` output
  attached — this is why doctor exists; feature request naming the law it
  would change).
- [ ] us — a code of conduct (Contributor Covenant is the boring,
  expected answer).
- [ ] us — CODEOWNERS pointing at you.
- [ ] us — GitHub social preview image (the card everyone sees when the
  repo is shared).
- [x] Description + topics set.
- [ ] you — pin the issue that best explains "what is this for" once
  real issues exist.

## 5. Distribution (the install story)

- [x] GitHub Releases with per-platform binaries + checksums.
- [ ] you — **npm public?** The package is `private: true` on purpose:
  publishing is a support commitment (issues about global installs,
  engines, ESM loaders). Decide before anyone asks.
- [ ] you — a curl/tar one-liner (`curl -fsSL … | sh`) vs "build from
  source" vs package managers (homebrew tap, scoop, AUR) — pick the
  smallest set you will actually maintain.
- [ ] us — README quickstart switches from "build from source" to the
  chosen install path the day one exists (it is written to be replayable —
  keep that property).
- [ ] us — `docodego upgrade`-style self-update is explicitly out of
  scope; say so where people will look for it.

## 6. Documentation

- [x] README (replayable quickstart), getting-started, record-format,
  versioning, skills, architecture, CHANGELOG, CONTRIBUTING, SECURITY.
- [x] Generated docs cannot drift (`docs:verify`); help pages are
  contracts; every diagnostic has an explain page.
- [ ] us — a real transcript pass over getting-started against the latest
  release output (transcripts age; the quickstart is enforced by tests,
  the walkthrough is not).
- [ ] you — glossary voice check: "grill", "planted", "the law", "record" —
  the metaphors are the brand; read the README as a newcomer once and
  prune anything that reads as in-joke.
- [ ] you — vocabulary packs decision (see the founder questions): same
  structure, different dialects (plain / agile / BABOK). Posture now:
  one voice, shipped; packs stay an idea until someone asks for theirs.

## 7. Community and support

- [ ] you — support expectation statement (where do questions go, what
  response time is honest — "best effort, alpha" is a fine answer).
- [ ] us — discussions/issues decision: which one is the front door.
- [ ] you — roadmap honesty: publish the founder questions that are open
  (npm, packs, channels) so the roadmap reflects real undecided things,
  not fake certainty.

## 8. Launch mechanics (the day itself)

- [ ] us — CHANGELOG top section reads like the announcement (it is the
  announcement).
- [ ] us — the release notes extraction is the single source: no separate
  announcement doc that can drift.
- [ ] you — write the announcement thread/post yourself (founder voice —
  no AI attribution, per repo law).
- [ ] you — pick the venue(s) and the day; ship one clean release right
  before (never launch on a dirty tree).
- [ ] us — freeze 24h around launch: docs changes only.
- [ ] us — a "known alpha gaps" list published alongside (honest limits:
  no install story yet, single-maintainer pace, record spec may still
  move with migrations provided).

## The rule this checklist obeys

Nothing here invents ceremony: each item exists because an alpha user will
hit it. When in doubt, the question is not "is this polished?" but "will
the first outsider's first hour be truthful?"
