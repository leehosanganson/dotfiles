---
name: principle-temp-files
description: Keep temporary artifacts in approved scratch locations and remove them when finished.
---

## When
Apply when the task matches this principle's trigger: keep temporary artifacts in approved scratch locations and remove them when finished.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Temporary files

Create temporary files in the harness-provided scratch directory when one exists; otherwise use `$TMPDIR` or `/tmp`. Remove them when finished; never leave temporary artifacts in the repository or other project paths.

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
