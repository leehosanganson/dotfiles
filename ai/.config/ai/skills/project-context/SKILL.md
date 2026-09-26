---
name: project-context
description: >-
  Gather repository conventions and concise project context before substantive
  implementation or planning, especially in unfamiliar repositories, and report
  branch and PR state read-only. Use when project context has not yet been
  gathered or branch/PR context matters. Do not use for isolated questions or
  one-step tasks where repository context is irrelevant. Never sync or switch
  branches as part of context gathering.
---

## Workflow

For substantive coding tasks, unfamiliar repositories, or relevant branch/PR context:

1. Get the absolute directory containing this `SKILL.md` and assign it to `skill_dir` (for example, `skill_dir=/absolute/path/to/project-context`). With the target repository as the current working directory, run `bash "$skill_dir/scripts/project-context.sh"`. Do not resolve the script path relative to the target repository or change directories to the skill directory.
2. Read the most relevant project documentation and conventions. Stop once you have enough context to plan safely; filenames and script output are pointers, not substitutes for reading relevant guidance.
3. Report a concise project note with confirmed facts and unknowns, covering project type, relevant language/framework, test/build commands, conventions, branch/upstream/working-tree status, relevant PR state, and decisions needed.

Skip this workflow for simple isolated questions or one-step tasks where repository context is irrelevant.

## Safe inspection

The script reads local Git metadata and may query open PRs with `gh pr list`. It does not change repository or GitHub state. Report missing tools and failed inspections instead of assuming results.

- Include branch, working-tree state, latest commit, and ahead/behind status when an upstream is configured; note that tracking data may be stale.
- If `gh` is available, report open/draft PRs or the query failure. Do not infer that an unrelated PR should be continued.
- Never fetch, pull, checkout, switch, reset, rebase, or otherwise change Git state. Ask the user first if context suggests such an operation is needed.

## Discovery

Read only files relevant to the task. Consider README, agent instructions, manifests, build/test tooling, design docs, CI guidance, tests, deployment/configuration, and lint/format settings. Do not dump broad file contents or expose secrets while gathering context.
