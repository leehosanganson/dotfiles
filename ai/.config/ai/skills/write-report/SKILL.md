---
name: write-report
description: >-
  Generate styled HTML reports and summaries with uniform, professional styling. Use whenever the user asks to produce a report, summary, briefing, writeup, or any document intended to be viewed as an HTML page. Also use when exporting research findings into a shareable format.
---

## Overview

This skill produces uniformly-styled HTML reports via `$AI_SKILL_DIR/write-report/scripts/write-report.py`. Reports are generated from markdown content and rendered into clean, professional HTML — no extra tools required beyond Python.

The script requires three arguments: `--title` (report title), `--project` (project name, now required), and `--content` (source markdown path). The `--target` argument is optional; when omitted, it auto-resolves to `~/Documents/research/<project>/report.html` and creates the directory automatically.

## How to Use

**Always use `$AI_SKILL_DIR/write-report/scripts/write-report.py`** bundled with this skill. The workflow is a clean two-step process: write content to a file, then run the script pointing at it.

```bash
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run the script with --content, -t, and --project; --target is optional
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py -t "Report Title" --project myproject --content /tmp/content.md --target /full/path/output.html

# Or omit --target to auto-resolve to ~/Documents/research/myproject/report.html
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py -t "Report Title" --project myproject --content /tmp/content.md
```

This pattern is clean, reliable, and works in all agent contexts. The Write tool handles the content creation; the script handles HTML rendering, styling, and file output.

### Key Rules

1. **Use `--content` with a file path** — This is the only supported pattern for providing content. Write your content first (e.g., with your Write tool into `/tmp/content.md`), then point the script at it. No inline strings, no pipes, no heredocs needed in the command itself.
2. **Use `-t` for the title** — always required and must be non-empty.
3. **Use `--project` to specify the project name** — always required; used for default output path resolution (`~/Documents/research/<project>/report.html`).
4. **Use `--target` to specify the output path** — optional; when omitted, defaults to `~/Documents/research/<project>/report.html` and the directory is auto-created. Must be a full absolute or tilde-expanded path when provided.

### Examples

```bash
# Basic report with auto-resolved target (~/Documents/research/myproject/report.html)
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run with --project; --target omitted → auto-resolves
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py -t "Q2 Planning Meeting" --project myproject --content /tmp/content.md

# Report with explicit --target override
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run with --project and explicit --target
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py -t "Alpha Findings" --project finance --content /tmp/content.md --target ~/Documents/report.html

# Report placed in a project subdirectory (explicit path still requires --project)
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py -t "Research Summary" --project research --content /tmp/content.md --target ~/Documents/research/summary.html
```

## Validation & Error Handling

The script enforces strict validation and will exit with a non-zero code on any error:

- **Missing required argument** — argparse exits immediately if `--title`, `--project`, or `--content` is not provided, printing a usage message to stderr.
- **Empty `--title`** — If `--title` is passed as an empty string, the script prints `Error: --title must be a non-empty string` and exits with code 1.
- **Missing `--content` file** — If the file at `--content` does not exist, prints `Error: File not found: <path>` and exits with code 1.
- **Unreadable `--content` file** — If the file cannot be read (permissions, encoding), prints `Error: Cannot read file <path>: <detail>` and exits with code 1.
- **Empty `--content` file** — If the file exists but contains no content, prints `Error: File is empty: <path>` and exits with code 1.

When `--target` is omitted, the script auto-resolves the path to `~/Documents/research/<project>/report.html` and creates any missing intermediate directories using `os.makedirs(..., exist_ok=True)`.

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
