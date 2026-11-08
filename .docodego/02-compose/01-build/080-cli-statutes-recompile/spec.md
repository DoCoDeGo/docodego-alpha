---
name: 080-cli-statutes-recompile
type: unit
status: delivered
---

# 080-cli-statutes-recompile

## intent

The payload's planted `statutes.md` still binds statutes to the old
stream names (`01-discover`, `04-spec`), predating the arc Appendix B
streams the spec tree carries — doctor has been red on exactly this
mirror debt (0/16) since it landed. This unit closes it: a compiler
(`apps/cli/scripts/compile-statutes.ts`) reads the canon — spec/laws
ST-1…16, titles, streams, published words, † completions — and emits
`.docodego/.standard/statutes.md` deterministically, so the reference
page is generated from the spec, never hand-maintained beside it. Then
the record declares recordVersion 9 (a bindings fix is canon upkeep:
patch class, declared by a human per the guard's own law), the bundler
recomputes the payload (specVersion 9, fresh hashes, structure hash), and
doctor flips to 16/16 — exit 0 for the first time. The adopter path is
proven: a v8 record upgrades, its statutes mirror refreshes from the
payload, drifted bytes preserved as `.upstream` per the provenance law.

## scope

In: the statutes compiler (+ its `--check` drift mode), the compiled
statutes page (arc bindings, † completions, honest header), the
recordVersion 8→9 declaration, the rebundle (payload + bundled manifest),
the adopter-path proof. Also in, found by this unit's own proof run: the
bundler's unit-folder exclusion now walks ancestors — `proofs/`
subfolders leaked unit internals into the payload (v2's history is not
an adopter's history). Out: spec/ law text (already accepted at 1.0.0),
migration-registry entries beyond the v8→v9 statutes refresh
(the registry's 6→7/7→8 contiguity gap stays §12 backlog), CLI version
(axes are independent — EL-20), spec 7's normative batch.

## acceptance

- AC1 — `compile-statutes.ts --check` proves the committed page matches
  the compiled canon: sixteen statutes, titles byte-equal to spec
  frontmatter, binds equal to the arc mapping (1→validate … 16→measure),
  † completion lines for exactly the statutes that carry a
  `Completion †` (8 of them: 1, 2, 3, 5, 11, 14, 15, 16), none for
  "complete as published" statutes.
- AC2 — after the compiler runs and recordVersion declares 9, the bundle
  regenerates: payload `specVersion: 9`, `structureHash` fresh, the
  statutes file's payload hash matching the new bytes; `bundle:verify`
  exits 0; the bump guard accepted the declared patch.
- AC3 — `canon doctor` on the real tree exits 0: mirror 16/16 aligned,
  first time green — axes read payload 9 · cli 0.8.0 · spec/ 1.0.2, side
  by side, never inferred.
- AC4 — the adopter path: a scratch record stamped v8 carrying the OLD
  statutes bytes upgrades (`docodego upgrade --apply`): the mirror
  refreshes to the compiled bytes, the manifest stamps 9, and the upgrade
  plan named the refresh before applying.
- AC5 — no regression: `docodego check` and lint clean; canon lint,
  verify, coverage, diff, build all exit 0; typecheck clean; zero
  non-node imports.

## threats

- hand-editing the reference page beside the canon and letting them drift
  again. Mitigation: the page is compiled, and `--check` makes drift a
  failing command; the header says what generated it.
- the completion extraction silently dropping a † (regex rot). Mitigation:
  AC1 pins the count (7) and names which statutes carry one; a dropped
  completion changes the bytes and fails `--check` against the committed
  page.
- reading the version bump as license to touch law meaning. Mitigation:
  the compiled page carries only what the spec files already say —
  bindings and completions move, no published word is edited; the guard
  classifies the change as patch and the declaration says patch.
