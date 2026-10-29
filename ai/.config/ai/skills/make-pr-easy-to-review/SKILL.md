---
name: make-pr-easy-to-review
description: Prepare a completed change for reviewer-friendly delivery by clarifying scope, rationale, diff organization, title, description, and commit presentation.
---

## When
Use before opening or handing off a PR when the change is complete and verified.

## Strict
Do not publish, stage, commit, rewrite history, or push unless separately authorized. Never claim checks passed unless they ran.

## Steps
1. Inspect repository guidance, intended changes, branch, commits, and verification.
2. Keep unrelated edits untouched and outside the proposed scope.
3. Check that the diff tells a coherent story and commits are focused where present.
4. Draft a concise title and description with why, what, risks, and actual checks.
5. Use existing raise-pr workflow for publication only when requested.

## Asks You?
Ask before staging, committing, pushing, or when intended PR scope is ambiguous.

## Output
A reviewer-ready change and proposed PR title/body, or a concise blocker list.

## Best Size
Completed, reviewable changes.

## Speed
Focus on scope clarity and truthful verification, not cosmetic churn.

## Edge
Separate unrelated local changes without discarding them.
