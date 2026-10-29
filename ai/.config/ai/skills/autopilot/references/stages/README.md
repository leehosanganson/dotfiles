# Development lifecycle stages

Autopilot is the front door. It identifies the task-specific playbook, current stage, and next useful capability from the user's goal and available evidence. Keep these lifecycle stages in order when they apply, but do not force every task through all of them. A task may start partway through when its goal and evidence establish earlier work is complete. Explain the active stage, evidence, and skipped or completed stages. A stage is complete when its exit evidence is present, not when its checklist was merely attempted.

These stage guides describe outcomes and decisions. The task-specific playbooks in `../playbooks/` remain the detailed execution path for bugs, features, refactors, performance work, research, and PR operations.

| Order | Stage | Guide | Typical handoff |
|---|---|---|---|
| 1 | Plan | [plan.md](plan.md) | Clear goal, relevant code understanding, constraints, and (when needed) an actionable plan. |
| 2 | Design | [design.md](design.md) | Chosen approach, data shape, and boundaries where design warrants explicit work. |
| 3 | Build | [build.md](build.md) | Scoped change implemented with appropriate tests and a reviewable diff. |
| 4 | Test | [test.md](test.md) | Evidence that the intended behavior works on the best available surface, plus explicit limitations. |
| 5 | Deploy | [deploy.md](deploy.md) | Requested delivery prepared or shepherded within explicit publishing and merge gates. |
| 6 | Maintain | Deferred | Do not route to this stage until requested. |

## Default routes

- Read-only how/why questions use Plan and stop without editing.
- Nontrivial bug fixes and features use Plan, Design when useful, Build, and Test. Deploy only when requested or part of the acceptance criteria.
- Refactors use Plan, Build, and behavior-preserving Test; add Design when structure choices are material.
- Performance tasks establish target and baseline in Plan/Design, then Build and comparable Test measurements.
- Existing PR, CI, comment, or conflict requests start in Deploy. If resolving them requires code changes, perform the relevant Build and Test work before returning to Deploy.
- Plan-only, design-only, and verify-only requests stop at their requested stage.
- Small tasks may use a lightweight path. Explicitly state why stages are skipped when the routing might otherwise be unclear.

## Capability selection

For cross-cutting guidance, the playbook or worker should load only relevant `principle-*` skills. Common pairings are `principle-read-before-writing` and `principle-context-boundaries` in Plan; `principle-foundational-thinking` and `principle-model-the-domain` in Design; `principle-simplicity-first` and `principle-surgical-changes` in Build; `principle-test-behavior` and `principle-prove-it-works` in Test; and `principle-make-operations-idempotent` and `principle-prove-it-works` in Deploy. These are examples, not required invocations for every task.

Stage guides provide lifecycle handoffs; task playbooks orchestrate task-specific steps. Both invoke capability and principle skills only when their triggers apply. The lists below name available capabilities; existing task/domain skills remain the source of truth for their own procedures.

- **Plan:** `how`, `why`, `teach`, `figure-it-out`, `show-me-your-work`, `project-context`, `plan`, `research`.
- **Design:** `architect`, `arena`, `interrogate`.
- **Build:** `tdd`, `language-best-practices`, `deslop`, `no-comments`.
- **Test:** `create-verification-skill`, `swarm`, `blast-radius`, `benchmark-checklist`, `interrogate`, and existing `code-review`.
- **Deploy:** `make-pr-easy-to-review`, existing `raise-pr` and `babysit`, plus `fix-merge-conflicts`, `get-pr-comments`, and `fix-ci`.

Use available skills and runtime capabilities when their trigger fits the work. Prefer an existing equivalent over creating or invoking a duplicate. Some named capabilities in the development workflow concept may not be installed in every environment. Never claim one ran when it did not. Give subagents access to the applicable workflow/capability and `principle-*` skill names, and ask them to read and apply the relevant skills for their own scope. Use independent subagents only when the decomposition and expected benefit justify dispatch overhead; preserve coordinator ownership of integration and final verification.
