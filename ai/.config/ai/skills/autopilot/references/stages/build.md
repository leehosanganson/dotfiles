# Build stage

## Purpose

Implement the approved change with the smallest coherent diff and checks that protect user-visible behavior.

## Steps

1. Invoke `principle-read-before-writing` on the immediate callers and conventions. Then follow the matching task playbook and the accepted design.
2. Invoke `tdd` for every defect or behavior change with a clear automated test path: write the failing test first, then fix or implement. Skip `tdd` only when the path needs an integration environment that is unavailable, and state that in the report.
3. Invoke `language-best-practices` on every changed source file before handoff. Do not claim a language check ran if it did not.
4. Invoke `principle-surgical-changes` to keep edits scoped. Preserve useful comments and documentation. Invoke `no-comments` and `deslop` on the diff before handoff to remove comments and generated-looking noise the diff shows to be unnecessary; skip both when the diff adds neither. Do not perform unrelated cleanup.
5. Run focused checks and inspect the diff. Hand off to Test with changed behavior, verification already run, and remaining risks.

## Capability routing

Invoke `tdd` for failing-test-first defects and behavior changes, and `language-best-practices` for language-specific checks. Use `deslop` and `no-comments` as focused diff-cleanup passes, not blanket deletion. Existing project checks and implementation playbooks take precedence over generic advice.

## Exit evidence

The requested change is implemented within scope, relevant focused checks have been run or their blockers stated, and the diff is reviewable.

## Boundaries

Do not silently broaden requirements. Keep publishing, deployment, merging, and destructive operations behind their explicit approval gates.
