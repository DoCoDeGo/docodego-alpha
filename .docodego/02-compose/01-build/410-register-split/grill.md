## grill 2026-11-08

- round: self-grilled — the agent answered its own questions; the form of independence is not the fact of it

- GQ-1 asked: What does this unit do, in one sentence a stranger can verify?
  answered: marks the honesty law's rules into two registers (invariants: verbatim intent, append-only, records-before-claims, earned statuses, real proof paths, honored refusals; guidance: unit home, artifact layout, ADR pattern, phases' depth, score as checklist) in AGENTS.md and every planted record, with guidance deviations on one recorded line, per the founder's accepted split.
- GQ-2 asked: What evidence proves each acceptance criterion actually ran?
  answered: proofs/: conformance.txt (the teach fixture facts + the hop-mirror fact), bundle.txt (drift report naming the AGENTS.md minor bump, verify clean at 23), canon.txt (build sanity + doctor axes payload 23 / spec/ 1.2.0 / delivered 1.2.0), tracker-snip.txt (the plan-approval row).
- GQ-3 asked: What is the biggest threat to this unit landing — and its mitigation?
  answered: AGENTS.md is payload — a removed line flips the bump to MAJOR; mitigated by pure insertion (replace-before-anchor, nothing deleted), the drift report captured naming 'AGENTS.md rule line(s) added' minor, and the fixtures asserting byte-exact teaches.
- GQ-4 asked: What did you deliberately leave out of scope?
  answered: new deviation detectors (the compose-log machinery already reads the form), plan-approval as product law (founder limited it to this repo), moving rules between registers (founder's revision), EL-law amendments (the honesty law is taught in place; the log row is the amendment record).
- GQ-AC1 asked: Criterion: 'criterion one — AGENTS.md carries the two registers section with the accepted lists' wording and the one-line deviation form, inserted between the honesty law and the commands, no lines removed.' — how is this verified end-to-end?
  answered: diff AGENTS.md before/after: insertions only; the section text carries each accepted list item verbatim-shaped; grep proves the section sits between the honesty law and the commands heading.
- GQ-AC2 asked: Criterion: 'criterion two — the teach migration holds the full contract on the conformance fixture: shipped-v22 bytes gain the section, a second run is a no-op, a customized AGENTS.md is kept untouched with the refreshed scaffold riding as .new.' — how is this verified end-to-end?
  answered: the conformance teach fixture: shipped-v22 AGENTS.md bytes + teach -> section present; second run -> 'already present', bytes unchanged; customized copy -> 'customized' note, body untouched; captured in conformance.txt.
- GQ-AC3 asked: Criterion: 'criterion three — the version pair moves together and mirrors: registry has 22→23, the transition table carries v22→v23 hop-for-hop, the record manifest says 23, the bundle compiles at declared 23 with the bump guard satisfied, conformance green.' — how is this verified end-to-end?
  answered: conformance.txt carries the hop-mirror fact (table v22->v23 == registry 22->23) and suite green; bundle.txt shows declared specVersion 23 satisfying the guard; manifest.json recordVersion 23 shown in canon.txt.
- GQ-AC4 asked: Criterion: 'criterion four — the spec tree records the addition: the log's 1.2.0 row describes the registers and the deviation form, SPEC.md says 1.2.0, canon build passes version sanity, doctor green at the deliverable HEAD with the axes side by side (payload 23 · spec/ 1.2.0 · delivered 1.2.0).' — how is this verified end-to-end?
  answered: canon.txt: build's version sanity line + doctor's axes (payload 23 · cli · spec/ 1.2.0 · delivered 1.2.0) captured green at the deliverable HEAD; the log row quoted in the record commit.
- GQ-AC5 asked: Criterion: 'criterion five — the practice is live: the tracker carries this unit's plan-approval row (auto, bounded, rationale, repo-only) and the boundary proves untouched-but-for-the-bump — bundle verify clean at 52 files, allowlist v2, spec 23.' — how is this verified end-to-end?
  answered: tracker-snip.txt shows the plan-approval row as appended; bundle.txt quotes '52 files, spec 23, allowlist v2' clean.

verdict: pass
