# Shared shell tools: aliases and functions sourced by both
# bash/.bashrc (Windows Git Bash) and zsh/.config/zsh/config (Linux/macOS).
# Stowed to ~/.config/bash-tools/tools.sh by install.sh.

# Alias
alias cc='claude'
alias k='kubectl'
alias vim='nvim'
alias v='nvim'

# Navigation helpers. These are functions, not aliases, because `cd` has to run
# in the calling shell -- an external script's cd dies with its child process.
# `gw`/`cn` take an optional fzf query; a unique match is taken without
# prompting. `--list` prints the candidates and exits (used by the tests).

# gr - jump to the git root of the current directory.
gr() {
  local root
  root=$(git rev-parse --show-toplevel 2>/dev/null)
  if [ -z "$root" ]; then
    echo "gr: not inside a git repository" >&2
    return 1
  fi
  cd "$root" || return 1
}

# gw - pick a worktree of the current repo and cd into it.
gw() {
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "gw: not inside a git repository" >&2
    return 1
  fi
  local list target
  # --porcelain, not the default format: worktree paths may contain spaces.
  list=$(git worktree list --porcelain | awk '
    /^worktree /  { path=substr($0,10); branch="(detached)" }
    /^bare$/      { branch="(bare)" }
    /^branch /    { branch=substr($0,8); sub(/^refs\/heads\//,"",branch) }
    /^$/          { if (path!="") { printf "%s\t%s\n", branch, path; path="" } }
    END           { if (path!="") printf "%s\t%s\n", branch, path }')
  if [ -z "$list" ]; then
    echo "gw: no worktrees found" >&2
    return 1
  fi
  if [ "$1" = "--list" ]; then printf '%s\n' "$list"; return 0; fi
  if ! command -v fzf >/dev/null 2>&1; then
    echo "gw: fzf not installed (choco install fzf)" >&2
    return 1
  fi
  target=$(printf '%s\n' "$list" | fzf --select-1 --exit-0 --reverse --height=40% \
    --delimiter=$'\t' --with-nth=1,2 --prompt='worktree> ' --query="${1:-}" | cut -f2)
  [ -n "$target" ] || return 1
  cd "$target" || return 1
}

# cn - pick a Claude plan or analysis doc and open it in VS Code.
cn() {
  local dirs d list target
  dirs=("$HOME/.claude/plans" "$HOME/.claude/analysis")
  for d in "${dirs[@]}"; do mkdir -p "$d"; done
  list=$(for d in "${dirs[@]}"; do find "$d" -maxdepth 1 -type f 2>/dev/null; done)
  if [ -z "$list" ]; then
    echo "cn: no files under ~/.claude/plans or ~/.claude/analysis" >&2
    return 1
  fi
  if [ "$1" = "--list" ]; then printf '%s\n' "$list"; return 0; fi
  if ! command -v fzf >/dev/null 2>&1; then
    echo "cn: fzf not installed (choco install fzf)" >&2
    return 1
  fi
  target=$(printf '%s\n' "$list" | fzf --select-1 --exit-0 --reverse --height=60% \
    --prompt='claude doc> ' --query="${1:-}" --preview='head -60 {}')
  [ -n "$target" ] || return 1
  # --reuse-window targets the VS Code window this terminal is running in.
  code --reuse-window "$target"
}

# Lazygit - 'q' to quit at selected directory, 'shift-q' to quit normally
lg()
{
    export LAZYGIT_NEW_DIR_FILE=~/.lazygit/newdir

    lazygit "$@"

    if [ -f $LAZYGIT_NEW_DIR_FILE ]; then
            cd "$(cat $LAZYGIT_NEW_DIR_FILE)"
            rm -f $LAZYGIT_NEW_DIR_FILE > /dev/null
    fi
}
