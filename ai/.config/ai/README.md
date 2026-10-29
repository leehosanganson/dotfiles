# Shared AI Workflow Resources

This directory contains vendor-neutral agent guidance and reusable skills. Skills, agents, prompts, and playbooks describe goals, decisions, constraints, and expected outcomes—not a particular model provider or agent runtime's command syntax, tool names, metadata schema, or filesystem layout.

## Portability boundary

- Keep `AGENTS.md`, agent role instructions, skills, and autopilot playbooks runtime-agnostic. Refer to capabilities (for example, task tracking, repository inspection, or subagent dispatch) rather than hard-coded tool identifiers or vendor-specific prompt commands.
- Runtime integrations belong in that runtime's configuration package, outside this directory. Put model assignments, permissions, agent metadata, tool mappings, commands, setup scripts, and adapters there; connect shared guidance through the runtime's supported resource-loading mechanism.
- Domain-specific skills may name the external platform they operate (such as GitHub or Kubernetes), but should describe the goal and select among available equivalent interfaces where possible. This does not make the shared prompt framework vendor-bound.
- Preserve upstream licenses and attribution as legal metadata. They are not agent instructions and are exempt from prompt portability checks.

## How the workflow is organized

Skills, playbooks, and principles are different by purpose, even when they are all packaged as Markdown guidance:

- **Skills are capabilities.** They answer “What can the agent do?” A skill has a clear trigger and a useful outcome, such as explaining code, reviewing a diff, or operating Kubernetes. Skills may include references or scripts that support that capability.
- **Playbooks are task workflows.** They answer “In what order should the agent handle this kind of request?” A playbook selects and sequences capabilities, decision points, handoffs, and verification for a task such as a bug fix or PR follow-up. Autopilot chooses the task playbook.
- **Principles are reusable decision capabilities.** They answer “What should remain true across different tasks?” Examples include safe concurrency and evidence-based verification. Each actionable principle is available as a `principle-*` skill so a playbook or delegated agent can consult it directly. Keep only universal policy and a lightweight index in Autopilot references.

Do not collapse these roles into one undifferentiated catalog. Keep one canonical copy of each instruction and link to it where needed. The distinction is semantic, not merely directory-based: playbooks orchestrate, skills provide capabilities, and principles are reusable decision guidance.

## Autopilot

The `skills/autopilot/` directory is the shared engineering router and canonical home for task playbooks, lifecycle stage guidance, and working principles. Autopilot identifies the task and current lifecycle stage, selects the relevant task playbook, and invokes capability skills as needed. Keep simple questions and one-step tasks lightweight.

The lifecycle stage guides are Plan, Design, Build, Test, and Deploy. Maintain is deferred. Stage guidance complements task playbooks; it does not replace them or require every task to pass through every stage. See [`skills/autopilot/references/stages/README.md`](skills/autopilot/references/stages/README.md) for stage routing and [`skills/autopilot/SKILL.md`](skills/autopilot/SKILL.md) for the router.

Use the current runtime's native skill mechanism to activate Autopilot. Follow its matching playbook and relevant principles. Routing authorizes only the requested task; sustained autonomy and gated actions require explicit authorization under the applicable workflow.

## Current inventory

The inventory below lists shared invokable skills by capability area, then the Autopilot playbooks and principle skills used to route and constrain work. It reflects the repository files and should be updated when the inventory changes.

### Skills

- **Workflow and understanding:** `autopilot`, `plan`, `project-context`, `how`, `why`, `teach`, `figure-it-out`, `show-me-your-work`, `delegate`, `self-improvement`.
- **Design, build, and verification:** `architect`, `arena`, `interrogate`, `tdd`, `language-best-practices`, `deslop`, `no-comments`, `create-verification-skill`, `swarm`, `blast-radius`, `benchmark-checklist`.
- **Review and delivery:** `code-review`, `code-review-harsh`, `fix-issues`, `make-pr-easy-to-review`, `raise-pr`, `babysit`, `get-pr-comments`, `fix-merge-conflicts`, `fix-ci`, `github-ops`.
- **Domain and content:** `frontend-design`, `content-writer`, `write-notes`, `write-report`, `research`, `diagnose-issues`, `gitops-ops`, `kubernetes-ops`, `nixos-ops`, `explain`.
- **Principles:** `principle` index plus 26 focused skills listed below.
- **Skill authoring:** `create-skill`.

### Autopilot task playbooks

`autopilot`, `babysit`, `bug-fix`, `delegate`, `diagnose-issues`, `feature-work`, `pause-safely`, `performance`, `plan`, `project-context`, `prototype`, `raise-pr`, `refactoring`, `research`, `session-pickup`, `visual-parity`, `worktree-cleanup`.

### Autopilot lifecycle stage guides

`Plan`, `Design`, `Build`, `Test`, and `Deploy` each have a guide under `skills/autopilot/references/stages/`. `Maintain` is intentionally deferred.

### Principle skills

`principle-attack-the-premise`, `principle-build-the-lever`, `principle-context-boundaries`, `principle-encode-corrections`, `principle-explain-the-number`, `principle-foundational-thinking`, `principle-makefile-first`, `principle-make-operations-idempotent`, `principle-migrate-callers-then-delete-legacy-apis`, `principle-minimize-reader-load`, `principle-model-the-domain`, `principle-outcome-oriented-execution`, `principle-prove-it-works`, `principle-python-execution`, `principle-read-before-writing`, `principle-redesign-from-first-principles`, `principle-safe-concurrency`, `principle-scoped-attempts`, `principle-sequence-verifiable-units`, `principle-simplicity-first`, `principle-surgical-changes`, `principle-surface-conflicts`, `principle-temp-files`, `principle-test-behavior`, `principle-type-and-boundary-discipline`, `principle-web-search`.

## Principles

Each focused principle is an independently discoverable `principle-*` skill, so task playbooks and delegated agents can load the guidance relevant to their own scope. Autopilot keeps universal router policy and a lightweight index in `skills/autopilot/references/principles/AGENTS.md`; that index points to canonical principle skill files and does not duplicate their full content. The optional `principle` index skill explains how to consult that index. Do not load every principle automatically. The applicable playbook or task brief should identify only the principles that materially affect the work.

## Maintaining skills

Keep skill triggers specific, include meaningful exclusions and safety boundaries, and make steps actionable. Remove non-directive filler. Keep `SKILL.md` concise; put detailed guides or scripts in referenced resources only when they support a real capability. Preserve vendor neutrality in shared guidance and place runtime adapters in runtime-specific configuration.
