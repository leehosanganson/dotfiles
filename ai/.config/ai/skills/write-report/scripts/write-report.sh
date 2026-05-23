#!/usr/bin/env bash
#
# write-report.sh — Generate a styled HTML report from markdown content
#
# Usage:
#   echo "markdown content" | scripts/write-report.sh <title> [output-file]
#
# Arguments:
#   title         The report title
#   output-file   Optional output path (defaults to ./report.html)

set -euo pipefail

##############################################################################
# Argument parsing
##############################################################################

if [ $# -lt 1 ]; then
  cat >&2 <<EOF
Usage: $(basename "$0") <title> [output-file]

Arguments:
  title         The report title
  output-file   Optional output path (defaults to ./report.html)

Examples:
  echo "# My Report" | $(basename "$0") "My Report Title"
  echo "# Summary" | $(basename "$0") "Q2 Summary" q2-report.html
EOF
  exit 1
fi

TITLE="$1"
OUTPUT_FILE="${2:-report.html}"

##############################################################################
# Check that stdin is actually piped (not a terminal)
##############################################################################

if [ -t 0 ]; then
  echo "Error: This script reads markdown content from stdin." >&2
  exit 1
fi

##############################################################################
# Write the Python converter to a temp file so stdin stays available for
# the markdown content piped in by the user.
##############################################################################

CONVERTER="$(mktemp /tmp/write-report-XXXXXX.py)"
trap 'rm -f "$CONVERTER"' EXIT

cat > "$CONVERTER" <<'PYEOF'
import os
import sys
import html
import re
from datetime import datetime

def escape(text):
    """Escape HTML special characters."""
    return html.escape(text)

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

def convert_inline(text):
    """Convert inline markdown (bold, code)."""
    # Bold: **text** or __text__
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__(.*?)__', r'<strong>\1</strong>', text)
    # Inline code: `code`
    text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
    return text

# Read stdin (markdown content) — this works because we read the script from a file
md_content = sys.stdin.read()

# Get title from environment variable passed by bash
title = os.environ.get('REPORT_TITLE', 'Untitled Report')

now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

html_output = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{escape(title)}</title>
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
      <h1>{escape(title)}</h1>
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

print(html_output)
PYEOF

##############################################################################
# Run the converter: stdin is piped markdown, env var carries the title
##############################################################################

REPORT_TITLE="$TITLE" python3 "$CONVERTER" > "$OUTPUT_FILE"

echo "$OUTPUT_FILE"
