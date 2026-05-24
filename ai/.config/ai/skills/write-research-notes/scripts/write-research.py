#!/usr/bin/env python3
"""
write-research.py — Write a research note with YAML frontmatter.

Usage:
    uv run scripts/write-research.py topic-slug --file /tmp/content.md

The script reads markdown content from --file, prepends YAML frontmatter,
and writes to $HOME/Documents/research/YYYYMMDD_HHMMSS-project/YYYYMMDD_HHMMSS-slug.md.
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime


def usage():
    prog = os.path.basename(sys.argv[0]) if len(sys.argv) > 0 else "write-research.py"
    print(
        f"Usage: {prog} <topic-slug> [-t TITLE] [-p PROJECT] [-f FILEPATH] --file PATH\n"
        "\n"
        "Arguments:\n"
        "  topic-slug    URL-friendly name for the note (e.g., k8s-setup)\n"
        "\n"
        "Options:\n"
        "  -t, --title TITLE        Title of the note (auto-derived from slug if not provided)\n"
        "  -p, --project PROJECT    Project name for the session directory.\n"
        "                           If not given, auto-derived from topic-slug\n"
        "                           (first part before '/' or the full slug).\n"
        "  -f, --filepath FILEPATH  Explicit output file path (overrides auto-resolution)\n"
        "  -F, --file PATH          Read markdown content from this file\n"
        "\n"
        "Examples:\n"
        f'  uv run {prog} k8s-setup --file /tmp/content.md\n'
        f'    → ~/Documents/research/20260523_143000-k8s-setup/20260523_143000-k8s-setup.md\n',
        file=sys.stderr,
    )
    sys.exit(1)


def slug_to_title(slug):
    """Derive a title from a topic-slug: replace separators with spaces, then title-case."""
    title = slug.replace('_', ' ').replace('-', ' ').replace('/', ' ')
    return title.title()


def main():
    parser = argparse.ArgumentParser(
        description="Write a research note with YAML frontmatter.",
        epilog=(
            "Examples:\n"
            "  uv run scripts/write-research.py k8s-setup --file /tmp/content.md\n"
        ),
    )
    parser.add_argument(
        "topic_slug",
        help="URL-friendly name for the note (e.g., k8s-setup)",
    )
    parser.add_argument(
        "-t", "--title",
        help="Title of the note (auto-derived from slug if not provided)",
    )
    parser.add_argument(
        "-p", "--project",
        help=(
            "Project name for the session directory. If not given, auto-derived "
            "from topic-slug (first part before '/' or the full slug)."
        ),
    )
    parser.add_argument(
        "-f", "--filepath",
        help="Explicit output file path (overrides auto-resolution)",
    )
    parser.add_argument(
        "-F", "--file",
        metavar="PATH",
        help="Read markdown content from this file",
    )

    args = parser.parse_args()

    # --------------------------------------------------------------------------
    # Resolve content source (--file only)
    # --------------------------------------------------------------------------
    if not args.file:
        print(
            "Error: --file is required.\n"
            f"  Usage: {os.path.basename(sys.argv[0])} topic-slug --file /tmp/content.md",
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        md_content = Path(args.file).read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        print(f"Error: File not found: {args.file}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error: Cannot read file {args.file}: {e}", file=sys.stderr)
        sys.exit(1)

    if not md_content:
        print(
            f"Error: File is empty: {args.file}",
            file=sys.stderr,
        )
        sys.exit(1)

    # --------------------------------------------------------------------------
    # Resolve title (explicit > derived from slug)
    # --------------------------------------------------------------------------
    title = args.title if args.title else slug_to_title(args.topic_slug)

    # --------------------------------------------------------------------------
    # Resolve output path
    # --------------------------------------------------------------------------
    if args.filepath:
        # Explicit filepath override — bypasses auto-resolution entirely
        output_file = Path(os.path.expanduser(str(args.filepath)))
        output_file.parent.mkdir(parents=True, exist_ok=True)
    else:
        # Derive project name: explicit flag > auto from slug
        if args.project:
            project = args.project
        elif "/" in args.topic_slug:
            project = args.topic_slug.split("/", 1)[0]
        else:
            project = args.topic_slug

        # Build session directory: ~/Documents/research/<datetime>-<project>/
        research_base = Path(os.environ.get("HOME", "/home/ansonlee")).joinpath(
            "Documents", "research"
        )
        now = datetime.now()
        timestamp_str = now.strftime("%Y%m%d_%H%M%S")
        session_dir = research_base / f"{timestamp_str}-{project}"
        session_dir.mkdir(parents=True, exist_ok=True)

        # Build filename: YYYYMMDD_HHMMSS-topic-slug.md
        filename = f"{timestamp_str}-{args.topic_slug}.md"
        output_file = session_dir / filename

    # --------------------------------------------------------------------------
    # Build and write: frontmatter + content → file
    # --------------------------------------------------------------------------
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")

    frontmatter = f"---\ntitle: {title}\ndate: {date_str}\ntags: []\nstatus: draft\n---\n"

    output_file.write_text(frontmatter + md_content, encoding="utf-8")

    print(output_file)


if __name__ == "__main__":
    main()
