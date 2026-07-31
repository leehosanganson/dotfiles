---
name: gitops-ops
description: >-
  Operate a Flux CD GitOps setup safely. Load this skill when the user asks to bootstrap, reconcile, inspect, or troubleshoot Flux sources, Kustomizations, HelmReleases, or OCI artifacts. Use it for day-to-day GitOps operations, including bootstrapping, reconciling, inspecting, and troubleshooting.
---

## Overview

GitOps means Git is the single source of truth. The Flux controllers continuously reconcile the cluster to match the desired state in Git. Operate through the Flux CLI and Git, not by editing cluster resources directly.

## Safety Rules

- Never `kubectl edit` or `kubectl delete` resources that are managed by a Flux Kustomization; the controller will revert or recreate them.
- Make changes in Git, commit them, then trigger reconciliation with `flux reconcile`.
- Never suspend or delete a Kustomization/Source without confirming the impact.
- Validate manifests before committing with `kustomize build` or `flux build kustomization`.
- For secrets, encrypt them in Git (SOPS) rather than storing plain values.

## Common Workflows

### Inspect the GitOps state

```bash
flux get all
flux get sources all
flux get kustomizations
flux get helmreleases
```

### Trigger reconciliation

After committing a change:

```bash
flux reconcile source git <name>
flux reconcile kustomization <name>
```

Or for Helm:

```bash
flux reconcile source helm <name>
flux reconcile helmrelease <name>
```

### See what would change

```bash
flux diff kustomization <name>
flux build kustomization <name>
```

### Troubleshoot

```bash
flux logs
flux logs --level=error
flux status
kubectl get events -n flux-system --sort-by='.lastTimestamp'
```

Check the Source status first, then the Kustomization, then the HelmRelease.

### Drift

If someone manually changed a managed resource, Flux will revert it on the next reconciliation. To make an emergency ad-hoc change:

1. Suspend the Kustomization: `flux suspend kustomization <name>`.
2. Make the change and backport it to Git immediately.
3. Resume: `flux resume kustomization <name>`.

### Bootstrap

To set up Flux on a cluster:

```bash
flux bootstrap github --owner=<owner> --repository=<repo> --path=clusters/<env>
```

Or use `flux bootstrap git` for a generic Git server.

## Secrets

Use SOPS to encrypt Kubernetes Secret manifests in Git. Create a Kubernetes secret in the `flux-system` namespace containing the SOPS key (e.g., `sops-gpg` or `sops-age`), then reference it in the Kustomization:

```yaml
spec:
  decryption:
    provider: sops
    secretRef:
      name: sops-gpg
```

Never commit unencrypted Kubernetes Secrets.

## Escalation

Ask the user before:

- Suspending or deleting a Kustomization, Source, or HelmRelease.
- Running `flux uninstall`.
- Changing the bootstrap path or repository.
- Any action that could cause downtime.

When in doubt, describe the planned command and its impact, then wait for approval.
