---
name: 020-canon-build
type: unit
status: delivered
retired_on: 2026-11-08
was: 020-canon-build
---

# 020-canon-build

## intent

`canon build` compiles the spec tree into its machine artifacts:
`law-index.json` (the agent-era payload — laws as data), a canonical
`SPEC.md` copy, and `manifest.json` carrying the spec semver, a structure
hash over every file, and per-file checksums. It enforces CommonMark's
version-sanity refusal: no build may move the spec backwards, and no content
change may land under an unchanged version — the tool suggests, a person
declares (EL-20). It exists now because `amend` and the payload recompile
both consume the manifest; they must not ship before the thing they read.

## scope

In: the `build` command, deterministic artifact emission (no timestamps —
identical trees produce identical bytes, which is what makes drift checks
possible), the version-sanity rules, fixtures proving each refusal fires.
Out: payload mirrors into the CLI's bundle (the statutes recompile rides the
bundle-guard unit), `amend`/`diff`/`coverage`/`doctor`/`publish`, any
write outside `apps/spec/dist/`.

## acceptance

- AC1 — `canon build` on the committed spec set writes `apps/spec/dist/`:
  `law-index.json` carrying all 31 laws (id, title, pillar, severity,
  enforced-by, introduced-in, status, file) plus the spec version;
  `SPEC.md` byte-identical to the source; `manifest.json` with a sha256
  structure hash and per-file checksums. All three valid, deterministic
  (a second build produces identical bytes).
- AC2 — idempotence: an immediate rebuild with no changes exits 0 and
  leaves artifacts byte-identical.
- AC3 — downgrade refusal: with `dist/manifest.json` holding a version
  greater than SPEC.md's, build refuses (exit 1, SP-B001) and changes
  nothing.
- AC4 — undeclared-change refusal: with the manifest holding the same
  version but a stale structure hash (a fixture tree edited under the same
  version), build refuses (exit 1, SP-B002) with remediation pointing at
  the amendment procedure.
- AC5 — the reading gates still pass (lint, verify exit 0 on spec/), exit
  codes and `--json` follow the vendored law, typecheck clean, zero
  non-node imports.

## threats

- non-deterministic artifacts would make drift checks meaningless.
  Mitigation: fixed key order, sorted file lists, no timestamps anywhere;
  the idempotence proof (AC2) is byte-for-byte.
- a build that silently supersedes a manifest would let law change without
  a version. Mitigation: the two refusals (AC3, AC4) — and both fixtures
  are committed, so the refusals are re-runnable by anyone.
- artifact sprawl (publishing dreams creeping into build). Mitigation:
  exactly three files, one schema each; everything else is a later unit.
