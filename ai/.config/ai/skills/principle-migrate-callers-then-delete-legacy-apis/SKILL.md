---
name: principle-migrate-callers-then-delete-legacy-apis
description: Migrate and verify callers before deleting a replaced API or compatibility path.
---

## When
Apply when the task matches this principle's trigger: migrate and verify callers before deleting a replaced api or compatibility path.

## Strict
Apply proportionately without overriding the user's scope, repository policy, or approval boundaries. Do not apply when the principle's trigger is absent.

## Steps
# Migrate callers, then delete legacy APIs

When replacing an API, migrate its callers to the supported interface and verify behavior before removing the old API. Search for remaining usages, account for external compatibility where relevant, and delete the legacy path only when it is no longer needed.

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
