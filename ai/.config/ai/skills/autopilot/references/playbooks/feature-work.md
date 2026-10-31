# Feature work

**Trigger:** Implementing a scoped feature or user-facing behavior.

1. Invoke `feature-worktree` at the start of new feature work unless the user explicitly requests the current checkout, the task is already in its intended isolated worktree, or worktrees are unsuitable. Keep branch creation local; pushing is deferred to an authorized PR workflow. Invoke `project-context` unless repository conventions, branch, and PR state were already gathered in this session. Clarify expected behavior, constraints, and approval boundaries.
2. Invoke `plan` when the feature spans several files or has an open decision. Skip it only for a one-file change with one obvious implementation.
3. Invoke `architect` and `principle-foundational-thinking` when the feature changes a data shape, interface, or state ownership. Skip both when the change stays inside existing interfaces.
4. Split into slices only when they share no files and can be verified separately. Invoke `delegate` for each slice, passing its playbook, skill names, and relevant `principle-*` skills. Otherwise implement in this thread. Never delegate dependent work.
5. Invoke `principle-read-before-writing` on the immediate callers and conventions. Invoke `tdd` to write failing tests for the intended behavior, and `principle-test-behavior` to test the contract. For user-facing changes, add integration coverage, or state the gap if the repository has no integration harness.
6. Implement the smallest scoped diff. Invoke `principle-simplicity-first` and `principle-surgical-changes` to keep scope bounded.
7. Invoke `code-review` on the changed files. Skip it only when the change has no logic, such as copy or configuration.
8. Run the relevant checks and compare the final diff against the acceptance criteria. Invoke `principle-prove-it-works` for this check.

**Boundary:** Preserve explicit user approval constraints. Do not turn a small feature into an adjacent refactor or delegate dependent work. Feature work normally stays in its dedicated worktree. When autopilot was explicitly invoked for the implementation, its agreed outcome is a reviewable PR: route scoped commits, branch push, and PR creation through `raise-pr` without requesting redundant authorization. PR follow-up uses `babysit`; merging and deployment remain separately gated; worktree removal uses `worktree-cleanup`.
