#!/usr/bin/env python3
"""
write-research.py — Write a research note with YAML frontmatter.

Usage:
    uv run scripts/write-research.py [topic-slug] --content PATH -t TITLE -p PROJECT [--target OUTPUT]

All three of `topic-slug`, `-t/--title`, and `-p/--project` are required.
The script reads markdown content from --content, prepends YAML frontmatter,
and writes to the resolved output path (auto-derived from target path or
content filename if topic-slug is omitted).
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime


def usage():
    prog = os.path.basename(sys.argv[0]) if len(sys.argv) > 0 else "write-research.py"
    print(
        f"Usage: {prog} [topic-slug] --content PATH -t TITLE -p PROJECT [--target OUTPUT]\n"
        "\n"
        "Arguments:\n"
        "  topic-slug      URL-friendly name for the note (e.g., k8s-setup). Required.\n"
        "\n"
        "Options:\n"
        "  -t, --title TITLE        Title of the note. Required.\n"
        "  -p, --project PROJECT    Project name for the session directory. Required.\n"
        "  --target FILEPATH        Explicit output file path (overrides auto-resolution)\n"
        "  --content PATH           Read markdown content from this file (required)\n"
        "\n"
        "Examples:\n"
        f'  uv run {prog} k8s-setup --content /tmp/content.md -t "Kubernetes Setup" -p my-project\n'
        f'    → ~/Documents/research/20260523_143000-my-project/20260523_143000-k8s-setup.md\n'
        f'  uv run {prog} k8s-setup --content /tmp/content.md -t "Kubernetes Setup" -p my-project --target ~/Documents/research/dl-overview.md\n',
        file=sys.stderr,
    )
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Write a research note with YAML frontmatter.",
        epilog=(
            "Examples:\n"
            "  uv run scripts/write-research.py k8s-setup --content /tmp/content.md -t \"Kubernetes Setup\" -p my-project\n"
            "  uv run scripts/write-research.py k8s-setup --content /tmp/content.md -t \"Kubernetes Setup\" -p my-project --target ~/Documents/research/dl-overview.md\n"
        ),
    )
    parser.add_argument(
        "topic_slug",
        help="URL-friendly name for the note (e.g., k8s-setup). Required.",
    )
    parser.add_argument(
        "-t", "--title",
        required=True,
        help="Title of the note. Required.",
    )
    parser.add_argument(
        "-p", "--project",
        required=True,
        help="Project name for the session directory. Required.",
    )
    parser.add_argument(
        "--target",
        help="Explicit output file path (overrides auto-resolution)",
    )
    parser.add_argument(
        "--content",
        metavar="PATH",
        required=True,
        help="Read markdown content from this file (required)",
    )

    args = parser.parse_args()

    # --------------------------------------------------------------------------
    # Resolve content source (--content only)
    # --------------------------------------------------------------------------
    try:
        md_content = Path(args.content).read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        print(f"Error: File not found: {args.content}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error: Cannot read file {args.content}: {e}", file=sys.stderr)
        sys.exit(1)

    if not md_content:
        print(
            f"Error: File is empty: {args.content}",
            file=sys.stderr,
        )
        sys.exit(1)

    # --------------------------------------------------------------------------
    # Title is required (enforced by argparse --required=True)
    # --------------------------------------------------------------------------
    title = args.title

    # --------------------------------------------------------------------------
    # Project is required (enforced by argparse --required=True)
    # --------------------------------------------------------------------------
    if args.target:
        # Explicit target override — bypasses auto-resolution entirely
        output_file = Path(os.path.expanduser(str(args.target)))
        output_file.parent.mkdir(parents=True, exist_ok=True)
    else:
        # Project is required (enforced by argparse --required=True)
        project = args.project

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
