# The shelf and the rules

*The craft a record ships with: the skill shelf (what bundles, what
waits for its trigger, what rides as opt-in packs) and the rules layer
(the invariant rules and the furniture doctrine). This is the law the
CLI enforces, stated so a stranger can check it.*

## The shelf

The decided shape: **27 bundled / 9 authored / packs opt-in.** The
bundled shelf rides the payload — init plants the profile's skills,
`upgrade` refreshes only what the lockfile names, and `docodego skill
add <name>` installs explicitly. The shelf stays small on purpose: the
market's failure mode is too many skills, not too few, and no agent
dispatch should see more than about eight at once.

The hard rule: **nothing bundles without a trigger-precise description.**
A skill's description names when to use it; a description that cannot
answer "when?" keeps the skill off the payload. Skills the payload
carries but no profile lists are **auto-add**: planted on their trigger
or an explicit add, never by default. Category packs (payments,
security, data, docs) stay opt-in — the shelf grows without payload
bloat.

## The rules layer

`.agents/rules/` holds the invariant rules, planted create-only by
`init` and carried by the upgrade plan. Every rule file carries three
fields, and the anti-bloat filter operates at authoring time: **a rule
that cannot fill all three does not get planted.**

- **reader** — who reads it (the agent, in which posture)
- **fails-when** — the failure it prevents, stated as an observable
- **enforced-by** — what holds it: a live check target
  (`check:stack-scan`, `check:untracked-scan`) or `practice:` with the
  named instrument that exercises it

The five invariants: the stack standard (below), no-untracked-source,
reduced-motion, privacy-at-network-layer, interruption-safety.

### The furniture doctrine

**A rule without a living enforcer is furniture** — and the repo can
tell the difference mechanically. `docodego check` validates every
planted rule: frontmatter present, enforced-by target live. A rule that
names nothing is listed as furniture (DG-C010), twice-quiet rules are
recommended for deletion, and **deletion is human-confirmed**: rules are
law, and auto-deleting law is an interruption-safety violation by
definition.

## The stack standard

Web product means **TypeScript end-to-end**, one package manager,
accepted framework tooling, and `tsc --noEmit` (strict) in the verify
path. Creativity belongs to the product's face; the stack defaults to
the industry's. Plain JavaScript beside a typed stack is the founding
failure (one product of the audited five typechecked; another shipped a
plain-JS front-end against a strict back-end with standing errors) —
`check` warns on it (DG-C008), as it warns on untracked source
(DG-C009). Both warnings cite the rule file they enforce.

## Conformance

Enforced today: the payload boundary names every shelf and rules file
(a named-but-missing file fails the bundle loudly); the skill index
carries versions and digests, audited by `skill list` against the
lockfile; auto-add skills list in no profile, so no default plant
carries them; `check` runs the rules floor and the two scans as
warnings with file evidence. Declared direction: the auto-add triggers
(armed at `new`/`score`/`deliver`, closed registry, removals respected
forever) and the thirteen craft-skill ports toward the decided 27 ride
a later pass.
