#!/usr/bin/env python3
"""
write-research.py — Write a research note with YAML frontmatter.

Usage:
    cat > /tmp/content.md << 'EOF'  # Step 1 — write content to temp file
    # Kubernetes Setup             # (heredoc ends here)
    EOF
    uv run scripts/write-research.py k8s-setup < /tmp/content.md          # Step 2 — pipe as stdin

    uv run scripts/write-research.py my-topic -t "My Topic" \
      -f ~/Documents/research/my-topic.md < /tmp/content.md

The script reads markdown content from the CONTENT environment variable,
the --content flag, or stdin (in that order of precedence), prepends YAML
frontmatter, and writes to $HOME/Documents/research/<topic-slug>.md.
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import date


def usage():
    prog = os.path.basename(sys.argv[0]) if len(sys.argv) > 0 else "write-research.py"
    print(
        f"Usage: {prog} <topic-slug> [-t TITLE] [-f FILEPATH] [--content TEXT]\n"
        "\n"
        "Arguments:\n"
        "  topic-slug    URL-friendly name for the note (e.g., proxmox-server-build)\n"
        "\n"
        "Options:\n"
        "  -t, --title TITLE        Title of the note (auto-derived from slug if not provided)\n"
        "  -f, --filepath FILEPATH  Explicit output file path (auto-resolves if not given)\n"
        "  --content TEXT           Markdown content on the command line\n"
        "\n"
        "Environment Variables:\n"
        "  CONTENT    Markdown content (takes precedence over --content)\n"
        "\n"
        "Examples:\n"
        f'  cat > /tmp/content.md << \'EOF\'   # Step 1 — write content to temp file\n'
        f'  # Kubernetes Setup\n'
        f'  EOF\n'
        f'  uv run {prog} k8s-setup < /tmp/content.md   # Step 2 — pipe as stdin\n'
        f'  uv run {prog} my-topic -t "My Topic" \\\n'
        f'    -f ~/Documents/research/my-topic.md < /tmp/content.md\n',
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
        ),
    )
    parser.add_argument(
        "topic_slug",
        help="URL-friendly name for the note (e.g., proxmox-server-build)",
    )
    parser.add_argument(
        "-t", "--title",
        help="Title of the note (auto-derived from slug if not provided)",
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
        # Expand ~ in filepath
        output_file = Path(os.path.expanduser(str(args.filepath)))
        # Ensure parent directory exists
        output_file.parent.mkdir(parents=True, exist_ok=True)
    else:
        # Auto-resolve: $HOME/Documents/research/<subfolder>/<topic-slug>.md
        research_dir = Path(os.environ.get("HOME", "/home/ansonlee")).joinpath(
            "Documents", "research"
        )

        subfolder = ""
        target_file = f"{args.topic_slug}.md"

        # Handle "subfolder/topic-slug" pattern in the slug itself
        if "/" in args.topic_slug:
            parts = args.topic_slug.rsplit("/", 1)
            subfolder = parts[0]
            target_file = f"{parts[1]}.md"

        if subfolder:
            output_dir = research_dir / subfolder
        else:
            output_dir = research_dir

        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / target_file

    # --------------------------------------------------------------------------
    # Build and write: frontmatter + content → file
    # --------------------------------------------------------------------------
    today = date.today().isoformat()

    frontmatter = f"---\ntitle: {title}\ndate: {today}\ntags: []\nstatus: draft\n---\n"

    output_file.write_text(frontmatter + md_content, encoding="utf-8")

    print(output_file)


if __name__ == "__main__":
    main()
