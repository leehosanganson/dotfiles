---
name: write-report
description: >-
  Generate styled HTML reports and summaries with uniform, professional styling. Use whenever the user asks to produce a report, summary, briefing, writeup, or any document intended to be viewed as an HTML page. Also use when exporting research findings into a shareable format.
---

## Overview

Use this skill to generate a styled HTML report from markdown content with:

`$AI_SKILL_DIR/write-report/scripts/write-report.py`

Required flags:
- `-t/--title`
- `--project`
- `--content` (path to markdown file)

Optional flag:
- `--target` (explicit output file path)

Path safety is the priority. The script only auto-creates directories when `--target` is omitted.

## Safe Usage / Path Rules

1. **Prefer omitting `--target`** for safest behavior. Default output resolves to:
   `~/Documents/research/<project>/report.html`
2. **If you use `--target`, use an absolute path starting with `/`** (safety recommendation).
3. **Do not use `~` in `--target`**; treat it as unsafe for this workflow.
4. **For explicit `--target`, ensure the parent directory already exists** before running.
5. **If you want automatic directory creation, omit `--target` and use `--project`.**
6. **Always verify the printed output path** after the command succeeds.

## Canonical Workflow

1. Write markdown content to a file (typically `/tmp/content.md`).
2. Run `write-report.py` with `--title`, `--project`, and `--content`.
3. Choose output mode:
   - **Default mode (recommended):** omit `--target`.
   - **Explicit mode:** pass `--target /absolute/path/report.html` only after parent dir exists.
4. Confirm the script's printed path is the expected destination.

## Command Patterns

Recommended default (no explicit target; default branch handles directory creation):

```bash
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py \
  -t "Q2 Planning Meeting" \
  --project myproject \
  --content /tmp/content.md
```

Safe explicit target (parent directory already exists):

```bash
uv run $AI_SKILL_DIR/write-report/scripts/write-report.py \
  -t "Alpha Findings" \
  --project finance \
  --content /tmp/content.md \
  --target /home/ansonlee/Documents/reports/alpha-findings.html
```

## Failure Modes

- Missing required args (`--title`, `--project`, `--content`) → argparse usage error.
- Empty title (`--title ""`) → exits with `Error: --title must be a non-empty string`.
- Content file missing → handled via `FileNotFoundError`.
- Content read failure (for example permissions/path issues) → handled via `OSError`.
- Content file empty after read/strip → exits with `Error: File is empty: <path>`.
- Explicit `--target` with missing parent directory → write step fails (directory is not auto-created in explicit-target branch).

Note: only the default path branch auto-creates directories.

## Quick Checklist

- [ ] Content file exists and is non-empty (`--content`).
- [ ] `--title` is non-empty.
- [ ] `--project` is set.
- [ ] If using `--target`: absolute path starts with `/`, no `~`, parent directory already exists.
- [ ] If you need auto directory creation: omit `--target`.
- [ ] Verify the final printed path.
