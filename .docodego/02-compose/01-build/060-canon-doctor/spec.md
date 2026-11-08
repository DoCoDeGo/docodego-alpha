---
name: 060-canon-doctor
type: unit
status: delivered
---

# 060-canon-doctor

## intent

`canon doctor` is the drift gate across spec ↔ build ↔ payload, in one
honest run: it reruns the lint and verify findings from the same cores the
gates use (extracted so any command can reuse them, not re-implement them),
recomputes the structure hash against the delivered manifest, checks the
index's law count against the tree, closes the manifest↔SPEC.md version
pair, and compares the bundled payload's statutes mirror to the spec tree's
statute→stream bindings. The three version axes — payload stamps, CLI
version, spec semver — are reported side by side, never inferred from one
another (EL-20). Exit 1 on any error finding: a payload-bearing release
runs doctor first (how-to-amend), and a red doctor holds it. It exists now
because the payload's statute bindings predate the arc streams, and the
recompile that fixes them needs the gate that proves it worked.

## scope

In: the `doctor` command; lint/verify findings extracted into reusable
cores; the structure/law-count/version checks; the payload statutes-mirror
check (statute title match AND spec stream in the bind list, decoded from
the payload source text — never by importing the module); the axes report.
Out: fixing anything (doctor diagnoses, makers repair), publishing,
coverage/impact, grading prose quality, checking the record layer
(`.docodego/` has the CLI's own doctor for that).

## acceptance

- AC1 — doctor on the real tree: lint and verify cores clean, structure
  and law count and version pair aligned (the tree matches the delivered
  1.0.2 manifest), and the payload mirror found honestly behind: SP-F005
  reports 0/16 aligned with the first drift named (statute 1 binds the old
  stream names; ST-1 carries `stream: validate`) — exit 1. The axes line
  reads payload 8 · cli 0.8.0 · spec/ 1.0.2, never equated.
- AC2 — doctor on the fixture tree (mini spec that passes lint+verify, a
  committed dist built by `canon build` outside the fixture root, and an
  aligned payload fixture) exits 0: every check green, mirror 1/1 — the
  green path exists, not just the red one.
- AC3 — drift detections, each exit 1 on a mutated scratch copy of the
  fixture: structure changed without a rebuild (SP-F001), manifest
  specVersion ≠ SPEC.md's (SP-F002), index lawCount ≠ tree count
  (SP-F003), no delivered manifest at the dist path (SP-F004).
- AC4 — no regression on the real tree: lint, verify, coverage, diff,
  build, amend all exit 0; typecheck clean; zero non-node imports;
  `--json` envelope `docodego-spec/doctor/v1`.

## threats

- doctor reimplementing the gates' logic and drifting from them. Mitigation:
  lint and verify expose their finding cores; doctor imports them — the
  gates and the doctor cannot disagree about what a clean tree is.
- the mirror check becoming a full text-diff of statutes (prose grading in
  disguise). Mitigation: v1 checks the mechanical identity only — statute
  presence, title, and the stream binding; body prose is out of scope.
- false comfort from the axes line (reading payload 8 as "the spec is at
  8"). Mitigation: the axes are reported as separate fields with their own
  names; the human output labels each axis; no comparison is computed
  across them.
