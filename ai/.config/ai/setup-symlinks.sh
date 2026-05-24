#!/usr/bin/env bash
set -euo pipefail

RULES_DIR="/home/ansonlee/dotfiles/ai/.config/ai/rules"
LINK_DIR="/home/ansonlee/.config/opencode"

if [[ ! -d "$RULES_DIR" ]]; then
  echo "Error: rules directory not found: $RULES_DIR" >&2
  exit 1
fi

mkdir -p "$LINK_DIR"

for md_file in "$RULES_DIR"/*.md; do
  # Skip if no .md files match (glob returns literal pattern)
  [[ -e "$md_file" ]] || continue

  filename="$(basename "$md_file")"
  link_path="$LINK_DIR/$filename"

  ln -s "$md_file" "$link_path"
  echo "Created: $link_path -> $md_file"
done
