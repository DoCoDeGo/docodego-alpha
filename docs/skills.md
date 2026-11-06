# Skills and profiles

The craft — the method's skills — ships inside the CLI and plants into
your repository at `init`. This page is the mechanism; the skills
themselves are markdown files with frontmatter, readable without any tool.

## Where skills live

- **Bundled:** `.agents/skills/` in the docodego repository. At build time
  the bundler generates the skill index: name, description, version, and a
  sha256 digest over every file of the skill folder.
- **Installed:** `.agents/skills/` in *your* repository, plus one entry per
  install in `.docodego/skills-lock.json` — name, version, source
  (`bundled` or a git URL), and the digest recorded at install time.

The lockfile is committed, so installs are reviewable and diffable. It is
the supply-chain audit trail: `docodego skill list` re-verifies every
digest on every run, and `DG-K001` fires when installed bytes differ from
what was recorded.

## Profiles

`init` installs a profile's default set (or everything with
`--all-skills`):

| profile | intent |
|---|---|
| `minimal` | the record and its law, nothing else |
| `docs-only` | documentation work: the method's core skills |
| `product-team` *(default)* | the full working set for a product team |
| `platform-team` | infrastructure-leaning additions |
| `research` | the finding/grounding-heavy set |

Profiles are data, curated in the bundle; `docodego skill list` shows the
installed set and the index with each skill's `defaultFor` profiles.

## Adding and removing

```sh
docodego skill list                     # what is installed, digests verified
docodego skill add docodego-research    # install a bundled skill (offline)
docodego skill remove docodego-research # remove it and its lockfile entry
```

Manage skills only through the CLI — hand-editing the lockfile breaks the
audit trail (`DG-K002`), and hand-copying folders skips the digest
(`DG-K001` will catch it).

### Remote sources are opt-in, validated, and inert

```sh
docodego skill add <name> --from https://github.com/org/skills
```

Bundled first-party skills install offline. Pulling from a remote git
repository is an explicit act — and a bounded one:

- **Names are strict.** Letters, digits, `.`, `_`, `-` only — no paths, no
  traversal (`DG-U074`). A remote whose `SKILL.md` declares a traversing
  name is refused, and the filesystem layer re-checks every install path
  stays inside `.agents/skills/`.
- **Sources are named transports only.** `https://`, `ssh://`, `git://`,
  `file://` (`DG-U075`). Bare paths, `ext::`/`fd::` command transports, and
  option-shaped strings are refused before git runs — the CLI does not
  inherit the user's git-protocol config.
- **Symlinks are skipped, never followed** — a cloned tree can only offer
  what it actually contains.
- **The lockfile stays metadata-only** — name, version, source, digest.
  File contents live in the installed folder; the digest attests them.
- **The content is inert text.** Nothing in a skill is executed, evaluated,
  or templated into a command; the only child process a remote add spawns
  is `git clone` itself, with fixed arguments. The documented trade stands:
  a skill's text is prompt material — verify what you pulled. The digest
  proves the *bytes* stayed what was recorded, not that the upstream was
  trustworthy.

## The usage law

Load the one skill the work calls for; load nothing speculatively. That
law lives in the planted `AGENTS.md` so every agent in the repository
inherits it.
