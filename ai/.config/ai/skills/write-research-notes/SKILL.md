---
name: write-research-notes
description: >-
  Write research notes and markdown documentation into the canonical research directory at $HOME/Documents/research/. Use whenever an agent needs to save research findings, deep-analysis notes, or any markdown content that should persist across sessions. Agents may also read existing notes from this directory for reference.
---

## Overview

`$HOME/Documents/research/` is the canonical directory for storing research notes and markdown documentation. All research content should be written here so it persists across sessions and is easily discoverable.

## How to Write Research Notes

**Always use `scripts/write-research.py`** bundled with this skill — never write files directly into `$HOME/Documents/research/`. The script handles:

- YAML frontmatter generation (`title`, `date`, `tags`, `status`)
- Directory creation (creates any missing parent directories)
- Path resolution and file naming
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
uv run scripts/write-research.py topic-slug -f ~/Documents/research/topic-slug.md < /tmp/content.md
```

Key rules:
1. **Use a heredoc** to write content into a temp file (like `/tmp/content.md`). This handles multi-line content, special characters, and long text reliably.
2. **Pipe the temp file via stdin** (`< /tmp/content.md`) rather than using env vars or pipes. The script reads from stdin when no `CONTENT` env var is set.
3. **Use `-t` for explicit title** — optional; if omitted, auto-derived from slug.
4. **Use `-f` for explicit output path** — overrides auto-resolution to `$HOME/Documents/research/<topic-slug>.md`.
5. **No chaining** — run the heredoc command first, then the script in a separate command.

### Examples

```bash
# Simple note (auto-resolves path)
cat > /tmp/content.md << 'EOF'
# Proxmox Server Build

Notes about building the production server.
EOF
uv run scripts/write-research.py proxmox-server-build < /tmp/content.md

# With explicit title and output path
cat > /tmp/content.md << 'EOF'
# Deep Learning Overview

Initial findings on model evaluation...
EOF
uv run scripts/write-research.py dl-overview -t "Deep Learning Overview" \
  -f ~/Documents/research/dl-overview.md < /tmp/content.md

# Organized under a subfolder (auto-resolved via slug)
cat > /tmp/content.md << 'EOF'
# Kubernetes Setup

Initial cluster configuration notes.
EOF
uv run scripts/write-research.py k8s-setup < /tmp/content.md
```

### File Structure

The script generates YAML frontmatter automatically:

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

### Organization Tips

Organize notes into subfolders by project, topic, or category:

- `server-infrastructure/` — server setup, networking, storage
- `development-tools/` — IDE configs, CI/CD, devops
- `ai-ml/` — ML research findings, model evaluations
- Any custom subfolder that makes sense for your workflow
