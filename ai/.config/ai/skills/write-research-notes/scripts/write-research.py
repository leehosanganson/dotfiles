#!/usr/bin/env python3
"""
write-research.py — Write a research note with YAML frontmatter.

Usage:
    python scripts/write-research.py <topic-slug> <title> [subfolder]

The script reads markdown from stdin, prepends YAML frontmatter, and writes
to $HOME/Documents/research/<subfolder>/<topic-slug>.md (or the top level if
no subfolder is specified).

With uv:
    echo "Your content" | uv run scripts/write-research.py topic-slug "Title"
"""

import sys
import os
from pathlib import Path
from datetime import date


def usage():
    prog = os.path.basename(sys.argv[0]) if len(sys.argv) > 0 else "write-research.py"
    print(
        f"Usage: {prog} <topic-slug> <title> [subfolder]\n"
        "\n"
        "Arguments:\n"
        "  topic-slug    URL-friendly name for the note (e.g., proxmox-server-build)\n"
        "  title         Title of the research note\n"
        "  subfolder     Optional subfolder under $HOME/Documents/research/\n"
        "\n"
        "The script reads markdown content from stdin. If no stdin is provided\n"
        "(i.e. running from a terminal), this message is printed instead.\n"
        "\n"
        "Examples:\n"
        f'  echo "# My Notes" | {prog} my-topic "My Topic"\n'
        f'  echo "# Kubernetes Setup" | {prog} k8s-setup "Kubernetes Setup"\n'
        f'  echo "# Server Build" | {prog} server-build "Server Build" server-infrastructure\n',
        file=sys.stderr,
    )
    sys.exit(1)


def main():
    # --------------------------------------------------------------------------
    # Argument parsing
    # --------------------------------------------------------------------------
    if len(sys.argv) < 3:
        usage()

    topic_slug = sys.argv[1]
    title = sys.argv[2]

    # Handle optional subfolder (third arg) or the "subfolder/topic-slug" pattern
    subfolder = ""
    target_file = ""

    if len(sys.argv) >= 4:
        # Fourth argument is explicitly the subfolder
        subfolder = sys.argv[3]
        target_file = f"{topic_slug}.md"
    elif "/" in topic_slug:
        # Parse "subfolder/topic-slug" from the slug itself
        parts = topic_slug.rsplit("/", 1)
        subfolder = parts[0]
        target_file = f"{parts[1]}.md"
    else:
        target_file = f"{topic_slug}.md"

    # --------------------------------------------------------------------------
    # Resolve paths and create directories
    # --------------------------------------------------------------------------
    research_dir = Path(os.environ.get("HOME", "/home/ansonlee")).joinpath(
        "Documents", "research"
    )

    if subfolder:
        output_dir = research_dir / subfolder
    else:
        output_dir = research_dir

    output_dir.mkdir(parents=True, exist_ok=True)

    output_file = output_dir / target_file

    # --------------------------------------------------------------------------
    # Check that stdin is actually piped (not a terminal)
    # --------------------------------------------------------------------------
    if sys.stdin.isatty():
        print("Error: This script reads markdown content from stdin.", file=sys.stderr)
        print('Example:', file=sys.stderr)
        print(f'  echo "# My Notes" | {sys.argv[0]} my-topic "My Topic"', file=sys.stderr)
        usage()

    # --------------------------------------------------------------------------
    # Read the date for frontmatter
    # --------------------------------------------------------------------------
    today = date.today().isoformat()

    # --------------------------------------------------------------------------
    # Build and write: frontmatter + stdin content → file
    # --------------------------------------------------------------------------
    frontmatter = f"---\ntitle: {title}\ndate: {today}\ntags: []\nstatus: draft\n---\n"

    markdown_content = sys.stdin.read()

    output_file.write_text(frontmatter + markdown_content, encoding="utf-8")

    print(output_file)


if __name__ == "__main__":
    main()
