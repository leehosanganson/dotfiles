---
name: write-notes
description: >-
  Create durable Markdown notes that preserve useful context and conclusions from experiments, online searches, and study. Use this when findings should be kept for later reference.
---

# Write Durable Notes

Turn useful work into notes that remain understandable and actionable later. Capture the reasoning and evidence, not just a transcript of activity.

## Default Location

Unless the user or workflow specifies an exact destination, save one standalone Markdown file at:

```text
~/Documents/research/notes/YYYYMMDD_<slug>.md
```

Use the current date and a concise, filesystem-safe slug derived from the topic. The script creates missing parent directories. If the generated default path already exists, the script refuses to overwrite it and reports an error. If an explicit `--target` is supplied, write to that exact path instead of the default location; explicit targets may be overwritten.

## Note Structure

Include these sections, adapting their detail to the subject:

- **Topic** — a clear title or subject.
- **Context** — why the work was done, the question being answered, and relevant background.
- **Method** — experiments, search strategy, tools, or study approach; include enough detail to reproduce important steps.
- **Findings** — observations and evidence, distinguishing facts from assumptions or interpretation.
- **Conclusion** — what the findings mean, decisions made, limitations, and useful next steps.
- **Sources** — links or citations when external material informed the note; identify relevant sources clearly. Omit this section when there are no sources to cite.

Prefer concise prose, descriptive headings, and concrete details. Record dates, versions, commands, and conditions when they materially affect reproducibility. Avoid unsupported claims and preserve caveats.

## Command

Provide the content as a non-empty Markdown file. The positional topic slug and title are required; `--project` is optional and retained for compatibility, but does not affect the default destination.

```bash
uv run "$AI_SKILL_DIR/write-notes/scripts/write-notes.py" <topic-slug> \
  --content /tmp/note.md \
  --title "Topic title"
```

To choose an exact destination, pass `--target`:

```bash
uv run "$AI_SKILL_DIR/write-notes/scripts/write-notes.py" <topic-slug> \
  --content /tmp/note.md \
  --title "Topic title" \
  --target /path/to/exact-note.md
```

The script prints the path it wrote. Keep temporary source content under `/tmp` when appropriate, and do not put transient scratch output in the research-notes directory.
