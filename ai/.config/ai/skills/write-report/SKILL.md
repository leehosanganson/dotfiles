---
name: write-report
description: >-
  Generate styled HTML reports and summaries from markdown. Use whenever a user
  asks for a report, summary, briefing, writeup, or an HTML export.
---

## Usage

Write the report content to a Markdown file, then run:

```bash
uv run "$AI_SKILL_DIR/write-report/scripts/write-report.py" \
  --title "Q2 Planning Meeting" \
  --content /tmp/content.md
```

The script prints the output path. By default it creates
`~/Documents/research/reports/` and writes
`YYYYMMDD_<slug>.html`. The slug is derived from `--slug` when supplied,
otherwise `--project`, otherwise `--title`; characters other than lowercase
letters and digits become hyphens. For example, `Q2 Planning Meeting` becomes
`q2-planning-meeting`.

`--project` is optional and only affects the default filename slug; it does not
change the output directory. You can also provide `--slug` without project or
research-specific context.

## Explicit output path

Use `--target` to write to an explicit absolute path. The script creates missing
parent directories, including when writing a research-session artifact:

```bash
uv run "$AI_SKILL_DIR/write-report/scripts/write-report.py" \
  --title "Alpha Findings" \
  --content /tmp/content.md \
  --target /absolute/path/to/research-session/report.html
```

Relative `--target` values are rejected. Do not pass `~` expecting shell
expansion inside the argument; use an absolute path instead.

## Content and safety

The renderer supports headings, bold, inline code, fenced code blocks, unordered
lists, paragraphs, and clickable HTTP(S)/mailto Markdown links. It escapes raw
HTML and does not make unsupported or unsafe link schemes clickable.

The input Markdown file must exist and contain non-whitespace content. Check the
printed output path after a successful run.
