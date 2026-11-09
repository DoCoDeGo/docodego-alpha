# Enhancement backlog — the 20, as a checklist

Prioritized by the founder review of 2026-11-07. Plain English on purpose:
each item says what it is and why it matters. Items that overlap the
[go-public checklist](go-public-checklist.md) are marked with their section
there — the law applies: one claim, one home; this list is the umbrella,
that list is the launch gate.

## Decisions only the founder can make

- [x] **1. Name the thing.** Still "working title: docodego" (ADR 0001).
      Every README, binary, and URL hard-codes the name; cost grows weekly.
      One shortlist session beats another month of drift.
      *(ruled 2026-11-09 — the name stays `docodego`; the working-title
      drift ends.)*
- [x] **2. Decide how people get it.** Today: clone → npm install → build →
      manual alias. A maintainer's install, not a user's. npm? Homebrew?
      direct download? Shapes items 3 and 11. *(research recorded in
      [distribution.md](distribution.md); verified live 2026-11-09 — npm
      `docodego` + `@docodego/cli` publish with provenance from the
      release workflow, homebrew tap `docodego/tap/docodego` is real,
      binaries + install.sh shipped; registry/tap lag main-vs-branch is
      sequencing, not absence.)*
- [ ] **3. Shrink the binaries.** ~85 MB each (embedded runtime). For a
      tool pitched as small and honest, that size argues against it on
      every download. One spike to test alternatives.
- [ ] **4. Trademark/license check on the final name.** Cheap, boring,
      painful only if skipped.

## Highest-value engineering

- [ ] **5. Permanent getting-started transcript gate.** The 2026-11-07
      transcript pass found 6 real drifts, one breaking the walkthrough
      literally. A conformance check that replays the doc command-by-command
      makes doc rot impossible instead of periodic.
- [ ] **6. Threat pass on record parsing semantics** (go-public §2). Can a
      crafted record make `deliver` pass falsely or `upgrade` write outside
      the repo? Fuzzing proves no crashes; nobody has attacked meaning yet.
- [ ] **7. Secret scanning + workflow least-privilege audit** (go-public
      §2). `contents: write` on release is correct today; nothing verifies
      it stays that way.
- [x] **8. Branch protection + CODEOWNERS** (go-public §4). Auto-release on
      push is the superpower and the liability — one typo is a public
      release with no review gate.
      *(done 2026-11-09 — 640-go-public-surface: main protected via the
      API (no force-push, no deletion, conversation resolution), CODEOWNERS
      `* @DoCoDeGo` landed.)*
- [x] **9. Deduplicate the Payload interface.** Defined in bundle.ts and
      again in the file bundle.ts generates; synced by hand; no gate
      watches it. The one quiet rot in the tree.
      (done 2026-11-08 — 260-payload-interface-dedupe: `Payload` and
      `SkillIndexEntry` are declared once in `apps/cli/src/types.ts`; the
      generated bundle re-exports the type; conformance holds the gate.)
- [ ] **10. A first-party skill repository.** `skill add --from` is
      hardened (v0.7.1) and points at nothing. Three curated skills at a
      real URL make the supply-chain story demonstrable.

## Strong second tier

- [x] **11. One-command install** (`curl … | sh` or npm i -g) so item 2
      has a landing spot. *(first step shipped: install.sh — see
      [distribution.md](distribution.md); verified live 2026-11-09 —
      `npx docodego` and the curl installer are the documented paths,
      npm 0.7.2 published, tap real.)*
- [ ] **12. Sign or attest release assets.** Checksums exist; provenance
      ("these bytes came from that commit") is the next honest step for a
      tool about evidence.
- [ ] **13. Audit planted prose for stale lineage.** The front door was
      one file from the old era; sweep every planted file for references
      to paths that do not exist (04-spec, 01-grill, 02-e2e…).
- [ ] **14. `doctor` validates `manifest.vocabulary`.** A record naming a
      pack the CLI does not bundle (downgrade case) reads canonical today,
      silently. One check.
- [ ] **15. Close the add-time TOCTOU** in skill install: digest the bytes
      read, not the folder re-read after. Fail-closed today; cheap to
      tighten.
- [ ] **16. Decide the Windows symlink story.** A repo with symlinks,
      cloned on default Windows, turns each link into a text file of its
      target path. Refusing 120000-mode files may be more honest than
      installing them as content.
- [ ] **17. In-place re-voicing (`docodego vocabulary <pack>`).**
      Deliberately declined for v1 (init-time only, spec 5). Small
      append-only increment when someone asks.
- [ ] **18. Pack-voiced tool output.** The CLI's stdout stays canonical
      English regardless of dialect (documented v1 limit). Re-voicing it is
      a possible later increment.

## Cheap wins

- [ ] **19. Promote an on-demand pack on demand.** All six live proven in
      the research record; adoption is drop-the-JSON-in + bump, no code.
      Zero work until an audience asks — that is the design working.
- [ ] **20. A 60-second demo.** The walkthrough replays perfectly now;
      record it once (asciinema/GIF) for the public front door.

## Dispositions (the triage, 2026-11-09 — 650-enhancements-triage)

Re-verified against the tree before dispositioning (the 430 law). Every
open box lands in exactly one state. The shelf keeps the prose above as
written (append-only); this table is the current truth.

| # | box | disposition |
|---|---|---|
| 1 | name the thing | ruled — stays `docodego` (founder, 2026-11-09); box flipped |
| 2 | how people get it | verified live — npm (unscoped + org mirror, provenance), brew tap real, binaries, installer; box flipped |
| 3 | shrink the binaries | launch-gate — 85 MB per binary is a real objection; one spike unit before wide launch, owner: maintainer |
| 4 | trademark check | founder-at-launch — cheap and boring only if done before the name is on domains; owner: founder |
| 5 | getting-started transcript gate | ship-now — its own unit: a conformance check that replays the walkthrough command-by-command and diffs real output; design named in the doc rot finding (2026-11-07) |
| 6 | threat pass on record parsing | ship-now — its own unit: adversarial records against deliver/upgrade semantics (crafted paths, forged markers, parser confusion), fuzzing is not enough |
| 7 | secret scanning + least-privilege audit | ship-now (half landed here) — the verifiable half is pinned: conformance asserts the workflow permission blocks byte-exactly; secret-scanning repo settings are recorded prose (suite stays offline): enabled on the org setting, verify at launch |
| 8 | branch protection + CODEOWNERS | done — 640-go-public-surface (main: no force-push/deletion, conversation resolution; CODEOWNERS `* @DoCoDeGo`); box flipped |
| 9 | payload interface dedupe | done — 260-payload-interface-dedupe |
| 10 | first-party skill repository | founder-at-launch — `skill add --from` is hardened and points at nothing; three curated skills at a real URL need the org's repo, the founder's call |
| 11 | one-command install | done — install.sh shipped, npm live (0.7.2), tap real; box flipped |
| 12 | sign/attest release assets | launch-gate — npm publishes carry `--provenance` already; binary attestations (the js + binaries) at launch; owner: maintainer |
| 13 | planted-prose audit | done — 290-planted-prose-sweep (a conformance gate now) |
| 14 | doctor validates vocabulary | done — 270-doctor-vocabulary-check |
| 15 | add-time TOCTOU | done — 280-install-toctou |
| 16 | Windows symlink story | ship-now — its own unit: refuse 120000-mode files at the boundary collector (honest refusal beats silent text-file install); needs the collector walkthrough first |
| 17 | in-place re-voicing | decline (stands) — deliberately declined for v1 (init-time only, spec 5); a small append-only increment when someone asks |
| 18 | pack-voiced tool output | decline (stands) — documented v1 limit; stdout stays canonical English |
| 19 | promote packs on demand | decline (stands) — zero work until an audience asks; that is the design working |
| 20 | 60-second demo | founder-at-launch — the walkthrough replays perfectly; the recording wants a human session |

Score at triage: 4 ruled/verified done today + 4 done by earlier
children + 1 half-implemented pin (7) + 4 ship-now units pending their
own pickup (5, 6, 16, 12's binary half at gate) + 3 launch-gates
(3, 12) + 3 founder-at-launch (4, 10, 20) + 3 deliberate declines
(17, 18, 19). Nothing open is unowned.
