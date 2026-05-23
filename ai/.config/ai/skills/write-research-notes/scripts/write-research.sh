#!/usr/bin/env bash
#
# write-research.sh — Write a research note with YAML frontmatter
#
# Usage:
#   echo "markdown content" | scripts/write-research.sh <topic-slug> <title> [subfolder]
#
# Arguments:
#   topic-slug  — URL-friendly name for the note (e.g., proxmox-server-build)
#   title       — Title of the research note
#   subfolder   — Optional subfolder under $HOME/Documents/research/
#                 If given as "subfolder/topic-slug", splits on last "/"
#
# The script reads markdown from stdin, prepends YAML frontmatter, and writes
# to $HOME/Documents/research/<subfolder>/<topic-slug>.md (or the top level if
# no subfolder is specified).

set -euo pipefail

##############################################################################
# Usage / help
##############################################################################

usage() {
  cat >&2 <<EOF
Usage: $(basename "$0") <topic-slug> <title> [subfolder]

Arguments:
  topic-slug    URL-friendly name for the note (e.g., proxmox-server-build)
  title         Title of the research note
  subfolder     Optional subfolder under \$HOME/Documents/research/

The script reads markdown from stdin. If no stdin is provided (i.e. running
from a terminal), this message is printed and the script exits with code 1.

Examples:
  echo "# My Notes" | $(basename "$0") my-topic "My Topic"
  echo "# Kubernetes Setup" | $(basename "$0") k8s-setup "Kubernetes Setup"
  echo "# Server Build" | $(basename "$0") server-build "Server Build" server-infrastructure
EOF
  exit 1
}

##############################################################################
# Argument parsing
##############################################################################

if [ $# -lt 2 ]; then
  usage
fi

TOPIC_SLUG="$1"
TITLE="$2"

# Handle optional subfolder (third arg) or the "subfolder/topic-slug" pattern
SUBDIR=""
TARGET_FILE=""

if [ $# -ge 3 ]; then
  # Third argument is explicitly the subfolder
  SUBDIR="$3"
  TARGET_FILE="${TOPIC_SLUG}.md"
else
  # Check if TOPIC_SLUG contains a "/" — parse "subfolder/topic-slug"
  case "$TOPIC_SLUG" in
    */*)
      SUBDIR="${TOPIC_SLUG%/*}"
      TARGET_FILE="${TOPIC_SLUG##*/}.md"
      ;;
    *)
      TARGET_FILE="${TOPIC_SLUG}.md"
      ;;
  esac
fi

##############################################################################
# Resolve paths and create directories
##############################################################################

RESEARCH_DIR="$HOME/Documents/research"

if [ -n "$SUBDIR" ]; then
  OUTPUT_DIR="$RESEARCH_DIR/$SUBDIR"
else
  OUTPUT_DIR="$RESEARCH_DIR"
fi

mkdir -p "$OUTPUT_DIR"

OUTPUT_FILE="$OUTPUT_DIR/$TARGET_FILE"

##############################################################################
# Check that stdin is actually piped (not a terminal)
##############################################################################

if [ -t 0 ]; then
  # No stdin — print usage and exit
  echo "Error: This script reads markdown content from stdin." >&2
  echo "Example:" >&2
  echo "  echo '# My Notes' | $0 my-topic \"My Topic\"" >&2
  usage
fi

##############################################################################
# Read the date for frontmatter
##############################################################################

TODAY="$(date +%Y-%m-%d)"

##############################################################################
# Build and write: frontmatter + stdin content → file
##############################################################################

{
  cat <<FMTHEADER
---
title: ${TITLE}
date: ${TODAY}
tags: []
status: draft
---
FMTHEADER
  cat
} > "$OUTPUT_FILE"

echo "$OUTPUT_FILE"
