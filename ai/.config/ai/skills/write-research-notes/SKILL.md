---
name: write-research-notes
description: >-
  Write research notes and markdown documentation into the canonical research directory at $HOME/Documents/research/. Use whenever an agent needs to save research findings, deep-analysis notes, or any markdown content that should persist across sessions. Agents may also read existing notes from this directory for reference.
---

## Overview

`$HOME/Documents/research/` is the canonical directory for storing research notes and markdown documentation. All research content should be written here so it persists across sessions and is easily discoverable.

## How to Write Research Notes

**Always use `scripts/write-research.py`** bundled with this skill — never write files directly into `$HOME/Documents/research/`. The script handles:

- Directory creation (creates any missing parent directories)
- YAML frontmatter generation (`title`, `date`, `tags`, `status`)
- Path resolution and file naming

### Running the Script

Use `uv run` so the Python environment is available even inside sandboxed agent contexts that block pipes. This avoids shell-pipe restrictions entirely:

```bash
# Method A — pipe content via stdin (works in most agents)
echo "Your markdown content here" | uv run --with yq scripts/write-research.py topic-slug "Title of Research Note"

# Method B — write a temp file then pass it (avoids pipes entirely)
printf "Your markdown content here" > /tmp/research-input.md
uv run --with yq scripts/write-research.py topic-slug "Title of Research Note" < /tmp/research-input.md

# Method C — use Python directly if uv is not available
echo "Your markdown content here" | python3 scripts/write-research.py topic-slug "Title of Research Note"
```

**Recommended for agents:** Use Method B (redirect from a temp file) when the agent framework blocks pipes. The `uv run` ensures any Python dependencies are resolved before execution.

#### Examples

```bash
# Simple note (goes at top level)
echo "# Proxmox Server Build\n\nNotes about building the production server." \
  | uv run scripts/write-research.py proxmox-server-build "Proxmox Server Build"

# Organized under a subfolder
echo "# Kubernetes Setup\n\nInitial cluster configuration notes." \
  | uv run scripts/write-research.py k8s-setup "Kubernetes Setup"

# With explicit subfolder argument (avoids slash-in-slug)
printf "# Deep Learning Notes" > /tmp/dl.md
uv run --with yq scripts/write-research.py dl-overview "Deep Learning Overview" ai-ml < /tmp/dl.md
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
