## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Builds apps/spec/dist/ from the spec tree: law-index.json (31 laws as data), a byte-identical SPEC.md copy, and manifest.json (spec semver + sha256 structure hash + per-file checksums), refusing to move the spec backwards or to ship content changes under an unchanged version.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Real runs land in this unit's proofs/ folder: a build over the committed spec set (exit 0, artifacts listed), an immediate rebuild proving byte-identical idempotence (shasum compared), and refusal runs against the downgrade and stale-hash fixtures (exit 1, SP-B001 / SP-B002), plus lint and verify re-runs showing no regression.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: non-deterministic artifacts, which would make every downstream drift check meaningless. Mitigation: fixed key order, sorted file lists, no timestamps — and AC2's idempotence proof is byte-for-byte, not eyeballed.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: payload mirrors into the CLI's bundle (the statutes recompile rides the bundle-guard unit at recordVersion 9), the other writer commands, and any write outside apps/spec/dist/.
- GQ-AC1 asked: Criterion: 'AC1 — `canon build` on the committed spec set writes `apps/spec/dist/`: `law-index.json` carrying all 31 laws (id, title, pillar, severity, enforced-by, introduced-in, status, file) plus the spec version; `SPEC.md` byte-identical to the source; `manifest.json` with a sha256 structure hash and per-file checksums. All three valid, deterministic (a second build produces identical bytes).' — how is this verified end-to-end?
  answered: Run canon build — exit 0; then `node -e` JSON.parse of law-index.json counting 31 laws and printing the specVersion; shasum of all three artifacts recorded, then canon build again and shasum again — the two lists must be identical.
- GQ-AC2 asked: Criterion: 'AC2 — idempotence: an immediate rebuild with no changes exits 0 and leaves artifacts byte-identical.' — how is this verified end-to-end?
  answered: The rebuild in AC1's proof IS the idempotence proof: exit 0 and identical shasums for SPEC.md, law-index.json, manifest.json.
- GQ-AC3 asked: Criterion: 'AC3 — downgrade refusal: with `dist/manifest.json` holding a version greater than SPEC.md's, build refuses (exit 1, SP-B001) and changes nothing.' — how is this verified end-to-end?
  answered: Fixture: a tree whose SPEC.md says 0.9.0 while dist/manifest.json says 1.0.0 — build refuses, exit 1, SP-B001 message names the versions; nothing in dist/ changes (mtime and shasum unchanged).
- GQ-AC4 asked: Criterion: 'AC4 — undeclared-change refusal: with the manifest holding the same version but a stale structure hash (a fixture tree edited under the same version), build refuses (exit 1, SP-B002) with remediation pointing at the amendment procedure.' — how is this verified end-to-end?
  answered: Fixture: edit a fixture law's body under the same version — build compares the new structure hash against the manifest's stale one, refuses exit 1 with SP-B002 and remediation citing the amendment procedure.
- GQ-AC5 asked: Criterion: 'AC5 — the reading gates still pass (lint, verify exit 0 on spec/), exit codes and `--json` follow the vendored law, typecheck clean, zero non-node imports.' — how is this verified end-to-end?
  answered: After build lands: lint exit 0, verify exit 0 on spec/; tsc --noEmit clean output; the imports grep shows zero non-node imports — all recorded in proofs/.

verdict: pass
