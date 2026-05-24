---
name: write-research-notes
description: >-
  Write research notes and markdown documentation into the canonical research directory at $HOME/Documents/research/. Use whenever an agent needs to save research findings, deep-analysis notes, or any markdown content that should persist across sessions. Agents may also read existing notes from this directory for reference.
---

## Overview

`$HOME/Documents/research/` is the canonical directory for storing research notes and markdown documentation. All research content should be written here so it persists across sessions and is easily discoverable.

The script handles YAML frontmatter generation, timestamped session directory creation, path resolution, and file naming — all fully automated. Agents never need to compute or supply any datetime values.

## Why Write Notes Frequently

**Write research findings as soon as you have them — don't wait until the end.** Every time you:

- Discover a new piece of information
- Complete an analysis step
- Reach a conclusion or hypothesis

…write it down immediately. This matters because:

1. **Discoverability** — Other agents (and your future self) can search and browse `$HOME/Documents/research/` to find what's already been done. Nothing is worse than duplicating work because someone else already solved it but didn't write it down.
2. **Persistence across sessions** — In long research workflows, context gets lost between agent turns. Writing notes after each step creates a durable trail that survives session boundaries.
3. **Avoids duplication** — Always **read existing notes before writing new ones**. Check what's already been documented to avoid repeating effort and to build on prior work.

Research notes are the shared memory of your project. Write often, write early, write clearly.

## How to Use

### Command Interface

```bash
uv run scripts/write-research.py [topic-slug] --content /path/to/content.md [--target OUTPUT] [-t "Title"] [-p project-name]
```

| Argument | Required | Description |
|---|---|---|
| `topic-slug` | No | URL-friendly name for the note (e.g., `k8s-setup`) |
| `--content` | Yes | Source markdown file to write into a research note |
| `--target` | No | Explicit output path; if omitted, auto-resolves to `~/Documents/research/<timestamp>-<slug>/<timestamp>-<slug>.md` |
| `-t "Title"` | No | Explicit title (auto-derived from slug if omitted) |
| `-p project-name` | No | Project name for session directory grouping |

### Recommended Workflow (Two Steps)

```bash
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run the script pointing to it
uv run scripts/write-research.py k8s-setup --content /tmp/content.md
# → ~/Documents/research/20260523_143000-k8s-setup/20260523_143000-k8s-setup.md
```

### Key Rules

1. **Always use `--content`** — Write your content to a file first (e.g., `/tmp/content.md`), then pass it with `--content`. No inline strings, pipes, or heredocs.
2. **Use `-t` for explicit title** — Optional; auto-derived from slug if omitted. Provide it when the slug alone doesn't make a good title.
3. **Use `-p/--project` to group notes** — Determines the session subdirectory (`<datetime>-<project>/`). If not given, auto-derived from `topic-slug`. Never supply timestamps yourself.
4. **Use `--target` for explicit output** — Overrides auto-resolution entirely, bypassing timestamped directory creation. Use when you need a specific location.

### Examples

```bash
# Simple note — auto-derives project from slug, creates session dir
uv run scripts/write-research.py proxmox-server-build --content /tmp/content.md

# With explicit title and project override
uv run scripts/write-research.py db-migration -p k8s-setup -t "DB Migration Plan" --content /tmp/content.md

# Multiple notes under the same session directory (run separately for each)
uv run scripts/write-research.py findings -t "Cluster Findings" -p my-project --content /tmp/content.md
uv run scripts/write-research.py summary -t "Summary Report" -p my-project --content /tmp/content.md

# Explicit output path (bypasses session directory)
uv run scripts/write-research.py dl-overview -t "Deep Learning Overview" \
  --target ~/Documents/research/dl-overview.md --content /tmp/content.md
```

### Research Workflow — Write at Every Step

```bash
# Read existing notes first to avoid duplication (use file reading tools)

# Write initial findings
uv run scripts/write-research.py hypothesis -t "Initial Hypothesis" -p my-project --content /tmp/content.md

# Write intermediate results after each step
uv run scripts/write-research.py analysis-results -t "Analysis Results" -p my-project --content /tmp/content.md

# Write conclusions when reached
uv run scripts/write-research.py conclusions -t "Conclusions" -p my-project --content /tmp/content.md
```

**Don't batch everything into one final write.** Each note is self-contained and discoverable. Smaller, focused files are easier to search, reference, and update.

## File Structure

Notes are organized into timestamped session directories:

```
~/Documents/research/
├── 20260523_143000-k8s-setup/
│   └── 20260523_143000-k8s-setup.md
└── 20260523_143000-my-project/
    ├── 20260523_143000-findings.md
    ├── 20260523_143000-analysis-results.md
    └── 20260523_143000-conclusions.md
```

The script generates YAML frontmatter automatically:

```yaml
---
title: Your Title
date: 2026-05-23
tags: []
status: draft
---
```

Edit `tags` and `status` after writing if needed.

## Reading Existing Notes

Before writing new notes, **read existing ones** from `$HOME/Documents/research/` to avoid duplication and build on prior work. Use your file reading tools to browse the directory structure and read relevant files. Always check what's already documented before writing new content.
