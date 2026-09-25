# ctx - list AI documents and context.
ctx() {
  local dirs list target editor d file_path modified created filename
  dirs=("$HOME/.claude/plans" "$HOME/.claude/analysis" "$HOME/Documents/research" "$HOME/Documents/analysis")

  for d in "${dirs[@]}"; do
    [ -d "$d" ] || mkdir -p "$d"
  done

  list=$(find "${dirs[@]}" -type f -print0 2>/dev/null |
    while IFS= read -r -d '' file_path; do
      if modified=$(stat -c %Y -- "$file_path" 2>/dev/null); then
        :
      else
        modified=$(stat -f %Sm -t %s "$file_path" 2>/dev/null) || modified=0
      fi
      if created=$(stat -c %W -- "$file_path" 2>/dev/null); then
        :
      else
        created=$(stat -f %B "$file_path" 2>/dev/null) || created=0
      fi
      [[ $modified =~ ^[0-9]+$ ]] || modified=0
      [[ $created =~ ^[0-9]+$ ]] || created=0
      filename=${file_path##*/}
      printf '%s\t%s\t%s\t%s\n' "$modified" "$created" "$filename" "$file_path"
    done |
    LC_ALL=C sort -t $'\t' -k1,1nr -k2,2nr -k3,3r -k4,4r |
    cut -f4-)
  if [ -z "$list" ]; then
    echo "ctx: no files under specified directories" >&2
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
