## grill 2026-11-07

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: Lays the delivered artifacts out as a version-directory site — v/<semver>/ with SPEC, index, manifest, and a verification badge — plus llms.txt and current.txt regenerated from the directories present; refuses a tree ahead of dist, a downgrade, or a same-version-different-structure republish.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: Fresh-site publish of 1.0.2 (layout + badge contents shown), the idempotent second publish (hashes identical before/after), the four refusals SP-S001..SP-S004 each exit 1 with remediation, and the no-regression suite — all in proofs/.
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: Biggest threat: the site becoming a decorated product surface. Mitigation: four plain-text file kinds, nothing else; the scope section names PDF/search/rss out.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: Out: writing dist (build's job), serving or hosting, extras, doctor's checks (already a command).
- GQ-AC1 asked: Criterion: 'AC1 — publishing the current dist (1.0.2) into a fresh site dir exits 0 and lays out: `v/1.0.2/{SPEC.md, law-index.json, manifest.json, verification.txt}`, root `llms.txt` and `current.txt` naming 1.0.2 with the structure hash prefix.' — how is this verified end-to-end?
  answered: Run canon publish --site into a fresh folder — exit 0; the tree shows v/1.0.2/ with four files, llms.txt lists 1.0.2, current.txt names it with the hash prefix.
- GQ-AC2 asked: Criterion: 'AC2 — idempotence: a second publish of the same version-and-structure exits 0 and changes nothing (byte-identical files — verified by hash before/after); the root files regenerate from the version directories present, so deleting them rebuilds correctly.' — how is this verified end-to-end?
  answered: Run the same publish again — exit 0 and every file byte-identical (sha256 compared in the proof); then delete current.txt and republish — it regenerates from the v/ directory.
- GQ-AC3 asked: Criterion: 'AC3 — refusals, each exit 1 and taught: no manifest at dist (SP-S001, build first); tree ahead of dist (SP-S002, rebuild); downgrade below the site's current (SP-S003); same version already published with a different structure (SP-S004).' — how is this verified end-to-end?
  answered: Mutate four ways — empty dist (SP-S001), touch a spec file without rebuilding (SP-S002), point --site at a folder whose current.txt says 9.9.9 (SP-S003), and a same-version site whose recorded hash differs (SP-S004) — each exit 1 with its code and the fix.
- GQ-AC4 asked: Criterion: 'AC4 — no regression on the real tree: lint, verify, coverage, diff, build, doctor's non-mirror checks all exit 0; typecheck clean; zero non-node imports; `--json` envelope `docodego-spec/publish/v1`.' — how is this verified end-to-end?
  answered: After publish lands: lint, verify, coverage, diff, build all exit 0 on the real tree; tsc --noEmit clean; imports grep zero non-node; the --json envelope carries schema docodego-spec/publish/v1 — all in proofs/.

verdict: pass
