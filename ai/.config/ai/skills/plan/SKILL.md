---
name: plan
description: >-
  Produces an analysis-only, actionable implementation plan for a small, medium,
  or large task, including architecture, product requirements, vertical slices,
  dependencies, risks, acceptance criteria, and verification.
---

## Contract

This skill produces a plan only. Do not implement, edit, or create project files
unless the caller separately and explicitly asks for implementation. Read the
repository and relevant documentation as needed so the plan reflects the actual
codebase rather than assumptions.

Invoke it as `/plan` through OpenCode's native skill loader. This is a skill
module, not a command file; do not create or depend on a commands symlink.

## Size Argument

Accept one positional size argument: `small`, `medium`, or `large`.

- `small`: inspect the immediate files and conventions; produce a focused plan
  for one bounded change, normally with one to three implementation slices.
- `medium`: inspect the relevant subsystem, callers, tests, and dependencies;
  produce a cross-cutting plan with interfaces, migration/configuration concerns,
  and ordered vertical slices.
- `large`: perform broad repository discovery and architecture analysis; map
  affected subsystems, rollout or migration strategy, ownership boundaries,
  risks, and phased vertical slices with explicit dependency gates.
- Missing or invalid argument: do not silently choose a size. Ask the caller to
  provide exactly one of `small`, `medium`, or `large`, and explain that no plan
  has been produced yet. If the task itself is clearly trivial but no argument
  was supplied, still request the argument.

## Planning Workflow

1. Restate the goal, user/product outcome, constraints, non-goals, and open
   questions. State assumptions separately.
2. Resolve project context and inspect the relevant README, agent rules, source,
   tests, build tooling, schemas, APIs, and deployment/configuration files. Stop
   discovery when the plan is grounded, but do not skip files that can change
   architecture or acceptance criteria.
3. Define product requirements: actors, user journeys, business rules, edge and
   failure cases, compatibility expectations, and measurable outcomes.
4. Describe the architecture design: current behavior, proposed behavior,
   component boundaries, data/control flow, public contracts, persistence,
   observability, security, and backward-compatibility strategy.
5. Break the work into independently testable vertical slices. For each slice,
   specify context, files/areas, behavior, dependencies, acceptance criteria,
   tests, and what must be handed to the next slice. Keep dependent slices
   ordered; identify independent slices that can be delegated in parallel.
6. Inventory dependencies: internal modules, external services/packages,
   versions, schemas, feature flags, migrations, generated artifacts, and
   environment or rollout prerequisites.
7. Analyze risks and alternatives, including failure modes, security/privacy,
   performance, operational impact, compatibility, rollback, and unresolved
   decisions. Recommend the simplest option that satisfies the requirements.
8. Define verification: unit, integration, E2E, contract, build/type, lint,
   migration/rollback, observability, and manual acceptance checks as applicable.
   Tie every check to an acceptance criterion.

## Knowledge Gaps and External Research

Do not guess about uncertain concepts, current behavior, latest news, releases,
or version-specific documentation. First use the repository as the source of
truth; when it is insufficient, use `searxng_*` tools to search and
`webfetch`/`searxng_web_url_read` to read authoritative sources. Prefer official
documentation, release notes, standards, and primary sources. Record the source,
version/date, relevant finding, and how it changes the plan. Research is for
closing a concrete knowledge gap, not for broad unfocused browsing.

## Output Format

Return an actionable plan with these headings:

1. **Scope and assumptions**
2. **Product requirements and non-goals**
3. **Current architecture/context**
4. **Proposed architecture/design**
5. **Vertical slices and dependency order**
6. **Dependencies and external research**
7. **Risks, alternatives, and rollback**
8. **Acceptance criteria**
9. **Verification strategy**
10. **Open questions and next action**

Make each step concrete enough for another agent to implement without rediscovery:
name the relevant modules/files, interfaces, data changes, test behavior, and
ordering. End by clearly stating that no implementation was performed.
