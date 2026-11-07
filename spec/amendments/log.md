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

*Changes to published words are rare, and each is recorded word for word.*
