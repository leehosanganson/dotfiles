---
name: write-report
description: >-
  Generate styled HTML reports and summaries with uniform, professional styling. Use whenever the user asks to produce a report, summary, briefing, writeup, or any document intended to be viewed as an HTML page. Also use when exporting research findings into a shareable format.
---

## Overview

This skill produces uniformly-styled HTML reports via `scripts/write-report.py`. Reports are generated from markdown content and rendered into clean, professional HTML — no extra tools required beyond Python.

By default, reports are saved into `$HOME/Documents/research/<YYYYMMDD_HHMMSS>-<project>/<YYYYMMDD_HHMMSS>-<title-slug>.html`, organized in timestamped session directories for easy retrieval.

## How to Use

**Always use `scripts/write-report.py`** bundled with this skill. The single-command pattern is:

```bash
CONTENT="# My Report\n\nContent here." uv run scripts/write-report.py -t "Report Title"
# → writes to ~/Documents/research/20260523_143000-report-title.html
```

The project directory is auto-derived from the title. To specify a custom project for the session:

```bash
CONTENT="# Summary\n\nMore content." uv run scripts/write-report.py -t "Q2 Summary" -p finance
# → writes to ~/Documents/research/20260523_143000-finance/20260523_143000-q2-summary.html
```

Or use the `--content` flag instead of an environment variable:

```bash
uv run scripts/write-report.py -t "Title" --content "# Inline content"
```

### Key Rules

1. **Use `CONTENT=` env var** — set it inline before `uv run`. This is the primary pattern and works in all agent contexts.
2. **Use `-t` for the title** — always required, never skip it.
3. **Use `-p` for project name override** — specifies the session directory under `~/Documents/research/`; auto-derived from the title if not provided.
4. **Use `-o` to specify an explicit output path** — bypasses auto-resolution and writes directly to the given path; only use when you need a custom location outside the session directory.
5. **No pipes, no temp files** — just a single `uv run` command with `CONTENT=` or `--content`.

### Examples

```bash
# Meeting summary (auto-project from title)
CONTENT="# Team Meeting Notes" uv run scripts/write-report.py -t "Q2 Planning Meeting"
# → ~/Documents/research/20260523_143000-q2-planning-meeting.html

# Report with explicit project
CONTENT="# Project Findings" uv run scripts/write-report.py -t "Alpha Findings" -p finance
# → ~/Documents/research/20260523_143000-finance/findings.html

# Explicit output path override (bypasses auto-resolution)
uv run scripts/write-report.py -t "Title" --content "# Hello" -o custom.html
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
