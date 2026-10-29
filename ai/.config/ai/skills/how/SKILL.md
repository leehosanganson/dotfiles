---
name: how
description: Explain how a codebase, subsystem, or behavior works from source evidence. Use before changing unfamiliar code or for read-only technical explanations. Do not use to explain motivation alone or a diff walkthrough.
---

## When
Use to understand architecture, control/data flow, ownership, or runtime behavior. Use why for historical rationale and explain for an interactive walkthrough of a specific diff.

## Strict
Ground claims in inspected source, tests, docs, or observed behavior. Mark inference as inference. Stay read-only unless the user separately asks for changes.

## Steps
1. Identify the question and scope.
2. Trace entry points, key data shapes, calls, state changes, tests, and relevant configuration.
3. Explain the flow compactly and point to files or symbols.
4. List important gotchas or unverified assumptions.

## Asks You?
Ask only if the target subsystem or behavior is unclear and cannot be inferred safely.

## Output
A concise, evidence-backed explanation of what happens and where.

## Best Size
One subsystem or user-visible behavior. Route broad investigations through research or a custom playbook.

## Speed
Read the shortest evidence path that answers the question.

## Edge
If observed behavior contradicts source expectations, report the discrepancy and propose a reproducible next check.
