#!/usr/bin/env python3
"""
Generate a styled HTML report from markdown content.

Without --target, reports are saved as
~/Documents/research/reports/YYYYMMDD_<slug>.html. The slug comes from
--slug, then --project, then --title.
"""

import os
import sys
import html
import re
import argparse
from datetime import datetime
from urllib.parse import urlsplit


def escape(text):
    """Escape HTML special characters."""
    return html.escape(text)


def convert_inline(text):
    """Render a small safe subset of inline markdown."""
    pattern = re.compile(
        r'`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|__(.+?)__'
    )
    output = []
    last = 0
    for match in pattern.finditer(text):
        output.append(escape(text[last:match.start()]))
        code, label, url, bold, underscore_bold = match.groups()
        if code is not None:
            output.append(f"<code>{escape(code)}</code>")
        elif label is not None:
            scheme = urlsplit(url).scheme.lower()
            if scheme in ("http", "https", "mailto"):
                output.append(
                    f'<a href="{escape(url)}" rel="noopener noreferrer">'
                    f'{escape(label)}</a>'
                )
            else:
                output.append(escape(match.group(0)))
        else:
            output.append(f"<strong>{escape(bold or underscore_bold)}</strong>")
        last = match.end()
    output.append(escape(text[last:]))
    return ''.join(output)


def convert_markdown(md):
    """Convert a subset of markdown to HTML.

    Supports headings, bold, inline code, safe HTTP(S)/mailto links, fenced
    code blocks, unordered lists, and paragraphs. Raw HTML is always escaped.
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


def main():
    parser = argparse.ArgumentParser(
        description="Generate a styled HTML report from markdown content.",
        epilog=(
            "Examples:\n"
            '  uv run scripts/write-report.py -t "My Report Title" --content /tmp/content.md\n'
            '  uv run scripts/write-report.py -t "My Report Title" --content /tmp/content.md --target /absolute/path/report.html\n'
        ),
    )
    parser.add_argument(
        "-t", "--title",
        required=True,
        help="Report title (required)",
    )
    parser.add_argument(
        "--target",
        default=None,
        metavar="PATH",
        help="Absolute output file path (optional; parent directories are created)",
    )
    parser.add_argument(
        "-p", "--project",
        help="Optional project name used as the default filename slug",
    )
    parser.add_argument(
        "--content",
        metavar="PATH",
        required=True,
        help="Read markdown content from this file (required)",
    )

    parser.add_argument(
        "--slug",
        help="Optional filename slug; defaults to --project or the report title",
    )

    args = parser.parse_args()

    # --------------------------------------------------------------------------
    # Validate required arguments
    # --------------------------------------------------------------------------
    if not args.title:
        print("Error: --title must be a non-empty string", file=sys.stderr)
        sys.exit(1)

    # --------------------------------------------------------------------------
    # Resolve target path
    # --------------------------------------------------------------------------
    if args.target is None:
        home = os.environ.get("HOME", os.path.expanduser("~"))
        target_dir = os.path.join(home, "Documents", "research", "reports")
        slug_source = args.slug or args.project or args.title
        slug = re.sub(r"[^a-z0-9]+", "-", slug_source.lower()).strip("-") or "report"
        date_prefix = datetime.now().strftime("%Y%m%d")
        args.target = os.path.join(target_dir, f"{date_prefix}_{slug}.html")
    elif not os.path.isabs(args.target):
        print("Error: --target must be an absolute path", file=sys.stderr)
        sys.exit(1)

    os.makedirs(os.path.dirname(args.target), exist_ok=True)

    # --------------------------------------------------------------------------
    # Read content from --content
    # --------------------------------------------------------------------------
    try:
        md_content = open(args.content, encoding="utf-8").read().strip()
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
    # Generate HTML
    # --------------------------------------------------------------------------
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html_output = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{}</title>
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
      <h1>{}</h1>
      <hr>
    </header>

    <div class="content">
{}
    </div>

    <footer>
      Generated on {}
    </footer>
  </div>
</body>
</html>
""".format(escape(args.title), escape(args.title), convert_markdown(md_content), now)

    # --------------------------------------------------------------------------
    # Write to explicit target path
    # --------------------------------------------------------------------------
    try:
        with open(args.target, "w", encoding="utf-8") as f:
            f.write(html_output)
    except OSError as e:
        print(f"Error: Cannot write file {args.target}: {e}", file=sys.stderr)
        sys.exit(1)

    print(args.target)


if __name__ == "__main__":
    main()
