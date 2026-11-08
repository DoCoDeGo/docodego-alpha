---
name: 070-canon-publish
type: unit
status: delivered
---

# 070-canon-publish

## intent

`canon publish --site <dir>` turns the delivered artifacts into a
version-directory site: one folder per delivered semver holding the
stamped SPEC.md, the law index, and the manifest, a verification badge
beside them (version, structure hash, law count, and the recomputation a
reader can run), `llms.txt` at the root listing every version for machine
readers, and `current.txt` naming the delivered version and its hash. The
site accumulates — each publish adds the current version's directory if
absent and regenerates the root files from the directories present. It
refuses to publish a tree ahead of its dist (build first), a downgrade,
or a same-version republish with a different structure — what is published
is what was delivered, addressed by content. No PDF, no search gimmicks:
markdown and JSON are the payload, the badge is text, and the machines
that read specs are the audience (ADR 0012).

## scope

In: the `publish` command, the site layout (v/<semver>/, llms.txt,
current.txt, verification.txt), the refusal set (no dist, tree ahead,
downgrade, same-version-different-structure), idempotent regeneration of
the root files. Out: writing dist artifacts (build's job), any HTTP
serving or hosting (the site is files; serving is someone else's unit),
PDF/search/rss extras, doctor's mirror checks (already a command).

## acceptance

- AC1 — publishing the current dist (1.0.2) into a fresh site dir exits 0
  and lays out: `v/1.0.2/{SPEC.md, law-index.json, manifest.json,
  verification.txt}`, root `llms.txt` and `current.txt` naming 1.0.2 with
  the structure hash prefix.
- AC2 — idempotence: a second publish of the same version-and-structure
  exits 0 and changes nothing (byte-identical files — verified by hash
  before/after); the root files regenerate from the version directories
  present, so deleting them rebuilds correctly.
- AC3 — refusals, each exit 1 and taught: no manifest at dist (SP-S001,
  build first); tree ahead of dist (SP-S002, rebuild); downgrade below
  the site's current (SP-S003); same version already published with a
  different structure (SP-S004).
- AC4 — no regression on the real tree: lint, verify, coverage, diff,
  build, doctor's non-mirror checks all exit 0; typecheck clean; zero
  non-node imports; `--json` envelope `docodego-spec/publish/v1`.

## threats

- the site becoming a product surface (branding, analytics, search).
  Mitigation: out-of-scope recorded here; the layout is four file kinds,
  all plain text — nothing to decorate.
- published files drifting from what was delivered (post-publish edits).
  Mitigation: every published directory carries its manifest copy and the
  badge restates the structure hash; SP-S004 refuses a silent republish.
- downgrade or rewrite of public versions. Mitigation: SP-S003 refuses a
  downgrade outright; version directories are never touched once written
  (only added), the root files are the only regenerated surface.
