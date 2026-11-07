# canon — the spec workbench

*The toolchain for the DoCoDeGo System's law-file set: it lints the
document standard, verifies referential integrity against the live CLI, and
compiles the spec for the payload. Separate binary by design — laws amend
at founder pace, the CLI at gate pace (ADR 0012).*

## Commands

| Command | Delivered | What it does |
|---|---|---|
| `lint` | yes | document-standard conformance over the spec tree |
| `verify` | yes | referential integrity: enforced-by names a live gate, links and anchors resolve, the version circle closes |
| `build` | yes | SPEC.md bundle + law-index.json + manifest with structure hash, version-sanity refusal |
| `amend` | yes | scaffold an amendment record (anchor, baseline hash, the three questions); the founder signs via `docodego sign` |
| `diff` | yes | semantic law diff with a suggested bump class (tool suggests, human declares) |
| `coverage` | no | the enforceability map, orphan gates, `--impact` |
| `doctor` | yes | drift across spec ↔ build ↔ payload (gates rerun, mirror checked; exit 1 holds a payload release) |
| `publish` | yes | version-directory site, llms.txt, verification badge (refuses downgrades and silent republishes) |

## Running it

From the repository root:

```
node --experimental-strip-types apps/spec/src/main.ts lint
node --experimental-strip-types apps/spec/src/main.ts verify
```

Or through the package script: `npm run canon -- lint --json` (in
`apps/spec/`). Fixtures that prove each gate fails live in
[fixtures/](fixtures/) — `--root apps/spec/fixtures/broken-spec` and
`--root apps/spec/fixtures/drift-spec`.

## The contract

Zero dependencies, erasable TypeScript, node ≥ 22.6. Exit law (vendored
from the CLI): `0` ok · `1` gate/lint/verify failure · `2` usage or not
built yet · `3` spec missing or corrupt. `--json` emits one envelope,
`docodego-spec/<command>/v1`. `verify` reads the CLI's command registry
from `apps/cli/src/cli/help.ts` at run time — never a copy — so contract
drift between the two binaries is caught mechanically, not by hope.
