---
description: Definition of Done gate — every code change must pass unit tests, e2e tests, and an isolated review cycle before being marked complete. No trivial tests or hand-waving allowed.
---

# Definition of Done (MANDATORY)

No code change, feature, bug fix, refactor, or work item is considered **done** until it satisfies all gates below. This rule applies to every pass in the Worker→Evaluator lifecycle and is validated by both Evaluator and Dispatcher.

## Gate 1 — Unit Tests

Every code change MUST include unit tests that exercise the modified logic.

- **No trivial tests**: A test that only asserts a hard-coded literal (`assert x == 42`), checks an identity function, or verifies no-op behavior does not count.
- **Behavioral assertions**: Tests must verify that changing inputs produces different outputs, or that error paths raise the correct exceptions. If the business logic changes, at least one test must be sensitive enough to fail when the logic is wrong.
- **Coverage of edge cases**: Boundary conditions, null/empty inputs, and error paths must have dedicated test coverage where applicable.
- **No test-only files for untested code**: Creating a new test file with no corresponding production code changes is not a valid "done" signal.

The Evaluator MUST verify that tests are meaningful — not just present. A test suite with 50 assertions all checking `assert True` is not done.

## Gate 2 — E2E Tests (When Applicable)

For changes that touch user-facing behavior, APIs, or integration points:

- **End-to-end flows** must be tested where the change affects observable system behavior.
- **No mocking out the changed code**: If the modified code is under test, it should execute in the E2E test (or a real/fake implementation), not be stubbed/mocked away entirely.
- **Integration points**: Database queries, network calls, file I/O changes must have E2E or integration-level coverage appropriate to the project's testing infrastructure.

If the project has no existing E2E framework, the Worker should note this as a known limitation — but the gate still requires writing what E2E tests are feasible with available tooling.

## Gate 3 — Isolated Review Cycle

Every code change MUST be reviewed by an isolated agent workflow before being marked complete.

- **Evaluator independence**: The Evaluator must assess the Worker's output against objective criteria without pressure to approve. See `agents/evaluator.md` for independence guarantees.
- **Mandatory re-dispatch on issues**: If the Evaluator returns `failed` or `incomplete`, the Dispatcher MUST retry with a new Worker pass addressing the specific issues. The item is not done until a pass achieves `success`.
- **No skipping review**: An Architect or Dispatcher must never accept code changes without running them through the Worker→Evaluator cycle. Self-approval is forbidden.

## Gate 4 — Report-Back Compliance (See `rules/report-back.md`)

The Worker's handoff summary must be present, clear, and accurate. A poor report-back alone is grounds for rejection regardless of implementation quality. This is enforced by both Evaluator and Dispatcher.

## Gate 5 — No Regressions

The change must not introduce:

- **Security vulnerabilities**: Secrets in code, exposed credentials, unsafe deserialization.
- **Breaking changes** without explicit scope authorization.
- **Test failures** in existing test suites (unless the existing tests are themselves trivial or incorrect per Rule 7).

## Enforcement Protocol

| Agent | Responsibility |
|-------|----------------|
| **Architect** | Ensures task items include explicit acceptance criteria that reference testing requirements. Never dispatches work without defining what "done" looks like for each item. |
| **Dispatcher** | Validates that every Worker pass includes test coverage before running Evaluator. If no tests are present, marks as `failed` with rationale "Definition of Done Gate 1/2 not met — missing unit/e2e tests." |
| **Evaluator** | Assesses test quality (not just presence). Checks for trivial tests per Gate 1. Verifies no regressions per Gate 5. Reports findings on test adequacy as issues. |
| **Worker** | Implements tests alongside code changes. Does not mark scope complete until tests pass locally. Includes test files in report-back. |

## When Tests Are Not Feasible

If a change genuinely cannot be tested (e.g., highly environment-specific behavior with no testing infrastructure):

1. The Worker must document **why** testing is not feasible in the Notes section.
2. The Evaluator may accept `success` without tests — but only when this justification is credible and documented.
3. The Architect should create a follow-up todo item to improve test coverage for that area.

---
