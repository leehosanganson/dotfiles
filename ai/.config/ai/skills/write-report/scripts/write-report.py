#!/usr/bin/env python3
"""
write-report.py — Generate a styled HTML report from markdown content.

Usage:
    uv run scripts/write-report.py -t "Report Title" --file /tmp/content.md
    # → writes to ~/Documents/research/20260523_143000-report-title.html

    uv run scripts/write-report.py -t "Q2 Summary" -p finance --file /tmp/content.md
    # → writes to ~/Documents/research/20260523_143000-finance/20260523_143000-q2-summary.html

The script reads markdown content from the --file flag, then converts it to a
styled HTML page.  By default output is placed in a timestamped session
directory under ~/Documents/research/.

Output path resolution:
    1. If -o/--output is given explicitly, it bypasses auto-resolution.
    2. Otherwise the file is written to:
       ~/Documents/research/<YYYYMMDD_HHMMSS>-<project>/<YYYYMMDD_HHMMSS>-<title-slug>.html
"""

import os
import sys
import html
import re
import argparse
from datetime import datetime


def escape(text):
    """Escape HTML special characters."""
    return html.escape(text)


def convert_inline(text):
    """Convert inline markdown (bold, code)."""
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__(.*?)__', r'<strong>\1</strong>', text)
    text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
    return text


def convert_markdown(md):
    """Convert a subset of markdown to HTML.

    Supports:
    - Headings (#, ##, ###)
    - Bold (**text**)
    - Inline code (`code`)
    - Code blocks (``` ... ```)
    - Unordered lists (- item)
    - Paragraphs (double newlines)
    """
    lines = md.split('\n')
    output = []
    in_list = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # --- Code blocks ---
        if line.strip().startswith('```'):
            code_lines = []
            i += 1
            while i < len(lines):
                stripped = lines[i].rstrip()
                if stripped == '```':
                    break
                code_lines.append(lines[i])
                i += 1
            code_content = '\n'.join(code_lines)
            output.append(f"<pre><code>{escape(code_content)}</code></pre>")
            i += 1
            continue

        # --- Headings ---
        heading_match = re.match(r'^(#{1,6})\s+(.*)', line)
        if heading_match:
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            output.append(f"<h{level}>{convert_inline(text)}</h{level}>")
            i += 1
            continue

        # --- Unordered list items ---
        list_match = re.match(r'^[-*]\s+(.*)', line)
        if list_match:
            if not in_list:
                output.append("<ul>")
                in_list = True
            text = list_match.group(1)
            output.append(f"<li>{convert_inline(text)}</li>")
            i += 1
            continue

        # --- Close list if we hit a non-list line ---
        if in_list:
            output.append("</ul>")
            in_list = False

        # --- Blank lines become paragraph breaks ---
        if line.strip() == '':
            i += 1
            continue

        # --- Paragraphs: accumulate non-blank, non-special lines ---
        para_lines = [line]
        i += 1
        while i < len(lines) and lines[i].strip() != '' and \
              not re.match(r'^(#{1,6})\s+', lines[i]) and \
              not re.match(r'^[-*]\s+', lines[i]) and \
              not lines[i].strip().startswith('```'):
            para_lines.append(lines[i])
            i += 1

        para_text = '\n'.join(para_lines)
        output.append(f"<p>{convert_inline(para_text)}</p>")

    # Close any open list
    if in_list:
        output.append("</ul>")

    return '\n'.join(output)


def slugify(title):
    """Turn a title into a URL-safe slug."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug


def resolve_output_path(args):
    """Resolve the output file path.

    If -o/--output is explicitly provided, use it as-is (override).
    Otherwise, auto-resolve to a timestamped session directory under
    ~/Documents/research/.
    """
    if args.output is not None:
        # Explicit override given by the user via -o flag
        return args.output

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Determine project name: explicit -p flag or auto-derived from title
    if args.project:
        project = slugify(args.project)
    else:
        project = slugify(args.title)

    home = os.environ.get("HOME", "/home/ansonlee")
    research_base = os.path.join(home, "Documents", "research")
    session_dir = os.path.join(research_base, f"{timestamp}-{project}")

    os.makedirs(session_dir, exist_ok=True)

    title_slug = slugify(args.title)
    output_filename = f"{timestamp}-{title_slug}.html"
    return os.path.join(session_dir, output_filename)


def main():
    parser = argparse.ArgumentParser(
        description="Generate a styled HTML report from markdown content.",
        epilog=(
            "Examples:\n"
            '  uv run scripts/write-report.py -t "My Report Title" --file /tmp/content.md\n'
            '  uv run scripts/write-report.py -t "Q2 Summary" -p finance --file /tmp/content.md\n'
        ),
    )
    parser.add_argument(
        "-t", "--title",
        required=True,
        help="Report title (required)",
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Output file path (default: auto-resolve to timestamped session dir)",
    )
    parser.add_argument(
        "-p", "--project",
        default=None,
        help="Project name for the session directory. Auto-derived from title if not provided.",
    )
    parser.add_argument(
        "-F", "--file",
        metavar="PATH",
        required=True,
        help="Read markdown content from this file (required)",
    )

    args = parser.parse_args()

    # --------------------------------------------------------------------------
    # Read content from --file
    # --------------------------------------------------------------------------
    try:
        md_content = open(args.file, encoding="utf-8").read().strip()
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
    # Generate HTML
    # --------------------------------------------------------------------------
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html_output = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{escape(args.title)}</title>
  <style>
    *, *::before, *::after {{
      box-sizing: border-box;
    }}

    html {{
      font-size: 16px;
    }}

    body {{
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                   "Helvetica Neue", Arial, sans-serif;
      line-height: 1.7;
      color: #1a1a1a;
      background-color: #ffffff;
    }}

    .report {{
      max-width: 720px;
      margin: 3rem auto;
      padding: 0 1.5rem;
    }}

    header {{
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }}

    h1 {{
      font-size: 2rem;
      font-weight: 700;
      color: #111;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }}

    header hr {{
      border: none;
      border-top: 3px solid #e8e8e8;
      margin-top: 0.75rem;
    }}

    .content h1, .content h2 {{
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      color: #222;
    }}

    .content h3 {{
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }}

    .content p {{
      margin-bottom: 1.25rem;
      color: #333;
    }}

    .content ul {{
      margin: 0 0 1.25rem 1.5rem;
      padding: 0;
    }}

    .content li {{
      margin-bottom: 0.4rem;
      color: #333;
    }}

    .content pre {{
      background-color: #f7f7f7;
      border-radius: 6px;
      padding: 1rem 1.25rem;
      overflow-x: auto;
      margin-bottom: 1.25rem;
      font-size: 0.9em;
      line-height: 1.6;
    }}

    .content code {{
      background-color: #f4f4f4;
      padding: 0.15em 0.35em;
      border-radius: 3px;
      font-size: 0.9em;
      font-family: "SF Mono", "Fira Code", Consolas, monospace;
    }}

    .content pre code {{
      background: none;
      padding: 0;
      border-radius: 0;
    }}

    footer {{
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      font-size: 0.85rem;
      color: #888;
    }}

    @media (max-width: 640px) {{
      .report {{
        margin: 1.5rem auto;
        padding: 0 1rem;
      }}
      h1 {{
        font-size: 1.5rem;
      }}
      .content h1, .content h2 {{
        font-size: 1.3rem;
      }}
    }}
  </style>
</head>
<body>
  <div class="report">
    <header>
      <h1>{escape(args.title)}</h1>
      <hr>
    </header>

    <div class="content">
{convert_markdown(md_content)}
    </div>

    <footer>
      Generated on {now}
    </footer>
  </div>
</body>
</html>
"""

    # --------------------------------------------------------------------------
    # Resolve output path & write
    # --------------------------------------------------------------------------
    output_path = resolve_output_path(args)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_output)

    print(output_path)


if __name__ == "__main__":
    main()