#!/usr/bin/env bash
set -euo pipefail

# Directories
SRC_DIR="/home/ansonlee/dotfiles/ai/.config/ai"
LINK_DIR="/home/ansonlee/.config/opencode"

# Verify source directory exists
if [[ ! -d "$SRC_DIR" ]]; then
  echo "Error: Source directory not found: $SRC_DIR" >&2
  exit 1
fi

# Ensure LINK_DIR exists
mkdir -p "$LINK_DIR"

# Create fresh symlinks for each source subdirectory
for subdir in agents rules skills commands; do
  src_path="$SRC_DIR/$subdir"
  [[ -d "$src_path" ]] || continue
  link_path="$LINK_DIR/$subdir"
  [[ -e "$link_path" ]] && rm -rf "$link_path"
  ln -s "$src_path" "$link_path"
  echo "$src_path -> $link_path"
done
