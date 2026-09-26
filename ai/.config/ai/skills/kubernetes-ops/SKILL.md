---
name: kubernetes-ops
description: >-
  Inspect, troubleshoot, or perform day-to-day operations on Kubernetes workloads,
  namespaces, and manifests with kubectl and Kustomize. Do not use for Flux-managed
  GitOps operations (use gitops-ops) or NixOS host operations. Out of scope: cluster
  bootstrap and disaster recovery.
---

## Operating rules

- Read current state before making changes.
- Validate changes with `kubectl apply --dry-run=server` or `kubectl diff` before applying; check rollout status afterward.
- Prefer declarative GitOps for production changes. Use direct cluster changes only for inspection, troubleshooting, or small ad-hoc fixes that must be backported to Git.
- Never run destructive commands without explicit user confirmation.
- Before cluster-wide changes, identify and confirm the blast radius. Pause and explain impact if a command could evict pods, restart workloads, change external endpoints, or cause downtime.

## Inspect a workload

```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod> -n <namespace>
kubectl logs <pod> -n <namespace> --tail=100
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```

## Edit and apply a manifest

1. Read the current manifest from the repository or cluster.
2. Make the smallest change that meets the request.
3. Validate with `kubectl apply --dry-run=server -f <file>` or `kubectl diff -f <file>`.
4. Apply with `kubectl apply -f <file>` and verify with `kubectl rollout status deployment/<name> -n <namespace>` or the relevant resource check.

For Kustomize overlays, use `kubectl diff -k <dir>` and `kubectl apply -k <dir>`; use `kustomize build <dir>` for local validation when available.

## Troubleshoot

Check events and recent logs, then verify resource requests and limits, node capacity, DNS and networking, endpoints, and probe results.

## Roll back

Get user confirmation before rolling back:

```bash
kubectl rollout undo deployment/<name> -n <namespace>
```

## Ask before

- Deleting any resource.
- Applying changes to multiple namespaces or cluster-scoped resources.
- Changing storage, ingress controllers, cert-manager, or network policies.
- Taking any action that could cause downtime.
