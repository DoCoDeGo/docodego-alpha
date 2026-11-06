# option 01 — agile / scrum (the Atlassian shape)

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

- `.standard/` — statutes, `manifest.json` (mode contract), `tech-radar.md`, `guidelines/pattern.md`.
- `04-govern/01-monitor/tracker.md` — appended, never rewritten.
- Units are folders inside streams: `spec.md`, `grill.md`, `score.md`, `proofs.md`, `delivered.md`.
- Epics and stories are document **types** (frontmatter `type:`), not folders: epics sit in 01-discover, stories in 02-refine; `status` rolls them up.
- Modes (auto / review / guided / hands-on) govern oversight, recorded in the manifest.
