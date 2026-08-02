---
name: diagnose-issues
description: >-
  Diagnose and fix infrastructure issues. Load this skill when the user asks to investigate, troubleshoot, or resolve a problem in their homelab or
  any connected system. It follows a repeatable loop: explore current state, compare against desired state with concrete tests, research documentation
  and recent discussions, apply targeted changes, re-run tests, and iterate until the issue is resolved.
---

## Overview

Diagnose issues methodically — never guess. This skill enforces a four-phase loop that repeats until the symptom is gone:

1. **Explore** the current state.
2. **Test** current state against desired state with concrete, repeatable checks.
3. **Research** documentation and up-to-date discussions for known causes.
4. **Fix** by applying targeted changes, then re-run tests. Loop until passing.

## Safety Rules

- Never run destructive commands without explicit user confirmation.
- Prefer read-only diagnostics before making changes.
- Roll back or revert changes that worsen the symptom.
- Describe blast radius before touching shared resources.

## Phase 1 — Explore current state

Gather the living state, not just config files:

```bash
# General diagnostics
systemctl status <service>
journalctl --since "10 min ago" -u <service>
ps aux | grep <keyword>
ss -tuln | grep <port>
```

Kubernetes:

```bash
kubectl get pods,events -n <ns> --sort-by='.metadata.name'
kubectl logs <pod> -n <ns> --tail=200
kubectl describe pod <pod> -n <ns>
```

NixOS:

```bash
nixos-rebuild list-generations
systemctl status <unit>
```

GitOps / Flux:

```bash
flux status
flux logs --level=error
```

GitHub:

```bash
gh runs view --repo <owner>/<repo>
gh issue view <number>
```

Report findings in plain language. Do not yet propose fixes.

## Phase 2 — Design and run repeatable tests

Turn the symptom into concrete acceptance criteria. For each criterion, write a test the user can re-run:

- **Service availability**: `curl -sf http://<host>:<port>/health || echo FAIL`
- **Pod health** (Kubernetes): `kubectl get pod <pod> -n <ns> -o jsonpath='{.status.phase}' | grep Running || echo FAIL`
- **Configuration drift**: diff the running config against the manifest (`diff <running> <desired>`).
- **DNS / networking**: `dig +short <hostname>` or `ping -c 2 <host>`.

Save the test commands in a small script at `<issue>/diagnose.sh` so they are reproducible. Run them and record pass/fail before touching anything.

## Phase 3 — Research

Use the research skill (`research-workflow`) or web search to find:

- Official documentation for the component at fault.
- Recent GitHub issues, discussions, or changelogs mentioning the same symptom.
- Known regressions or breaking changes in the version in use.

Summarise findings and only then narrow down plausible causes.

## Phase 4 — Fix and validate

1. Make the **smallest change** that targets the root cause.
2. Apply with dry-run first (`--dry-run=server`, `nixos-rebuild test`, etc.).
3. Activate the change.
4. Re-run every test from Phase 2. All must pass.
5. If any test fails, revert or adjust and re-loop through Phases 3–4.

## Iteration loop

After each fix attempt:

- Re-run `./diagnose.sh` (or equivalent tests).
- If all pass → mark issue resolved and report results.
- If any fail → go back to Phase 3 (research the new symptom) or Phase 1 (re-explore if state changed unexpectedly), then Phase 4 again.

## Reporting

When done, summarise:

- What the symptom was.
- What tests you designed.
- What root cause you found.
- What changes were made.
- Test results before and after.
- Any remaining risks or follow-ups.
