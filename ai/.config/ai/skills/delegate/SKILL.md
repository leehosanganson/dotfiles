---
name: delegate
description: >-
  Coordinate implementation work that can be split into independently scoped
  agent tasks; delegate the slices, reconcile their changes, and verify the
  integrated result. Use when the user has approved multi-agent work with
  clear task boundaries. Do not use for a single bounded task, planning without
  implementation, or when no sub-agent capability is available.
---

## Dispatch

Use the harness's native sub-agent tool to delegate each slice. Do not implement a slice in the caller and claim it was delegated.

- Use parallel dispatch only for independent slices; use sequential dispatch when a slice depends on an earlier result.
- In this repository, `worker` implements focused tasks and `evaluator` reviews them. Use `coder`, `homelab`, or `content` only when a slice itself requires domain planning or delegation.
- If no sub-agent tool is available, state that delegation is unavailable. Proceed inline only when appropriate and report the limitation.

## Before dispatch

1. Read project instructions, relevant documentation, architecture, and conventions.
2. Clarify ambiguities; state assumptions and measurable success criteria.
3. Split the approved scope into independently testable vertical slices. Include interface, implementation, and tests in each slice where applicable.
4. Give each sub-agent a brief with the goal, context, exact scope and exclusions, dependencies, acceptance criteria, verification, permitted files, assumptions, and risks.
5. Identify overlapping files and shared decisions. Assign one owner or serialize conflicting work.

## Integrate and verify

After each group completes:

1. Read each report and inspect the actual diff.
2. Reconcile conflicts against the agreed scope and acceptance criteria. Integrate in dependency order, making only necessary edits.
3. Return incomplete or out-of-scope work for correction before accepting it.
4. Verify the integrated result: inspect scope and interfaces; run applicable formatting, lint, tests, build/type checks, and cross-slice or failure-path checks; confirm documentation and security constraints.
5. Report the result, delegated slices, changed areas, reconciled decisions, verification (including skipped checks), acceptance status, and remaining risks. Do not claim completion while required checks are blocked or failing.
