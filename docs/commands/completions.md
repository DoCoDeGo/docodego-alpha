# docodego completions

> Shell completion scripts for bash, zsh, and fish — generated from this registry.

## Usage

```
docodego completions <bash|zsh|fish>
```

## Contract

```
prints the completion script for one shell, generated from the same
registry that powers --help, so the scripts cannot drift from the contracts.
each script opens with its own install instructions.

install:
  bash   add to ~/.bashrc:         source <(docodego completions bash)
  zsh    before compinit:          docodego completions zsh > ~/.zfunc/_docodego
                                   (and fpath=(~/.zfunc $fpath) in ~/.zshrc)
  fish                              docodego completions fish > ~/.config/fish/completions/docodego.fish

exit codes: 0 script on stdout · 2 unknown shell

example:
  docodego completions zsh > ~/.zfunc/_docodego
```

---

Generated from the CLI's help registry (`apps/cli/src/cli/help.ts`) by
`apps/cli/scripts/gen-docs.ts` — run `npm run docs` after changing help
text. Do not edit by hand; this page is the CLI's contract, verbatim.
