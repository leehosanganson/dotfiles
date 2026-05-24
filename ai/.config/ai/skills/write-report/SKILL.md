---
name: write-report
description: >-
  Generate styled HTML reports and summaries with uniform, professional styling. Use whenever the user asks to produce a report, summary, briefing, writeup, or any document intended to be viewed as an HTML page. Also use when exporting research findings into a shareable format.
---

## Overview

This skill produces uniformly-styled HTML reports via `scripts/write-report.py`. Reports are generated from markdown content and rendered into clean, professional HTML — no extra tools required beyond Python.

Reports are written to an explicit output path specified with `--target`. The script requires both `--content` (source markdown) and `--target` (output HTML path); the `-t` flag sets the report title, and `-p` is optional for labeling.

## How to Use

**Always use `scripts/write-report.py`** bundled with this skill. The workflow is a clean two-step process: write content to a file, then run the script pointing at it.

```bash
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run the script with --content, -t, and --target
uv run scripts/write-report.py -t "Report Title" --content /tmp/content.md --target /full/path/output.html
```

This pattern is clean, reliable, and works in all agent contexts. The Write tool handles the content creation; the script handles HTML rendering, styling, and file output.

### Key Rules

1. **Use `--content` with a file path** — This is the only supported pattern for providing content. Write your content first (e.g., with your Write tool into `/tmp/content.md`), then point the script at it. No inline strings, no pipes, no heredocs needed in the command itself.
2. **Use `-t` for the title** — always required, never skip it.
3. **Use `--target` to specify the output path** — always required, must be a full absolute path. The script writes directly to this location; no auto-resolution or fallback paths.
4. **Use `-p` for project name** — optional, informational only. Does not affect output path or naming.

### Examples

```bash
# Basic report
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run with --target
uv run scripts/write-report.py -t "Q2 Planning Meeting" --content /tmp/content.md --target /tmp/report.html

# Report with project label
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run with -p and --target
uv run scripts/write-report.py -t "Alpha Findings" -p finance --content /tmp/content.md --target ~/Documents/report.html

# Report placed in a project subdirectory
uv run scripts/write-report.py -t "Research Summary" --content /tmp/content.md --target ~/Documents/research/summary.html
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
