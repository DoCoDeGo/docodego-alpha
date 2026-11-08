---
name: 050-canon-amend
type: unit
status: delivered
---

# 050-canon-amend

## intent

`canon amend <law-id> --as <version>` scaffolds an amendment record in
`spec/amendments/`: the law's anchor, the delivered baseline's structure
hash, and the three questions an amendment must answer (what changed, why,
what risk it answers — EL-30), with the sign-off section left pending for
`docodego sign`. It writes the scaffold and nothing else: the law file, the
version stamp, and the log move only when a person accepts (EL-20). It
exists now because every later amendment — the statutes recompile first
among them — needs its record to start from the delivered baseline, not
from memory.

## scope

In: the `amend` command, the scaffold template (document standard), the
refusals (unknown law, no delivered manifest, existing scaffold, version
not greater than current), the version comparison hoisted for shared use.
Out: editing law files or SPEC.md (a person's act, founder-signed),
`docodego sign` itself (CLI-side, spec 7), doctor, publish.

## acceptance

- AC1 — on the fixture tree (which carries a delivered manifest), `canon
  amend ST-2 --as 1.0.1` exits 0, writes `amendments/1.0.1-ST-2.md`, and
  the scaffold carries: the law's anchor and title, the manifest's
  structure hash as baseline, the three questions, and a pending sign-off
  section.
- AC2 — refusing an unknown law id exits 1 (SP-A001); refusing when the
  scaffold file already exists exits 1 (SP-A003); refusing a version not
  greater than the current SPEC.md version exits 1 (SP-A004); refusing
  when no delivered manifest exists exits 1 (SP-A002, remediation: build
  first). All four taught with the fix.
- AC3 — the scaffold is document-standard clean: lint passes the fixture
  tree after the scaffold lands (H1, purpose, header block).
- AC4 — no regression on the real tree: lint, verify, coverage, diff,
  build all exit 0; typecheck clean; zero non-node imports; `--json`
  envelope `docodego-spec/amend/v1`.

## threats

- the scaffold drifting into a writer (auto-editing law files "to help").
  Mitigation: the command's write set is exactly one new file under
  amendments/; the acceptance criteria say so; the refusals keep it from
  overwriting anything.
- a scaffold forgotten in the tree (draft rot). Mitigation: the scaffold's
  frontmatter carries `status: draft`; a later unit (doctor) reports draft
  amendments as findings; the scaffold's own header says what it is.
- version comparison duplicating build's logic and drifting. Mitigation:
  the comparison is hoisted to the loader module and both commands import
  it.
