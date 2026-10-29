---
name: deslop
description: Remove unnecessary generated-looking noise from a change diff while preserving behavior, useful context, and user intent.
---

## When
Use as a cleanup pass when the diff may contain filler, duplication, overengineering, or unrelated edits.

## Strict
Read the whole diff and surrounding code. Do not change behavior or delete useful comments, tests, safeguards, or user-authored work.

## Steps
1. Identify approved scope and inspect the full diff.
2. Flag boilerplate, redundant abstractions, gratuitous defensive code, duplicated logic, and unrelated formatting.
3. Remove only clearly unnecessary material.
4. Re-run affected checks and inspect the cleaned diff.

## Asks You?
Ask before removing material with unclear ownership or intentional meaning.

## Output
A smaller, clearer diff or a short report that no unjustified noise was found.

## Best Size
Reviewable implementation diffs.

## Speed
Prefer subtraction; do not create a cleanup project.

## Edge
Comments and explicit branches may encode hidden contracts. Check before deleting.
