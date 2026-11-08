# Law-implementation audit — the docodego CLI (`apps/cli/src/`)

*F1 fleet audit, 2026-11-08 · Method: full source read of `passes/`, `commands/`, `record/`, `emit/`, `skills/`, `versioning/`, `bundled/`; black-box execution against the five fleet records (all five: `check`+`lint` exit 0 today) and a sandbox copy of 03's record exercising the state machine, gates, and scanner directly. Sandbox results labeled **[empirical]**. Folded into the issues catalog §9.*

**Headline.** The gates verify *record shape*, never *record truth*: every gate decision is a regex or an existence probe over prose the agent itself wrote. A hand-typed `total: 100/100` passes G2 **[empirical]**, the unit's own `spec.md` passes G4 as delivery proof **[empirical]**, a self-contradictory spec scores 100/100 **[empirical]**, and `score` silently demotes `delivered` units **[empirical]**. The fleet's 12 launch-blockers shipped through exactly these holes.

---

## A. Coverage holes — what `check`/`lint` verify vs. what they don't

What exists today (`passes/check.ts:11-165`): spec parse diags, marker-file presence for claimed statuses (DG-C003/C004), proofs.md presence + ≥1 resolving path (DG-C001/C002), *any* `verdict:` line in grill.md (DG-C007, warning), epic/story link targets (DG-C006). That is the entire integrity surface.

**1. Status↔verdict coherence is never checked.**
- `passes/check.ts:22` — `claimsGrill` only tests that `grill.md` *exists*; nothing reads the *latest* verdict for a delivered unit. `lastVerdict` (`passes/grillq.ts:35-40`) exists but only `deliver`'s G3 calls it.
- **[empirical]** Appended `verdict: fail` to delivered `grade-reveal`'s grill.md → status stays `delivered`, `check` emits nothing about it.
- Fleet blocker: 03's walkthrough-PASS-contradicted-by-HEAD decay pattern (proof claims rot after the gate); 01's re-score family.
- Severity: **law-critical**. Fix: a coherence pass — for status ∈ {grilled, scored, delivered}, `lastVerdict(grill.md)` must be `pass`; anything else is an error naming the file and the verdict line.

**2. Status-vocabulary validation lives only in `lint`; `check` passes gibberish.**
- `passes/frontmatter.ts:38-41` validates against `STATUS_VALUES` (DG-F004); `passes/check.ts` has no equivalent — its header claims "status claims must match the markers on disk" (`check.ts:1-3`), but a status of `banana` produces zero check diagnostics.
- **[empirical]** `status: banana` → `check` reports only unrelated findings; `lint` catches it. The two health commands disagree about what a status *is*.
- Fleet blocker: standalone (but it means any tool trusting `check` alone — including doctor's `record check` line, `commands/doctor.ts:117` — inherits the blindness).
- Severity: **major**. Fix: `checkPass` should include the vocabulary check, or `check` should run `frontmatterPass` (doctor already composes them, so no contract break).

**3. Tracker and delivery-log are write-only.**
- `DELIVERY_LOG_REL` is written by `record/record-write.ts:22-28`, `commands/init.ts:70`, `versioning/migrations.ts:95` — and **read by no module in the CLI** (grep evidence). The tracker is read only by `passes/trace.ts:119-130` for one unit's timeline.
- **[empirical]** Deleted all tracker rows for a delivered unit → zero diagnostics from `check`.
- Fleet blocker: "deliver's tracker rows landing in the next commit" is invisible; "gate refusals recorded in only 2 of 5 (silent otherwise)"; `status` can't answer "could this ship" partly because the ship-relevant state (refusals, landings) lives in files no health pass opens.
- Severity: **law-critical**. Fix: a governance pass in `check`: every `delivered` unit must have ≥1 tracker `delivered` row + delivery-log row; every `gate-refused` row must reference a unit that exists; rows referencing missing units are errors.

**4. A proof is "a path that exists" — source files, specs, even directories count.**
- `passes/check.ts:158-165` (`proofResolves`) and `passes/gates.ts:66-87` (`proofsGate`): G4 passes when *any* candidate resolves; no semantics attached to the path.
- **[empirical]** proofs.md citing only `spec.md` and `src/copy.ts` → `pass G4 — proof: 02-compose/01-build/test-unit/spec.md`. Also `isDir` (`check.ts:161`) lets an empty directory satisfy the gate.
- Fleet blocker: 02's "delivery rows cite `src/copy.ts` as evidence"; 00's "flagship proof is prose + screenshots, not a committed replayable script" (screenshots *exist*; nothing requires them to be regenerable).
- Severity: **law-critical**. Fix: classify candidates — exclude paths inside the unit's own dir that resolve to `spec.md|grill.md|score.md|proofs.md|delivered.md` and exclude repo source trees (`src/`, `server/`, `web/`, `product/`) unless the item also carries a proof-marker sibling (a produced artifact path: logs, pngs, txt under `proofs/`); directories never count; require ≥1 proof whose extension is artifact-shaped (`.png/.txt/.log/.json/.md` produced under a proofs dir) for user-facing units.

**5. grill.md path citations are never existence-checked.**
- `passes/check.ts:41-46` scans grill.md only for `verdict:`; `proofPaths` is applied to proofs.md only. DG-C002's law ("a proof is a file that exists") is not enforced inside the file that records the grilling.
- Fleet blocker: 02's "grill.md cites four proof files that don't exist" passed clean.
- Severity: **major**. Fix: run `proofPaths` over grill.md blocks too; dead citations = warning (narrative), all-dead = error pre-delivery — mirroring the proofs.md law.

**6. Stream binding covers only epic/story; build units in the discover stream sail through.**
- `passes/frontmatter.ts:42-49` applies `TYPE_HOME` (`record/streams.ts:25-28`) only when type is epic/story; `type: unit` has no home law. `DG-F005`'s own explain text says "containers-as-documents have homes" — the gap is doctrinal, not accidental.
- **[empirical/live]** 00's `color-engine`, `the-atelier` and 02's `read-your-architecture` are build units sitting in `01-document/01-discover`; `lint` and `check` on those repos: "nothing to report."
- Fleet blocker: comparator gap 6 ("unit home semantics: check passes build units in the discover movement").
- Severity: **major**. Fix: either a unit-type→stream hint table enforced as a warning (placement freedom preserved, visibility won), or a `work:` frontmatter field (build/verify/govern) that must agree with movement — warning at lint, error at deliver.

**7. No VC/untracked-source surface.**
- The CLI never runs `git status` (only `doctor`'s `git --version`, `commands/doctor.ts:148-152`). Untracked manifests, `node_modules/`, dual lockfiles, stub `package.json` are invisible to every command.
- Fleet blocker: 03's untracked stub manifest + unignored `node_modules/`; 01/00 dual lockfiles; comparator Tier-2 item 5.
- Severity: **major**. Fix: `check` gains one probe: `git status --porcelain` under the repo root; untracked source-like files (`package.json`, lockfiles, `src/**`) produce a DG-C0xx error naming the file; `no-untracked-source` rule plants with the same law.

**8. Score satisfiability, spec-hash, staleness: absent everywhere.**
- Nothing ties `score.md` to the spec text it scored (`record/template-docs.ts:65-86` writes no digest); nothing reconciles score vs. current spec at deliver; nothing tests criteria for mutual contradiction. Details in B below.
- Fleet blocker: 03's unsatisfiable spec at 100 (catalog §8 Tier-1 item 2).
- Severity: **law-critical** (folded into items 9–12).

---

## B. The scorer

**9. The scale saturates by construction — 100 is reachable by a spec that contradicts itself.**
- The five passes (`passes/score.ts`): completeness 25 = word-count + item-count thresholds (`:67-96`); unambiguity 25 = −2 per hit on a 10-word blocklist (`:23, 98-119`); testability 25 = `min(25, criteria×5) − weak`, where "weak" means missing one of ~12 regex keywords whose list includes `when|file|run|returns` (`:24, 121-131`) — nearly any English sentence with "when" scores as observable; threat 15 = **any** one bullet scores full 15 (`:133-138`); anti-gaming 10 = only catches verbatim ≥40-char duplicates (`:140-157`).
- **[empirical]** A spec whose every criterion is internally contradictory ("must show zero entries and every entry must render; build must fail when it passes"): **100/100**, exit 0. The empty scaffold scores 58; the floor is 60 (`types.ts:62`) — one replaced sentence above the template.
- Fleet blocker: 9×100/4×99/2×98/1×90 across 16 specs while 12 launch-blockers shipped (IMP-12/17); 03's unsatisfiable spec at 100.
- Severity: **law-critical**. Fix sketch (in code terms): (a) testability stops rewarding *count* — cap at 15 with criteria≤3, require each criterion to name an instrument (a command, a path, a selector) not just a keyword; (b) a `satisfiability(spec)` pass: pairwise negation/quantity conflict scan over acceptance items (`zero|no |never` vs `every|all|must`, numeric contradictions) scoring 0 with a named conflict pair, blocking 100; (c) score 100 requires an attached external-validation artifact (a proofs path that resolves); (d) floor computed from template distance, not a constant.

**10. The gate re-parses prose instead of recomputing — `total:` is a self-reported integer.**
- `passes/gates.ts:45-57`: G2 regexes `/(^|\n)\s*total:\s*(\d+)\s*(?:\/\s*100)?/i` out of score.md and passes that number. The score is never recomputed from the spec at deliver time; no hash binds score to spec.
- **[empirical]** Hand-wrote `total: 100/100` into score.md → `pass G2 — total 100/100`. Also the regex takes the *first* match, so a prose sentence mentioning `total:` shadows the real table.
- Fleet blocker: same as 9 — score ≠ truth was possible only because the gate consumes the score as text.
- Severity: **law-critical**. Fix: G2 recomputes `scoreSpec(unit)` at gate time and compares to the recorded total; mismatch = fail ("score.md is stale — spec changed after scoring"); score.md carries a `spec-sha:` line (first 16 hex of the spec body at scoring time) that G2 verifies. The regex scrape disappears entirely.

**11. `~~struck~~` criteria shrink the grill and the gates with no trace.**
- `record/sections.ts:48-55` filters struck items out of `acceptance()`; `grillQuestions` (`passes/grillq.ts:23-25`) generates one hard question per *remaining* criterion; G1 (`gates.ts:36`) needs only `criteria.length > 0`.
- Standalone today, but it is the lever that would have "fixed" 03's unsatisfiable spec silently: strike the impossible criteria, score 100, deliver. No diagnostic ever mentions a strike.
- Severity: **major**. Fix: strikes after a pass verdict are a check error ("criterion struck after grill pass — re-grill"); G1 reports struck-count in its detail; a spec with >50% struck criteria fails G1.

**12. `score` rewrites score.md — the CLI breaks its own append law.**
- `commands/score.ts:25` uses `writeText`; grill.md appends (`commands/grill.ts:59`), delivered.md appends (`deliver.ts:44`). The repo's honesty law (AGENTS.md: "Records append. Superseded text is struck or archived, never deleted") is violated by the CLI's own write on every re-score.
- Fleet blocker: standalone; but it compounds 01's re-score defect — the old score (the evidence of what was believed at delivery time) is destroyed by the demotion command.
- Severity: **major**. Fix: append a new dated score block (trace already knows how to find `# score — unit — date` blocks, `passes/trace.ts:42`); last block wins.

---

## C. The status machine

The actual machine, reconstructed from code — there is no transition table anywhere; `unitStatus` is a bare frontmatter read (`record/load.ts:173-175`) and `setStatus` is a blind byte-patch (`record/record-write.ts:34-58`):

```
new        → draft
score      → scored      (ALWAYS: no grill check, no floor check, no prior-status check)
grill pass → grilled     (grill fail → status untouched)
deliver    → delivered   (all 4 gates; refusal → untouched + tracker row)
```

**13. `score` mints `scored` with zero grill — the CLI manufactures the state `check` then condemns.**
- `commands/score.ts:26` unconditionally `setStatus("scored")`. **[empirical]** `score` on a fresh draft: `status: scored` at 58/100, exit 0; `check` *afterwards* flags DG-C003. The command and the integrity pass disagree about who is right, and the command ran first.
- Fleet blocker: 03's "scored awardable without grill" (catalog §8 item 2: "grill demanded at scoring time").
- Severity: **law-critical**. Fix: `score` refuses (or degrades to `grilled`-only) when `unit.markers.grill === null`; the refusal names the fix: "run docodego grill first — scoring without a grilling is the exact state DG-C003 exists to catch."

**14. Re-`score` silently demotes `delivered` → `scored`; the record becomes three-way inconsistent, invisibly.**
- Same `commands/score.ts:26` line, combined with the blind `setStatus`. **[empirical]** Re-scoring delivered `grade-reveal`: status `scored`, exit 0, no tracker row, no warning — while delivered.md, the tracker, and the delivery-log all still assert delivery. `check` has no diagnostic for "delivered.md present but status scored" (only the *reverse*, DG-C004).
- Fleet blocker: 01's re-score defect.
- Severity: **law-critical**. Fix: `setStatus` gains a transition table; `delivered → scored` is refused by `score` ("already delivered — score changes require a recorded re-opening; append a re-score note instead"); any illegal transition attempt appends a `gate-refused`-style tracker row.

**15. Grill-fail after delivery cannot demote — asymmetric decay, and both directions are silent.**
- `commands/grill.ts:60`: only `verdict === "pass"` writes status; a fail leaves `delivered` in place (T2 evidence under item 1). Combined with 13/14: score can demote delivered, grill can't, and neither warns.
- Fleet blocker: 01's re-score + the general "self-reported PASS contradicted by shipped code" pattern — the record's claim and its newest evidence diverge with no tripwire.
- Severity: **law-critical** (the coherence pass in item 1 is the detector; this item is the writer-side half). Fix: on fail against a `delivered` unit, demote to `grilled` *with* a tracker row `demoted` naming the verdict line — or refuse to record a fail without an explicit `--reopen` flag; either way the status file and the newest verdict may never disagree (enforced by item 1's pass).

**16. No `parked`, no `launch-passed`, no `v0-boundary` — the vocabulary cannot express the fleet's actual end-states.**
- `types.ts:64`: `STATUS_VALUES = ["draft","grilled","scored","delivered"]`. 03's `pro-fit-report` sits at `grilled` forever (live: `status` shows `pro-fit-report (grilled)`), indistinguishable from actively-grilled; founder signature has no representation at all — **zero of five products have a founder-signed boundary**, and the CLI has no field/status/row type that could hold one.
- Fleet blocker: catalog §8 Tier-1 item 1 (two-tier done + founder signature) is unimplementable without vocabulary change; comparator gap 5.
- Severity: **law-critical**. Fix: extend `STATUS_VALUES` with `parked` (writable via `docodego park <unit> --reason`, requires a tracker row; counts separately on the board) and `launch-passed`; add a `boundaries.md`-style founder-decision record type whose write path is `docodego sign` reading a founder-verified input (the signature is a recorded founder decision, not agent prose); `deliver`'s success line must print the tier: "delivered (not launch-passed — n rails open)."

**17. `deliver` is not idempotent — re-delivery doubles everything.**
- `commands/deliver.ts:43-47`: no already-delivered guard. **[empirical]** Second `deliver` of a delivered unit: exit 0, 2 `## delivered` blocks, 2 tracker rows, 2 delivery-log rows.
- Fleet blocker: standalone (record pollution; makes trace's timeline and status counts lie by multiplication).
- Severity: **major**. Fix: refuse with "already delivered <date> — use --re-deliver to record a re-landing," which appends a `re-delivered` row without duplicating the landing event.

---

## D. Diagnostic quality — which diagnostics fail "error names the fix"

**18. DG-U013 doesn't name the law, so agents go read the source.**
- `commands/new.ts:87`: `--stream 'X' is not one of the sixteen streams` — doesn't list the streams, doesn't state the type-home rule that actually decided the rejection (`new.ts:89-91`). The explain page (`passes/explain.ts:78`) is a two-contract mush ("for 'new': … For 'sketch': …").
- Fleet blocker: the named incident — "DG-U013 not naming the stream shape (agent read CLI source)." The diagnostic failed to teach, so the agent learned from implementation instead of law.
- Severity: **major**. Fix: message enumerates the legal streams for the current type and states the home rule ("type 'unit' accepts any stream; epics live in 01-document/01-discover — got 'X'"); explain page splits per-command.

**19. The proof grammar is discoverable only by refusal, and the refusal explains candidates worse than it looks.**
- The grammar is documented in a code comment (`passes/check.ts:112-126`) and compressed into DG-C002's explain `fix` (`passes/explain.ts:51`). **[empirical]** A proofs.md honestly naming its screenshot mid-sentence (`screenshot saved at proofs/reload.png` — not backticked, not first token) plus two prose identifiers (`app.unlocked.v1`, `db.yaml`) → `error DG-C002: no proof path exists — looked for: app.unlocked.v1, db.yaml`. The real evidence path is silently not a candidate; the phantom identifiers are named as if they were the author's claims. Refusal names *what* it looked for but never *why* each token was or wasn't counted.
- Fleet blocker: the catalog's "DG-C002 path-scanner reading prose as paths" — and its converse: identifiers that *exist* on disk silently become proof (item 4).
- Severity: **major**. Fix: (a) extend `candidatesOf` to all backticked spans *and* whitespace-delimited tokens containing `/`; (b) the diagnostic lists per-candidate disposition ("`app.unlocked.v1` — read as a path because it ends in `.v1`; if this is prose, backtick it as prose"); (c) ship the grammar in the proofs.md template comment so it's visible at write time, not refusal time.

**20. Gate details present scraped text as verified fact.**
- `passes/gates.ts:48-56`: `detail: "total ${total}/100"` — the gate's own voice endorsing a number it never computed (hand-edit passes verbatim, item 10); `gates.ts:62-63` likewise for "latest verdict: pass" from an append-only prose file. Deliver's JSON on failure also goes to stderr while success JSON goes to stdout (`deliver.ts:35` vs `:51`) — automation asymmetry.
- Fleet blocker: feeds the "self-reported PASS" class; the walkthrough-PASS in 03 is this defect wearing a product's clothes.
- Severity: **minor** (fix falls out of item 10 — once G2 recomputes, the detail becomes the gate's own finding; add `— recomputed, matches recorded` to the detail).
- Also under D: exit-code drift — `commands/new.ts:37` exits **1** for an existing unit (usage-class error; every other usage error exits 2, per `emit/exit.ts`'s own contract comment). Minor. Fix: exit 2.

---

## E. `status` blindness

**21. `status` reads four frontmatter fields and nothing else — "could this ship" is unanswerable by construction.**
- `emit/board.ts:33-64`: `statusData` consumes name/type/status/epic/story + stream. It never opens proofs.md, grill.md, score.md, the tracker, or the delivery log. Rollups (`board.ts:66-76`) divide delivered by the same frontmatter. **[empirical/live]** 00-finessetry `status --json`: `delivered: 2`, `01-document` holding both build units while `02-compose` prints empty — misplacement rendered without comment, paywall/brand/classifier state nonexistent to the command.
- Fleet blocker: "docodego status cannot answer 'could this ship'" (catalog §6, IMP-15) — the material differences live in files status never reads.
- Severity: **law-critical**. Fix: status gains a `rails` section computed from the same passes `check` uses (open gate-refusals, latest-verdict≠pass units, delivered-without-boundary rows, parked units) and a one-line verdict field: `ship: no — 2 rails open (payment boundary unsigned; walkthrough unregenerable)`. The JSON gets the same field so agents can consume it.

**22. The counts buckets hard-code the four statuses; anything else is invisible.**
- `board.ts:42-49`: `counts` filters for exactly draft/grilled/scored/delivered. A `parked` (or gibberish) status appears in movement lines but in no count, no warning — the board's summary line under-reports by exactly the units that need attention.
- Fleet blocker: parked-vocabulary gap (03's pro-fit-report); item 2's vocabulary hole.
- Severity: **minor** standalone / **major** once item 16 lands. Fix: counts derived from `STATUS_VALUES` dynamically + an `other: n` bucket that always renders when non-zero.

---

## F. Other defects (standalone)

**23. Absolute proof paths can never resolve.** `passes/check.ts:158-165` does `isFile(join(rec.cwd, p))` — `join` with an absolute `p` concatenates, mangling the path. **[empirical]** An absolute path in proofs.md fails G4 with the mangled path echoed in the refusal. Fix: probe `isFile(p)` directly when `p` is absolute. Minor.

**24. `today()` is UTC; records carry yesterday's date for half the world.** `fsx.ts:104`, `skills/lock.ts:141`, `record/template-docs.ts:55` all use `toISOString().slice(0,10)`. **[empirical]** Sandbox deliver printed `delivered 2026-11-07` on local Nov 8. Trace sorts timelines by these strings (`passes/trace.ts:146-154`), so a late-night landing can sort before its own grill. Fix: local-date formatting with explicit TZ annotation, or store ISO instants. Minor.

**25. Verdict law exists twice and can drift.** `passes/grillq.ts:30-33` (`verdictFor`: every answer non-empty) vs `record/template-docs.ts:60` (grillBlock recomputes inline with an extra `answers.length >= questions.length` clause). Today equivalent-in-effect; tomorrow a change to one silently forks the recorded verdict from the computed one. Fix: grillBlock takes the verdict as a parameter; one law, one site. Minor.

**26. Lockfile parse exists twice — one guarded, one not.** `skills/lock.ts:59-63` (`readLock`: raw `JSON.parse`, throws → generic exit 1 via main.ts's catch-all) vs `commands/skill.ts:34-37` (own try/catch emitting DG-R007 properly). Any future `readLock` caller inherits the unexplained crash. Fix: move the guarded parse into `readLock` returning `Result`; DG-R007 emitted there. Minor.

**27. Tracker append is duplicated three times and non-atomic.** `record/record-write.ts:13-19`, `skills/lock.ts:133-139` (a third copy for upgrade resumability), same create-then-append shape each. A crash between header write and first append leaves an empty tracker (interruption-safety rule 9). Refusal rows also violate the tracker's own header contract: the template promises "every claim carries a path to its evidence" (`bundled/index.ts:72`), but `gate-refused` rows put prose in the evidence column (`deliver.ts:32-33`). Fix: one `appendTrackerLine` used everywhere; refusal rows point at the gate transcript file they also write. Minor.

**28. The CLI's own conformance suite never tests a single failure mode the fleet hit.** `conformance.ts` (116 checks) covers the happy lifecycle and the missing-file refusals, but greps for `demote|re-score|idempoten|hand-edit|stale|parked|already delivered` return nothing. The law's self-test asserts the gates pass when they should; it never asserts they *fail when they should not pass*. Fix: add conformance cases for items 9, 10, 13, 14, 15, 16, 17, 19 — each a two-line scenario in the existing scratch-record harness. **Law-critical as a meta-defect**: this suite is why the CLI could ship feeling green.

**29. Refusals and demotions leave no queryable surface.** `gate-refused` tracker rows are written (`deliver.ts:33`) but no pass, status field, or count ever reads them (item 3's write-only problem). A record that refused a unit five times looks identical to one that refused never — "the law can't tell perfection from underrecording," verbatim from the catalog, is implemented literally. Fix: fold into item 3's governance pass and item 21's `rails` section. Major.

---

## What held (brief, for the record)

The honesty layer's *plumbing* is genuinely good: the error-recovering parser never crashes on broken input (`record/markdown.ts`), diagnostics are positioned and coded (`emit/diagnostics.ts`), upgrade is create-only with `.new` conflict law (`versioning/plan.ts`), skill digests cover content and refuse traversal (`skills/lock.ts:39-57, 88-108`), and `checkProofsAhead` deliberately mirrors the gate so health and delivery can't disagree about *dead paths* (`passes/check.ts:91-110`). The defect is not sloppiness — every one of the 29 items above is a *precise* mechanism doing exactly what its code says. The defect is that what the code says is shape, not truth: the gates grade the record's grammar while the fleet's failures were all semantics.

## Input summary for record spec 7

The five law-critical mechanisms to specify, in dependency order: (1) **score binding** — recompute at the gate, hash the scored spec, append score blocks (items 9–12); (2) **transition table** in `setStatus` with `parked`/`launch-passed`/founder-signed boundary vocabulary (items 13–16); (3) **governance pass** in `check` reading tracker + delivery-log + latest verdicts (items 1, 3, 29); (4) **proof semantics** — artifact-shaped evidence, source-file exclusion, grill citations checked, grammar taught at write time (items 4, 5, 19, 23); (5) **status that answers "could this ship"** — rails section composed from the same passes (items 21–22) — with item 28's conformance failures as the acceptance suite for all five.
