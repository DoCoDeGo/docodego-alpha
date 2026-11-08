# how to run

The demo is the name: the tree that represents the DoCoDeGo System
is called what the machinery already calls it.

## see it work

    ls canon/
    node apps/cli/src/main.ts explain DG-U117 | grep fix
    node apps/cli/src/main.ts upgrade 2>&1 | tail -1

Expected: `canon/` holds SPEC.md, laws, record, amendments — the
System's canon; the explain page's fix line names
`canon/amendments/<file>.md`; the upgrade plan prints "at the
bundled version — nothing to migrate" (the live record took v28
during the unit). The old name appears only in declared history:
record files and the wire schemas that name the Specification
domain.

## run output

`conformance: all 461 checks green` — 2026-11-09, in the committed
state, recorded in the unit's proofs.md.

## visual evidence

none — a renamed tree and a green suite are the show.
