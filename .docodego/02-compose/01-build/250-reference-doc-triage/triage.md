# the triage — 250-reference-doc-triage (2026-11-08)

Enumerated item-by-item against the four docs as they stand today. The
debt map's snapshot (41/7/10/20) predated spec-7; today's count: 20
enhancement items + 6 open distribution rows + 2 vocabulary-pack
threads + 1 skills nothing-open. Buckets: **ship-now** (a named small
child), **launch-gate** (feeds cluster 2, owner named), **declined**
(the reason). The docs are evidence — nothing in them changes.

## enhancements.md — the twenty

| # | item | bucket | owner / reason |
|---|---|---|---|
| 1 | name the thing | launch-gate | founder (EL-32 reserved) — feeds cluster 2 |
| 2 | how people get it | declined | shipped: npm + Homebrew + install script live (distribution.md channel table) |
| 3 | shrink the binaries | launch-gate | studio — a spike child; 85 MB argues at every download |
| 4 | trademark/license on the final name | launch-gate | founder — cheap, owed before the name goes public |
| 5 | getting-started transcript gate | launch-gate | studio — a conformance child (replay the README command-by-command) |
| 6 | threat pass on parsing semantics | launch-gate | studio — a security child (go-public §2) |
| 7 | secret scanning + workflow least-privilege | launch-gate | studio — a CI-audit child |
| 8 | branch protection + CODEOWNERS | launch-gate | founder — repo-settings ceremony |
| 9 | dedupe the Payload interface | ship-now | studio — small child: one interface, one generator |
| 10 | first-party skill repository | declined (for now) | `skill add --from` hardened, pointing at nothing; curated content is post-launch work |
| 11 | one-command install | declined | shipped: install.sh + npm live |
| 12 | sign/attest release assets | launch-gate | studio — a provenance child (checksums exist, attestations next) |
| 13 | audit planted prose for stale lineage | ship-now | studio — small child: sweep planted files for dead path references |
| 14 | doctor validates manifest.vocabulary | ship-now | studio — one-check child (the silent-downgrade case) |
| 15 | close the add-time TOCTOU in skill install | ship-now | studio — small child: digest the bytes read, not the re-read folder |
| 16 | Windows symlink story | declined (for now) | no Windows host in the studio; revisit when Windows users exist |
| 17 | in-place re-voicing | declined | the doc's own words: "deliberately declined for v1 (init-time only, spec 5)" |
| 18 | pack-voiced tool output | declined | the doc's own words: a "documented v1 limit" |
| 19 | on-demand packs | declined | the doc's own words: "zero work until an audience asks — that is the design working" |
| 20 | a 60-second demo | launch-gate | founder + studio — record once for the public front door |

## distribution.md — the open rows

| row | bucket | owner / reason |
|---|---|---|
| Scoop: published, unproven | launch-gate | studio — proof needs a Windows host (lines 21, 123) |
| Nix: published, unproven | launch-gate | studio — proof needs a nix host (line 22) |
| AUR: staged | launch-gate (founder-blocked) | founder — Arch account + SSH key (line 23) |
| Winget: staged | launch-gate | studio — `winget validate` + the PR (line 24) |
| Homebrew bump: manual, CI candidate | declined (for now) | the CI path needs a fine-grained PAT (line 187) — a founder secrets call; the manual bump works |
| announcement surface unverified | launch-gate | founder — X bot-blocked; 30-second manual checks (line 205) |

## skills.md — nothing open

The doc reflects the shipped mechanism: bundled shelf, lockfile with
digest re-verification (DG-K001), profiles — landed via
210-spec7-shelf-and-stack. No open thread found.

## vocabulary-packs.md — two threads, both declined

| thread | bucket | reason |
|---|---|---|
| re-voiced streams (line 101) | declined | "possible later increment, deliberately out of scope" — the doc's own words |
| in-place re-voicing (line 110) | declined | "small, append-only later increment if the founder ever asks" — the doc's own words |

## the buckets, counted

- ship-now: 4 — enhancements 9, 13, 14, 15 (each a named small child
  in a future cycle).
- launch-gate: 14 — enhancements 1, 3, 4, 5, 6, 7, 8, 12, 20 +
  distribution Scoop, Nix, AUR, Winget, announcement. Every row names
  the cluster-2 owner it feeds; nothing sits in two places with two
  owners.
- declined: 10 — enhancements 2, 10, 11, 16, 17, 18, 19 + Homebrew CI
  bump + vocabulary-packs ×2 (shipped, deferred-by-design, or
  founder-secrets calls — each with its reason).
