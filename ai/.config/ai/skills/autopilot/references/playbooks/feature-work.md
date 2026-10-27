# Feature work

**Trigger:** Implementing a scoped feature or user-facing behavior.

1. Clarify expected behavior, constraints, and approval boundaries; follow the `project-context` and `plan` playbooks when repository context or task complexity warrants them.
2. Define the relevant data shape, ownership, state flow, and success criteria before changing code.
3. Split into independent slices only when useful; follow the `delegate` playbook and use the harness's native subagent mechanism only for genuinely independent work.
4. Read immediate callers and conventions, then implement the smallest scoped diff.
5. Add or update tests for intended behavior; use integration coverage for user-facing changes when feasible.
6. Run relevant checks and inspect the final diff against the acceptance criteria.

**Boundary:** Preserve explicit user approval constraints. Do not turn a small feature into an adjacent refactor or delegate dependent work.
