---
name: gitops-ops
description: >-
  Inspect, troubleshoot, or operate a Flux CD GitOps installation, including its
  sources, Kustomizations, HelmReleases, and OCI artifacts. Use for Flux bootstrap
  and reconciliation; do not use for general Kubernetes or NixOS operations. Out of
  scope: cluster bootstrap and disaster recovery.
---

## Operating rules

- Treat Git as the source of truth. Make managed-resource changes in Git, not directly in the cluster; reconcile after committing.
- Never use `kubectl edit` or `kubectl delete` on Flux-managed resources.
- Validate manifests with `kustomize build` or `flux build kustomization` before committing.
- Encrypt secrets in Git with SOPS; never commit plaintext Kubernetes Secrets.
- Ask before suspending or deleting a Kustomization, Source, or HelmRelease, running `flux uninstall`, changing the bootstrap path or repository, or taking an action that could cause downtime. Explain impact before any uncertain action.

## Inspect

```bash
flux get all
flux get sources all
flux get kustomizations
flux get helmreleases
flux status
flux logs
flux logs --level=error
kubectl get events -n flux-system --sort-by='.lastTimestamp'
```

For troubleshooting, check Source status first, then the Kustomization, then the HelmRelease.

## Validate and reconcile

Preview changes with `flux diff kustomization <name>` or `flux build kustomization <name>`. After committing a Git change, reconcile the relevant source and resource:

```bash
flux reconcile source git <name>
flux reconcile kustomization <name>
flux reconcile source helm <name>
flux reconcile helmrelease <name>
```

## Handle drift

Flux will restore a managed resource changed manually. For an authorized emergency change, suspend the owning Kustomization, make the change, backport it to Git immediately, then resume reconciliation. Get user approval before suspending or resuming if impact is uncertain.

## Bootstrap

Use only when the task specifically requests installing Flux on a cluster:

```bash
flux bootstrap github --owner=<owner> --repository=<repo> --path=clusters/<env>
flux bootstrap git
```

Confirm bootstrap target and repository/path before changing them. Bootstrap does not include cluster provisioning or recovery.

## Secrets

Store SOPS-encrypted Kubernetes Secret manifests in Git. Configure the Kustomization with the appropriate key reference, for example:

```yaml
spec:
  decryption:
    provider: sops
    secretRef:
      name: sops-age
```
