# Build stage

## Purpose

Implement the approved change with the smallest coherent diff and checks that protect user-visible behavior.

## Steps

1. Follow the matching task playbook and the accepted design. Inspect immediate callers and conventions before editing.
2. For defects with a clear test path, add a test that fails for the reported behavior, then fix it. Use TDD when it materially improves confidence; do not force it for unclear or costly integration paths.
3. Apply relevant language- and project-specific best practices. Do not invent generic rules or claim a language skill was used if it is unavailable.
4. Keep edits scoped. Preserve useful comments and documentation. Remove needless comments or generated-looking noise only when the diff demonstrates they are unnecessary; don't perform unrelated cleanup.
5. Run focused checks and inspect the diff. Hand off to Test with changed behavior, verification already run, and remaining risks.

## Capability routing

Use `tdd` for clear, affordable failing-test-first paths; use `language-best-practices` for relevant language-specific checks. Use `deslop` and `no-comments` as focused diff-cleanup passes, not blanket deletion directives. Existing project checks and implementation playbooks take precedence over generic advice.

## Exit evidence

The requested change is implemented within scope, relevant focused checks have been run or their blockers stated, and the diff is reviewable.

## Boundaries

Do not silently broaden requirements. Keep publishing, deployment, merging, and destructive operations behind their explicit approval gates.
