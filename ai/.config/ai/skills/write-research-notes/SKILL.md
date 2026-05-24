---
name: write-research-notes
description: >-
  Write research notes and markdown documentation into the canonical research directory at $HOME/Documents/research/<project-name>>. Use whenever an agent needs to save research findings, deep-analysis notes, or any markdown content that should persist across sessions. Agents may also read existing notes from this directory for reference.
---

## Overview

`$HOME/Documents/research/<project-name>` is the canonical directory for storing research notes and markdown documentation. All research content should be written here so it persists across sessions and is easily discoverable.

The script handles YAML frontmatter generation, timestamped session directory creation, path resolution, and file naming — all fully automated. Agents never need to compute or supply any datetime values.

## Why Write Notes Frequently

**Write research findings as soon as you have them — don't wait until the end.** Every time you:

- Discover a new piece of information
- Complete an analysis step
- Reach a conclusion or hypothesis

…write it down immediately. This matters because:

1. **Discoverability** — Other agents (and your future self) can search and browse `$HOME/Documents/research/<project-name>/` to find what's already been done. Nothing is worse than duplicating work because someone else already solved it but didn't write it down.
2. **Persistence across sessions** — In long research workflows, context gets lost between agent turns. Writing notes after each step creates a durable trail that survives session boundaries.
3. **Avoids duplication** — Always **read existing notes before writing new ones**. Check what's already been documented to avoid repeating effort and to build on prior work.

Research notes are the shared memory of your project. Write often, write early, write clearly.

## How to Use

### Command Interface

```bash
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py [topic-slug] --content /path/to/content.md -t "Title" -p project-name [--target OUTPUT]
```

| Argument          | Required | Description                                                                                                        |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `topic-slug`      | Yes      | URL-friendly name for the note (e.g., `k8s-setup`)                                                                 |
| `--content`       | Yes      | Source markdown file to write into a research note                                                                 |
| `--target`        | No       | Explicit output path; if omitted, auto-resolves to `~/Documents/research/<timestamp>-<project>/<timestamp>-<slug>.md` |
| `-t "Title"`      | Yes      | Explicit title for the note                                                                                        |
| `-p project-name` | Yes      | Project name for session directory grouping                                                                        |

### Recommended Workflow (Two Steps)

```bash
# Step 1: Write content to /tmp/content.md (using your Write tool)
# Step 2: Run with all required args — `-t` for title, `-p` for project name
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py k8s-setup --content /tmp/content.md -t "K8s Setup" -p infrastructure
# → ~/Documents/research/YYYYMMDD_HHMMSS-infrastructure/YYYYMMDD_HHMMSS-k8s-setup.md
```

### Key Rules

1. **Always use `--content`** — Write your content to a file first (e.g., `/tmp/content.md`), then pass it with `--content`. No inline strings, pipes, or heredocs.
2. **Use `-t/--title` — Required** — Provide an explicit title every time. It is used in the YAML frontmatter and must not be auto-derived from the slug.
3. **Use `-p/--project` — Required** — Determines the session subdirectory (`<datetime>-<project>/`). If not given, the script exits with a validation error.
4. **Use `--target` for explicit output** — Location to be stored. Overrides auto-resolution entirely when provided.

### Examples

```bash
# Note with required title and project
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py proxmox-server-build --content /tmp/content.md -t "Proxmox Server Build" -p infrastructure

# Multiple notes under the same session directory (run separately for each)
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py findings -t "Cluster Findings" -p my-project --content /tmp/content.md
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py summary -t "Summary Report" -p my-project --content /tmp/content.md

# Explicit output path (bypasses session directory)
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py dl-overview -t "Deep Learning Overview" \
  --target ~/Documents/research/dl-overview.md --content /tmp/content.md
```

### Validation & Error Handling

The script validates all required inputs before writing:

- **`--title` is required** — The script exits with an error if `-t/--title` is not provided.
- **`--project` is required** — The script exits with an error if `-p/--project` is not provided.
- **`topic-slug` is required** — The positional argument has no default; omitting it exits with an error.
- **`--content` must exist and be non-empty** — If the file is missing or empty, the script prints an error to stderr and exits.

```bash
# Missing --title → argparse error: "the following arguments are required: -t/--title"
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py proxmox-server-build --content /tmp/content.md -p infrastructure

# Missing --project → argparse error: "the following arguments are required: -p/--project"
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py proxmox-server-build --content /tmp/content.md -t "Proxmox Build"

# File not found → script exits with "Error: File not found: ..." to stderr
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py proxmox-server-build --content /tmp/missing.md -t "Proxmox Build" -p infrastructure
```

### Research Workflow — Write at Every Step

```bash
# Read existing notes first to avoid duplication (use file reading tools)

# Write initial findings
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py hypothesis -t "Initial Hypothesis" -p my-project --content /tmp/content.md

# Write intermediate results after each step
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py analysis-results -t "Analysis Results" -p my-project --content /tmp/content.md

# Write conclusions when reached
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py conclusions -t "Conclusions" -p my-project --content /tmp/content.md
```

**Don't batch everything into one final write.** Each note is self-contained and discoverable. Smaller, focused files are easier to search, reference, and update.

## File Structure

Notes are organized into timestamped session directories:

```
~/Documents/research/
├── 20260523_143000-k8s-setup/
│   └── k8s-setup.md
└── 20260523_143000-my-project/
    ├── findings-1.md
    ├── analysis-results.md
    └── report.html
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

Before writing new notes, **read existing ones** from `$HOME/Documents/research/<project-name>` to avoid duplication and build on prior work. Use your file reading tools to browse the directory structure and read relevant files. Always check what's already documented before writing new content.
