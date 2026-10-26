# Plan

**Trigger:** The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.

1. Clarify the goal, outcome, constraints, non-goals, success criteria, and unresolved decisions. Use settled conversation context; ask only when a missing decision blocks safe planning.
2. Inspect enough relevant instructions, documentation, code, interfaces, tests, and tooling to ground the plan. Use authoritative external sources only to resolve a concrete factual uncertainty.
3. Describe current context and proposed behavior/design, including boundaries, data/control flow, compatibility, edge cases, dependencies, and risks as relevant.
4. Break work into ordered, testable vertical slices with owners, dependencies, acceptance criteria, verification, and safe parallelism. Identify migration, rollout, and rollback gates where needed.
5. Recommend the simplest fitting approach and map each acceptance criterion to a verification check.

**Boundary:** Planning is analysis-only. Do not implement changes or create project files unless separately authorized. Keep one-step tasks lightweight.
