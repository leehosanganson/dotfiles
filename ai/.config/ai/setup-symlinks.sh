#!/usr/bin/env bash
set -euo pipefail

# Directories
SRC_DIR="/home/ansonlee/dotfiles/ai/.config/ai"
LINK_DIR="/home/ansonlee/.config/opencode"

# Arrays to track actions
declare -a REMOVE_ENTRIES=()
declare -a CREATE_ENTRIES=()
declare -a SKIP_ENTRIES=()

# Function to check if source directory exists
if [[ ! -d "$SRC_DIR" ]]; then
  echo "Error: Source directory not found: $SRC_DIR" >&2
  exit 1
fi

# Create target directory
mkdir -p "$LINK_DIR"

# Phase 1: Check for stale symlinks in target
for link in "$LINK_DIR"/*; do
  [[ -L "$link" ]] || continue
  
  # Get the target of the symlink
  target=$(readlink "$link")
  
  # Check if target exists
  if [[ ! -e "$target" ]]; then
    REMOVE_ENTRIES+=("$link|$target")
  fi
done

# Phase 2: Create symlinks for each source subdirectory
for subdir in agents rules skills; do
  src_path="$SRC_DIR/$subdir"
  
  # Skip if source doesn't exist
  [[ -d "$src_path" ]] || continue
  
  link_path="$LINK_DIR/$subdir"
  
  # Check if symlink already exists and points correctly
  if [[ -L "$link_path" ]]; then
    current_target=$(readlink "$link_path")
    if [[ "$current_target" == "$src_path" ]]; then
      SKIP_ENTRIES+=("$link_path|$src_path")
      continue
    fi
    # If it exists but points elsewhere, remove it first
    rm -f "$link_path"
  fi
  
  ln -s "$src_path" "$link_path"
  CREATE_ENTRIES+=("$link_path|$src_path")
done

# Phase 3: Display table of actions
printf "%-10s | %-50s | %-50s\n" "ACTION" "TARGET" "SOURCE"
echo "-----------|--------------------------------------------------|--------------------------------------------------"

for entry in "${REMOVE_ENTRIES[@]+"${REMOVE_ENTRIES[@]}"}"; do
  [[ -n "$entry" ]] || continue
  IFS='|' read -r target source <<< "$entry"
  printf "%-10s | %-50s | %-50s\n" "REMOVE" "$target" "$source"
done

for entry in "${SKIP_ENTRIES[@]+"${SKIP_ENTRIES[@]}"}"; do
  [[ -n "$entry" ]] || continue
  IFS='|' read -r target source <<< "$entry"
  printf "%-10s | %-50s | %-50s\n" "SKIP" "$target" "$source"
done

for entry in "${CREATE_ENTRIES[@]+"${CREATE_ENTRIES[@]}"}"; do
  [[ -n "$entry" ]] || continue
  IFS='|' read -r target source <<< "$entry"
  printf "%-10s | %-50s | %-50s\n" "CREATE" "$target" "$source"
done

# Phase 4: Actually perform the operations (remove stale symlinks)
for entry in "${REMOVE_ENTRIES[@]+"${REMOVE_ENTRIES[@]}"}"; do
  [[ -n "$entry" ]] || continue
  IFS='|' read -r target source <<< "$entry"
  rm -f "$target"
  echo "Removed stale symlink: $target -> $source"
done

echo ""
echo "Done."
