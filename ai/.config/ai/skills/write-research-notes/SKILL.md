---
name: write-research-notes
description: >-
  Write research notes and markdown documentation into the canonical research directory at $HOME/Documents/research/. Use whenever an agent needs to save research findings, deep-analysis notes, or any markdown content that should persist across sessions. Agents may also read existing notes from this directory for reference.
---

## Overview

`$HOME/Documents/research/` is the canonical directory for storing research notes and markdown documentation. All research content should be written here so it persists across sessions and is easily discoverable.

By default, the script creates a timestamped session directory under `research/` named `<YYYYMMDD_HHMMSS>-<project>/`. The project name can be specified with the `-p/--project` flag or auto-derived from the topic-slug (first part before `/`, or the full slug if no slash).

## How to Write Research Notes

**Always use `scripts/write-research.py`** bundled with this skill — never write files directly into `$HOME/Documents/research/`. The script handles:

- YAML frontmatter generation (`title`, `date`, `tags`, `status`)
- Timestamped session directory creation (`<YYYYMMDD_HHMMSS>-<project>/`)
- Path resolution and file naming (`<YYYYMMDD_HHMMSS>-<topic-slug>.md`)
- Content source resolution (stdin, `--content` flag, or `CONTENT` env var — in that order of precedence)

### Writing Research Notes (Sequential Commands)

Always use two sequential commands: write content to a temp file, then pipe it into the script.

```bash
# Step 1 — Write content to a temp file
cat > /tmp/content.md << 'EOF'
# Methodology Report

This is the research content...
EOF

# Step 2 — Run the script, piping the temp file as stdin
uv run scripts/write-research.py my-topic < /tmp/content.md
```

Key rules:
1. **Use a heredoc** to write content into a temp file (like `/tmp/content.md`). This handles multi-line content, special characters, and long text reliably.
2. **Pipe the temp file via stdin** (`< /tmp/content.md`) rather than using env vars or pipes. The script reads from stdin when no `CONTENT` env var is set.
3. **Use `-t` for explicit title** — optional; if omitted, auto-derived from slug.
4. **Use `-p/--project` to specify a project name** — determines the session subdirectory (`<YYYYMMDD_HHMMSS>-<project>/`). If not given, auto-derived from topic-slug (first part before `/`, or full slug).
5. **Use `-f` for explicit output path** — overrides auto-resolution entirely, bypassing timestamped directory creation.
6. **No chaining** — run the heredoc command first, then the script in a separate command.

### Examples

```bash
# Simple note — auto-derives project from slug, creates session dir
cat > /tmp/content.md << 'EOF'
# Proxmox Server Build

Notes about building the production server.
EOF
uv run scripts/write-research.py proxmox-server-build < /tmp/content.md
# → ~/Documents/research/20260523_143000-proxmox-server-build/20260523_143000-proxmox-server-build.md

# With explicit project override
cat > /tmp/content.md << 'EOF'
# Database Migration Notes

Notes about the latest migration.
EOF
uv run scripts/write-research.py db-migration -p k8s-setup < /tmp/content.md
# → ~/Documents/research/20260523_143000-k8s-setup/20260523_143000-db-migration.md

# Multiple notes under the same session directory
cat > /tmp/content.md << 'EOF'
# Cluster Findings

Key results from cluster analysis.
EOF
uv run scripts/write-research.py findings -t "Cluster Findings" \
  -p my-project < /tmp/content.md
# → ~/Documents/research/20260523_143000-my-project/20260523_143000-findings.md

cat > /tmp/content.md << 'EOF'
# Summary Report

Overall summary of findings.
EOF
uv run scripts/write-research.py summary -t "Summary Report" \
  -p my-project < /tmp/content.md
# → ~/Documents/research/20260523_143000-my-project/20260523_143000-summary.md

# Explicit filepath override (bypasses session directory)
cat > /tmp/content.md << 'EOF'
# Deep Learning Overview

Initial findings on model evaluation...
EOF
uv run scripts/write-research.py dl-overview -t "Deep Learning Overview" \
  -f ~/Documents/research/dl-overview.md < /tmp/content.md
```

### File Structure

The script auto-organizes notes into timestamped session directories:

```
~/Documents/research/
├── 20260523_143000-k8s-setup/
│   └── 20260523_143000-k8s-setup.md
└── 20260523_143000-my-project/
    ├── 20260523_143000-findings.md
    └── 20260523_143000-summary.md
```

The script also generates YAML frontmatter automatically:

```yaml
---
title: Your Title
date: 2026-05-23
tags: []
status: draft
---
```

Your markdown content follows the frontmatter. The `tags` and `status` fields are empty by default — edit them after writing if needed.

### Reading Existing Notes

Before writing new notes, **read existing ones** from `$HOME/Documents/research/` to avoid duplication and build on prior work. Use your file reading tools to browse the directory structure and read relevant files.
