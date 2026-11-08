## grill 2026-11-08

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: The unit digests the in-memory files map at remote-add time (digestFiles in lock.ts, same recipe), re-checks the SKILL.md name from the map itself, and fixes the lying doc comment; a conformance fact holds digestFiles and digestSkillDir to one recipe and a fixture runs a real file:// clone install verified green by skill list.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: AC1 by the file:// fixture (add exits 0, lock integrity equals digestFiles of the planted bytes, list re-verifies green); AC2 by a fact and the re-check code path; AC3 by the recipe-identity fact over a nested map vs its on-disk twin; AC4 by conformance + tsc + canon — proofs/conformance.txt, proofs/tsc.txt, proofs/canon.txt.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Reimplementing the digest recipe wrong — flat path sort differs from the per-level walk. Mitigated: digestFiles rebuilds the tree and sorts per level; the identity fact holds the two together forever.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: The bundled path, the re-add disk-digest comparison, digestSkillDir itself, and any lockfile format change — out.
- GQ-AC1 asked: Criterion: 'AC1 — fetchRemote records `digestFiles(files)`: the lockfile digest is computed over the exact map that plants, one read, no window — proven by a conformance fixture running `skill add --from file://` (a real clone of a real git repo) whose lock entry's integrity matches `digestFiles` of what lands, and by `skill list` re-verifying the install green.' — how is this verified end-to-end?
  answered: the fixture clones a temp git repo via file://, adds the skill, asserts the lock entry and skill list exit 0 — proofs/conformance.txt.
- GQ-AC2 asked: Criterion: 'AC2 — a tree whose SKILL.md frontmatter name shifts mid-read is refused (the name is re-checked against the map's own SKILL.md), not planted under the wrong name.' — how is this verified end-to-end?
  answered: fetchRemote refuses when the map's SKILL.md frontmatter name differs from the requested name (the shift refused outright, not planted wrong) — the code plus the recipe fact in proofs/conformance.txt.
- GQ-AC3 asked: Criterion: 'AC3 — `digestFiles` and `digestSkillDir` agree: the same bytes give the same digest (the recipe identity), so `list`'s folder re-verify and the install-time map digest hold together — a conformance fact over a nested map and its on-disk twin.' — how is this verified end-to-end?
  answered: the fact digestFiles(nested map) === digestSkillDir(temp dir with the same bytes) — proofs/conformance.txt.
- GQ-AC4 asked: Criterion: 'AC4 — the suite stays green: conformance green, tsc green, canon lint/verify green.' — how is this verified end-to-end?
  answered: proofs/tsc.txt and proofs/canon.txt hold the green runs; conformance 282+ green in proofs/conformance.txt.

verdict: pass
