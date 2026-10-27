# Bug fix

**Trigger:** A coding defect has a concrete, observable failure.

1. Define the failing behavior and reproduce it before changing code.
2. Trace the failure to a root cause using code and evidence; do not patch speculative causes.
3. Add a regression test that captures the violated business or user-facing contract. If an automated test is not practical, define a repeatable check that verifies the same behavior and note why a test is unsuitable.
4. Make the smallest fix that addresses the root cause without broadening scope.
5. Run the regression test or alternative check and relevant suite, then inspect the diff for unintended changes.

**Boundary:** For homelab symptoms, use an installed infrastructure-diagnosis capability; for known tracked findings, use the repository's issue-fixing workflow. This playbook is for coding defects, not infrastructure diagnosis or general cleanup.
