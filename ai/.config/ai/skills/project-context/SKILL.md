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

Use this skill before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar or relevant. Skip it for isolated questions and simple one-step tasks where repository context is irrelevant. Do not continue a prior task or PR merely because it appears in status.

## Workflow

1. Inspect repository instructions and the nearest relevant documentation, code, tests, and tooling. Read only what is needed to ground the work. Apply `principle-context-boundaries` and `principle-minimize-reader-load`.
2. Run the helper script: resolve this skill's directory and run its `scripts/project-context.sh` with the target repository as the current working directory. Treat its output and filenames as pointers, not substitutes for the source documents.
3. Report confirmed facts and unknowns, including project type, relevant stack, test/build commands, conventions, branch/upstream/working-tree state, relevant PR state, and decisions needed. Separate facts from unknowns.

The helper reads local Git metadata and does not change Git state. It may query pull-request state only when an optional provider integration is configured. Report missing capabilities and failed inspections rather than assuming results. Never fetch, pull, checkout, switch, reset, rebase, or otherwise change Git state during context gathering. Avoid exposing secrets.
