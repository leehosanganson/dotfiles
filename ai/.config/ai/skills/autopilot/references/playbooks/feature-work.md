# Feature work

**Trigger:** Implementing a scoped feature or user-facing behavior.

1. Clarify expected behavior, constraints, and approval boundaries; follow the `project-context` and `plan` playbooks when repository context or task complexity warrants them.
2. Define the relevant data shape, ownership, state flow, and success criteria before changing code. Apply `principle-foundational-thinking` when those decisions are nontrivial.
3. Split into independent slices only when useful; follow the `delegate` playbook and use the harness's native subagent mechanism only for genuinely independent work. Give each subagent its assigned playbook/capability skills and the specific `principle-*` skills relevant to its slice; it should load and apply them independently.
4. Read immediate callers and conventions, then implement the smallest scoped diff.
5. Add or update tests for intended behavior; use integration coverage for user-facing changes when feasible. Apply `principle-test-behavior` when shaping tests.
6. Run relevant checks and inspect the final diff against the acceptance criteria, applying `principle-prove-it-works`.

**Boundary:** Preserve explicit user approval constraints. Do not turn a small feature into an adjacent refactor or delegate dependent work.
