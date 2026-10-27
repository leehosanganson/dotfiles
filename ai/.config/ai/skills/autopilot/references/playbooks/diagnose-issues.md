# Diagnose issues

**Trigger:** An unclear homelab or connected-infrastructure symptom has no known owner subsystem yet.

1. Inspect only relevant live state and configuration read-only. Establish evidence and a repeatable check with its pre-change result.
2. If the symptom maps to a specialist skill, hand off the evidence, checks, and unresolved questions; follow that skill's runbook for further diagnosis and changes.
3. If no specialist applies, use local evidence and version-specific authoritative documentation to narrow the cause before changing anything. Make only the smallest authorized fix, use a dry run where possible, and rerun the check.
4. Report evidence, results, blast radius, remaining uncertainty, and rollback or follow-up needs. Obtain approval for destructive or otherwise gated operations.

**Boundary:** This playbook routes and triages; it does not replace GitHub, Flux/GitOps, Kubernetes, or NixOS operating guidance. Bootstrap and disaster recovery are out of scope.
