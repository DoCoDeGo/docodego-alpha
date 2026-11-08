# Issues catalog — the 20-cycle quality audit (2026-11-08)

Master catalog of every issue found in re-reviewing the five built
products, per the founder's directive. This file folds in the outputs of:

- **Five product auditors** (4 passes each = the 20 cycles), one per
  product, graded against `docs/process/quality-audit-rubric.md`.
- **One cross-product comparator** — the divergence matrix, the
  sibling-solved list, and what the method failed to standardize.
- **One skills/rules infrastructure analyst** — dossier at
  `docs/research/shelf-bundle-and-auto-add.md` (outer repo).

Cross-links: findings that appeared in the live round's improvement log
(`docs/audits/2026-11-08-improvements.md`, IMP-1..23) carry their IMP tag.
Severity: **L** launch-blocking · **M** major · **m** minor · **p** praise.

Headline (final, all five audited): **five for five FAIL the ship test —
twelve launch-blockers total** — payment-integrity *bugs*, broken core paths,
agent-signed boundaries, and one record-layer verification contradicted by
its own artifact. The single most predictive individual choice in the fleet:
whether the agent scripted a real-browser walkthrough with committed,
regenerable evidence.

## Sections

### 1. Product 00 — finessetry (audited: FAIL)

**Blockers (L)**
1. **No purchase surface at all** — paywall says "$12, once" then demands a review code hardcoded in view-source (`DEMO_CODE = 'FINESSETRY-FOUNDER'`, `product/src/main.ts:10`); the tier is simultaneously unpurchasable and trivially bypassable. ADR 0004 records the boundary — signed by "founding agent," i.e. the agent signed its own boundary; no founder signature exists.
2. **The share card prints a domain nobody owns** — `finessestry.com` (extra "s") vs the brief's owned `finessetry.com`, on the card *and* the download filename (`product/src/ui/copy.ts:43-44`); systemic (title, wordmark, package name, localStorage keys) and **the product's own verification tooling enforces the misspelling** (`grep-copy.mjs:26` requires it to pass). No record file ever names the brand.
3. **The classifier has never seen a real face** — fixtures drawn from the engine's own Lab bands (`scripts/make-fixtures.mjs:4-6`): circular validation proving round-trips, not reading. No face detection at all (centered box assumed); an off-center selfie misreads silently. Determinism proven; *correctness* externally unverified.

**Major (M)** — no typecheck anywhere in the verify path (`tsc --noEmit` passes today; nothing would catch the next error); capture button live before camera frames with silent `IndexSizeError` and no visitor feedback (`main.ts:210-217`, confirmed live); paywall's code field still visible after unlocking (`[hidden]` beaten by author CSS, `styles.css:265-267`); swatch names invisible on dark swatches (`mix-blend-mode: multiply`, black-on-`#16161A` — 4 of 6 free winter swatches unreadable; the paywall sells "named" colors).

**Minor (m)** — two package managers sanctioned in README; `pnpm-workspace.yaml` (the reproducibility switch) untracked; `Verdict.ok` dead contract; corrupt localStorage crashes unlock; retake mid-reading overridden by a naked `setTimeout`; share-card buttons silently no-op; no OG/social meta; **the delivery gate's flagship proof (run-e2e.md) is prose + screenshots, not a committed replayable script**; ADR 0001's recorded CSP drifted from the shipped CSP (append-only note needed).

**Praise (p)** — privacy rail exemplary and re-measured live: `connect-src 'none'` + 0 resource entries + 0 network requests through the whole funnel; determinism proven three ways (byte-equality, cross-invocation sha256, source-scan banning randomness); engine/shell split enforced by a test; the paywall copy refuses to lie in writing ("we will not pretend otherwise"); **the deploy artifact is genuinely launch-shaped** — one 228 kB self-contained HTML, works from `file://`, the rare audited artifact that could upload tomorrow.

**Post-audit instrument sweep (visual-proof driver's first honest run):**
- **[new] [M] 375px horizontal overflow confirmed on the built artifact — the auditor's "375px clean" verdict corrected.** Full-page capture is 400px wide on a 375px viewport (+25px bleed; `first-load-mobile.png`, transcript `visual-proof.md`). Real horizontal scroll on the dominant shopping-adjacent viewport; less severe than 01's 118px clip, mechanically proven where the prose claim failed. The culprit is the palette/gradient strip bleeding past the right padding edge.
- **[evidence] Brand mutation confirmed live in the built artifact** — page title reads `finessestry — find your colors, keep your photo`, footer `FINESSETRY.COM`, wordmark `Finessestry` (screenshot + title tag). Strengthens blocker #2/#3: the misspelling ships in the build, not just source.
- **[instrument] Driver self-test findings fixed same-day:** refused `file://` with the fix named (it silently produced garbage verdicts on a CORS-blocked page — the exact "error names the fix" standard); overflow now reported as a measured delta (`+25px`), not a bare boolean. Instrument disagreement (driver vs auditor prose) was adjudicable only because the evidence is a committed file — the Tier-1 lesson proven on the instrument itself.

**Ship test:** FAIL — "v0 awaiting a signature it never asked for": checkout is signature-excusable; the wrong-domain card and the unvalidated classifier are defects no signature excuses. Siblings-better: 01's typecheck-in-build, 01's real payment rail, 04's no-input sample read.

### 2. Product 01 — swatchship (audited: FAIL)

**Blockers (L)**
1. **Duplicate fulfillment rows on confirmation refresh** — `appendOrder` unconditional per confirm, no session-id dedupe, UI never clears `session_id`; proven by execution: one paid session → 2 order rows (`server/src/handlers.ts:116`). A payment-integrity bug in the standard refresh path.
2. **375px layout break: fan overflows by 118px, cards clipped beyond reach** — hero `.swatch-card` right edge 493px on 375px viewport; left-clipped cards unreachable in LTR (`web/src/styles.css:248-280`). The repo's own 46-check verify never asserts zero overflow — green while broken.

**Major (M)**
3. Live Stripe round-trip never executed (invalid-key rejection only); unit reads `delivered` with no founder-signed boundary row in the tracker; `stripe.ts:25` blind-casts params, severing type safety at the only real-SDK seam.
4. `npm run verify` is flaky (exit 1, 0, 0 across three runs) — `goto` + immediate `evaluate` races the async confirm (`scripts/visual-verify.ts:265-266`); the evidence instrument itself is intermittent.
5. Two package managers touched the tree — tracked `package-lock.json` + untracked `pnpm-lock.yaml`.

**Minor (m)** — no README anywhere (build must precede serve; `STRIPE_SECRET_KEY` documented only in source); missing page → 500 JSON not 404; keyboard focus drops to `<body>` on every quiz answer, fake radio semantics (3 tabbable, no arrow keys); mobile nav `display:none` below 900px with no replacement; zero og:/twitter:/canonical; no returns policy, no deploy recipe (PORT hardcoded); no security/cache headers; typecheck only in `build`, no aggregate gate.

**Praise (p)** — determinism proven by 16,384-vector enumeration ×2; carry fuzz (27 hostile values → null) + DOM-write law; fail-closed at every seam (503 no-key → 402 unpaid; forged-id tests); zero identity fields on the origin page; reduced-motion collapses everything; strict TS with `noUncheckedIndexedAccess`.

**Ship test:** FAIL — fix #1 + #2, founder-sign the four open rails (live charge, shipping list, webhooks/idempotency, deploy recipe) → legitimate v0.

### 3. Product 02 — bodyarchetype (audited: FAIL)

**Blockers (L)**
1. **Paid tier bypassable by typing a URL** — `?purchase=success` sets `localStorage["bodyarchetype.unlocked.v1"]="1"` with zero verification (`src/main.ts:75-81`); full 22-entry ledger rendered without payment. UI actively advertises "the founder wires a Stripe payment link here, in one config line" (`src/copy.ts:59`) — that one line would ship a paywall any visitor defeats by sharing a link.
2. **The brief's headline promise fails on its promised input** — "reads a full-body or waist-up photo": two real head-to-toe photos both misread as waist-up with the UI asserting a falsehood ("hips and legs sat outside the frame"); ankle-visibility < 0.5 demotes the frame with no geometric fallback (`src/lib/features.ts:85-92`). Both delivered fixtures were upper-frame; features `verticalLine`/`legTorso` never touched a real photo. Delivered proofs contain zero real full-body runs.

**Major (M)**
3. Stage shows "Reading your lines…" forever after success — never cleared, infinite animation spins beside the finished reading (`src/main.ts:128`).
4. Signature elevation renders malformed (jagged, truncated, no head/legs) on real full-body photos — the delivered clean plate was an upper-frame fixture (`src/lib/drawing.ts:122-162`).
5. Classifier externally unvalidated: two celebrity fixtures, hand-set ranges, **identical per-family weights for all five families** — "weighted scoring" is range-distance only (`src/lib/classifier.ts:49-93`); two unrelated real women both read Gamine.
6. No typecheck in the verify path — strict tsconfig exists, orphaned; `tsc --noEmit` passes but no script runs it.

**Minor (m)** — no-person branch unreachable (dead copy, wrong diagnosis shown); UI claims a second-family ledger that never renders; tone-lint scope overstates its README claim (card.ts + main.ts literals unscanned); 30 lines of shipped prose dead (`lineNotes[1..2]`); `capture="user"` forces front camera when guidance says frame head-to-toe; zero OG tags, no 404; elevation label clips outside its own viewBox mid-digit (violates the module's own "what the classifier sees is exactly what is on the wall"); guard is a 4-API allowlist while copy claims totality (Image/EventSource/RTC/form-nav unwrapped); **grill.md cites four proof files that don't exist; delivery rows cite `src/copy.ts` as evidence** (record-integrity defect — IMP-5 adjacent); audit scripts untyped `.mjs`; measured ratios live only in aria-hidden SVG (screen readers never hear them); accent contrast ≈4.4:1 borderline; TensorFlow INFO logs as console noise.

**Praise (p)** — privacy guard: installs pre-analysis, origin-pinned GET-only, live counters; probe re-run by auditor: **6/6 exfiltration channels refused**; byte-identical end-to-end determinism reproduced by auditor across two headless runs; tests substantive (exact-ratio fixtures to 1e-6, lint meta-test plants violations to prove the net); tone law real in every shipped string; mobile clean (zero overflow, reduced-motion draw collapse).

**Ship test:** FAIL — payment rail (or signed boundary naming the bypassable path) + the full-body defect (fix, or founder-approved reduction of the brief's first sentence).

### 4. Product 03 — grademyfit (audited: FAIL)

**Blockers (L)**
1. **Every permalink renders an empty page** — `/f/<id>` rewrite makes `./js/fit.js` resolve to `/f/js/fit.js` → 404; the feed prints "permalink" links on every slip; a stranger clicking any share gets masthead, footer, nothing between (`web/fit.html:51`, `server/index.ts:192`, observed live). On a product whose brief is "the traffic engine of my portfolio."
2. **Moderation console + API fully unauthenticated** — `curl -X POST /api/review/<id> -d '{"action":"dismiss"}'` → 200; queue with reporter reasons world-readable (`server/index.ts:139-148`). Loopback bind + README disclosure, but unshippable to any real domain, and unsigned.
3. **No founder-signed v0 boundary** — the $9.99 pro report unbuilt (honestly), NSFW blocklist ships one demo hash (byte-exact match only), console-auth gap open — all agent-recorded, none founder-signed. `grep -ri founder .docodego/` finds no signature.

**Major (M)**
4. **The walkthrough recorded a PASS the shipped code contradicts** — step 12 claims the permalink "renders the single slip → PASS (no screenshot required)"; HEAD demonstrably renders nothing (finding 1's 404 was in fit.html's birth commit). Either regressed after the walkthrough or never executed — **no screenshot exists to arbitrate.** The fleet's flagship evidence instrument fails silently; proof that isn't regenerable can't arbitrate (`grade-reveal/proofs/walkthrough.md` step 12).
5. Plain-JS front-end beside TS server (6 untyped modules) — the quality bar's named violation, confirmed; and the server itself doesn't compile clean: four standing strict-mode tsc errors (`index.ts:102-103,238`, `moderation.ts:55`), `reports!` papers over exactly the named error.
6. **Posting has no double-submit defense** — no nonce on `POST /api/post` (vote/report have one), button never disabled: two concurrent posts with ≥100 credits → two identical fits, −100 credits. The credits economy's unguarded till.
7. Reveal misfires in its most common state — first voter sees "the panel has spoken" + a stamped letter, then re-render to "1 of 3 votes": verdict claimed, stamped, retracted (`web/js/reveal.js:15`).
8. Zero OG/share surface on all three pages; permalink title never personalized — the share card is the ad, and there is none.
9. Untracked `package.json` is a scaffold stub (`"main": "index.js"` — no such file; `"test": "no test specified"` — contradicting 44 tests) + untracked lockfile + unignored `node_modules/`; every boot emits `MODULE_TYPELESS_PACKAGE_JSON`.
10. Client re-implements server cutoffs in two places with no pinning test (drift by design); `reviewAction` dismiss resurrects removed posts (broken image in public feed).

**Minor (m)** — email captured but no page ever calls the endpoint (stored, never used — against the brief's own data-minimization line); favicon is the `data:,` suppression trick; no robots/llms.txt; bare-text 404s; no deploy artifact or topology (runtime state beside code).

**Praise (p)** — 44 tests, ~1.1s, all boot the real server against real SQLite, zero mocks, no tautologies; XSS title renders inert via `textContent`; zero third-party requests; reduced-motion genuinely collapses with the fix recorded; the zero-dependency server layer (HMAC + `timingSafeEqual`, nonces, magic-byte sniffing, traversal guards, injectable clock) is ownable tomorrow.

**Ship test:** FAIL — permalink bug, unguarded till, false walkthrough PASS, reveal misfire are defects no signature excuses; pro report/blocklist/console-auth are signature-excusable rails.

### 5. Product 04 — planmyskin (audited: FAIL)

**Blockers (L)**
1. **The $12.99 paywall takes nothing** — `action === "unlock"` → `store.unlock()` with zero provider (`src/main.ts:68-73`); one click grants the full paid tier. Labeled in UI and scoped in spec, but no founder-signed v0 boundary exists anywhere in the record.
2. **Guard recovery is a dead end** — capture panel removed on scan; "Try again" scrolls to the detached node (`src/app.ts:113`, `src/main.ts:61-63`). A dark first photo — the most likely real-camera outcome — strands the user until reload.

**Major (M)**
3. Camera denial silent: no guard panel, no fallback to upload — the spec's promised fallback was never built; primary button does nothing (`src/main.ts:47-50`).
4. **Camera stream never released** — no `getTracks/stop` anywhere; the lens stays hot after the read in a product whose pitch is "no upload, no server" — a trust defect in the privacy story itself (`src/camera.ts:26-35`).
5. Score reveal fails WCAG: blush `#c08d7e` on porcelain = **2.56:1** on the hero moment (`.pm-top-name`, 40–64px) and the 12.5px lock-tags (`src/styles.css:134-138`).
6. TypeScript checked nowhere — no typescript dep, no tsconfig; strip-types + esbuild transpile without checking.
7. Copy-lint blind spot on its own criterion — scans 3 hand-listed files; user-facing strings in `render.ts` unscanned, spec's claim false for that file.
8. Demo mode label built and never wired (`copy.capture.demoLabel` + CSS exist, zero render call sites) — live report shows "Your read" with no synthetic marker.
9. Re-scan promise thin: no counter (9 scans stored 8 records, 5th never refused), history renders one comparison, not a 4-week arc.

**Minor (m)** — disclaimer 13.5px muted gray (present, "prominent" questionable); band-coarse comparability (luma 105 vs 185 "comparable"); dead code set (`topConcernOf`, `demoLabel`, 3 CSS classes); full 76,800-sample pixel pass runs twice; non-image upload fails silently; favicon/OG/404 all absent; the 4-week plan is one week ×4 (`eveningSteps` computed once); no README.

**Praise (p)** — privacy true by construction (fetch/XHR/WS/sendBeacon stubs throw in tests, dist scanned, live run zero external requests); deps minimal and purposeful (3, locked); edges hold (double-submit, dark upload, cross-band refusal, persistence, 375px clean); tests substantive, not tautologies.

**Ship test:** FAIL — #1 + #2 not signature-excusable; with signature, payment/re-scan/demo/plan-thinness/polish could stand as free-tier v0; #2/#3/#4 are plain primary-path bugs.

### 6. Cross-product divergences & standardization gaps (comparator: FAIL verdict pending per-product; 40 findings)

**Matrix headline:** converged on record-layer mechanics (identical tracker/delivery-log/gate shape — the method's rules landed) and diverged on everything the rules didn't name — language (03: JS front-end beside TS server), typecheck (only 01), test realism (5 different meanings of "proven"), privacy enforcement (3 incompatible shapes of the same hard line), payment realism (5 answers), unit homes (2 of 5 wrong movement), runnability (2 of 5 unrunnable by a stranger).

**Standardization gaps the method should have forced:**
1. Stack standard: web ⇒ TS end-to-end + `tsc --noEmit` in the verify path — prevents the JS front-end, both missing tsconfigs, the orphaned strict config.
2. Verify-path shape: every unit's proof is a **committed script** whose run exercises the built artifact — would have refused 04's skipped visual pass and 00's uncommitted driver at G4.
3. Privacy enforcement pattern: one required shape (CSP where feasible + runtime guard + committed live probe with request log) — not CSP vs JS-guard vs test-stubs.
4. Screenshot proofs name their producing script, or they aren't proofs (→ shipped as `docodego-visual-proof`).
5. Two-tier done: `delivered` vs `launch-passed` vs founder-signed `v0 boundary`; "parked" vocabulary for units blocked on founder (03's `pro-fit-report` sits at `grilled` forever).
6. Unit home semantics: streams unbound to work type; `check` passes build units in the discover movement (00, 02).
7. Scorer saturation: 9×100, 4×99, 2×98, 1×90 across 16 specs — a gate that nearly always says 100 adds ceremony, not signal (IMP-12).
8. One package manager, one lockfile, `engines` pinned — none of the five pin engines.
9. Runbook required: 2 of 5 repos have no README at all (01, 04); record immaculate, product unstartable.
10. Visitor-facing tier needs a test floor: 00's UI, 01's UI, 03's entire front-end have zero automated tests.

**Gap catalog (condensed, evidence in comparator report):**
L-class: 01 duplicate order rows; 01/02 375px breaks; 02 bypassable paywall + false full-body statement; 04 paywall-takes-nothing + stranded recovery.
M-class: unproven Stripe round-trips (00/02/04 unpaid, 01 invalid-key only); classifier unvalidated (02, identical family weights); camera stream never released (04); silent camera denial (04); eternal loading status (02); malformed elevation on real full-body (02); typecheck absent (02/03/04, decorative in 00); copy-lint blind spots (02/04 — lint never sees `dist/` or full file sets); no tsconfig (03/04).
Record-layer findings: grill citations to nonexistent proof files (02); delivery rows citing source files as evidence (02, gate echo — IMP-5 adjacent); ADRs in 1 of 5 repos and outside the record (00); gate refusals recorded in only 2 of 5 (silent otherwise — the law can't tell perfection from underrecording); parked-unit vocabulary missing; companion files ad hoc (only 04 grew deliverables.md); founder-waiver marker in only 1 of 5.
Universal minors: no OG/share meta (all five), favicon/404 gaps (01/02/04), no `engines` field (all five), two lockfiles or untracked manifests (00/01/03), dead copy/code in every repo, a11y (focus loss 01, aria-hidden data 02, contrast 04).
**`docodego status` cannot answer "could this ship"** — every tracker reads identically green while the material differences live in files status never reads (→ IMP-15 + launch gate).

### 7. Skills / rules / agents infrastructure (analyst; full dossier: outer repo `docs/research/shelf-bundle-and-auto-add.md`)

1. **Inventory:** 31 skills across four shelves (studio 26 · v2 CLI 8 · product family 5 · webrtc 23, read-only). The webrtc shelf's unique content was already harvested; the real un-ported craft is **visual-verify authoring** — now shipped as `docodego-visual-proof` (founder directive, same conclusion).
2. **Bundle 21 / cut 10:** in = 8 method + `meaningful-tests`, `systematic-debugging`, `web-design-guidelines`, `chrome-extension-mv3`, both Vercel skills, `refactor`, `refactor-ratchet`, `uncle-bob`, `grill-me`, `launch-auditor`, `ux-strategy`, `domain-scout`; cut = `docodego-promote` (init ate it), `leaving`/`beyond`/`nurturing`, `never-repeat` (one law line beats one page), `code-comments`/`visualizing-solutions`/`reflect` (studio taste), `prompt-smith`/`context-forge` (hard-coded portfolio paths — remote pack).
3. **Profiles:** minimal = locator; docs-only/research + `grill-me`; product-team = loop + `meaningful-tests` + `systematic-debugging` + `launch-auditor` (+ `visual-proof`, now bundled); platform adds refactor pair + `uncle-bob`. Stack-specific skills never plant — they auto-add.
4. **Auto-add:** closed trigger registry in CLI code (self-checked like RULES; a trigger naming a missing bundled skill = self-check error). Detection at `new` (unit type, product class, stack files), `score` (acceptance keywords: payment/scan/a11y/domain/test), `deliver` (launch gate refuses without its instrument — auto-add is recovery, not bypass). Laws: bundled-only, tracker row before exit, deterministic, respects user removals forever, auto-not-asking (stderr → tracker → `skill list` marker). Three trigger-target skills must be authored first: tech-stack, payments, research-verify.
5. **Rules layer:** 5 invariant rules plant per profile — `standard-stack-default`, `no-untracked-source`, `reduced-motion`, `privacy-at-network-layer`, `interruption-safety` — each with `reader/fails-when/enforced-by/paths` frontmatter; binding map becomes computed (`lint --self-check` verifies every enforced-by target; furniture listed in status, deletion human-confirmed). Verbatim-intent/append-only deliberately not duplicated as rules (already the AGENTS.md honesty law — never-repeat doctrine).
6. **Gaps:** `vercel-react-best-practices` is client-only-trimmed (wrong for SSR); `refactor-ratchet` hard-codes studio furniture; agent presets planted but unemployed (the law must say when reviewer/tester are mandatory); rules not planted at all today; studio-vs-CLI shelf divergence needs a one-upstream law.

### 8. Consolidated ranked list

**Fleet totals:** 103 product findings (00:22 · 01:17 · 02:23 · 03:21 · 04:20), 12 launch-blockers, 5/5 ship-test FAIL, plus 40 comparator divergences and 12 infra gaps. Raw ≈155, deduped below to the law-level fixes.

**Tier 1 — the gates grade the wrong thing (law):**
1. **Two-tier done + founder signature.** Five trackers read `delivered`; zero products pass the ship test; every boundary was agent-signed or absent (`grep -ri founder` → nothing in any of five records). Fix: `launch-passed` gate (launch-auditor as instrument) + `v0-boundary` status writable only by a recorded founder decision; `status` renders the tier. *(quality-outcomes mechanism 1; IMP-1's third act)*
2. **Score ≠ truth, and the score is saturated anyway.** 9×100/4×99/2×98/1×90 across 16 specs while 12 launch-blockers shipped; 03's unsatisfiable spec scored 100; 02's false full-body statement passed a 100-scored spec. Fix: satisfiability check at scoring, hash-marked scores, grill demanded at scoring time. *(IMP-12/17)*
3. **Self-reported verification is not verification.** 03's walkthrough PASS contradicted by HEAD; 04's final visual pass silently skipped, gate passed; 00's flagship proof is prose with no driver. Fix: the visual-proof instrument is mandatory for user-facing units — committed driver, screenshots, regenerable transcript; "no screenshot required" is an illegal phrase in a proof. *(IMP-20/23, shipped skill)*

**Tier 2 — the standards that never existed (rules):**
4. **Stack standard + typecheck.** 1 of 5 typechecks; 03 has four standing strict errors and a JS front-end; 02's strict tsconfig is orphaned. Fix: `standard-stack-default` rule (web ⇒ TS end-to-end, `tsc --noEmit` in verify) planted and enforced by lint.
5. **VC completeness.** 03's stub package.json untracked with `node_modules/`; two lockfiles in 01/00; no `engines` anywhere. Fix: `no-untracked-source` rule + `check` warning on untracked source-like files.
6. **Privacy pattern, one shape.** CSP (00, exemplary) / JS guard (02, 6/6 refused but 4 APIs of the surface) / throwing stubs (04, weakest enforcement with the strongest claim). Fix: `privacy-at-network-layer` rule requiring CSP where feasible + guard + committed live probe; copy may only claim what the mechanism enforces.
7. **Runbook + share surface.** No OG meta in five for five; two repos unrunnable by a stranger; favicon/404 gaps in four. Fix: launch-gate checklist rows (OG, favicon, 404, README, deploy recipe or signed demo-real boundary).

**Tier 3 — the craft layer (skills/agents):**
8. **Bundle 21 / plant per profile / auto-add on trigger** (analyst §2–4): craft floors (`meaningful-tests`, `systematic-debugging`) fix tautological suites and honest-prototype stop-conditions; `ux-strategy` + `launch-auditor` + `visual-proof` plant with product-team; tech-stack/payments/research-verify skills authored, then triggers arm; tracker row before exit, user removals respected forever.
9. **Agent topology mandatory where independence matters.** Reviewer preset runs grills in solo runs (IMP-13); testers run proofs; the law says when.
10. **The integrity map (IMP-15)** — `status` must answer "could this ship": compose-log, demo bundles, launch tier in the map; the fork dissolved by gate-written uniform rooms.

**The one-line verdict for the founder:** the honesty layer carried everything it was designed to carry — every gap recorded truthfully across five strangers — and that is exactly the problem: docodego produced five truthful records about five unfinished products. Record spec 7's job is to make the gates grade the product, make the evidence regenerable, and make the founder's signature the only thing that closes a rail.

### 9. CLI law-implementation audit (F1; full report: `docs/cli-law-audit-2026-11-08.md`)

**Headline: the gates verify record shape, never record truth.** Every gate decision is a regex or an existence probe over prose the agent itself wrote. Empirical, in a sandbox copy of 03's record: a hand-typed `total: 100/100` passes G2; the unit's own `spec.md` passes G4 as delivery proof; a spec whose every criterion is self-contradictory scores 100/100; `score` silently demotes a `delivered` unit to `scored`; `status: banana` produces zero check diagnostics. The fleet's 12 blockers shipped through exactly these holes.

29 defects (~11 law-critical, ~8 major, rest minor). The law-critical ones, named:
- **Scorer saturates by construction** — completeness is word-count thresholds; unambiguity is a 10-word blocklist; testability is criteria×5 minus keyword misses ("when|file|run|returns" makes nearly any sentence "observable"); threat-model is satisfied by any one bullet. The empty scaffold scores 58; the floor is a constant 60. (Confirms §8 Tier-1 item 2 at code level.)
- **G2 consumes the self-reported `total:`** — never recomputes the score, no hash binds score to spec; regex takes the first match, so prose mentioning `total:` shadows the table.
- **`score` mints `scored` with zero grill** — the command manufactures the exact state DG-C003 exists to condemn, then `check` condemns it afterwards. (03's "scored without grill" defect, located.)
- **Re-`score` silently demotes `delivered` → `scored`** — delivered.md, tracker, delivery-log all still assert delivery; no diagnostic exists for that direction. (01's re-score defect, located.)
- **Grill-fail after delivery cannot demote** — only `verdict === "pass"` writes status; asymmetric, silent decay. (The "self-reported PASS contradicted by shipped code" class, writer-side.)
- **Status vocabulary cannot express the fleet's end-states** — no `parked`, no `launch-passed`, no founder-boundary row type; 03's `pro-fit-report` sits at `grilled` forever, indistinguishable from active. Zero of five products have a founder-signed boundary and the CLI has no field that could hold one.
- **Tracker and delivery-log are write-only** — the delivery log is written by three modules and read by none; deleting all tracker rows for a delivered unit produces zero diagnostics.
- **`status` reads four frontmatter fields and nothing else** — "could this ship" is unanswerable by construction.
- **Meta-defect (law-critical):** the CLI's own 116-check conformance suite contains **zero tests for any failure mode the fleet produced** — no re-score, no hand-edit, no idempotency, no stale-score case. It asserts the gates pass when they should; it never asserts they *fail when they should not pass*. This suite is why the CLI could ship feeling green.

Also confirmed live: 00's `color-engine`/`the-atelier` and 02's `read-your-architecture` are build units sitting in the discover movement with clean lint+check (stream binding covers only epic/story).

**Spec-7 input — five law-critical mechanisms in dependency order:** (1) score binding (recompute at the gate, `spec-sha:` hash, append-only score blocks); (2) transition table in `setStatus` + `parked`/`launch-passed`/founder-boundary vocabulary; (3) governance pass in `check` (tracker + delivery-log + latest verdict coherence); (4) proof semantics (artifact-shaped evidence, source-file exclusion, grill citations existence-checked, grammar taught at write time); (5) `status` rails section with a `ship:` verdict line — with the conformance suite's missing failure cases as the acceptance suite for all five.

### 10. Record-integrity sweep (F3; full report: `docs/record-integrity-audit-2026-11-08.md`)

**Headline: `check` exits 0 on all five products — and 7 distinct dead paths / 21 dead citations / 9 violation classes survive it (4 of 5 products affected; 00 clean).** The structural finding: the current checker validates exactly one narrow thing — "the proofs.md of a delivered unit contains at least one path that exists" — and all real lying in this fleet happens outside that one surface: in grill answers, delivery rows, intent quotes, and claims that time has silently drifted away from the code they describe.

The nine classes: (A) dead proof paths in grill/grill-answers — 02's grill verdict passes on four test transcripts never written; (B) a source file as gate evidence — 02's delivery rows cite `src/copy.ts`; (C) post-delivery claim drift — 04's grill/proofs name a refusal key the code renamed, its cited transcript predates the rename and names neither; (D) walkthrough PASS vs shipped code — 03's AC8 "CSS transforms only" vs a `translate`-property shake, PASS recorded with the deviation footnoted "met in spirit"; (E) verbatim-intent violations — 13 paraphrase instances across 4 products, worst in **04, where intent.md attributes agent-authored content to the founder** (an ingredient list and drug-claim ban the founder never wrote, later cited as "the founder hard line" in a commit message); also 01 misattributes the harness directive as the founder's mandate; (F) evidence claimed in a container that doesn't hold it — 03 claims "the reds are in git history" of a green-only 10-commit repo, and a grill evidence claim rests on a session transcript that was never committed; (G) determinism proven once with fixtures outside the tree — 02's byte-identity is real but unrerunnable from the repo; (H) a spec's own evidence map naming a wrong location (04's `tests/proofs/`); (I) ambiguous unit-relative paths in delivery-log/tracker evidence columns (01, 03).

Clean-for-the-record notes: score arithmetic is honest everywhere (all 12 score files sum correctly); tracker↔frontmatter↔delivery-log row counts agree everywhere; 00's record is fully clean — the determinism proof (committed script + two identical sha256 hashes) is the evidence shape the law intends. The failure is not agent dishonesty about arithmetic; it is that every class above is mechanically invisible to a checker that reads one file, one claim type.

**Law note:** class E is the founder-verbatim law dying where enforcement is absent — the record law says verbatim, the agents believed they were quoting, and nothing could catch the drift. R2's ALCOA verdict (fails as an *evidence* standard) is confirmed: "original" and "attributable" need the founder's words hash-bound at capture, and the checker needs to diff intent quotes against the brief mechanically.

### 11. Security/abuse pass (F2; full report: `docs/security-audit-2026-11-08.md`)

**Headline: 16 new findings beyond the known blockers — 4 exploitable-at-launch (L), 5 major, 7 hardening — every one reproduced against live servers or a real browser.** The worst, all in 03: persona takeover via client-minted ids (`POST /api/persona` returns a valid, non-expiring token for any known persona id — seed ids are hardcoded in the repo); the "stolen token is inert" nonce claim is false (challenge issues nonces to any token holder); all rate limits are keyed to freely-mintable identities, so no limit exists (proven: four burner personas each posted); and a racing GET+remove **crashes the whole server** (unhandled ReadStream error — reproduced, process died on round 37). Also: hidden posts fully readable via permalink and still awarding credits; a review state machine whose `dismiss` resurrects removed posts; non-unique handles (impersonation); non-idempotent posting that double-charges 50 credits on retry.

02's finding guts the core promise: the network guard wraps exactly 4 JS APIs — proven bypassed live via `new Image()`, CSS `url()`, and `EventSource`, each exfiltrating photo data to a listener. "Your photo never leaves your device" is one `new Image()` away from false, and no CSP header exists on the served app. 01 buffers request bodies unbounded (memory DoS) and builds Stripe redirect URLs from the client-controlled `Host` header. 00's license gate ships in the minified bundle as `const me="FINESSETRY-FOUNDER"` — view-source is the paywall.

**The four recurring trust assumptions (the same mistakes in five costumes):** client-held state is the entitlement; a client-generated identifier is an identity; invariants implemented in page JS are guarantees; the happy path defines the protocol. F2's one-server-side-standard that kills the class: **treat the client bundle as attacker literature — every state change and entitlement grant happens server-side, bound to a server-minted credential, an idempotency key, a cost limit with acquisition cost, and one shared visibility predicate.**

Verified-clean knowledge for pass 3: SQLi clean everywhere (parameterized), 03's ledger math exactly correct under parallel load, prototype pollution clean, ReDoS clean, no secrets in any dist (01 even ships a build gate for it), path traversal clean on 01/03 static routes.

**Spec-7 tie-in:** the `privacy-at-network-layer` rule must require CSP (+ trusted types where feasible) rather than JS-API wrapping alone — browsers enforce CSP outside JS reach; the launch gate needs an abuse-probe class for anything with identity, money, or moderation surfaces (entitlement bypass, replay/idempotency, limit-keying, error disclosure); "client bundle as attacker literature" belongs in the stack standard's first paragraph.

### Fleet totals after the three finder passes (2026-11-08)

103 product findings (§§1–6) · 40 comparator divergences · 12 infra gaps · **29 CLI law-implementation defects** (§9) · **9 record-violation classes / 21 dead citations** (§10) · **16 security/abuse findings** (§11). Launch-blockers unchanged (12); ship test unchanged (5/5 FAIL). One delivery unit follows from every section: record spec 7 makes the gates grade the artifact, the evidence regenerable, the founder's words hash-bound, and the founder's signature the only thing that closes a rail.

### 12. Cycle-2 engine findings & harness-bridge decisions (H1+H2; full reports: outer repo `docs/research/mitigation-research-2026-11-08.md`)

Three law-critical versioning bugs (H2, found by reading the engine — fix before any upgrade build):

- **BUG-V1 · `init --force` can stamp a record DOWN.** `writeManifest` spreads the incoming manifest (carrying `recordVersion: specVersion()`) over the raw one; a v9 record opened by a v8 CLI silently becomes v8 — an append-only violation. Guard: `recordVersion: Math.max(existing ?? 0, incoming)` + print the ahead-record warning `upgrade` prints.
- **BUG-V2 · No registry-contiguity assertion.** `migrationsFor` filters silently; if `MIGRATIONS` skips a version (this tree's array ends at v6 while the payload ships spec 8), a behind record "upgrades" with zero transforms and gets stamped current. Guard: `assertRegistryCovers(0, specVersion())` in `upgrade` + conformance + CI bundle guard (Terraform's contiguous-ladder check; Angular's "never consolidate").
- **BUG-V3 · Vocabulary stomp on upgrade.** `upgrade.ts` `bundledFiles()` copies all `recordFiles()`; a vocabulary-pack record's pack-voiced stream `README.md`s would conflict against canonical-voice bytes as `.new` spam. Guard: when `manifest.vocabulary` is set, exclude stream-README paths from the upgrade target.

Lockfile path canon (H1 discrepancy, resolved): a task brief said `.agents/skills-lock.json`; the CLI (`LOCK_REL`, `skills/lock.ts:15`), the planted AGENTS.md text, and the swatchship tree all say **`.docodego/skills-lock.json`**. Canonical path is `.docodego/skills-lock.json`; any text saying `.agents/skills-lock.json` is wrong and must not reach spec 7.

Harness-bridge decisions (H1 research; adoption pending founder review, then spec 7 rules-planting + bridge build):

- **Precedence ladder codified in AGENTS.md verbatim:** `user's explicit instruction > .docodego/.standard statutes > AGENTS.md > loaded skill/vocabulary > style preference`.
- **Never plant a root CLAUDE.md** — its existence suppresses AGENTS.md loading under Claude Code (v2.1.277+ fallback semantics). Doctor must warn when a CLAUDE.md exists without an `@AGENTS.md` import.
- **Claude Code bridge:** `.claude/rules/docodego.md` (≤8 lines, NO `paths:` frontmatter so it loads every session) + `.claude/skills/<name>` symlinks to `../.agents/skills/<name>`. Claude Code reads nothing under `.agents/`.
- **Gemini CLI/Antigravity bridge:** `GEMINI.md` containing exactly one line: `@./AGENTS.md`.
- **Zed:** never plant; doctor warns on shadow files (`.rules`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `AGENT.md`) — Zed reads first-match, not AGENTS.md.
- **Codex/Cursor/OpenCode/Copilot:** nothing extra planted (AGENTS.md + `.agents/skills` already native/compat).
- **`.agents/rules` stays docodego-private** — no harness reads it; the rules layer plants docodego-native and every rule's `enforced-by` names a CLI gate, so the rule holds even where the harness never cooperates.
- **Mirror hygiene:** all mirrors generated-marked, digests recorded in the lockfile, regenerated by `skill add/remove`, verified by `doctor --fix`.
- **`init --hooks` offer** (pre-commit/CI running `docodego check`).
- **Enforcement-floor law (H1's blunt closing):** "no instruction chain enforces anything — the CLI gate is not a fallback, it is the product." `deliver` refuses when `lint`/`check` fail; harness cooperation is a bonus, never a dependency.
- **Harness churn facts for doctor:** Codex 32 KiB combined cap + untrusted-project stripping since 0.150.0 (Aug 26, 2026); Gemini workspace skills need `/trust`; Gemini CLI consumer auth ended June 18, 2026 (→ Antigravity); Windsurf → Devin Desktop June 2, 2026; Claude Code rewrote memory behavior four times Sept–Oct 2026. Mirrors stay thin and replantable; the record conventions (`.docodego/`) are the stable asset.

### Fleet totals after cycle 2 (H1+H2, 2026-11-08)

CLI law-implementation defects: 29 → **32** (BUG-V1..V3; §12). Bridge spec adopted pending founder review. H3 (research refresh + skills census) pending. Launch-blockers unchanged (12); ship test unchanged (5/5 FAIL).

### 13. Cycle-2 research refresh — corrections & shelf decision (H3; full report: outer repo `docs/research/mitigation-research-2026-11-08.md`)

Launch-narrative corrections (any doc/marketing text carrying the old figures must use these):

- **EU AI Act:** high-risk (Annex III) obligations deferred to **Dec 2, 2027** (Digital Omnibus, 2026) — not Aug 2026. Correct framing: a hard, dated evidence deadline ~13 months out; docodego positions as evidence-readiness infrastructure.
- **Attribution fixes:** 45% → **Veracode** 2025 GenAI Code Security Report (not CSA); 2.74× → **CodeRabbit** (Dec 17, 2025, XSS-specific); 82/94 → **New Relic** State of AI Coding (Jun 9, 2026), companion stat CloudBees 81/92 (May 2026); UTBoost → **ACL 2025** (not 2026); SWE-Bench Pro retraction → **mid-2026** (~late June/early July), not September; Sonar 96/48 → State of Code **2026**, published Jan 2026; SO trust 29% → **2025 survey**.
- **Landscape:** Jules winds down **Dec 31, 2026** (announced Oct 29, 2026) — never cite as a live verifier product; its death is the position line: verification-as-product-feature is fragile, verification-as-method+record is durable. Kiro GA was **Nov 2025**, still AWS, 15,000+ community powers; add BMAD Method to the OSS poles; Tessl alive ($125M).
- **New evidence:** DryRun Security — 87% of agentic PRs (26/30) introduced ≥1 vulnerability (Mar 2026); Arnica — agent rules cut AI coding errors ~2.7× (Oct 2026), direct support for the rules layer; ISO **9001:2026** published, 2015 withdrawn — a fresh, dated ceremonial-conformity exhibit.

Shelf decision (adopted from census; §7 superseded on sizing):

- **Bundle ~27** (21 existing + 6 new below); **author 9 total** (3 planned: tech-stack, payments, research-verify + 6 new). The founder's "only three skills?" concern inverts under the data: the market's failure mode is too many skills (half of 1M registry skills installed once; 0.04% capture 62% of installs), not too few. Volume punishes; trigger precision pays.
- **6 new skills to author:** `security-baseline-for-ai-code` (Veracode-45%/Lovable failure patterns), `destructive-action-guard` (Replit-incident lesson), `reward-hacking-detection` (EvilGenie/emergent-misalignment), `supply-chain-evidence` (Trail of Bits cover-page discipline → records), `incident-record-writing` (append-only postmortems), `docs-publishing` (highest-demand undersupplied category).
- **Hard rules from the census:** nothing bundled without a trigger-precise SKILL.md description; no agent dispatch sees more than ~5–8 skills at once (per-dispatch scoping); remote/optional packs (payments, security, data/ML, docs) install opt-in via the auto-add registry — payload never bloats.
- **Distribution rides the Agent Skills open standard** (SKILL.md): OpenAI, Microsoft, Google + 20 agents on skills.sh share it — docodego's payload is portable by construction.

**Spec-7 tie-in:** the 6 new skills ride spec 7's auto-add trigger registry (author at most the bundled core; packs install on demand). Launch-blocker narrative updates to the corrected figures above; ship test unchanged (5/5 FAIL).

### Fleet totals after cycle 2 complete (H1+H2+H3, 2026-11-08)

103 product findings (§§1–6) · 40 divergences · 12 infra gaps · **32 CLI law defects** (§9 + §12) · 9 record-violation classes (§10) · 16 security findings (§11) · §12: 3 versioning bugs + bridge decisions · §13: corrections + shelf decision (27 bundled / 9 authored). Launch-blockers unchanged (12); ship test unchanged (5/5 FAIL). Build order: §12 bug fixes first, then spec 7 (launch gate, founder-signed tiers, rules planting, 9-skill shelf, stack standard, satisfiability scorer, transition table, governance pass, proof semantics, status rails), then upgrade mechanism (H2 build order), then bridge planting (H1 spec), then the five-product acceptance protocol.

### 14. The spec/ law-file set + canon (spec CLI) — inserted ahead of spec 7 (ADR 0012, 2026-11-08)

Decision recorded in the outer repo (`docs/decisions/0012-docodego-system-name-canon-spec-format-spec-cli.md`; research: S4 in the outer `mitigation-research` doc; arc canon: `arc-canon-2026-11-08.md`):

- **Name:** the DoCoDeGo System (Dual Operating Composition Demonstration and Governance System). Acronym intact; canon doctrine on the front door ("an anagram of Good Code — the name is the claim").
- **Canon:** `spec/` in the studio repo is the origin of the normative text; docodego.com mirrors.
- **Spec format:** versioned law-file set — SPEC.md front door; `laws/` (statutes 1–16 verbatim with book-8 † completions and honest limits + engine laws 17+; frontmatter: stable anchor id, pillar, severity, enforced-by, introduced-in, status); `movements/`; `record/`; `conformance/` (incl. the enforceability map); `amendments/` (append-only); `meta/` (glossary, how-to-amend, the document standard). Document standard as conformance: title + purpose + header block + meaningful structure, lint-checkable, no decoration — this is the init document-quality directive made enforceable.
- **Spec CLI:** separate binary `apps/spec/`, bin `docodego-spec` (working name canon) — NOT a `docodego` subcommand; the spec is payload, lawkeeping must not ship through CLI releases. Eight commands: lint · verify · build (SPEC.md + law-index.json + payload mirrors + manifest hashes) · amend (scaffold only; founder signs via `docodego sign`) · diff · coverage (enforceability map + `--impact`) · doctor · publish. Build order: foundation → lint+verify → build → coverage+diff → amend → doctor+publish (doctor before any payload-changing amendment).
- **Build order change:** this work goes **ahead of spec 7** — spec 7's statutes, transition table, and document templates compile from the spec set. Statutes.md re-binding to the arc Appendix B statute→stream layout + † completions rides the bundle guard (recordVersion+1).
- **Arc intake into spec 7** (from `arc-canon-2026-11-08.md`): spec versions in frontmatter cited by receipts; named signer on receipts; person/agent provenance on acts; bounded-record lint (~600 KB tracker, ~100 grill files); mode-sensitive gates + tested halt; doubt lines on receipts; cold start as record test. **Open founder question:** ICS form — four dimensions × 25 (G9.2; receipt "score 78, threat 19") vs five passes with anti-gaming 10 (Appendix A). Recommendation: four-dimension normative; satisfiability as a gate-level check, not a scored dimension.
