# Bug fix

**Trigger:** A coding defect has a concrete, observable failure.

1. Invoke `project-context` unless conventions were already gathered earlier in this session.
2. Invoke `principle-read-before-writing` on the failing path, its callers, and its tests before editing.
3. Reproduce the failure before changing code. Invoke `principle-prove-it-works` to choose evidence that exercises it. If reproduction is impossible, report the blocker; do not guess.
4. Trace the root cause from code and evidence; do not patch speculative causes. Invoke `principle-attack-the-premise` if a second fix built on the same assumption fails.
5. Write a regression test for the violated contract with `tdd` and `principle-test-behavior`. Skip `tdd` only when no automated path is affordable; then define a repeatable check and state in the report why a test is unsuitable.
6. Make the smallest fix at the root cause. Invoke `principle-surgical-changes` to keep the diff within the defect.
7. Run the regression test and the relevant suite. Invoke `language-best-practices` on changed source, then inspect the diff for unintended changes.
8. Invoke `code-review` when the fix touches shared code, a public interface, or several modules. Skip it for a single-function fix that the regression test fully covers.

**Boundary:** For homelab symptoms, use an installed infrastructure-diagnosis capability; for known tracked findings, use the repository's issue-fixing workflow. This playbook is for coding defects, not infrastructure diagnosis or general cleanup.
