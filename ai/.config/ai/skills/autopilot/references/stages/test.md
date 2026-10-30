# Test stage

## Purpose

Establish evidence that the intended behavior works and that material regressions are unlikely.

## Steps

1. Start from the task's acceptance criteria. Invoke `principle-prove-it-works` to exercise the behavior on the real application or system. Use a lower-fidelity surface only when the real one is unavailable, and say so in the report.
2. Run focused tests first, then relevant project checks and integration coverage. Invoke `principle-test-behavior` so tests cover contracts. Invoke `create-verification-skill` when a behavior needs repeated real-surface checks that cannot practically be run once by hand; skip it for one-time checks.
3. Invoke `blast-radius` when the change has downstream callers or external contracts; skip it for internal changes with no callers. Invoke `benchmark-checklist` for every performance-relevant change before reporting a measurement; skip it for other changes.
4. Invoke `code-review` on every non-trivial change. Also invoke `interrogate` for high-risk changes touching authentication, data, concurrency, or external contracts. Skip `code-review` only for documentation-only or configuration-only changes. Invoke `swarm` for two or more independent checks when workers are available. Do not repeat a review prompt without a distinct question.
5. Report actual commands, outcomes, and unavailable or inconclusive checks. Return to Build for actionable failures; proceed to Deploy only when acceptance evidence is adequate.

## Capability routing

Invoke `create-verification-skill` for repeated real-surface checks, `swarm` for independent parallel checks when workers are available, `blast-radius` for downstream or contract risk, and `benchmark-checklist` for performance measurement. Invoke `code-review` for each non-trivial review and `interrogate` for high-risk changes. Run each review once, even though both appear in this list.

## Exit evidence

Acceptance criteria are verified on the strongest practical surface, relevant checks pass, and limitations are explicit. A compile or unit test alone is not presented as proof of end-to-end behavior when the change requires a real app check.

## Boundaries

Do not fabricate test output, benchmark results, or review. Do not run expensive or destructive integration tests without authorization and safeguards.
