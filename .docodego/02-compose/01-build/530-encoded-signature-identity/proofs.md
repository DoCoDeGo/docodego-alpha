# proofs — 530-encoded-signature-identity

The flip, proven over fixture records through real command runs
(conformance: 445 checks — every pin green in the committed state; the
one pre-commit red is the bundle drift gate, whose baseline is HEAD by
design, the same delivered-baseline rule the delivered index uses — it
reads clean from this unit's commit forward).

- AC1 — the stored form: the derived sign writes `enc:v1:<base64>`
  byte-exact (fixture-pinned against base64 of the stubbed raw), the
  receipt line names "(the … identity of the environment, encoded)",
  and the fixture decodes the stored token back to the raw — the ruled
  round-trip held at the storage site. Typed `--name "Ada Lovelace"`
  rows are byte-identical in shape to the pre-flip pins. Both sign and
  sign-off walk the encoded path in the suite. The raw string appears
  nowhere — the no-raw pin survived unchanged.
- AC2 — the reveal surface: `whoami` prints raw, kind, and the exact
  stored form with no record layer; `--decode` returns the plain
  string (cli306); an `fp:v1` value refuses with the one-way honesty
  (cli307); a non-token refuses as usage (cli308); the JSON envelope
  carries raw, kind, stored (cli309). The command's contract lives in
  `apps/cli/src/commands/whoami.ts`.
- AC3 — the payload declares record version 27: the live record's
  `.docodego/.standard/manifest.json` stamps 27 (hashes detect,
  humans declare), the migration registry stays contiguous
  (assertContiguous held during the bundle), the v26→v27 teach
  rewrites the shipped sign line in place and inserts the whoami line
  (fixture-pinned: updated-in-place, idempotent, customized copies
  kept), and `canon/record/version-transition.md` carries the v27 row
  (the suite compares the table to the registry hop for hop — green).
  The bundle guard accepted the declaration: two changes (AGENTS.md
  rule line rewritten — minimum bump major — and the version
  declaration itself) at the fresh hop 27.
- AC4 — the scaffold: `canon/amendments/1.2.5-EL-34.md` exists in the
  law tree's shape — frontmatter id AMEND-EL-34-1.2.5, baseline-hash
  of the untouched law file, status draft, pending block intact and
  runnable by `docodego sign-off` (the same fixture shape the suite
  signs). The law file `canon/laws/34-the-launch-gate.md` is
  byte-untouched by this unit — the scaffold changes nothing by
  itself; the wording moves only on the founder's sign-off.
- AC5 — the honest clause, repriced once, everywhere: "concealment
  from the casual read, not cryptography" pinned in the ledger
  template and all three help bodies (sign, sign-off, whoami) with
  whitespace-normalized matching; the receipts carry it on every
  derived act; the scaffold names the traded property in its risk
  paragraph (deterministic encoding → cross-record correlation is
  possible; the salt's unlinkability is what the visibility ruling
  spends). The legacy salt file and fp rows are untouched by every
  command — the fixture writes a salt and proves byte-stability
  across signs, and no code path creates a salt anymore.

## the battery

Record check green · conformance 445 green in the committed state ·
`pnpm run build` 11/11 gates (bundle, bump guard at the declared hop,
drift verify, typecheck, bun compile, artifact smokes) · doctor zero
errors · docs fresh at 25 generated files (whoami's page included) ·
bundle:verify clean at spec 27. One migration quirk recorded: the
root `pnpm docs` collides with pnpm's builtin registry command —
`pnpm run docs` is the explicit form (the pnpm migration's quirk
line, journaled).

- supersession (2026-11-09, unit 590-canon-rename) — the law tree renamed: `spec/` is `canon/` and `apps/spec/` is `apps/canon/` (the founder's cycle-8 ruling; the files above are the same files, moved). Paths in this proof were recaptured to their current locations per the drift gate's sanctioned repair.
