# ctx - list AI documents and context.
ctx() {
  local dirs list target editor d file_path modified created filename create_defaults=0
  dirs=("$HOME/.claude/plans" "$HOME/.claude/analysis" "$HOME/Documents/research" "$HOME/Documents/analysis")
  [ "$#" -eq 0 ] && create_defaults=1

  if [ "$#" -gt 0 ]; then
    if [ "$#" -gt 1 ]; then
      echo "Usage: ctx [directory]" >&2
      return 2
    fi
    dirs=("$1")
  fi

  for d in "${dirs[@]}"; do
    if [ "$create_defaults" -eq 1 ]; then
      [ -d "$d" ] || mkdir -p "$d"
    elif [ ! -d "$d" ]; then
      echo "ctx: directory does not exist: $d" >&2
      return 1
    fi
  done

  list=$(
    for d in "${dirs[@]}"; do
      if git -C "$d" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        while IFS= read -r -d '' file_path; do
          [ -f "$d/$file_path" ] && printf '%s\0' "$d/$file_path"
        done < <(git -C "$d" ls-files --cached --others --exclude-standard -z -- .)
      else
        find "$d" -type f -print0 2>/dev/null
      fi
    done |
    while IFS= read -r -d '' file_path; do
      case "$file_path" in
        *.[tT][xX][tT]|*.[mM][dD]|*.[hH][tT][mM][lL]) ;;
        *) continue ;;
      esac
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

  if ! command -v fzf >/dev/null 2>&1; then
    echo "cn: fzf not installed (choco install fzf)" >&2
    return 1
  fi

  target=$(printf '%s\n' "$list" | fzf --select-1 --exit-0 --reverse --height=60% \
    -d '[/\\\\]' \
    --with-nth='-2..-1' \
    --prompt='Context> ' \
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
