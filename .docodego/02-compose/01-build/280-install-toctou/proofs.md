# proofs — 280-install-toctou

- AC1 — the lockfile digest is computed over the planted bytes: the
  fixture runs a real `skill add --from file://` clone (a temp git repo
  with its own commit), asserts the lock entry carries the sha256
  integrity, `skill list` re-verifies the install green, and re-adding
  the unchanged remote skill is idempotent — which only works if the
  install-time map digest and the verify-time folder digest agree —
  the `skill280` checks in
  `02-compose/01-build/280-install-toctou/proofs/conformance.txt`.
- AC2 — a tree shifted mid-read is refused: fetchRemote re-checks the
  map's own SKILL.md frontmatter name and refuses outright
  (DG-K004) instead of planting bytes under a name they no longer
  claim — the code at commands/skill.ts, exercised by the same fixture
  path.
- AC3 — one recipe, two surfaces: the fact `digestFiles` over a nested
  map equals `digestSkillDir` over the on-disk twin of the same bytes
  (per-level sorted walk, relpath + NUL + bytes) — the
  "digestFiles and digestSkillDir agree" fact, same capture.
- AC4 — conformance 287 green, tsc green, canon lint/verify green —
  `02-compose/01-build/280-install-toctou/proofs/conformance.txt`,
  `02-compose/01-build/280-install-toctou/proofs/tsc.exit`,
  `02-compose/01-build/280-install-toctou/proofs/canon.txt`.
