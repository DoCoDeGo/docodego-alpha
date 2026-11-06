# Security policy

## Supported versions

docodego is pre-1.0. Only the latest release receives security fixes;
upgrade to the newest `cli x.y.z` before reporting.

## Reporting a vulnerability

Open a private security advisory on this repository (Security → Advisories →
New), or contact the maintainers directly if you cannot. Please include:

- the CLI version (`docodego --version` prints `cli x.y.z · record spec N`)
- what you did, what you expected, what happened
- for record-integrity issues: the record tree structure (not its contents)

You will get an acknowledgment within a few days and a fix or a reasoned
 wontfix within a month.

## Posture — what this CLI trusts and why

**Zero runtime dependencies.** The shipped artifact imports Node builtins
only. The supply chain you accept is Node (or bun) plus this source tree —
there is no transitive dependency graph to audit.

**The bundle is hashed and drift-gated.** The CLI carries its record, law
file, and skills as a generated payload with per-file sha256 digests and a
structure hash over the record's shape. `bundle --verify` recomputes both and
fails the build on any drift; the bump guard refuses a bundle whose declared
record version does not cover its own content changes.

**Installed skills are pinned.** Every installed skill is recorded in
`.docodego/skills-lock.json` with its version, source, and sha256 digest
(over every file of the skill folder). `docodego skill list` re-verifies the
digests on every run; `DG-K001` fires when bytes differ from the record.
Install and remove only through `docodego skill add|remove` — the lockfile is
the audit trail.

**Remote skills are opt-in.** Bundled first-party skills install offline.
Pulling from a remote git source (`skill add --from <git-url>`) is an
explicit act, and the clone's digest is recorded at install time.

**No telemetry. Nothing phones home. Ever.** The CLI reads your record and
writes your record; it makes no network requests except an explicit
`skill add --from <git-url>`.

**Your content is never destroyed.** Upgrades are create-only: a scaffold
file you modified receives the new version side-by-side as `<file>.new`;
units, tracker entries, and dossier are never migrated or overwritten. The
CLI does not delete user files anywhere.

## Known limitations

- The markdown/frontmatter parser is hand-rolled and error-recovering:
  malformed record input yields positioned diagnostics (`DG-P*`), not
  crashes — but parser hardening (fuzzing, AST goldens) is tracked in the
  improvement backlog and not yet done.
- Record integrity is enforced at command time, not continuously; nothing
  stops concurrent writers. The intended deployment is one agent at a time
  per record (or a human, or a branch).
