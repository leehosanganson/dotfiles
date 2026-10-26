# Diagnose issues

**Trigger:** An unclear symptom spans homelab or connected infrastructure and the affected subsystem is not yet known.

1. Start with read-only inspection of live state and configuration. Report evidence before proposing a fix.
2. Define repeatable acceptance checks and capture their pre-change pass/fail state; save a reusable diagnostic check when appropriate.
3. Research version-specific behavior in authoritative documentation or release notes when local evidence is insufficient.
4. Narrow the cause before changing anything. Make the smallest authorized fix, use a dry run where possible, then rerun the acceptance checks and compare results.
5. Describe blast radius, remaining uncertainty, and rollback/follow-up needs. Obtain approval for destructive or otherwise approval-gated operations.

**Boundary:** For clearly scoped Kubernetes, Flux/GitOps, NixOS, or GitHub operations, use the corresponding specialist skill. Bootstrap and disaster recovery are out of scope.
