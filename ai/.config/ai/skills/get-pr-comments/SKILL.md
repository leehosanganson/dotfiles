---
name: get-pr-comments
description: Gather and summarize review comments for a specified pull request into actionable findings without posting replies or changing code.
---

## When
Use when asked to list or triage comments on an identified PR.

## Strict
Use authorized provider tools only. Do not expose unrelated private data, post comments, or modify code.

## Steps
1. Identify the exact repository and PR.
2. Inspect review threads, general comments, and relevant statuses with available provider interfaces.
3. Group actionable requests, questions, resolved threads, and non-actionable discussion.
4. Link findings to file/line where possible and note ambiguity.

## Asks You?
Ask for the PR identifier if context cannot resolve it.

## Output
A concise, deduplicated action list with source locations and unresolved items.

## Best Size
One PR or explicitly scoped stack.

## Speed
Avoid repeated polling unless requested.

## Edge
If provider access is unavailable, state that; do not fabricate comments.
