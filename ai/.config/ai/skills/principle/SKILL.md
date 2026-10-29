---
name: principle
description: Consult the relevant shared engineering principle for a decision; use named principle skills for their scoped triggers.
---

## When
An engineering workflow needs a cross-cutting constraint such as evidence, simplicity, safe concurrency, or behavior-focused testing.

## Strict
Choose only relevant principles. The named `principle-*` skills are the canonical leaf guidance. Do not load every principle by default or duplicate their text in task playbooks.

## Steps
1. Read the [principle index](../autopilot/references/principles/AGENTS.md) to locate the applicable principle.
2. Invoke or read the matching `principle-*` skill in full when its trigger applies.
3. Apply the guidance to the specific decision and note the concrete effect when useful.
4. Give subagents the relevant principle skill names and allow them to consult them for their scoped task.

## Asks You?
No clarification is needed to apply a principle. Ask only if its application conflicts with the user's stated requirements or policy.

## Output
A decision shaped by applicable principles, without loading unrelated guidance.

## Best Size
Any task where a specific principle materially affects the work.

## Speed
Use the index to select narrowly; do not load the whole catalog.

## Edge
This skill is an index, not a replacement for the individual principle skills or task playbooks.
