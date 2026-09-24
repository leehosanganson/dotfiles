# ctx - list AI documents and context.
ctx() {
  local dirs list target editor d
  dirs=("$HOME/.claude/plans" "$HOME/.claude/analysis")

  for d in "${dirs[@]}"; do
    [ -d "$d" ] || mkdir -p "$d"
  done

  list=$(find "${dirs[@]}" -maxdepth 1 -type f 2>/dev/null)
  if [ -z "$list" ]; then
    echo "cn: no files under specified directories" >&2
    return 1
  fi

  if [ "${1:-}" = "--list" ]; then
    printf '%s\n' "$list"
    return 0
  fi

  if ! command -v fzf >/dev/null 2>&1; then
    echo "cn: fzf not installed (choco install fzf)" >&2
    return 1
  fi

  target=$(printf '%s\n' "$list" | fzf --select-1 --exit-0 --reverse --height=60% \
    -d '[/\\\\]' \
    --with-nth='-2..-1' \
    --prompt='Context> ' \
    --query="${1:-}" \
    --preview='cat {}' \
    --preview-window='right:70%:wrap')

  [ -n "$target" ] || return 1

  if [ "${EDITOR:-}" != "${EDITOR#*code}" ]; then
    editor="code --reuse-window"
  else
    editor=${EDITOR:-vi}
  fi

  echo "Opening $target"
  $editor "$target"
}
