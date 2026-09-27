---
name: explain
description: >-
  Interactively explain current branch changes or specific changes the user asks
  about, using the diff and surrounding context. Use when the user wants to
  understand what changed and why. Do not use to implement, review, or fix
  changes, or for generic tutorials unrelated to an actual diff.
---

## Walkthrough

1. **Establish scope.** Ask what the user wants to understand if it is unclear. Otherwise identify the current branch changes or the requested files, commits, or hunks. State the scope before explaining. If there are no relevant changes, say so and ask what target they intended.
2. **Gather context.** Inspect the relevant diff, then read nearby source and any directly relevant documentation or tests. Include enough context to explain how the change fits into existing behavior; do not expand into unrelated areas.
3. **Explain in small chunks.** Start with a short map of the change, then cover one coherent piece at a time. For each, explain its purpose and behavior, and relevant design rationale when the code or context supports it. Distinguish observed facts from inferred intent; label uncertainty rather than presenting a guess as fact.
4. **Keep it interactive.** Pause after each chunk and invite questions or an explicit request to continue. Adapt terminology, pace, and depth to the user's responses and stated familiarity. Check comprehension lightly when useful, without turning the walkthrough into a quiz.
5. **Stay read-only.** Do not edit files, implement suggestions, review the change for defects, or fix issues. If the user asks for one of those tasks, clarify that it is outside this walkthrough and let them choose whether to switch tasks.
6. **Finish clearly.** When the user is done or the relevant scope is covered, recap the main changes and their behavior, and list any open questions or uncertainties.
