---
name: write-notes
description: >-
  Turn research, experiments, or study into durable, evidence-aware Markdown
  notes for later reference. Use when the user wants findings captured as notes;
  don't use to render an HTML report or merely answer without saving notes.
---

## Workflow

Unless given an exact destination, save one note to
`~/Documents/research/notes/YYYYMMDD_<slug>.md`. Derive a concise,
filesystem-safe slug from the topic. The script creates parent directories and
refuses to overwrite an existing default-path note. An explicit `--target`
uses the requested path and may overwrite it.

Write non-empty Markdown content to a temporary file under `/tmp`. Include a
clear topic, context, method, evidence-based findings, conclusion, and useful
next steps. Include sources when external material informs the note; distinguish
facts from assumptions and interpretation. Record dates, versions, commands, or
conditions when needed for reproducibility.

Generate the note with the bundled script; provide the required topic slug and
title, and check the printed output path:

```bash
uv run "$AI_SKILL_DIR/write-notes/scripts/write-notes.py" <topic-slug> \
  --content /tmp/note.md \
  --title "Topic title"
```

To write to an exact destination, add `--target /absolute/path/to/note.md`.
The optional `--project` argument is retained for compatibility and does not
affect the destination.
