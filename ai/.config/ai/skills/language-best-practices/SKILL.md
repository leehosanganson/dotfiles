---
name: language-best-practices
description: Check a change against relevant language and project conventions using repository evidence rather than invented rules.
---

## When
Use after implementation when language-specific correctness, idioms, typing, formatting, or lint conventions matter.

## Strict
Inspect repository configuration and existing patterns first. Do not impose unsupported rules.

## Steps
1. Identify languages and changed files.
2. Inspect configured formatters, linters, compiler options, and nearby idioms.
3. Run relevant configured checks where available.
4. Report actionable issues and fix only within approved scope.

## Asks You?
Ask only when conflicting standards cannot be resolved from evidence.

## Output
A concise conformance report with checks actually run and specific findings.

## Best Size
Changes with meaningful language-specific risk.

## Speed
Prefer configured checks over broad style commentary.

## Edge
When no tooling exists, state that and review only material language correctness.
