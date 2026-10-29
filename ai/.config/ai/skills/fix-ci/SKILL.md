---
name: fix-ci
description: Diagnose and fix failing CI checks on an authorized change, then verify the updated checks without bypassing project policy.
---

## When
Use when the user asks to fix failing CI or CI blocks an in-scope delivery task.

## Strict
Do not disable checks, weaken assertions, skip required policy, or claim green status without current evidence. Do not push or publish without authorization.

## Steps
1. Identify exact commit/PR and failing checks.
2. Inspect logs and reproduce locally when practical. Separate code failures, flaky infrastructure, and provider issues.
3. Fix the root cause in scope and add regression coverage where appropriate.
4. Run focused checks and recheck CI on the updated revision when provider access permits.
5. Report remaining flakes or external blockers with evidence.

## Asks You?
Ask before changing workflow policy or when resolution requires out-of-scope credentials or infrastructure.

## Output
Root cause, scoped fix, verification status, and unresolved CI items.

## Best Size
A defined failing check set.

## Speed
Start with failed job logs and avoid unrelated matrices.

## Edge
Treat intermittent failure as unconfirmed until evidence distinguishes flake from regression.
