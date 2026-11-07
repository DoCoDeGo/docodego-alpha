# Quality outcomes — what docodego must optimize (2026-11-08)

Founder directive: process compliance was last round; outcome quality is the
point. "If the product is not built properly with the highest quality, no one
will use docodego no matter what." Two thinking cycles, recorded.

## Cycle 1 — what "best quality outcome" means: the ship test

The previous round graded whether the *record* was honest and coherent. It
was. But look at what the five agents actually shipped: every one stopped at
"honestly unfinished" on exactly the rails that make a product a *product* —
00's till unwired, 01's checkout waiting on a founder key, 02's classifier
never validated on real faces, 03's pro report deliberately unbuilt, 04's
payment a labeled stub. Honesty about gaps became an acceptable terminal
state. The law graded truthfulness, got truthfulness, and accidentally
optimized for **honest prototypes over finished products**.

So the outcome standard is the **ship test**: *could this deploy to its own
domain tomorrow and take real money without embarrassment?* None of the five
passes. That is docodego's real gap, and no amount of record integrity
compensates. Decomposed into five quality axes:

1. **Launch-real, not demo-real.** Every hard line actually wired end-to-end:
   payment takes money in test mode with a real provider round-trip; the
   deploy artifact builds and serves; the domain could host it. "Unfinished"
   is legitimate only as a founder-signed v0 boundary with the remaining
   rails enumerated as next units — never as a quiet final state.
2. **Standard stack, boring where boring is right.** Web product ⇒ TypeScript
   end-to-end, accepted tooling, one package manager, typecheck in the verify
   path. Stack standardness is table stakes, not creative space — one product
   shipped a JavaScript front-end beside a TypeScript server, and the law
   never noticed because creativity was invited everywhere. Creativity
   belongs to the product's face; the stack defaults to the industry's.
3. **Externally verified, not self-reported.** Real photos against real
   classifiers, real browser walkthroughs (03's walkthrough caught two bugs
   that a 99/100 spec and a clean suite missed — which means the other four
   products' unseen bugs are still in them), real performance numbers,
   real-device paths where the claim requires one.
4. **Complete per the brief's promise.** The brief is the contract: every
   hard line enforced *and* the promised artifact shipped at the promised
   tier. Gaps are decisions with recorded consequences, not omissions.
5. **Maintainable and fully version-controlled.** Everything committed
   (03's `package.json` never was), verify scripts reproducible by a
   stranger, deps pinned, no untracked source.

## Cycle 2 — the mechanism that gets there

1. **A product-launch gate in govern** — the second gate. Unit gates prove
   units; a launch gate proves the *product*: launch-auditor checklist as
   proofs with evidence paths (network-trace privacy, payment round-trip in
   test mode, deploy build, performance budget, copy lint, flair shipped and
   gated, reduced-motion, VC completeness). Two-tier done: `unit-delivered`
   (today) and `launch-passed` — with a founder-signed `v0 boundary` as the
   honest alternative. `docodego status` renders the tier. The
   `docodego-launch-auditor` skill already exists and becomes the gate's
   instrument.
2. **Bundle the craft; profile the init; auto-add on need.** The CLI's skill
   shelf carries only the 8 method skills. The craft exists on the studio
   shelf — meaningful-tests, systematic-debugging, web-design-guidelines,
   vercel patterns, refactor-ratchet — plus the product-family five
   (ux-strategy, context-forge, prompt-smith, domain-scout, launch-auditor).
   Bundle them; `init --profile` plants the necessary set (the profiles.json
   mechanism already exists); and the CLI **auto-adds** skills when the work
   triggers a need — a web product's first spec plants the tech-stack skill;
   payment criteria plant the payments skill; a scan claim plants the
   research skill. Auto-add is recorded (tracker line), never silent.
3. **Rules with no exceptions — and no bloat.** The studio's `.agents/rules`
   pattern (26 rules + a binding map + a pinning test) is the model: each
   rule names its reader and failure mode; rules nobody reads are deleted.
   Product repos get the invariant rules as enforceable rule files — verbatim
   intent, append-only, no untracked source, standard-stack default,
   reduced-motion, privacy-at-network-layer — wired into `lint`, not into
   prose nobody reads.
4. **The agent topology activates.** `docodego-reviewer` (fresh context,
   never the spec's own author) runs the grill in solo runs — killing grill
   theater with machinery that already exists. `docodego-tester` runs proofs.
   The presets are planted; the law must say when they are mandatory.
5. **VC completeness becomes checkable.** `check` warns on untracked
   source-like files; the verify path requires a clean `git status` or a
   recorded ignore.

6. **The visual evidence layer is an instrument, not a hope.** Founder: "the evidence layer is non-existent —
   no screenshots, responsive checks." The `docodego-visual-proof` skill (bundled; record spec 7's first
   payload) is the standard: headless Playwright — no visible pane, concurrent-safe, CI-capable — full-page
   screenshots at 375/768/1280, console-error and horizontal-overflow gates, a reduced-motion pass, and a
   transcript in the gate's own grammar. The launch gate consumes it; a screenshot proof names the committed
   script that produced it, or it is not a proof.

The one-sentence form: **docodego's next spec makes the record layer carry
the ship test — the gate grades the product, the skills carry the craft, the
rules leave no exceptions, and status shows which tier every product stands
on.**
