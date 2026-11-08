# Enhancement backlog — the 20, as a checklist

Prioritized by the founder review of 2026-11-07. Plain English on purpose:
each item says what it is and why it matters. Items that overlap the
[go-public checklist](go-public-checklist.md) are marked with their section
there — the law applies: one claim, one home; this list is the umbrella,
that list is the launch gate.

## Decisions only the founder can make

- [ ] **1. Name the thing.** Still "working title: docodego" (ADR 0001).
      Every README, binary, and URL hard-codes the name; cost grows weekly.
      One shortlist session beats another month of drift.
- [ ] **2. Decide how people get it.** Today: clone → npm install → build →
      manual alias. A maintainer's install, not a user's. npm? Homebrew?
      direct download? Shapes items 3 and 11. *(research recorded in
      [distribution.md](distribution.md))*
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
- [ ] **8. Branch protection + CODEOWNERS** (go-public §4). Auto-release on
      push is the superpower and the liability — one typo is a public
      release with no review gate.
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

- [ ] **11. One-command install** (`curl … | sh` or npm i -g) so item 2
      has a landing spot. *(first step shipped: install.sh — see
      [distribution.md](distribution.md))*
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
