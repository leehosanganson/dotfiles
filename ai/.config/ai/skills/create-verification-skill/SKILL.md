---
name: create-verification-skill
description: Create a reusable behavior-verification skill or script when an application behavior needs repeatable real-surface validation.
---

## When
Use when recurring or difficult-to-reproduce behavior lacks a practical verification path.

## Strict
Do not add a verifier for a one-off check unless requested. Follow repository conventions. Never claim a check passes without running it.

## Steps
1. Define behavior, preconditions, observable success, cleanup, and failure signal.
2. Inspect existing tests, scripts, app launch workflows, and available capabilities.
3. Choose the smallest reusable verifier, using a verify-behavior name when appropriate.
4. Make setup and teardown safe and repeatable; do not target production or destructive state without safeguards.
5. Run it on the intended surface and document prerequisites and limits.

## Asks You?
Ask before using production data, destructive operations, credentials, or unclear target environments.

## Output
A reusable verifier with command, prerequisites, assertions, cleanup, and execution evidence where possible.

## Best Size
Repeated or hard-to-verify behavior.

## Speed
Prefer existing test infrastructure and add only the missing lever.

## Edge
If real-surface access is unavailable, report that execution remains unverified.
