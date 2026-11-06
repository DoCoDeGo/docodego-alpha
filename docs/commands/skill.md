# docodego skill

> The installed craft, audited: every skill recorded in skills-lock.json with its digest.

## Usage

```
docodego skill list [--json] | skill add <name> [--from <git-url>] [--force] | skill remove <name>
```

## Contract

```
subcommands:
  list               installed skills + the index + profiles; digests re-verified
  add <name>         install a bundled skill (offline); --from <git-url> pulls a
                     remote skill (opt-in, ref-pinned, digest recorded)
  remove <name>      remove an installed skill and its lockfile entry

the lockfile (.docodego/skills-lock.json) records name, version, source and
sha256 integrity for every install — the audit trail for the craft.

exit codes: 0 · 1 integrity mismatch / nothing to remove · 2 usage

example:
  docodego skill add docodego-research
  docodego skill list --json
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
