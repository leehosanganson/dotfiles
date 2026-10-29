---
name: interrogate
description: Adversarially inspect a proposed design or changed diff for correctness gaps, hidden assumptions, and failure cases before shipping.
---

## When
Use for contested or high-impact designs and diffs where an adversarial pass could uncover material risk.

## Strict
Review evidence and actual changes, not imagined requirements. Distinguish defects from preferences. Use independent reviewers only if supported.

## Steps
1. Read task contract, design, diff, and relevant callers/tests.
2. Attack assumptions, boundaries, error paths, compatibility, concurrency, and security relevant to scope.
3. Give dispatched reviewers distinct questions and reconcile findings independently.
4. Return actionable findings with evidence and severity; recheck fixes.

## Asks You?
Ask only if the contract itself is materially ambiguous.

## Output
Prioritized, evidence-linked findings or an explicit no-material-issue result for inspected scope.

## Best Size
Risk-based review of a specific design or diff.

## Speed
Focus on highest-risk assumptions; avoid duplicate review passes.

## Edge
If the diff is empty or out of scope, report that rather than reviewing unrelated code.
