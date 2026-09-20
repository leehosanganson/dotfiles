---
name: delegate
description: >-
  Coordinates multi-agent implementation work by splitting a goal into independent
  vertical slices, delegating them in parallel where safe, and integrating and
  verifying the resulting changes for the caller.
---

## Overview

Use this skill when a task contains multiple implementation slices that can be
worked on independently. This is the preferred coordination model for replacing
ad-hoc or purely sequential dispatch: the caller owns decomposition,
contracts, integration, reconciliation, and the final report; subagents own only
their assigned vertical slice.

Invoke it as `/delegate` through OpenCode's native skill loader. This is a skill
module, not a command file; do not create or depend on a commands symlink.

## Before Delegating

1. Read the repository instructions, relevant documentation, and the files that
   define the current architecture and conventions.
2. State assumptions and clarify ambiguous requirements rather than guessing.
3. Define success criteria and split the work into independently testable,
   end-to-end vertical slices. A slice should include the relevant interface,
   implementation, and tests—not merely a layer such as “edit models.”
4. For every slice, write a task brief containing:
   - context and the user/product goal;
   - exact scope and explicit out-of-scope items;
   - dependencies and shared interfaces;
   - acceptance criteria and required verification;
   - files or areas the subagent may change;
   - known risks, assumptions, and likely conflicts.

## Parallel Subagent Workflow

- Dispatch independent slices in parallel using separate subagents. Include the
  full context, scope, constraints, acceptance criteria, and test expectations in
  each prompt; do not make a subagent infer the contract from another slice.
- Keep dependent slices sequential. If slice B needs an output or interface from
  slice A, finish and verify A first, then pass the relevant result to B.
- Identify conflicts before dispatch: overlapping files, incompatible API
  decisions, schema or migration ordering, shared configuration, generated files,
  and mutually exclusive design choices. Either assign ownership of the shared
  area to one slice or serialize the conflicting work.
- Require each subagent to stay within scope, inspect local conventions, write
  behavioral tests for modified logic, run applicable existing tests, and report
  changed files, verification, assumptions, and unresolved issues.
- Do not ask subagents to perform unrelated cleanup or silently broaden the
  specification.

## Caller Integration and Reconciliation

The caller is the integration owner. After each parallel group completes:

1. Collect every subagent report and inspect the actual diff; do not trust a
   summary in place of repository state.
2. Reconcile overlapping decisions against the original acceptance criteria,
   project conventions, and the declared ownership/dependency plan. Resolve
   conflicts explicitly by the caller instead of blending incompatible
   behavior.
3. Integrate changes in dependency order. Preserve correct work, and make only
   the smallest edits needed to resolve conflicts or fulfill the agreed contract.
4. If a slice is incomplete or violates its contract, send focused feedback back
   to that subagent (or reassign the slice) before declaring the group integrated.
5. Update the shared task status and record decisions that affect later slices.

## Integrated Verification

Once all slices are reconciled, verify the product as a whole, not just each
slice:

- inspect the final diff and confirm scope, interfaces, migrations, and generated
  artifacts are coherent;
- run formatting, linting, unit tests, integration/E2E tests, and build or type
  checks available in the repository;
- exercise cross-slice behavior and failure paths, especially shared APIs,
  persistence, configuration, and user-facing flows;
- confirm acceptance criteria, security constraints, and documentation impacts;
- report any environment-limited checks honestly and identify the remaining risk.

## Final Report

Report to the caller with:

1. a concise summary of the integrated result;
2. the slices delegated and their outcomes;
3. files or major areas changed;
4. conflicts or decisions reconciled by the caller;
5. verification commands and results, including skipped checks and why;
6. acceptance criteria status and any remaining risks or follow-up work.

Do not claim completion until the integrated verification is finished. If a
dependency, conflict, or failed verification blocks completion, state the blocker
and the minimum next action instead.
