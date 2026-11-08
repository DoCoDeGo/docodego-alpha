# Amendments

*The System amends the way its record does: by appending.*

Each amendment is one file in this directory plus one entry in the log below. Law files are
never edited in place: an amendment adds the new version and marks the old one
`amended-in` or `withdrawn-in`, keeping its anchor forever. Every amendment names who
decided, carries the founder's sign-off (via `docodego sign`), and declares the previous
version's hash so `canon verify` can re-derive the chain (EL-20).

Procedure: [meta/how-to-amend.md](../meta/how-to-amend.md)

## The log

| Version | Date | What changed and why | Words before → after |
|---|---|---|---|
| 1.0.0 | 2026-11-08 | First version: sixteen statutes (published words, † completions, honest limits), fifteen engine laws (EL-17…EL-31), the loop, the trail, gates and severity, the enforceability map, terminology, how-to-amend, the document standard. Accepted by the founder per ADR 0012 (name: the DoCoDeGo System; canon: this repo; placement: top-level `spec/` + the canon CLI). | — (first) |
| 1.0.1 | 2026-11-08 | Enforced-by bindings aligned with what actually enforces each law (found by `canon coverage`'s first run): EL-23 gains its `check` lead; EL-25 and EL-29 move their lead from `lint` to `direction` — lint does not check provenance or size thresholds today, and saying otherwise was the gap the map already recorded. Frontmatter bindings only; no normative text touched, no duty added or removed. | — (bindings only) |
| 1.0.2 | 2026-11-08 | The ICS ruling recorded: asked to pick the four-dimension or five-pass form, the founder commissioned a redesign instead ("ICS needs a significant uplift and redesign… willing to add more dimensions if they make sense responsibly" — recorded verbatim in the ruling note and in the record layer's cycle 2). The four-dimension form stays normative until a redesign is accepted. Status note; no duty change. | — (note only) |
| 1.0.3 | 2026-11-08 | The version transition table joins the record movement (`record/version-transition.md`): the three version axes stated as law (recordVersion — the only migration axis; the CLI version; the spec-tree version), the registry law (contiguous, never consolidated), skip-distance (forward-only, every hop), and the shipped hop table v0→v13 bound hop-for-hop to the engine's registry by the conformance suite. The trail links to it. Documentation of law the engine already enforces; no duty added, no law text changed. | — (new record doc) |
| 1.0.4 | 2026-11-08 | The shelf and the rules join the record movement (`record/the-shelf.md`): the shelf policy (27 bundled / 9 authored / packs opt-in; nothing bundles without a trigger-precise description; the ~8-skill dispatch floor), the rules layer (the three-field rule shape, the furniture doctrine — a rule without a living enforcer is furniture, deletion human-confirmed), and the stack standard (web ⇒ TypeScript end-to-end, typecheck in the verify path). Nine authored skills and the five invariant rules ship in the CLI payload; `check` gains the rules floor and the stack/untracked scans. The trail links to it. | — (new record doc) |
| 1.0.5 | 2026-11-08 | The governance pass enters the gates law (`conformance/gates-and-severity.md`): `check` grades the record as a whole — the ledgers against the units (DG-C011/C012 errors for a delivered unit with no tracker row or delivery-log row, DG-C013/C014 warnings for a ghost row or a status contradicted by the latest grill verdict) — with audit's GOV-003 reading the same detector. The law the ledgers must agree with the units, stated where the gates live. | — (law section added) |
| 1.0.6 | 2026-11-08 | The shipped hop table extends: v14→v15 — the planted prose sweep (dead references fixed at their sources; the visual-proof driver named at its planted path, the skill bumped to 1.0.1; the sweep itself a conformance gate reading every planted row every run). Table row only; no law text changed. | — (table row added) |
| 1.0.7 | 2026-11-08 | The gate-rows law enters the honesty law (`AGENTS.md`): the tracker and delivery-log lines a gate writes ride the unit's own commit — a delivered unit whose rows sit uncommitted is a broken record. Duty wording; the governance grades (DG-C011/C012) stay the enforcement. | — (planted scaffold line, taught in place) |
| 1.0.8 | 2026-11-08 | The event order and the repair rule enter the loop paragraph (`AGENTS.md`): a unit's status events run new → grill → score → deliver, and a refused gate records the attempt in the tracker and re-enters at the refused step — the record repaired forward, never rewritten. Duty wording; DG-U031 and the deliver gates stay the enforcement. | — (planted scaffold line, taught in place) |
| 1.0.9 | 2026-11-08 | Research gains a legal home (`01-discover/research/`): the checker exempts it as a first-class non-unit — grounding notes never impersonate units to be legal again — and the stream README names it. The exemption is the law; the README line rides birth copies. | — (checker exemption + README line) |
| 1.0.10 | 2026-11-08 | The record's machine artifacts leave git: `.docodego/.gitignore` joins the payload boundary — var/ as the record's scratch home, *.new as the upgrade plan's conflict copies, the file's comments teaching both. Boundary law; no duty wording changed. | — (boundary row, allowlist v2) |
| 1.0.11 | 2026-11-08 | The compose room gets its gate-written artifact (`02-compose/compose-log.md`): one row per delivered unit — date, unit, the delivered spec hash, the declared spec-vs-built deviations — appended by the deliver gate; readers named in the header (the handoff agent, the build-honesty auditor); anchored at init so an empty compose room truthfully means "not there yet". Engine-owned like the delivery log; no boundary row. | — (engine-owned template + gate append) |

*Changes to published words are rare, and each is recorded word for word.*
