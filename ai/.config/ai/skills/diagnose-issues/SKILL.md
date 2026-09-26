---
name: diagnose-issues
description: >-
  Investigate and resolve unclear symptoms across homelab or connected infrastructure.
  Do not use for clearly scoped GitHub, Flux/GitOps, Kubernetes, or NixOS operations;
  use the corresponding skill. Out of scope: bootstrap and disaster-recovery procedures.
---

## Workflow

Work through these phases and repeat the relevant phases until the symptom is resolved.

### 1. Explore current state

Inspect live state as well as configuration. Use the commands relevant to the affected system:

```bash
systemctl status <service>
journalctl --since "10 min ago" -u <service>
ps aux | grep <keyword>
ss -tuln | grep <port>
```

```bash
kubectl get pods,events -n <ns> --sort-by='.metadata.name'
kubectl logs <pod> -n <ns> --tail=200
kubectl describe pod <pod> -n <ns>
```

```bash
nixos-rebuild list-generations
systemctl status <unit>
```

```bash
flux status
flux logs --level=error
```

```bash
gh runs view --repo <owner>/<repo>
gh issue view <number>
```

Report findings plainly. Do not propose a fix until current state is understood.

### 2. Define and run repeatable tests

Turn the symptom into concrete acceptance criteria and record pass/fail before changes. Save reusable checks in `<issue>/diagnose.sh` when appropriate.

Examples:

```bash
curl -sf http://<host>:<port>/health || echo FAIL
kubectl get pod <pod> -n <ns> -o jsonpath='{.status.phase}' | grep Running || echo FAIL
diff <running-config> <desired-config>
dig +short <hostname>
```

### 3. Research

Use the `research` skill or web search to check official documentation, recent issues or discussions, and changelogs for the component version in use. Summarize relevant findings before narrowing down causes.

### 4. Fix and validate

1. Apply the smallest change that addresses the likely root cause.
2. Validate with a dry run where available (for example, `kubectl apply --dry-run=server` or `nixos-rebuild test`).
3. Apply the change only within the user's authorization; explain impact and obtain confirmation when required by the relevant operational skill.
4. Re-run every acceptance test. If a test fails, re-explore or research the new symptom, then adjust or revert the change.

## Safety

- Prefer read-only diagnostics before changes.
- Never run destructive commands without explicit user confirmation.
- Describe blast radius before changing shared resources.
- Revert changes that worsen the symptom.

## Report

Summarize the symptom, root cause, tests and before/after results, changes made, and remaining risks or follow-ups.
