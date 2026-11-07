# Evidence-layer audit — five product records (ground truth for spec-7 `check` improvements)

*F3 fleet audit, 2026-11-08 · Method: full read of every record file in all five `.docodego/` trees; mechanical path-extraction sweep (backticked spans, markdown links, slash-tokens, evidence-extension filenames) resolved against product root / record root / citing dir / unit dir / unit proofs dir; verbatim diff of every `intent.md` against `briefs/<product>.md`; score arithmetic recomputed; tracker × frontmatter × delivery-log × grill × proofs cross-checked; `docodego check` run in all five products; git history inspected for history-citing claims; shipped code read for every "fixed/proven" claim. Folded into the issues catalog §10.*

**Headline: `docodego check` exits 0 on all five products.** Zero diagnostics — not even warnings. Every defect below survives the current checker.

---

## Per-product defect lists

### 00-finessetry — CLEAN
- All cited proof paths exist; determinism claim substantiated (committed `product/scripts/determinism-run.mjs`; `proofs/determinism.txt` records two identical sha256 hashes); all screenshot proofs exist and are referenced; score 100/100 sums correctly (25+25+25+15+10); tracker (4 rows) ↔ delivery-log (2 rows) ↔ 2 delivered units ↔ frontmatter statuses all agree; brief and all 3 hard lines verbatim in `intent.md` (the enclosing `"` around the brief are dropped in the blockquote — cosmetic, not paraphrase).
- Only soft notes: proof transcripts embed absolute machine paths (e.g. `proofs/build-audit.txt:6`), and the two build-time corrections in `cycles.md:127-130` are substantiated by the struck placeholder text in `spec.md:63-100`, not by git history.

### 01-swatchship — 1 dead path, 1 verbatim violation, 2 structural grammar issues
1. **DEAD PATH — `proofs/grep-dom.txt`** cited as AC7 evidence in `02-compose/01-build/season-carry/grill.md:24` ("recorded in proofs/grep-dom.txt"). The file exists nowhere in the product; `proofs.md` correctly maps AC7 to `red.txt` + `visual-run.txt`, so the grill verdict rests partly on a file that never existed. **Check: MISS** (check reads only proofs.md).
2. **VERBATIM VIOLATION** — `intent.md:15` claims "the founder's hard lines (verbatim, non-negotiable)" but hard line 3 inserts words: brief says "…test mode); **no account creation anywhere**"; intent says "…test mode); **there is no account creation anywhere**".
3. **MISATTRIBUTED FOUNDER TEXT** — `intent.md:18-23`, "the founder's mandate (verbatim)", is actually the **test-harness directive** (`docodego-reinvented/temp/final/v2/docs/agentic-tests/directive.md:30-33`), not the founder's brief — and it is even silently edited while quoted: directive "or an engine design" → intent "or the quiz's design"; directive "(runnable, proven)" → intent "(runnable, proven — page, season path, checkout in test mode)".
4. **AMBIGUOUS PATH GRAMMAR** — `delivery-log.md:8-11` cites `dist/index.html`, `proofs/red.txt` (×2), `proofs/visual.txt`: unit-relative paths that resolve only by inferring the row's unit column; unresolvable from the log itself. **Check: MISS** (delivery-log never validated). Same for tracker evidence column.
5. Grammar-only (not defects): `tracker.md:12` quotes the checker's own refusal template (`path/to/proof.tx...`); checkout `proofs.md:55`/`stripe-wiring.txt:27` cite `var/orders.jsonl`, a described never-run artifact (the honest "open proof" admission); transcripts reference now-stale hashed dist assets (`proofs/build.txt:51-52`, `serve.txt:19-20` → `index-HP8fSrU6.css` vs shipped `index-BJ4_EgIs.css`) — historically true, drift only.

### 02-bodyarchetype — the confirmed violation class, plus inventory
1. **DEAD PATHS — 4 distinct files, 16 citing locations.** grill.md cites four per-area test transcripts that do not exist:
   - `proofs/tests-classifier.txt` — `grill.md:6, 12` and `grill-answers-round1.txt:2, 5`
   - `proofs/tests-features.txt` — `grill.md:6, 14`; `grill-answers-round1.txt:2, 6`
   - `proofs/tests-copy-lint.txt` — `grill.md:6, 16`; `grill-answers-round1.txt:2, 7`
   - `proofs/tests-network-guard.txt` — `grill.md:6, 18`; `grill-answers-round1.txt:2, 8`
   The real evidence (`proofs/tests-all.txt`, 35/35 pass — verified) exists and is cited in proofs.md, so **every grill.md AC1–AC4 answer names a file that was never written**; the "verdict: pass" is founded on dead paths. **Check: MISS.**
2. **GATE EVIDENCE IS A SOURCE FILE, NOT A PROOF** — `delivered.md:4` and `delivery-log.md:8`: "proof: **src/copy.ts**". The shipped copy module is claimed, not what ran. **Check: MISS** (delivery rows never read).
3. **VERBATIM VIOLATIONS ×4** — `intent.md:21-33` claims "the founder's words, verbatim":
   - "Legal-and-brand requirement — enforce with a copy-lint test" → intent: "**This is** a legal-and-brand requirement — enforce **it** with…"
   - "analysis fully client-side**.**" → intent appends "**; the claim must be true at the network layer, not promised in copy**" — imported from *00's* brief / the harness directive's standing line, not in 02's brief.
   - "must be deterministic and proven by tests" → intent inserts "— **same photo, same result** —".
   - "Styling guidance only" → intent: "**Cosmetic/**styling guidance only".
4. **DETERMINISM RE-RUN NOT REPO-REPRODUCIBLE** — `proofs.md:108-113`: the two fixtures (`ba-person.jpg`, `ba-person2.jpg`) the byte-identity proof depends on are "outside the product tree" and not committed. The committed pair `drive-photo1.json` / `drive-photo1-repeat.json` **is** byte-identical (verified with `cmp`), so the claim is substantiated — but only once; no one can rerun it from the repo.
5. Coherence: spec scope says segmentation masks ON, shipped build runs masks OFF + separate segmenter — **honestly recorded** in `proofs.md:90-104` and cycles (within the append law; not a defect). Delivered.md stamped 2026-11-07, proofs captured 2026-11-08 (timezone-plausible). Build chunk-size claims (38 kB / 145 kB) match shipped `dist/assets` exactly ✓.

### 03-grademyfit — the walkthrough-vs-code contradiction confirmed, plus history claims that don't hold
1. **WALKTHROUGH PASS CONTRADICTED BY SHIPPED CODE (confirmed).** `grade-reveal/spec.md:55` (AC8): "the reveal uses CSS transforms only." Shipped `web/styles.css:491-496`:
   ```css
   .reveal-shake { animation: slip-shake 0.18s ease-in-out 1; }
   @keyframes slip-shake { 0%,100% { translate: 0 0; } 30% { translate: 0.5px 1px; } … }
   ```
   The shake animates the CSS **`translate` property — not `transform`**. Grill verdict: pass; `proofs.md:39-44` marks AC8 proven; `walkthrough.md:112-115` admits it in a footnote ("the shake is the `translate` property, not a transform… met in spirit") while the AC still records PASS. (For contrast, the walkthrough's two "fixed during the run" bug claims check out: `feed.js:6` imports `renderGradeStamp`; `reveal.js:22-23` has no inline opacity.)
2. **HISTORY CLAIMS THE GIT HISTORY DOES NOT HOLD.**
   - `grade-engine/proofs.md:19-21`: "the reds are in this repository's git history" — the repo has exactly 10 commits, all green-only ("16 tests green"); no red-state commit exists in `git log --all`.
   - `participation/proofs.md:17-21`: "Both fixes are in git history" — the HMAC and NEED_CREDITS fixes are squashed into the single green `feat(server)` commit `80ab662`.
   - `pro-fit-report/grill.md:4, 6, 12`: AC1's "walkthrough search… the transcript is in the session record" — **no committed transcript**. The claim itself is true today (grep for the price string in `web/`, `server/`, `README.md` returns zero hits), but its evidence is uncommitable memory; the corroborating float-precision comment does exist (`server/grades.ts:73`).
3. **COHERENCE DRIFT** — `grade-engine/grill.md:13` (GQ-AC2) quotes the criterion as "3 votes at overall mean **4.60** → A"; the spec (`grade-engine/spec.md:34-37`) actually pins **4.66** with the 4.60 cutoff in a separate boundary AC. The grill paraphrased where the format implies verbatim quoting.
4. Paths, scores, statuses: all clean — every `proofs/test-run.txt`, all 9 screenshots, `font-request-log.txt`, `walkthrough.md`, `server/nsfw-blocklist.json`, `docs/research/nsfw-fixture.png` exist; five score files sum correctly (100/99/100/98/99, pro-fit 90); delivery-log (5 rows) ↔ tracker ↔ frontmatter agree; pro-fit-report correctly held at `status: grilled` with no delivery-log row. Delivery-log proof column uses unit-relative paths (`proofs/test-run.txt`) — same ambiguity class as 01.

### 04-planmyskin — 3 dead paths, post-delivery claim drift, worst verbatim violations
1. **DEAD PATHS (3 distinct):**
   - `proofs/visual.md` — cited in `report-experience/grill.md:6` ("plus proofs/visual.md recording the browser walkthrough") and `report-experience/deliverables.md:22` ("visual pass… recorded to proofs/visual.md"). Never created; the visual evidence ended up as three PNGs instead.
   - `tests/privacy.test.ts` — cited in `report-experience/grill.md:6`. Does not exist; the network-stub tests live in `tests/report-experience.test.ts:44-51`.
   - `tests/proofs/` — `report-experience/spec.md:82` ("proven in proofs.md by a file under `tests/proofs/`") — a wrong location claim in the spec's own evidence map; proofs actually live in the unit folder. **Check: MISS on all three.**
2. **POST-DELIVERY CLAIM DRIFT (checker-invisible class).** Commit `e381a77` renamed the scan refusal key `conditions-changed` → `not-comparable` (verified in `src/scan/engine.ts:252`, `types.ts:49`, `copy.ts:39`, and the test). But:
   - `scan-engine/grill.md:26` still says "exactly 1 guidance key (**conditions-changed**)".
   - `scan-engine/proofs.md:14` still says "**conditions-changed** guidance present".
   - The committed transcript `proofs/run.txt` (last touched in the pre-rename commit `5375615`, never regenerated) names **no guidance key at all**, so neither row is substantiated by its own cited proof. `cycles.md:74-76` records the rename honestly — the unit-level evidence rows were simply never re-verified. This is exactly the drift class spec-7's checker must catch.
3. **VERBATIM VIOLATIONS — the worst in the fleet.** `intent.md:16-22` claims "The founder's non-negotiables, verbatim":
   - Ingredient-safety line is **rewritten and padded with agent-authored content attributed to the founder**: the brief's terse line becomes a sentence adding "(**honey, aloe, oat, green tea, yogurt, rose water, jojoba, cucumber, ice therapy; turmeric only with a caution note**)" and "no '**treats/cures/heals**'" — none of which the founder wrote. (Downstream effect: commit `e381a77`'s message calls the ban "the founder hard line" for "condition"-family tokens, but the founder's actual line only bans *condition names*; the expanded ban is the agent's own.)
   - COSMETIC ONLY line restructured ("The report says…", "No drug claims, no 'treats/cures/heals'. Enforce with…").
   - Referral line reworded ("get a visible, warm **referral to a dermatologist**" vs "warm **dermatologist referral**").
   - Re-scan line rewritten ("are only honest if capture conditions are comparable: enforce a capture-quality guard (distance, angle, brightness bands)" vs "require comparable capture conditions (distance/angle/brightness guard)").
   - Photo line: appends "; the claim must be true at the network layer, not promised in copy" (from 00's brief / directive standing lines).
   - "All six concern scores **must be** deterministic — … — **and** proven by tests" (insertions).
4. Clean otherwise: all three units' proof paths exist; scores sum (100/98/99) and match `delivered.md` and `cycles.md`; tracker's `gate-refused` row for scan-engine is honest failure evidence; the knowledge-note markdown link resolves; commit `e381a77` exists as cited.

---

## Fleet summary

**Dead evidence paths: 7 distinct dead paths / 21 dead citations / 4 products affected (00 clean).**

| # | Dead path | Citing file:line | Product |
|---|---|---|---|
| 1 | `proofs/tests-classifier.txt` | grill.md:6,12; grill-answers-round1.txt:2,5 | 02 |
| 2 | `proofs/tests-features.txt` | grill.md:6,14; grill-answers-round1.txt:2,6 | 02 |
| 3 | `proofs/tests-copy-lint.txt` | grill.md:6,16; grill-answers-round1.txt:2,7 | 02 |
| 4 | `proofs/tests-network-guard.txt` | grill.md:6,18; grill-answers-round1.txt:2,8 | 02 |
| 5 | `proofs/grep-dom.txt` | season-carry/grill.md:24 | 01 |
| 6 | `proofs/visual.md` | report-experience/grill.md:6; deliverables.md:22 | 04 |
| 7 | `tests/privacy.test.ts` (+ dir `tests/proofs/`, spec.md:82) | report-experience/grill.md:6; spec.md:82 | 04 |

**Violation classes found (9):**
- **A — dead proof paths in grill/grill-answers** (02×4, 01×1, 04×2): grill verdicts pass on files never written.
- **B — non-proof gate evidence** (02): `src/copy.ts` as the delivery proof in delivered.md + delivery-log.
- **C — post-delivery claim drift** (04): grill/proofs name `conditions-changed`; code says `not-comparable`; cited transcript predates the rename and names neither.
- **D — walkthrough PASS vs shipped code** (03): AC8 "CSS transforms only" vs `translate`-property shake; PASS recorded, deviation footnoted "in spirit."
- **E — verbatim-intent violations** (02×4, 03×4, 04×5, 01×1 paraphrases; 04 substantive founder-attributed fabrications; 01 + 02/04 harness-text misattribution).
- **F — evidence claimed in a container that doesn't hold it** (03): "reds in git history" (green-only, 10 commits), "fixes are in git history" (squashed), "transcript is in the session record" (never committed).
- **G — determinism not repo-rerunnable** (02): proof fixtures outside the tree; the one-shot byte-identity JSONs are committed and identical, but unverifiable again.
- **H — spec's internal evidence map names a wrong location** (04 `tests/proofs/`).
- **I — ambiguous relative path grammar** (01, 03 delivery-log/tracker evidence columns): unit-relative paths resolvable only by inference; 00/04 by contrast use fully resolvable paths.

**What the CURRENT `check` catches vs misses** (source: `passes/check.ts` + `passes/gates.ts`; all five products exit 0, zero diagnostics):
- **Catches:** proofs.md of a delivered unit where **every** path is dead (DG-C002 error; the tracker `gate-refused` rows in 01-season-quiz and 04-scan-engine prove the mechanism fires); status-marker coherence (delivered ⇒ delivered.md/score.md/grill.md exist; readable `verdict:` line); missing tracker (warning). Partially: **some** dead paths inside proofs.md — but only as a warning, and only if at least one path resolves.
- **Misses — every class above:** its path scan reads **only proofs.md list items** (backticked spans + first bare token, `candidatesOf()`). It never opens grill.md, grill-answers files, delivered.md, delivery-log.md, tracker evidence columns, spec evidence maps, cycles.md, or deliverables.md — so classes A, B, H, I are structurally invisible. The "at least one live path" threshold means even inside proofs.md, one live path masks any number of dead ones. There is **no verbatim check** (E), **no claim-vs-code re-verification** (C, D), **no git-history or hash substantiation** (F, G), and **no score-arithmetic or row-count cross-check** (currently honest everywhere: all 12 score files sum correctly, all delivery-log row counts match delivered units, all tracker statuses match frontmatter — but nothing enforces it).

**Bottom line for spec 7:** the current checker validates exactly one narrow thing — "the proofs.md of a delivered unit contains at least one path that exists" — and all real lying in this fleet happens outside that one surface: in grill answers, delivery rows, intent quotes, and claims that time has silently drifted away from the code they describe.
