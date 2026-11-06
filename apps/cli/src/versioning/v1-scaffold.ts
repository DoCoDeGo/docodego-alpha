/** Historical: the exact record scaffold v1 planted (formerly
 * src/record/template-record.ts). Kept verbatim so the v0->v1 migration
 * reproduces what v1's init planted, byte for byte. Never edited — it is
 * the record of what v1 shipped. */
export const V1_README = `# option 01 — agile / scrum (the Atlassian shape)

**The frame:** the loop most product teams already run — discover, refine, plan, build, demo, retro.
**Sources:** Atlassian, "A guide to agile ceremonies" — sprint planning, daily scrum, sprint review, sprint retrospective, plus backlog refinement; Atlassian agile stages (plan → build → review → release → retrospective).
**Who it speaks to:** product owners first — planning, demo, acceptance, retro are *their* ceremonies. Devs recognise build/integrate. Management reads plan → demo → retro.
**Where review lives here:** twice by design — the sprint review (01-demo) and the retrospective (03-retrospect) — plus peer review inside 01-build. Review is a verb in every stream's contract, never a folder.

| stage | streams |
|---|---|
| 01-document | 01-discover · 02-refine · 03-validate · 04-plan |
| 02-compose | 01-build · 02-integrate · 03-enhance · 04-maintain |
| 03-demonstrate | 01-demo · 02-accept · 03-release · 04-deploy |
| 04-govern | 01-monitor · 02-measure · 03-retrospect · 04-improve |

## Improvements in succession (v7)

- \`.standard/\` — statutes, \`manifest.json\` (mode contract), \`tech-radar.md\`, \`guidelines/pattern.md\`.
- \`04-govern/01-monitor/tracker.md\` — appended, never rewritten.
- Units are folders inside streams: \`spec.md\`, \`grill.md\`, \`score.md\`, \`proofs.md\`, \`delivered.md\`.
- Epics and stories are document **types** (frontmatter \`type:\`), not folders: epics sit in 01-discover, stories in 02-refine; \`status\` rolls them up.
- Modes (auto / review / guided / hands-on) govern oversight, recorded in the manifest.
`;

export const V1_STATUTES = `# the sixteen statutes

Source: docodego.com, "Sixteen principles. Four pillars. One discipline."
Recorded verbatim, 2026-11-06. The site's own enforcement claim: each
principle is violable in a specific way; each violation is observable.

## DO — document · the Author (statutes 1–4)
1. Intent Is Absolute — binds 01-discover, 03-validate
2. The Spec Is the Contract — binds 04-spec, 03-validate
3. Quality Through Context — binds 02-research
4. Simplicity of Spec — binds 04-spec

## CO — compose · the Architect (statutes 5–8)
5. Code Is Regenerable — binds 02-develop, 04-maintain
6. Resilience Over Robustness — binds 03-enhance, 04-maintain
7. Architecture Before Generation — binds 01-grill
8. Comprehension Is Non-Negotiable — binds 01-grill

## DE — demonstrate · the Gatekeeper (statutes 9–12)
9. Zero-Latency Evolution — binds 03-deploy
10. Feedback Closes the Loop — binds 01-demo
11. Observability Is Non-Negotiable — binds 04-scale, 02-e2e
12. Atomic Delivery — binds 02-e2e, 03-deploy

## GO — govern · the Governor (statutes 13–16)
13. The Human as Governor — binds 03-decide, 04-handover
14. Transparent Reasoning — binds 02-retrospect, 03-decide
15. Security by Design — binds 01-observe (and the grill's threat floor)
16. Alignment Before Demonstration — binds 01-observe, 03-decide

Companion doctrine, verbatim from the site: the DoCoDeGo Axiom — "Intent is
the primary artefact. Implementation is a compiled derivative. Governance is
earned through the loop." IRAF — Intent → Reasoning → Action → Feedback —
replaces the sprint and the release.
`;

export const V1_TECH_RADAR = `# Tech radar — maturity rings

Rings: bleeding-edge (new; may churn; needs an exit story) · stable (proven; default) · conservative (boring; proven for a decade) · hold (no new use).
Every entry carries ring + owner + review date; lint flags expired entries at init and new-unit time.

| technique | ring | owner | review date |
|---|---|---|---|
| compiler-passes (pattern) | stable | founder | 2027-02-06 |
| TypeScript strict | stable | founder | 2027-02-06 |
| Node fs builtins | stable | founder | 2027-02-06 |
| markdown + frontmatter record | stable | founder | 2027-02-06 |
`;

export const V1_TRACKER = `# Tracker

Appended, never rewritten. Every claim carries a path to its evidence.

| date | unit | event | evidence |
|---|---|---|---|
`;
