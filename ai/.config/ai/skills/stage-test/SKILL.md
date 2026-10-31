---
name: stage-test
description: >-
  Own the Test stage when assigned by the autopilot coordinator: verify intended
  behavior and assess material regressions. Not for implementing fixes or
  reporting unrun checks as passing.
---

## When
Use only when the autopilot coordinator assigns you ownership of the Test stage, or when a workflow explicitly routes verification to you.

## Strict
You are the assigned stage owner, not the main coordinator. Load and follow the relevant task playbook and capability/principle skills yourself. Do not fabricate test output, benchmark results, or review. Do not run expensive or destructive integration tests without authorization and safeguards.

## Steps
1. Start from the task's acceptance criteria. Invoke `principle-prove-it-works` to exercise the behavior on the real application or system. Use a lower-fidelity surface only when the real one is unavailable, and say so in the report.
2. Run focused tests first, then relevant project checks and integration coverage. Invoke `principle-test-behavior` so tests cover contracts. Invoke `create-verification-skill` when a behavior needs repeated real-surface checks that cannot practically be run once by hand; skip it for one-time checks.
3. Invoke `blast-radius` when the change has downstream callers or external contracts; skip it for internal changes with no callers. Invoke `benchmark-checklist` for every performance-relevant change before reporting a measurement; skip it for other changes.
4. Invoke `code-review` on every non-trivial change. Also invoke `interrogate` for high-risk changes touching authentication, data, concurrency, or external contracts. Skip `code-review` only for documentation-only or configuration-only changes. Do not invoke `swarm` from a delegated stage; perform independent checks sequentially and report any limitation. Do not repeat a review prompt without a distinct question.
5. Report actual commands, outcomes, and unavailable or inconclusive checks. Return to Build for actionable failures; proceed to Deploy only when acceptance evidence is adequate.

### Capability routing
Invoke `create-verification-skill` for repeated real-surface checks, `blast-radius` for downstream or contract risk, and `benchmark-checklist` for performance measurement. Perform independent checks sequentially rather than dispatching child workers. Invoke `code-review` for each non-trivial review and `interrogate` for high-risk changes. Run each review once, even though both appear in this list.

### Exit evidence
Acceptance criteria are verified on the strongest practical surface, relevant checks pass, and limitations are explicit. A compile or unit test alone is not presented as proof of end-to-end behavior when the change requires a real app check.

## Asks You?
Ask the coordinator before expensive or destructive tests lacking authorization or safeguards, or when acceptance criteria are materially ambiguous. Otherwise test against the available evidence and report limitations.

## Output
Return acceptance criteria with actual verification evidence, checks and outcomes, review findings if applicable, unavailable or inconclusive checks, and remaining limitations. Hand actionable failures back to Build; hand verified evidence to Deploy.

## Best Size
Use to verify one assigned change or coherent slice against its acceptance criteria.

## Speed
Run focused tests first. A delegated stage owner performs bounded checks sequentially and never dispatches child workers. Avoid repeating reviews.

## Edge
If the real application/system is unavailable, use the strongest available lower-fidelity surface and state the limitation. Do not advance to Deploy with inadequate acceptance evidence.
