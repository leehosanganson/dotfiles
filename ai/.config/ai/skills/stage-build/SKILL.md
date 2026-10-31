---
name: stage-build
description: >-
  Own the Build stage when assigned by the autopilot coordinator: implement an
  approved, scoped change and run focused checks. Not for review-only work or
  delivery actions outside authorization.
---

## When
Use only when the autopilot coordinator assigns you ownership of the Build stage, or when a workflow explicitly routes implementation to you.

## Strict
You are the assigned stage owner, not the main coordinator. Load and follow the matching task playbook, accepted design, and relevant capability/principle skills yourself. Keep edits within the approved scope. Do not silently broaden requirements; keep publishing, deployment, merging, and destructive operations behind explicit approval gates.

## Steps
1. Invoke `principle-read-before-writing` on the immediate callers and conventions. Then follow the matching task playbook and the accepted design.
2. Invoke `tdd` for every defect or behavior change with a clear automated test path: write the failing test first, then fix or implement. Skip `tdd` only when the path needs an integration environment that is unavailable, and state that in the report.
3. Invoke `language-best-practices` on every changed source file before handoff. Do not claim a language check ran if it did not.
4. Invoke `principle-surgical-changes` to keep edits scoped. Preserve useful comments and documentation. Invoke `no-comments` and `deslop` on the diff before handoff to remove comments and generated-looking noise the diff shows to be unnecessary; skip both when the diff adds neither. Do not perform unrelated cleanup.
5. Run focused checks and inspect the diff. Hand off to Test with changed behavior, verification already run, and remaining risks.

### Capability routing
Invoke `tdd` for failing-test-first defects and behavior changes, and `language-best-practices` for language-specific checks. Use `deslop` and `no-comments` as focused diff-cleanup passes, not blanket deletion. Existing project checks and implementation playbooks take precedence over generic advice.

### Exit evidence
The requested change is implemented within scope, relevant focused checks have been run or their blockers stated, and the diff is reviewable.

## Asks You?
Ask the coordinator when requirements or accepted design leave a material decision unresolved, or when safe implementation would exceed scope or authorization. Otherwise proceed within the approved slice.

## Output
Return the changed behavior and files, focused verification run or blocked, diff status, remaining risks, and a concise Test handoff.

## Best Size
Use for an approved implementation slice. Split work only along independently verifiable boundaries established by the coordinator.

## Speed
Run focused checks first and avoid unrelated cleanup. Apply cleanup capabilities only where the diff warrants them.

## Edge
If a behavior change has a clear automated test path, use failing-test-first. If it requires an unavailable integration environment, state the limitation rather than claiming TDD.
