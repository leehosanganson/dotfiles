#!/usr/bin/env python3
"""
write-research.py — Write a research note with YAML frontmatter.

Usage:
    # Auto-project derived from slug (first part before '/'):
    cat > /tmp/content.md << 'EOF'
    # Kubernetes Setup
    EOF
    uv run scripts/write-research.py k8s-setup < /tmp/content.md

    # Explicit project override:
    cat > /tmp/content.md << 'EOF'
    # Project Findings
    EOF
    uv run scripts/write-research.py findings -t "Project Findings" \
      -p my-project < /tmp/content.md

The script reads markdown content from the CONTENT environment variable,
the --content flag, or stdin (in that order of precedence), prepends YAML
frontmatter, and writes to $HOME/Documents/research/YYYYMMDD_HHMMSS-project/YYYYMMDD_HHMMSS-slug.md.
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime


def usage():
    prog = os.path.basename(sys.argv[0]) if len(sys.argv) > 0 else "write-research.py"
    print(
        f"Usage: {prog} <topic-slug> [-t TITLE] [-p PROJECT] [-f FILEPATH] [--content TEXT]\n"
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
        "  --content TEXT           Markdown content on the command line\n"
        "\n"
        "Environment Variables:\n"
        "  CONTENT    Markdown content (takes precedence over --content)\n"
        "\n"
        "Examples:\n"
        f'  cat > /tmp/content.md << \'EOF\'\n'
        f'  # Kubernetes Setup\n'
        f'  EOF\n'
        f'  uv run {prog} k8s-setup < /tmp/content.md\n'
        f'    → ~/Documents/research/20260523_143000-k8s-setup.md\n'
        f'\n'
        f'  cat > /tmp/content.md << \'EOF\'\n'
        f'  # Project Findings\n'
        f'  EOF\n'
        f'  uv run {prog} findings -t "Project Findings" \\\n'
        f'    -p my-project < /tmp/content.md\n'
        f'    → ~/Documents/research/20260523_143000-my-project/findings.md\n',
        file=sys.stderr,
    )
    sys.exit(1)


def slug_to_title(slug):
    """Derive a title from a topic-slug: replace separators with spaces, then title-case."""
    # Replace _, -, / with spaces
    title = slug.replace('_', ' ').replace('-', ' ').replace('/', ' ')
    # Title case
    return title.title()


def main():
    parser = argparse.ArgumentParser(
        description="Write a research note with YAML frontmatter.",
        epilog=(
            "Examples:\n"
            "  cat > /tmp/content.md << 'EOF'\n"
            "  # Kubernetes Setup\n"
            "  EOF\n"
            "  uv run scripts/write-research.py k8s-setup < /tmp/content.md\n"
            "\n"
            "  cat > /tmp/content.md << 'EOF'\n"
            "  # Project Findings\n"
            "  EOF\n"
            "  uv run scripts/write-research.py findings -t \"Project Findings\" \\\n"
            "    -p my-project < /tmp/content.md\n"
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
        "--content",
        help="Markdown content on the command line (alternative to CONTENT env var)",
    )

    args = parser.parse_args()

    # --------------------------------------------------------------------------
    # Resolve content source (CONTENT env var > --content flag > stdin)
    # --------------------------------------------------------------------------
    md_content = os.environ.get("CONTENT", "").strip()

    if not md_content and args.content:
        md_content = args.content.strip()

    if not md_content and not sys.stdin.isatty():
        md_content = sys.stdin.read().strip()

    if not md_content:
        print(
            "Error: No content provided.\n"
            "  Use a temp file + stdin (recommended):\n"
            "    cat > /tmp/content.md << 'EOF'\n"
            "    # My Notes\n"
            "    EOF\n"
            "    uv run scripts/write-research.py my-topic < /tmp/content.md\n"
            "  Or --content flag:     uv run scripts/write-research.py my-topic --content '# Inline'\n",
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
