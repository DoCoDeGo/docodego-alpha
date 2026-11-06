# docodego init

> Plant the record layer, the law, agent presets, and skills — from the bundle this CLI carries.

## Usage

```
docodego init [--mode auto|review|guided|hands-on] [--profile <p>] [--all-skills] [--force]
```

## Contract

```
flags:
  --mode <m>      the oversight contract recorded in the manifest (auto | review | guided | hands-on)
  --profile <p>   which default skill set to install (default: product-team)
  --all-skills    install every bundled skill, ignoring the profile
  --force         fill in missing scaffold files; never overwrite existing content
  --json          emit docodego/init/v1 on stdout

exit codes: 0 planted · 1 record already exists (refusing; pass --force) · 2 usage

behavior:
  detects code state (new | growing | mature), plants the record tree from the
  bundle, writes the manifest, installs the profile's skills + agent presets,
  and writes .docodego/skills-lock.json recording what was installed.

example:
  docodego init --mode review --profile docs-only
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
