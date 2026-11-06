/** completions — shell completion scripts for bash, zsh, and fish, generated
 * from the same COMMAND_HELP registry that powers `--help`, so the scripts and
 * the contracts cannot drift. The command words are derived AT CALL TIME from
 * the registry's keys (sorted) and each command's flags are parsed
 * conservatively off its usage line — a new command flows into every script
 * without editing this file. Static text, Node builtins only. */
import { COMMAND_HELP } from "./help.ts";

export const COMPLETION_SHELLS = ["bash", "zsh", "fish"] as const;

/** The flags every command admits; `explain` additionally offers --list. */
const GLOBAL_FLAGS = ["--json", "--version", "--help"];

/** The flags a command admits, read off its usage line: `--word` tokens only,
 * with bracket sugar, `<...>` placeholders, and `|` alternatives stripped. */
function flagsOf(cmd: string): string[] {
  const set = new Set<string>(GLOBAL_FLAGS);
  if (cmd === "explain") set.add("--list");
  for (const tok of (COMMAND_HELP[cmd]?.usage ?? "").split(/\s+/)) {
    const m = /^\[?(--[a-z0-9][a-z0-9-]*)/i.exec(tok);
    const word = m?.[1];
    if (word !== undefined) set.add(word);
  }
  return [...set].sort();
}

function bashScript(commands: string[]): string {
  const arms = commands.map((c) => `    ${c}) flags="${flagsOf(c).join(" ")}" ;;`).join("\n");
  return `# docodego — bash completion
# generated from the registry that powers --help — command names and flags are
# derived at generation time, so regenerate after the CLI changes.
#
# install — add this line to your ~/.bashrc:
#   source <(docodego completions bash)

_docodego() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  # word 1: the command; after it: that command's flags
  if [ "\${COMP_CWORD}" -eq 1 ]; then
    COMPREPLY=($(compgen -W "${commands.join(" ")}" -- "$cur"))
    return 0
  fi
  local flags
  case "\${COMP_WORDS[1]}" in
${arms}
    *) flags="${GLOBAL_FLAGS.join(" ")}" ;;
  esac
  COMPREPLY=($(compgen -W "$flags" -- "$cur"))
  return 0
}
complete -F _docodego docodego
`;
}

function zshScript(commands: string[]): string {
  const arms = commands.map((c) => `    ${c}) flags=(${flagsOf(c).join(" ")}) ;;`).join("\n");
  return `#compdef docodego
# docodego — zsh completion
# generated from the registry that powers --help — command names and flags are
# derived at generation time, so regenerate after the CLI changes.
#
# install:
#   mkdir -p ~/.zfunc
#   docodego completions zsh > ~/.zfunc/_docodego
# then in ~/.zshrc, before compinit runs:
#   fpath=(~/.zfunc $fpath)
# and restart the shell.

_docodego() {
  local -a commands flags
  commands=(${commands.join(" ")})
  if (( CURRENT == 2 )); then
    _describe -t commands 'docodego command' commands
    return
  fi
  case "$words[2]" in
${arms}
    *) flags=(${GLOBAL_FLAGS.join(" ")}) ;;
  esac
  _describe -t flags 'flag' flags
}

_docodego "$@"
`;
}

function fishScript(commands: string[]): string {
  const perCommand = commands
    .map((c) => `complete -c docodego -n "__fish_seen_subcommand_from ${c}" ${flagsOf(c).map((f) => `-l ${f.slice(2)}`).join(" ")}`)
    .join("\n");
  return `# docodego — fish completion
# generated from the registry that powers --help — command names and flags are
# derived at generation time, so regenerate after the CLI changes.
#
# install:
#   mkdir -p ~/.config/fish/completions
#   docodego completions fish > ~/.config/fish/completions/docodego.fish
# fish loads it on the next prompt.

complete -c docodego -n "__fish_use_subcommand" -a "${commands.join(" ")}"
complete -c docodego -n "__fish_use_subcommand" -l help -l version
${perCommand}
`;
}

/** The completion script for `bash` | `zsh` | `fish`; undefined otherwise. */
export function completionScript(shell: string): string | undefined {
  if (!(COMPLETION_SHELLS as readonly string[]).includes(shell)) return undefined;
  // derived at call time — the registry is the single source, never a copy
  const commands = Object.keys(COMMAND_HELP).sort();
  if (shell === "bash") return bashScript(commands);
  if (shell === "zsh") return zshScript(commands);
  return fishScript(commands);
}
