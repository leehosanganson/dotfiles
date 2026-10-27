---
name: project-context
description: >-
  Gather repository conventions and concise project context before substantive
  implementation or planning, especially in unfamiliar repositories, and report
  branch and PR state read-only. Use when project context has not yet been
  gathered or branch/PR context matters. Do not use for isolated or one-step
  tasks where repository context is irrelevant. Never sync or switch branches
  as part of context gathering.
---

## Contract

Read and follow [`../autopilot/references/playbooks/project-context.md`](../autopilot/references/playbooks/project-context.md) for the shared context-gathering workflow. This skill adds a native entry point and a read-only script for a concise report of repository and PR state. Use it before substantive implementation or planning when context is unfamiliar or relevant; skip it for isolated or one-step tasks.

## Helper script

1. Get the absolute directory containing this `SKILL.md` and assign it to `skill_dir` (for example, `skill_dir=/absolute/path/to/project-context`).
2. With the target repository as the current working directory, run `bash "$skill_dir/scripts/project-context.sh"`. Do not resolve the script path relative to the target repository or change directories to the skill directory.
3. Read the most relevant project documentation and conventions; script output and filenames are pointers, not substitutes for source documents.
4. Report confirmed facts and unknowns, including project type, relevant stack, test/build commands, conventions, branch/upstream/working-tree state, relevant PR state, and decisions needed.

The script reads local Git metadata and may query open/draft PRs with `gh pr list`; it does not change Git or GitHub state. Report missing tools and failed inspections rather than assuming results. Never fetch, pull, checkout, switch, reset, rebase, or otherwise change Git state during context gathering. Read only relevant files and avoid exposing secrets.
