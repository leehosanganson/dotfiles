---
name: principle-context-boundaries
description: Prefer local authoritative project evidence and retrieve external information only to resolve concrete factual gaps.
---

## When
Choosing sources for repository-specific or external questions.

## Strict
Do not assume tools, paths, or runtime behavior transfer across environments. Avoid unnecessary sensitive or unrelated context.

## Steps
1. Check user-provided and local repository evidence first for project-specific questions.
2. Identify any concrete fact local evidence cannot establish.
3. Use an authorized current external source when that gap matters.
4. Separate sourced facts, inference, and unknowns.

## Asks You?
Ask before accessing restricted data or taking external actions that need authorization.

## Output
An answer grounded in the right source boundary, with limitations stated.

## Best Size
Repository, runtime, or multi-source investigations.

## Speed
Keep inspection relevant and minimize context transfer.

## Edge
Use `principle-web-search` for current public facts; external browsing is not a substitute for reading local source.
