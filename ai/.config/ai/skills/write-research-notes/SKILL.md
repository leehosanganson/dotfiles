---
name: write-research-notes
description: >-
  Write research notes and markdown documentation into the canonical research directory at $HOME/Documents/research/. Use whenever an agent needs to save research findings, deep-analysis notes, or any markdown content that should persist across sessions. Agents may also read existing notes from this directory for reference.
---

## Overview

`$HOME/Documents/research/` is the canonical directory for storing research notes and markdown documentation. All research content should be written here so it persists across sessions and is easily discoverable.

## How to Write Research Notes

**Always use `scripts/write-research.sh`** bundled with this skill — never write files directly into `$HOME/Documents/research/`. The script handles:

- Directory creation (creates any missing parent directories)
- YAML frontmatter generation (`title`, `date`, `tags`, `status`)
- Path resolution and file naming

### Usage

```bash
# Basic usage: writes to $HOME/Documents/research/<topic-slug>.md
echo "Your markdown content here" | scripts/write-research.sh topic-slug "Title of Research Note"

# With subfolder: writes to $HOME/Documents/research/<subfolder>/<topic-slug>.md
echo "Your markdown content here" | scripts/write-research.sh subfolder/topic-slug "Title of Research Note"
```

#### Examples

```bash
# Simple note (goes at top level)
echo "# Proxmox Server Build\n\nNotes about building the production server." \
  | scripts/write-research.sh proxmox-server-build "Proxmox Server Build"

# Organized under a subfolder
echo "# Kubernetes Setup\n\nInitial cluster configuration notes." \
  | scripts/write-research.sh k8s-setup "Kubernetes Setup"
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
