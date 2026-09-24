# Change to the current Git repository root.
gr() {
  local root
  root=$(git rev-parse --show-toplevel 2>/dev/null)
  if [ -z "$root" ]; then
    echo "gr: not inside a git repository" >&2
    return 1
  fi
  cd "$root" || return 1
}
