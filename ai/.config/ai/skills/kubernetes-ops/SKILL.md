---
name: kubernetes-ops
description: >-
  Run Kubernetes operational tasks safely with kubectl and Kustomize. Load this skill when the user asks to inspect, change, deploy, or troubleshoot Kubernetes workloads, namespaces, or manifests. Use it for day-to-day cluster operations, not for cluster bootstrap or disaster recovery.
---

## Overview

Operate Kubernetes clusters carefully. Prefer reading current state before changing it, validate every manifest change with a dry run, and verify rollouts before moving on.

## Safety Rules

- Always run `kubectl apply --dry-run=server` or `kubectl diff` before applying changes.
- Always check rollout status after applying: `kubectl rollout status ...`.
- Prefer declarative GitOps for production changes; use this skill only for inspection, troubleshooting, or small ad-hoc fixes that must be backported to Git.
- Never run `kubectl delete` or other destructive commands without explicit user confirmation.
- Never make cluster-wide changes (e.g., changing a namespace, CRD, or network policy that affects many workloads) without confirming the blast radius with the user.
- If a command could evict pods, restart workloads, or change external endpoints, pause and explain the impact.

## Common Workflows

### Inspect a workload

```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod> -n <namespace>
kubectl logs <pod> -n <namespace> --tail=100
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```

### Edit a manifest

1. Read the current manifest (`kubectl get ... -o yaml` or from the Git repo).
2. Make the smallest change that achieves the goal.
3. Validate: `kubectl apply --dry-run=server -f <file>` or `kubectl diff -f <file>`.
4. Apply: `kubectl apply -f <file>`.
5. Verify: `kubectl rollout status deployment/<name> -n <namespace>` (or equivalent).

### Kustomize

Use `kubectl apply -k <dir>` and `kubectl diff -k <dir>` for overlays. Validate locally with `kustomize build <dir>` if available.

### Roll back

Only after confirming with the user:

```bash
kubectl rollout undo deployment/<name> -n <namespace>
```

### Troubleshoot

- Check events and recent logs.
- Verify resource requests/limits and node capacity.
- Confirm DNS and networking (Services, Ingress, NetworkPolicies).
- Inspect endpoints and probe results.

## Escalation

Ask the user before:

- Deleting any resource.
- Applying changes to multiple namespaces or cluster-scoped resources.
- Changing storage, ingress controllers, cert-manager, or network policies.
- Any action that could cause downtime.

When in doubt, describe the planned command and its impact, then wait for approval.
