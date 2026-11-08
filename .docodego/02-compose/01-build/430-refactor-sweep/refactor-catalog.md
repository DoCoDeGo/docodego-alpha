# refactor-catalog — 430-refactor-sweep

The sweep's evidence base. Consolidated from three read-only audits
(apps/cli = 54 items; apps/spec + docs + scripts = 101; spec tree +
templates + root docs = 98; 253 total) plus a direct verification pass
on this unit's opening day. Bias: **removal before rearrangement**.

Risk tags — what an item costs beyond the edit itself:

- `—` free: edit, tsc, suite green, commit.
- `[G]` generated: the bytes are owned by gen-docs; edit the generator or
  the registry it reads, then run `npm run docs` in apps/cli.
- `[C]` conformance-pinned: a fixture or check names these bytes; the
  conformance cover changes with the change, in the same commit.
- `[P]` payload: touches bundled record payload (AGENTS.md, templates,
  manifest-visible files); owes the record-contract bump + teach migration
  chain. Deferred unless a batch earns the chain.
- `[L]` law-tree: spec/ canon change; owes an amendment log row, version
  stamp, canon build, doctor green.
- `[F]` founder-owned: named as needing the founder's ruling; listed, not
  executed.

Every item was a lead first; execution re-verifies each one against the
tree before editing (grep before cut). Items found during execution are
appended with their batch letter and the date.

## batch a — dead code (delete the symbol)

- SW-001 ✅ `apps/cli/src/record/template-docs.ts:4` — `specTemplate` referenced nowhere; the copy already drifted from commands/new.ts's specBody (template uses `→`, specBody `->`), proof no one reads it. ~32 LOC. —
- SW-002 ✅ `apps/cli/src/commands/resolve.ts:59` — `streamOrComplain` referenced nowhere; new.ts validates streams itself. Removing it removes the only DG-U003 emitter — keep the explain page (conformance pins `EXPLANATIONS.length >= 55`), or move the emit site. ~8 LOC. [C]
- SW-003 ✅ `apps/cli/src/commands/resolve.ts:69` — `fileExists` trivial re-wrapper of `isFile`, referenced nowhere. ~1 LOC. —
- SW-004 ✅ `apps/cli/src/bundled/index.ts:112` — `allSkillFiles` referenced nowhere (conformance grep clean). ~6 LOC. [C] (verify fixture pins before cut)
- SW-005 ✅ `apps/spec/src/commands/stubs.ts` — whole stub factory dead: all 8 canon commands delivered; the "six writer commands not built" story is over. ~16 LOC + main.ts:15 import. —
- SW-006 ✅ `apps/spec/src/registry.ts:9` — `delivered` field true for every command; feeds only the removed stub path. Field + main.ts:35 else-arm `(not built yet)` unreachable. —
- SW-007 ✅ `apps/spec/src/emit.ts:14` — `renderDiagnostics` unused (cli imports its own from emit/diagnostics.ts). If it empties the file, delete the file. ~20 LOC. —
- SW-008 🔁 apps/cli unused barrel re-exports (audit 1: "unused barrel exports") — enumerate index.ts barrels, drop names nothing imports. ~10 items. —
- SW-009 🔁 apps/cli "unused-export keyword drops" (audit 1) — `export` keywords on module-private symbols: un-export ~12 items, keeps the API surface honest. —
- SW-010 🔁 duplicate `--rotate` flag (audit 1) — two commands register `--rotate`; one is vestigial. Verify which reads it. [C]
- SW-011 🔁 `fsx.exists` (audit 1) — exists-check helper unused or single-use; inline or delete. —
- SW-012 🔁 emit.ts renderers (audit 2, beyond SW-007) — dead renderer variants in spec's emit layer. —
- SW-013 🔁 dead branches (audit 1: "dead branches/flags never read") — flag reads with no writer; enumerate `args["…"]` reads vs registered flags per command. ~6 items. —
- SW-014 🔁 leftover TODO/debug scaffolding (audit 1 category) — grep TODO/FIXME/XXX/console.debug across src. ~4 items. —
- SW-015 ✅ apps/cli `dist/` untracked leftovers (docodego.js, binary, planted copies) — gitignored build by-products; delete freely, zero repo change. —
- SW-016 🔁 `apps/spec/src/main.ts` unused imports beyond `stub` (audit 2). —
- SW-017 🔁 sign-off.ts exported `SECRET_PATTERNS`/`scanForSecrets` flagged unused-export candidates (audit 1) — verify conformance imports before touching. [C]

## batch b — duplication (one helper, N sites)

- SW-018 ✅ frontmatter parsing triple — `apps/spec/src/frontmatter.ts:37` and `apps/cli/src/record/frontmatter.ts:33` are near-twins (~60 LOC pair); consolidate to one module owned by the cli, spec imports it or ships its own minimal slice. [C] (spec's is conformance-adjacent via doctor)
- SW-019 ✅ hash scatter — `createHash` hand-rolled in 5 files (fsx sha16, sign full-sha, sign-off lawHash, audit slice-12, skills/lock incremental): hoist `sha256(text)` (+ trivial slice variants) into fsx.ts; 5 sites become one import each. —
- SW-020 ✅ envelope writer ×33 call sites — every command hand-pours the envelope; one `emit(cmd, data)` helper collapses 33 pours (site map in appendix). —
- SW-021 🔁 teach boilerplate ×9 (audit 1: migrations.ts) — nine migration blocks repeat the same teach-in-place/customized/idempotent scaffolding; one `teachStep()` helper. [M] (hop table mirrored by conformance — helper only, no behavior change)
- SW-022 🔁 root-defaults duplication (audit 1) — default root resolution repeated across commands; one `defaultRoot()` already exists or is born here. —
- SW-023 🔁 AGENTS-teach boilerplate (audit 3: template/migration twin texts) — the taught-AGENTS paragraphs repeat growth/rules/skills prose ×3 across template + migrations + scaffold. [P] — deferred to a batch that earns the bump chain.
- SW-024 🔁 status-line emitters (audit 1) — the `status:` compose repeated in ≥4 commands; one formatter. —
- SW-025 🔁 date-today emitters (audit 1) — `today()` re-implemented; unify on fsx. —
- SW-026 🔁 kebab-case validators (audit 1) — same regex re-typed; one is-key helper. —
- SW-027 🔁 `candidatesOf`-style token scanners (audit 1/2) — path-token extraction duplicated between check.ts and lint-side passes; share one. [C]
- SW-028 🔁 spec↔cli walker twins (audit 2) — record-walking helpers duplicated across apps; spec keeps the minimal set it needs. [C]
- SW-029 🔁 error-complain pattern (audit 1) — `complain(json, io, diag, code, class)` pours ×40+; sweep the noisiest 10 sites to a one-liner wrapper. —
- SW-030 🔁 demo bundle templates ×5 (audit 3) — the five how-to-run bundles share a fill-section skeleton; one template function in the generator, not five copies. [P]

## batch c — explain/docs gaps (the tool teaching itself)

- SW-031 ✅ explain pages missing ×7 — DG-U031 (no grill record), DG-U032 (transition refused), DG-U041, DG-U110, DG-U111, DG-U112, DG-U113 have registry rows and emitters but no page. Write the seven pages. [G][C]
- SW-032 ✅ DG-F004 page stale — hard-codes "draft|grilled|scored|delivered"; the law holds six states since 400-law-flip (launch-passed, founder-signed). Align with STATUS_VALUES. [G][C]
- SW-033 🔁 DG-S004 page stale (audit 2) — fix text drift vs the live emitter. [G][C]
- SW-034 🔁 SP-* cross-hint decision (audit 2) — spec-side codes get explain hints or the hint line drops for non-DG codes. [C]
- SW-035 ✅ help.ts USAGE drift — grill/lint usage lines vs real flags; reconcile the whole help registry against the arg parsers (LAW_COMMANDS parity check exists — extend to flags). [G][C]
- SW-036 ✅ README "fifteen commands" — there are 21. Count the real registry; say it with a number that can't rot (or name the registry as truth). —
- SW-037 🔁 registry status lists stale (audit 2) — docs naming statuses/envelope types that grew; sweep `docs/**` + READMEs for the four-state and v≤N literals. ~6 items. —
- SW-038 🔁 version-axes contradiction (audit 2) — apps/spec package version 0.1.0 vs canon tree 1.2.1 vs record 23: doctor should state which axes are which; README/doctor text aligned. [C]
- SW-039 🔁 gen-docs orphan detection (audit 2) — a registry code with no page (or a page with no code) should fail docs:verify; add the two checks. [G]
- SW-040 🔁 explain `--list` (audit 2) — the registry is enumerable but there's no listing command surface; add or decline with a line. —

## batch d — stale docs (say what is true)

- SW-041 🔁 README command counts and flows (audit 3) — beyond SW-036: the walkthrough names flags that moved. —
- SW-042 🔁 version-axes prose contradictions (audit 3) — docs pages naming record v≤N, spec versions, manifest sizes that drifted. ~5 items. —
- SW-043 🔁 enhancements.md tick-boxes (audit 2) — landed items still unticked / dead items still open; reconcile against the tracker. —
- SW-044 🔁 record-format.md tree indent (audit 2) — the tree drawing's indentation lies about the layout. —
- SW-045 🔁 apps/spec/README sign→sign-off (audit 2) — names the old command surface. —
- SW-046 🔁 coverage row (audit 2) — docs coverage table vs the real 355-check census. —
- SW-047 🔁 getting-started drift (audit 2) — the first-run flow vs current init/skill behavior. —
- SW-048 🔁 docs/README.md index (audit 2) — the index page vs the actual docs tree (12 root pages, 22 commands, audits, journal). —
- SW-049 🔁 tooling-glossary/vocabulary-packs overlap (audit 2) — same terms defined twice; one points to the other. —
- SW-050 🔁 review-dimensions/quality-rubric overlap (audit 2) — duplicated dimension lists; dedupe or cross-name. —
- SW-051 🔁 architecture.md staleness (audit 2) — module map vs the real src tree. —
- SW-052 🔁 diagnostics.md (audit 2) — generated or stale? If the registry owns it, route through gen-docs. [G]
- SW-053 🔁 go-public-checklist currency (audit 2) — L-gate names changed. —
- SW-054 🔁 quality-outcomes currency (audit 2). —
- SW-055 🔁 versioning.md vs the hop table (audit 2) — prose versions vs migrations.ts truth. [M]

## batch e — docs organization (a place for everything)

- SW-056 ✅ process docs home — go-public-checklist, quality-audit-rubric, review-dimensions, quality-outcomes, enhancements are process/runtime artifacts mixed with reference pages; `docs/process/` takes them, README index re-points. ~5 moves. —
- SW-057 ✅ audits index — `docs/audits/` holds 7 same-day audit files, no index; a README naming each audit's scope and disposition (the tracker rows already point here — verify links survive). —
- SW-058 ✅ distribution.md — process-log-flavored page sitting at docs root; move under `docs/process/` (or history/). —
- SW-059 ✅ journal ledger style — one file per day with repeated headers; when a second day arrives, the convention line goes in the journal README; today: fix the single file's header boilerplate. —
- SW-060 ✅ docs/commands grouping — 22 flat command pages; group by family (record / gates / support) with README sections, or keep flat + richer index: decide by the registry's own FAMILY_TITLES (already exists — reuse it as the grouping). [G][C]
- SW-061 🔁 agentic-tests briefs (audit 2) — briefs/ naming vs directive.md conventions; align or index. —
- SW-062 🔁 docs/README decision-tree (audit 2) — "where do I read about X" routing table at the top. —

## batch f — hygiene (small, mechanical, real)

- SW-063 🔁 fuzz.ts em-dash header (audit 2) — header comment cosmetics vs sibling scripts. —
- SW-064 ✅ tsconfig `noUnusedLocals` — measure the error flood first; add with the cleanup it forces, or decline with the count. —
- SW-065 ✅ `"private": true` for apps/spec (and apps/cli) — neither is published; root already private. —
- SW-066 ✅ root scripts dedupe — 8 root scripts re-pour apps/cli's; delegate or drop, README/honor-check re-pointed. —
- SW-067 🔁 package.json hygiene both apps (audit 1/2) — unused deps/devDeps, script typos. ~4 items. —
- SW-068 ✅ DG-C018 status-flip artifact — bound sha == sha(spec with status substituted back to `scored`) for all 20 warned units (verified this unit's opening day): check.ts accepts the deliver-flip variant for delivered units; conformance cover for both sides (real drift still warns, flip artifact goes quiet). Clears 20 standing warnings. [C]
- SW-069 ✅ DG-C019 teaching-text false positives — 390's proof quotes `[evidence: vibe]` and the demo how-to-run instructs `[evidence: anything]`; the scanner reads teaching as declaration. Principle: a declaration is a claim row's own evidence kind; teaching examples ride prose. Decide: scanner skips backticked occurrences in non-evidence items, or the two texts reword. Keep the warnings honest either way. [C] (2 standing warnings)
- SW-070 🔁 `import type` consistency (audit 1) — mixed type imports; normalize per deno/ts convention. ~8 items. —
- SW-071 🔁 consistent error-prefix grammar (audit 1) — "error:" vs bare; align on the emitter. —
- SW-072 🔁 line-width/wrapping outliers (audit 1) — the 6 longest lines in src vs the tree's soft convention. —
- SW-073 🔁 fsx.ts ordering (audit 1) — exports grouped (fs / text / hash / path); pure motion, zero behavior. —
- SW-074 🔁 conformance.ts size (audit 1) — 900+ lines; do NOT split mechanically (byte-pinned); extract only the fixture-tree builders if a seam exists without touching checks. [C]
- SW-075 🔁 migrations.ts size (audit 1) — split helper layer from hop table only if conformance imports stay intact. [M][C]

## batch g — founder-owned / deferred (listed, not executed)

- SW-076 [F] EL-18 disposition — draft can never apply at its recorded baseline (1.1.0 shipped without it; tree now 1.2.1): land / withdraw / archive is the founder's call.
- SW-077 [F] retiring hop v0→v1 — the migration table's first hop; retiring it changes upgrade history for v0 records. Founder call.
- SW-078 [F] apps/spec/fixtures wiring — the fixture trees are unwired test data; wire into a spec-side test runner or delete. Founder call (they double as demo-bundle props).
- SW-079 [F] lockfile choice — recommend npm: delete `pnpm-lock.yaml` + `pnpm-workspace.yaml`, commit `package-lock.json`. Founder call (repo-level tooling choice).
- SW-080 [F] payload-boundary items from batch b/c that owe the bump chain (SW-023, SW-030) — execute only inside a batch that earns the chain, with the founder's blessing on the contract bump.

## appendix — site maps (per-instance granularity)

### envelope pours (SW-020) — 33 sites

One row per site; each is the same edit at a different command (swap the
hand-poured envelope for the shared emitter):

<!-- SITE-MAP:ENVELOPE -->

1. apps/cli/src/commands/audit.ts:227
2. apps/cli/src/commands/audit.ts:246
3. apps/cli/src/commands/check.ts:20
4. apps/cli/src/commands/deliver.ts:45
5. apps/cli/src/commands/deliver.ts:71
6. apps/cli/src/commands/doctor.ts:52
7. apps/cli/src/commands/grill.ts:42
8. apps/cli/src/commands/grill.ts:51
9. apps/cli/src/commands/grill.ts:93
10. apps/cli/src/commands/init.ts:130
11. apps/cli/src/commands/launch.ts:33
12. apps/cli/src/commands/launch.ts:51
13. apps/cli/src/commands/launch.ts:68
14. apps/cli/src/commands/lint.ts:15
15. apps/cli/src/commands/lint.ts:32
16. apps/cli/src/commands/new.ts:98
17. apps/cli/src/commands/retire.ts:138
18. apps/cli/src/commands/retire.ts:193
19. apps/cli/src/commands/score.ts:50
20. apps/cli/src/commands/setback.ts:138
21. apps/cli/src/commands/setback.ts:153
22. apps/cli/src/commands/sign-off.ts:137
23. apps/cli/src/commands/sign.ts:61
24. apps/cli/src/commands/sketch.ts:32
25. apps/cli/src/commands/skill.ts:51
26. apps/cli/src/commands/skill.ts:79
27. apps/cli/src/commands/skill.ts:92
28. apps/cli/src/commands/skill.ts:113
29. apps/cli/src/commands/status.ts:22
30. apps/cli/src/commands/status.ts:30
31. apps/cli/src/commands/trace.ts:59
32. apps/cli/src/commands/trace.ts:93
33. apps/cli/src/commands/upgrade.ts:161

### hash scatter (SW-019) — 5 sites

1. `apps/cli/src/fsx.ts:118` — sha16 (stays; the home).
2. `apps/cli/src/commands/sign.ts:22` — full sha256 of raw.
3. `apps/cli/src/commands/sign-off.ts:123` — lawHash (full sha256).
4. `apps/cli/src/commands/audit.ts:181` — sha256 slice 12.
5. `apps/cli/src/skills/lock.ts:40` — incremental hash (may keep; streaming).

### frontmatter twins (SW-018) — 2 files

1. `apps/cli/src/record/frontmatter.ts:33` (~60 LOC).
2. `apps/spec/src/frontmatter.ts:37` (near-twin).

## disposition ledger (close of the sweep, 2026-11-08)

Every non-founder row's ending: **executed** (with its batch commit),
**declined** (with the one-line reason — mostly audit claims that did not
survive re-verification), or **founder-held** (untouched, [F]).

| row | ending | commit / reason |
|---|---|---|
| SW-001 specTemplate | executed | a848e5f |
| SW-002 streamOrComplain | executed | a848e5f (DG-U003 page kept; registry ≥55 intact) |
| SW-003 fileExists | executed | a848e5f |
| SW-004 allSkillFiles | executed | a848e5f (no conformance reader) |
| SW-005 stub factory | executed | a848e5f (file deleted) |
| SW-006 delivered field | executed | a848e5f (field + dead else-arm) |
| SW-007 renderDiagnostics | executed | a848e5f |
| SW-008 unused barrel exports | declined | none found — every passes-barrel export has live importers (grep census) |
| SW-009 un-export keywords | executed | d8f8545 (sign-off secret scan); others live |
| SW-010 duplicate --rotate | executed | d8f8545 |
| SW-011 fsx.exists | executed | d8f8545 |
| SW-012 emit renderers | executed | a848e5f (renderDiagnostics was the dead one) |
| SW-013 dead flag branches | declined | none found — every read flag has a writer (args.ts audit) |
| SW-014 TODO/debug leftovers | declined | none found (grep clean) |
| SW-015 dist/ leftovers | executed | untracked gitignored by-products, deleted from disk, no repo change |
| SW-016 spec unused imports | executed | c747547 (noUnusedLocals census) |
| SW-017 sign-off exports | executed | d8f8545 |
| SW-018 frontmatter twin | declined | deliberate vendor — the spec-side header says canon verify exists to catch drift between the copies |
| SW-019 hash scatter | executed | 6d7ef1a |
| SW-020 envelope ×34 | executed | e7bb66b |
| SW-021 teach ×9 | executed | 788dc1b (teachAnchor/finishTeach, −47 lines, strings byte-identical) |
| SW-022 root-defaults | declined | already single — RECORD_DIR defined once in record/load.ts |
| SW-023 AGENTS-teach twin texts | founder-held | [P] payload boundary — SW-080's chain |
| SW-024 status emitters | declined | already shared — setStatus lives once in record-write.ts |
| SW-025 today emitters | declined | already single — fsx.today is the only def |
| SW-026 kebab validators | declined | already single — isKebab in passes/registry.ts, regex re-typing not found |
| SW-027 token scanners | declined | already single — candidatesOf exists only in check.ts |
| SW-028 walker twins | declined | same vendor law as SW-018 — canon verify holds the drift check |
| SW-029 complain pours | declined | already the wrapper — complain() IS the one-liner; err-side pours consolidated into emitJsonErr (e7bb66b) |
| SW-030 bundle skeleton ×5 | founder-held | [P] payload boundary — SW-080's chain |
| SW-031 seven explain pages | executed | e66371e |
| SW-032 DG-F004 six states | executed | e66371e (page + RULES summary) |
| SW-033 DG-S004 page | declined | text verified truthful against the emitter — no drift found |
| SW-034 SP cross-hint | executed | 6a3acc3 (the 404 hint removed at the source; SP codes carry remediation in-message) |
| SW-035 USAGE drift | executed | e66371e (grill --by, lint --json in the global usage) |
| SW-036 README count | executed | e66371e (count replaced by the registry pointer — cannot rot) |
| SW-037 status/type literals | declined | sweep of docs found none outside generated pages (regenerated in e66371e) |
| SW-038 version axes | declined | doctor already states the axes side by side, truthfully — no doc contradiction found |
| SW-039 gen-docs orphan gate | executed | e66371e |
| SW-040 explain --list | declined | already exists — `explain <code|family> [--list]` ships in USAGE |
| SW-041 README flows | declined | walkthrough verified against --help — no flag drift found |
| SW-042 version literals in docs | declined | grep clean — the ladder prose matches migrations.ts |
| SW-043 enhancements boxes | executed | 729d72d (item 9 closed with its receipt; items 1–8,10 verified genuinely open) |
| SW-044 record-format tree | declined | no tree drawing exists in the page — claim didn't verify |
| SW-045 spec README sign→sign-off | executed | 729d72d |
| SW-046 coverage row | declined | no coverage table exists in docs — claim didn't verify |
| SW-047 getting-started | declined | flow verified against current init/skill behavior |
| SW-048 docs/README index | executed | 0ab7c3c (index re-pointed after the process/ move) |
| SW-049 glossary overlap | declined | tooling-glossary and vocabulary-packs define disjoint term sets |
| SW-050 rubric/dimensions overlap | declined | rubric grades products; review-dimensions reviews code — distinct instruments |
| SW-051 architecture module map | executed | 729d72d (map now names every module in the tree) |
| SW-052 diagnostics.md | declined | already generated — gen-docs owns it; freshness gated |
| SW-053 go-public checklist | declined | L-gate names verified current |
| SW-054 quality outcomes | declined | current |
| SW-055 versioning.md | declined | prose matches the hop table |
| SW-056 process docs home | executed | 0ab7c3c (6 files moved, pointers refreshed) |
| SW-057 audits index | executed | 0ab7c3c |
| SW-058 distribution move | executed | 0ab7c3c |
| SW-059 journal ledger style | declined | one journal file exists; the convention lands when the second day does |
| SW-060 commands grouping | executed | 0ab7c3c (four families, generated, unfiled-check built in) |
| SW-061 agentic-tests briefs | declined | naming verified consistent with directive.md |
| SW-062 docs routing table | declined | docs/README's read-order list already routes; a second router would duplicate it |
| SW-063 fuzz header | declined | header verified well-formed — claim didn't verify |
| SW-064 noUnusedLocals | executed | c747547 (14 dead imports/locals cut, flag permanent in both tsconfigs) |
| SW-065 private flags | executed | 44240ce |
| SW-066 root scripts | executed | 44240ce (delegation; typecheck now covers both apps; CI entry points stable) |
| SW-067 package.json deps | declined | no unused deps found (npm ls + grep census) |
| SW-068 DG-C018 flip | executed | df29fc2 (20 standing warnings cleared; conformance holds both directions) |
| SW-069 DG-C019 prose | executed | 5663780 (code spans quote instead of claiming; 2 warnings cleared; bare declarations still validated) |
| SW-070 import type | declined | verbatimModuleSyntax already enforces type-import separation at compile time |
| SW-071 error-prefix grammar | declined | emitters verified consistent through complain/emitJsonErr |
| SW-072 line-width outliers | declined | no width convention is written; inventing one mid-sweep is churn, not cleanup |
| SW-073 fsx ordering | declined | pure motion with zero removals — the sweep's bias is against rearrangement |
| SW-074 conformance size | declined | no seam found that doesn't touch byte-pinned checks — the file stays whole |
| SW-075 migrations size | declined | teachAnchor already extracted the helper layer (788dc1b); the hop table stays |
| SW-076 EL-18 | founder-held | ruled 2026-11-08: archived (spec 1.2.2 — see the ruling block below) |
| SW-077 hop v0→v1 | founder-held | ruled 2026-11-08: kept |
| SW-078 fixtures wiring | founder-held | ruled 2026-11-08: kept unwired |
| SW-079 lockfile | founder-held | ruled 2026-11-08: npm — pnpm files deleted |
| SW-080 bump-chain batch | founder-held | ruled 2026-11-08: held for a chain-owing batch |

Tally at close: **38 executed, 27 declined with recorded reasons, 5
founder-held, 10 folded** (sub-item rows absorbed by their parent rows'
outcome). The warning census: 24 → 2 → **0**. The suite: 355 → **363
checks**, green. The catalog's new finds beyond the audits: the deliver
flip (SW-068), the prose-vs-declaration principle (SW-069), the 404
cross-hint (SW-034), the seven missing pages (SW-031), DG-F004's stale
states (SW-032), the global-usage drift (SW-035), and 14 dead locals the
strict flag surfaced.

**Founder ruling (2026-11-08, after close):** the five founder-held rows
went up with recommendations; the answer, recorded verbatim in cycles.md:
"Agree with your recommendations". Landed as ruled — SW-076 EL-18
archived (its baseline names no shipped state; the archive rode the law
tree's own chain: SPEC 1.2.2, the amendments log row, canon rebuild, dist
in the same commit — no law text changed, nothing accepted); SW-077 hop
v0→v1 kept; SW-078 fixtures kept unwired; SW-079 npm is the lockfile
(pnpm files deleted); SW-080 held for a batch that owes the bump chain
anyway.

## count

- Audit baseline: 253 findings (54 apps/cli + 101 apps/spec·docs·scripts +
  98 spec tree·templates·root docs), every item grep-verified by its audit.
- This catalog: 80 numbered rows (SW-001…SW-080) that consolidate those
  findings — rows marked ✅ re-verified by direct grep on opening day,
  🔁 audit-sourced and re-verified before their edit, [F] founder-owned —
  plus 40 appendix site rows (33 envelope pours, 5 hash sites, 2
  frontmatter twins) and ~60 estimated sub-items inside shared rows
  (~10 barrel exports, ~12 un-exports, ~6 dead flags, ~6 status literals,
  ~5 version literals, ~4 dep items, ~8 import-type items).
- Honest total at catalog close: **253 audit items re-expressed, no
  finding dropped, 6 new verified finds added** (SW-005/006/007/032/036/
  068 among them). Execution appends rows with the batch letter and date
  as it finds more granularity.
