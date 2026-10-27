---
name: diagnose-issues
description: >-
  Triage unclear symptoms across homelab or connected infrastructure when the
  affected subsystem is not yet known. Hand off once the issue maps to a domain
  skill such as GitHub, Flux/GitOps, Kubernetes, or NixOS. Not for scoped
  operations, bootstrap, or disaster recovery.
---

## Workflow

Use this skill to identify the affected subsystem and establish evidence, not as a replacement for domain runbooks.

1. Inspect relevant live state and configuration read-only. Start with the reported symptom; avoid broad command sweeps or commands from unrelated platforms.
2. Define a repeatable check and record its pre-change result. Save it only when it will be reused.
3. If the issue maps to a specialist skill, hand off with the evidence, checks, and unresolved questions. Follow that skill for further diagnosis or changes.
4. If no specialist applies, use local evidence and version-relevant documentation to narrow the cause. Make only the smallest authorized fix, validate it, and repeat the check.
5. Report evidence, likely cause, checks and results, changes, and remaining uncertainty or risks.

Prefer read-only inspection. Describe blast radius and obtain confirmation for destructive or otherwise approval-gated operations. Do not propose a fix before the current state supports it.
