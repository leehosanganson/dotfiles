---
name: write-research-notes
description: >-
  Write research notes and markdown documentation for persistent project memory. In agent workflows, use this skill when an orchestrator provides a full output file path and you need to write markdown notes safely via --target.
---

## Contract-Safe Usage (Read First)

For agent workflows, this skill has a strict path contract:

- **MUST pass the orchestrator-provided full output file path to `--target`.**
- **MUST include `-p/--project`** (script-required).
- **MUST NOT omit `--target` in agent workflows.** Omitting `--target` can cause wrong-path writes.
- **MUST NOT invent timestamped paths or directories.** The orchestrator provides the path; agents must not derive it.

If `--target` is omitted, the script auto-generates a timestamped path under `~/Documents/research/...`. That script behavior is valid in standalone CLI usage, but **not safe for agent workflows** where output location is orchestrator-controlled.

## Command

```bash
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py [topic-slug] --content /path/to/content.md -t "Title" -p project-name --target /absolute/output/path.md
```

## Argument Requirements

### Script-Level Requirements (enforced by `write-research.py`)

| Argument          | Required | Description                              |
| ----------------- | -------- | ---------------------------------------- |
| `topic-slug`      | Yes      | URL-friendly note slug                   |
| `--content`       | Yes      | Path to non-empty markdown source file   |
| `-t/--title`      | Yes      | Note title for frontmatter               |
| `-p/--project`    | Yes      | Project name (required by argparse)      |
| `--target`        | No       | Explicit output path override            |

### Workflow-Level Requirements (agent contract)

- `--target` is **required** in agent workflows.
- Path must come from the orchestrator.
- Agents must not derive timestamps, session directories, or output filenames.

## Safe Workflow

1. Write markdown body to a temp file (for example, `/tmp/content.md`).
2. Use the orchestrator-provided full path as `--target`.
3. Run command with all required args: `topic-slug`, `--content`, `-t`, `-p`, `--target`.

## Valid Examples (contract-safe)

```bash
uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py k8s-setup \
  --content /tmp/content.md \
  -t "K8s Setup" \
  -p infrastructure \
  --target /home/ansonlee/Documents/research/infrastructure/k8s-setup.md

uv run $AI_SKILL_DIR/write-research-notes/scripts/write-research.py findings \
  --content /tmp/content.md \
  -t "Cluster Findings" \
  -p my-project \
  --target /home/ansonlee/Documents/research/my-project/findings.md
```

## Forbidden / Unsafe Patterns

- ❌ Omitting `--target` in agent workflows.
  - Why unsafe: script auto-resolves to a timestamped location, which can write to the wrong path for orchestrated runs.
- ❌ Omitting `-p/--project`.
  - Why unsafe: script exits with required-argument error.
- ❌ Inventing timestamp-based paths/directories manually.
  - Why unsafe: violates workflow contract; orchestrator already provides the exact destination path.
- ❌ Assuming separate runs will land in the same auto-generated session directory.
  - Why unsafe: timestamped auto-resolution is time-dependent.
- ❌ Passing inline markdown via pipes/heredocs instead of `--content` file.
  - Why unsafe: unsupported by this script contract.

## Validation Notes

- Script enforces `topic-slug`, `--content`, `-t/--title`, and `-p/--project`.
- `--target` overrides auto-resolution completely.
- In agent workflows, treat `--target` as mandatory contract input from orchestrator.

## Practical Reminder

Write notes early and often, but always follow the path contract above. Before adding new notes, read existing project notes to avoid duplicating prior work.
