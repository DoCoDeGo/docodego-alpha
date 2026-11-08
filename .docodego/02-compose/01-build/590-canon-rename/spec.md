---
name: 590-canon-rename
type: unit
status: scored
deviations: the folder name `canon/` was chosen by delegation — the founder ruled the rename ("resolve all discomfort"); the record's own verb (canon publish, canon rebuild) names the tree, and no founder time was spent on a name they had already described precisely ("represents DoCoDeGo System")
---

# 590-canon-rename

## intent

Resolve the cycle-8 naming discomfort (ruled 2026-11-09, cycle 11):
the founder is "not comfortable calling that folder spec if it
represents DoCoDeGo System" — the law tree stops being called
`spec/` and becomes `canon/` (the machinery's own verb: canon
publish, canon rebuild, canon rebuilds the public site). The tree's
root document stays `SPEC.md` — it is the DoCoDeGo Specification,
and its name is accurate; the folder is the System's canon. The
companion app dir `apps/spec/` becomes `apps/canon/` (it builds and
serves the canon; its `docodego-spec/*` wire schemas keep their
names — they name the Specification domain, a real contract). The
move is deliberate and total: every citation of the old name in
code, scripts, payloads, help, explain pages, and the conformance
suite moves with it, and the payload hops to record v28 because the
planted statutes template and the AGENTS.md template both name the
tree.

## scope

In: `git mv spec canon` and `git mv apps/spec apps/canon`; the
default tree root in the canon app's commands ("spec" → "canon");
dist paths (`apps/spec/dist` → `apps/canon/dist`); the workspace,
root scripts (`canon`, `typecheck`, build), CI's doctor step, and
package name; the compile-statutes generator's laws dir and its
compiled citation line; the statutes template's `(spec/laws, …)`
and the AGENTS.md template's "spec tree" prose (the payload hop:
specVersion 27 → 28, migration entry v27→v28 with notes, the
version-transition row); the conformance pins reading the tree
(a2's transition-table read, a5's sign-off fixture roots); the
explain page and help examples citing `spec/amendments/…`; the
live planted AGENTS.md's one prose line; docs regen; supersession
rows for any record proof the drift gate flags over the renamed
paths. Out: the `docodego-spec/*` schema identifiers (wire
contracts, unchanged); SPEC.md's own name; `.docodego/` record
files (append-only — their `spec/` citations are history, repaired
only by the gates' sanctioned supersession row); `docs/` (generated,
regenerated not hand-edited); any behavior change beyond the name.

## acceptance

- The tree is `canon/`, the app is `apps/canon/`, and a repo-wide
  grep finds no live `spec/` path citations outside `.docodego/`
  records, `docs/`, and the schema identifiers — the residue is
  exactly the declared history.
- The payload hops cleanly: bundle:verify clean at spec 28; the
  v27→v28 migration entry mirrors the version-transition row
  (the hop-for-hop pin); `docodego upgrade` plans and applies on a
  fixture; doctor's axes align.
- Fresh plants and the live repo agree: init in a scratch dir
  plants statutes citing `canon/laws`; the live root AGENTS.md says
  canon tree.
- Full battery green: check 0 errors, conformance all green (count
  grows, never shrinks), bundle:verify at 28, doctor healthy, docs
  fresh, build 11/11.
