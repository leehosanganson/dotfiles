---
name: write-report
description: >-
  Render Markdown findings as a styled HTML report. Use when the user requests a
  report, briefing, summary, writeup, or HTML export; don't use to conduct new
  research or create standalone Markdown notes.
---

## Workflow

Write non-empty report content to a Markdown file, preferably under `/tmp`, then
run the bundled renderer and check its printed output path:

```bash
uv run "$AI_SKILL_DIR/write-report/scripts/write-report.py" \
  --title "Q2 Planning Meeting" \
  --content /tmp/content.md
```

By default the report is saved in `~/Documents/research/reports/` as
`YYYYMMDD_<slug>.html`. The slug uses `--slug`, then `--project`, then `--title`;
`--project` only affects the default filename.

Use `--target /absolute/path/to/report.html` for an exact output path. The
renderer creates missing parent directories and rejects relative target paths.
When writing a research-session artifact, pass its explicit absolute path.

The renderer supports headings, bold, inline code, fenced code blocks, unordered
lists, paragraphs, and clickable HTTP(S)/mailto links. It escapes raw HTML and
leaves unsafe link schemes unclickable; author content within those supported
Markdown features.
