# proofs — 720-founder-communication-rules

- `apps/cli/src/bundled/payload.ts` — the payload carries founder-communication.md (reader, fails-when, enforced-by + the both-ends wording) and the rules map names it (pinned in a4)
- `.agents/rules/founder-communication.md` — the rule's own text: the five laws, plain English, the acronyms law, the both-ends audience law
- `apps/cli/src/versioning/migrations.ts` — the v32-to-v33 entry (four notes) + teachFounderRules: six rules named, the init bullet teaches the birth (the 710 deferral), the second-use section carries the voice law, the map row — all anchor-matched
- `canon/record/version-transition.md` — the v33 mirror row, appended from the registry itself (word for word)
- `apps/cli/bundle.manifest.json` — the rule file named into the boundary (the allowlist inversion: an unnamed file stays private and never embeds — the first red run taught this: the payload silently skipped the unnamed rule)
- `pnpm -C apps/cli run -s conformance` — "conformance: all 518 checks green" (the rules layer plants seven files; the sweep reads 53 boundary rows)
- `pnpm bundle:verify` — "bundle verify: clean — 53 files, spec 33"
- `pnpm run docs` + `pnpm run docs:verify` — fresh · `pnpm typecheck` exit 0 · `docodego check` exit 0

## failure-to-cause

- three red runs: (1) the new rule file was not named in the bundle allowlist — the boundary law excluded it silently and the payload carried everything except the law this unit exists to plant; (2) the 690 summary pin still named v32 — the fixture walks to the bundled spec, now 33; (3) two stale count pins (52 boundary rows, "five invariant rules") — counts move when the tree grows, and the pins say so out loud.
- the drift gate failed pre-commit by design (the delivered-baseline rule) — the hop commits, then the battery verifies against HEAD.
