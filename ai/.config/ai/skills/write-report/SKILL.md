---
name: write-report
description: >-
  Generate styled HTML reports and summaries with uniform, professional styling. Use whenever the user asks to produce a report, summary, briefing, writeup, or any document intended to be viewed as an HTML page. Also use when exporting research findings into a shareable format.
---

## Overview

This skill produces uniformly-styled HTML reports via `scripts/write-report.py`. Reports are generated from markdown content and rendered into clean, professional HTML — no extra tools required beyond Python.

## How to Use

**Always use `scripts/write-report.py`** bundled with this skill:

```bash
# Default: writes to ./report.html in the current directory
echo "Your markdown content here" | uv run scripts/write-report.py "Report Title"

# Custom output file path
echo "Your markdown content here" | uv run scripts/write-report.py "Report Title" /path/to/output.html
```

**When the agent framework blocks pipes**, use a temp file instead:

```bash
printf "# My Report\n\nContent here." > /tmp/report-input.md
uv run scripts/write-report.py "Report Title" < /tmp/report-input.md
```

### Examples

```bash
# Meeting summary as HTML report
echo "# Team Meeting Notes\n\n- Discussed Q2 roadmap\n- Action items assigned" \
  | uv run scripts/write-report.py "Q2 Planning Meeting"

# Research writeup
echo "# Project Findings\n\nThe data shows a **15% improvement**." \
  | uv run scripts/write-report.py "Project Alpha Findings" project-findings.html
```

## Template Features

Reports include:

- **Clean typography** — system font stack, good line-height, readable max-width (~720px)
- **Responsive layout** — looks great on mobile and desktop
- **Header** with the report title and a horizontal rule
- **Footer** with a generated timestamp ("Generated on ...")
- **Subtle color scheme** — white background, dark text, light gray dividers
- **Markdown support** — headings become `<h1>`, `<h2>`, paragraphs render as `<p>`, lists use `<ul>`/`<li>`, inline code and code blocks are styled

## Use Cases

- Research summaries and deep-dive writeups
- Meeting notes and action item recaps
- Project briefings and status reports
- Findings reports from analysis or experiments
- Any document intended to be viewed as a shareable HTML page
