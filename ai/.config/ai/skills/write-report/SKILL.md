---
name: write-report
description: >-
  Generate styled HTML reports and summaries with uniform, professional styling. Use whenever the user asks to produce a report, summary, briefing, writeup, or any document intended to be viewed as an HTML page. Also use when exporting research findings into a shareable format.
---

## Overview

This skill produces uniformly-styled HTML reports via `scripts/write-report.py`. Reports are generated from markdown content and rendered into clean, professional HTML — no extra tools required beyond Python.

## How to Use

**Always use `scripts/write-report.py`** bundled with this skill. The single-command pattern is:

```bash
CONTENT="# My Report\n\nContent here." uv run scripts/write-report.py -t "Report Title"
```

This writes to `./report.html` in the current directory. To specify a custom output path:

```bash
CONTENT="# Summary\n\nMore content." uv run scripts/write-report.py -t "Q2 Summary" -o q2-report.html
```

Or use the `--content` flag instead of an environment variable:

```bash
uv run scripts/write-report.py -t "Title" --content "# Inline content"
```

### Key Rules

1. **Use `CONTENT=` env var** — set it inline before `uv run`. This is the primary pattern and works in all agent contexts.
2. **Use `-t` for the title** — always required, never skip it.
3. **Use `-o` to specify output path** — defaults to `./report.html` if omitted.
4. **No pipes, no temp files** — just a single `uv run` command with `CONTENT=` or `--content`.

### Examples

```bash
# Meeting summary as HTML report
CONTENT="# Team Meeting Notes\n\n- Discussed Q2 roadmap\n- Action items assigned" \
  uv run scripts/write-report.py -t "Q2 Planning Meeting"

# Research writeup
CONTENT="# Project Findings\n\nThe data shows a **15% improvement**." \
  uv run scripts/write-report.py -t "Project Alpha Findings" -o project-findings.html

# Deep research report with explicit path
CONTENT="# AI Safety Survey\n\nKey themes:\n- Alignment\n- Interpretability" \
  uv run scripts/write-report.py -t "AI Safety Survey" -o ai-safety.html
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
