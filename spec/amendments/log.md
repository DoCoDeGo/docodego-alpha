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

*Changes to published words are rare, and each is recorded word for word.*
