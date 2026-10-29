---
name: principle-makefile-first
description: Prefer established Makefile targets over raw commands when a project provides them.
---

## When
Apply when the task matches this principle's trigger: prefer established makefile targets over raw commands when a project provides them.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Makefile first

When the repository has a `Makefile`, inspect `make help` or its targets and prefer `make <target>` over raw commands. If a recurring project command has no target, consider adding one; use direct shell commands for one-off work.

## Asks You?
Ask only when applying the principle requires a genuine product choice or conflicts with stated requirements. Otherwise use evidence and the task's constraints.

## Output
A decision or implementation shaped by this principle, with the concrete effect stated when material.

## Best Size
Use only for decisions within this principle's scope; ordinary unrelated tasks do not need it.

## Speed
Apply the smallest relevant guidance. Avoid loading unrelated principles.

## Edge
If the principle conflicts with task-specific evidence or higher-priority safety policy, surface the conflict and follow the applicable policy.
