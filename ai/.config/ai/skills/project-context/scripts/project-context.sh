#!/usr/bin/env bash
set -Eeuo pipefail
export GIT_OPTIONAL_LOCKS=0

fail() {
  printf 'Project context: %s\n' "$1" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || fail 'git is not installed; repository details unavailable.'

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || fail 'not inside a Git repository.'
cd -- "$repo_root"

printf 'Project context\n'
printf 'Repository: %s\n' "$repo_root"

if branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null); then
  printf 'Branch: %s\n' "$branch"
elif branch=$(git rev-parse --short HEAD 2>/dev/null); then
  printf 'Branch: detached HEAD (%s)\n' "$branch"
else
  printf 'Branch: unavailable (could not inspect HEAD)\n'
fi

if status=$(git status --short --branch 2>&1); then
  IFS= read -r status_header <<< "$status" || true
  printf 'Git status: %s\n' "${status_header:-clean; no status details}"
  status_entries=${status#*$'\n'}
  if [[ "$status" == *$'\n'* && -n "$status_entries" ]]; then
    printf '%s\n' "$status_entries" | awk '
      BEGIN { added = modified = deleted = untracked = other = 0 }
      /^\?\?/ { untracked++; next }
      {
        code = substr($0, 1, 2)
        if (code ~ /A/) added++
        if (code ~ /M/) modified++
        if (code ~ /D/) deleted++
        if (code !~ /[AMD ]/) other++
      }
      END {
        printf "  Changes: %d added, %d modified, %d deleted, %d untracked", added, modified, deleted, untracked
        if (other) printf ", %d other", other
        printf "\n"
      }
    '
  else
    printf '  Changes: none\n'
  fi
else
  printf 'Git status: unavailable (%.240s)\n' "${status//$'\n'/; }"
fi

if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null); then
  if counts=$(git rev-list --left-right --count "HEAD...$upstream" 2>/dev/null); then
    read -r ahead behind <<< "$counts"
    printf 'Upstream: %s; %s ahead, %s behind (local tracking data)\n' "$upstream" "$ahead" "$behind"
  else
    printf 'Upstream: %s; ahead/behind unavailable\n' "$upstream"
  fi
else
  printf 'Upstream: none configured; ahead/behind unavailable\n'
fi

if commit=$(git log -1 --format='%h %s (%cs)' 2>/dev/null); then
  if [[ -n "$commit" ]]; then
    printf 'Latest commit: %.240s\n' "$commit"
  else
    printf 'Latest commit: unavailable (no commits yet)\n'
  fi
else
  printf 'Latest commit: unavailable (git log failed)\n'
fi

printf 'Project files (up to 12, within 3 levels):\n'
project_files=$(find . -maxdepth 3 -type f \
  \( -name 'README*' -o -name 'AGENTS.md' -o -name '.cursorrules' -o \
     -name 'Makefile' -o -name 'justfile' -o -name 'Taskfile.yml' -o \
     -name 'package.json' -o -name 'pyproject.toml' -o -name 'Cargo.toml' -o \
     -name 'go.mod' -o -name 'pom.xml' -o -name 'flake.nix' -o \
     -name 'shell.nix' -o -name 'default.nix' \) \
  -not -path './.git/*' -print 2>/dev/null | sort | awk 'NR <= 12 { print "  " $0 } END { if (NR == 0) print "  none found"; else if (NR > 12) print "  …more files omitted" }')
printf '%s\n' "$project_files"

if command -v gh >/dev/null 2>&1; then
  if prs=$(gh pr list --state open --limit 20 --json number,title,state,isDraft,url \
    --template '{{range .}}  #{{.number}} [{{if .isDraft}}draft{{else}}{{.state}}{{end}}] {{.title}} — {{.url}}{{"\n"}}{{else}}  none{{"\n"}}{{end}}' 2>&1); then
    printf 'Open/draft PRs (up to 20; additional PRs may be omitted):\n%s' "$prs"
  else
    printf 'Open/draft PRs: unavailable (gh query failed: %.240s)\n' "${prs//$'\n'/; }"
  fi
else
  printf 'Open/draft PRs: unavailable (gh is not installed)\n'
fi
