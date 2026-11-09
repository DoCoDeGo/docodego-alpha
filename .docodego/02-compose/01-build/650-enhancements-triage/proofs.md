# proofs — 650-enhancements-triage

- `docs/process/enhancements.md` — the disposition table appended (all
  20 boxes, one state each); boxes 1, 2, 8, 11 flipped inline only
  after tree/registry verification (1–2: founder rulings + live npm
  `docodego@0.7.2` / the docodego homebrew tap at 0.7.1; 8:
  640-go-public-surface; 11: install.sh + registry)
- `.github/workflows/release.yml` — pinned in `apps/cli/src/conformance/a7-contract-surface.ts` (the 650 block): top-level `permissions: contents: write`, npm job `contents: read` + `id-token: write`, two `npm publish --provenance` occurrences — widening fails the suite
- `.github/workflows/ci.yml` — pinned as declaring no permissions block
- `pnpm -C apps/cli run -s conformance` — "conformance: all 488 checks green" (485 + the three 650 facts)
- `pnpm typecheck` — exit 0; `node apps/cli/src/main.ts check` — exit 0 (no payload hop: the shelf and workflows live outside the boundary)

## failure-to-cause

(none — first-pass green after the score gate)
