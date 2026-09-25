#!/usr/bin/env python3
"""Write a Markdown note with YAML frontmatter.

Usage:
    uv run scripts/write-notes.py TOPIC-SLUG --content PATH --title TITLE [--target OUTPUT]

If --target is omitted, the note is written to
~/Documents/research/notes/YYYYMMDD_<slug>.md.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Write a Markdown note with YAML frontmatter.",
        epilog=(
            "Example: uv run scripts/write-notes.py experiment-results "
            '--content /tmp/note.md --title "Experiment Results"'
        ),
    )
    parser.add_argument(
        "topic_slug",
        help="URL-friendly name for the note (e.g., experiment-results).",
    )
    parser.add_argument(
        "-t", "--title",
        required=True,
        help="Title of the note.",
    )
    parser.add_argument(
        "-p", "--project",
        help="Optional compatibility argument; it does not affect the output path.",
    )
    parser.add_argument(
        "--target",
        help="Exact output file path (overrides the default location).",
    )
    parser.add_argument(
        "--content",
        metavar="PATH",
        required=True,
        help="Read non-empty Markdown content from this file.",
    )

    args = parser.parse_args()
    if not re.fullmatch(r"[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*", args.topic_slug):
        parser.error("topic-slug must contain only letters, numbers, hyphens, or underscores")

    try:
        md_content = Path(args.content).read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        print(f"Error: File not found: {args.content}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error: Cannot read file {args.content}: {e}", file=sys.stderr)
        sys.exit(1)

    if not md_content:
        print(f"Error: File is empty: {args.content}", file=sys.stderr)
        sys.exit(1)

    is_default_target = args.target is None
    if not is_default_target:
        output_file = Path(os.path.expanduser(args.target))
    else:
        date = datetime.now().strftime("%Y%m%d")
        output_file = (
            Path(os.environ.get("HOME", str(Path.home())))
            / "Documents"
            / "research"
            / "notes"
            / f"{date}_{args.topic_slug}.md"
        )

    try:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        date_str = datetime.now().strftime("%Y-%m-%d")
        frontmatter = (
            f"---\ntitle: {json.dumps(args.title, ensure_ascii=False)}\n"
            f"date: {date_str}\ntags: []\nstatus: draft\n---\n"
        )
        if is_default_target:
            with output_file.open("x", encoding="utf-8") as note_file:
                note_file.write(frontmatter + md_content + "\n")
        else:
            output_file.write_text(frontmatter + md_content + "\n", encoding="utf-8")
    except FileExistsError:
        print(f"Error: Default note already exists: {output_file}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error: Cannot write note to {output_file}: {e}", file=sys.stderr)
        sys.exit(1)

    print(output_file)


if __name__ == "__main__":
    main()
