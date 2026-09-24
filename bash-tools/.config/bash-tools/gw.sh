# Select a Git worktree, or list available worktrees.
gw() {
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "gw: not inside a git repository" >&2
    return 1
  fi
  local list target
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
  if [ "${1:-}" = "--list" ]; then printf '%s\n' "$list"; return 0; fi
  if ! command -v fzf >/dev/null 2>&1; then
    echo "gw: fzf not installed (choco install fzf)" >&2
    return 1
  fi
  tab=$(printf '\t')
  target=$(printf '%s\n' "$list" | fzf --select-1 --exit-0 --reverse --height=40% \
    --delimiter="$tab" --with-nth=1,2 --prompt='worktree> ' --query="${1:-}" | cut -f2)
  [ -n "$target" ] || return 1
  cd "$target" || return 1
}
