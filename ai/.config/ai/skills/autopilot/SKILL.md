---
name: autopilot
description: >-
  Route nontrivial engineering work (bug fix, feature, refactor, performance,
  plan, research, PR, worktree cleanup, session pickup) to the matching
  playbook and skills, then coordinate execution and verification. Use
  when the user asks for multi-step engineering work or invokes autopilot.
  Not for simple questions, single-line edits, or non-engineering tasks
  covered by other skills.
---

# Autopilot

Autopilot is the task router for substantive work. `references/playbooks/` holds
task workflows and `references/stages/` holds lifecycle detail. Task-specific
skills and the `principle-*` skills hold the canonical procedures; invoke them
rather than restating them. Installing this skill authorizes only the task the
user requests, not a sustained autonomous campaign or any action beyond scope.

1. **Classify the request.** Identify the desired outcome, scope, constraints,
   approval boundaries, and observable success criteria. Answer simple questions
   directly without routing them through a workflow.
2. **Select guidance by owner and stage.** Pick the matching entry from the
   Playbooks section below. Read the selected playbook or workflow skill in full.
   Identify the active lifecycle stage and read its stage guide in full. Check
   repository-specific workflow guidance. Select only relevant optional skills,
   tools, and source files from task and repository evidence; preserve mandatory
   workflow instructions, explicitly requested skills, and required safety
   tools. Do not read unrelated playbooks, stage guides, skills, tools, or files.
3. **Keep guidance in the context that needs it.** The coordinator loads
   workflow-routing and coordination guidance, plus only the capability or
   principle guidance needed to make the current decision or perform its current
   work. Do not preload every skill for later stages. When a stage is handed to a
   subagent, pass the playbook/stage and selected skill names, and have that
   subagent load those skills itself. The subagent reports relevant decisions
   and evidence back, not full skill text. Keep tightly coupled work with its
   owner; do not delegate merely to move context. Never parallelize dependent
   stages. Before moving a later stage inline, load that stage's selected
   guidance then. After selection, use the runtime's available batch-read or
   orchestration mechanism to load selected independent files together; do not
   batch unrelated files or preload future-stage guidance.
4. **Make guidance use observable.** Before substantive execution, put the
   selected playbook's numbered steps into the harness's native task/todo
   mechanism verbatim and in order. Track guidance that must be loaded inline by
   owner and stage; name deferred guidance in the appropriate handoff instead
   of adding future-stage skills as current-context checklist items. Mark
   guidance loaded only after invoking the skill through the runtime's native
   mechanism or reading its full guidance. Keep conditional items visible and
   mark a skipped item with a brief reason. If no task tracker is available, use
   an equivalent checklist in working notes or the response. Before work starts,
   record the active stage and its owner's selected guidance. For simple
   questions and one-step tasks, skip this checklist when no workflow is
   selected.
5. **Plan and delegate.** For multi-step work, invoke `plan` before
   implementation, then invoke `delegate`. Assign stage work to subagents when
   independently executable and useful; each owner loads only its assigned
   stage's selected skills. Keep sequencing, unresolved dependencies, user
   decisions, integration, and final verification with the coordinator as
   appropriate. Skip delegation when work is one-step, tightly coupled, or
   delegation overhead exceeds its benefit. Never parallelize dependent or
   overlapping changes. Integrate and independently verify delegated results.
6. **Execute and verify.** Follow the selected guidance for the current owner and
   stage, preserve the user's scope and approval gates, and verify the stated
   success criteria. Report checks run or skipped; do not claim unverified
   success. If an unanticipated decision arises, make a new bounded selection
   from fresh evidence rather than preloading the full skill/tool catalog.
7. **Stop at the boundary.** Stop when the requested outcome is verified, a
   blocker or approval gate is reached, or the next step exceeds authorization.
   Report outcomes and remaining decisions or work.

## Development lifecycle

Identify the current stage from the user's goal and repository evidence. State
the active stage, evidence, and any stage skipped or already complete. Run stages
in order; start partway through when earlier exit evidence already exists. A
stage is complete when its exit evidence is present. Read the full guide for
each active stage; do not rely on the summary table alone. Record inactive or
already-complete stages with a brief reason when they would otherwise be
expected for the selected route.

| Stage | Guide | Invoke | Principles | Exit evidence |
|---|---|---|---|---|
| Plan | [plan.md](references/stages/plan.md) | `project-context`, `how`, `why`, `teach`, `plan`, `research`, `figure-it-out`, `show-me-your-work` | `principle-read-before-writing`, `principle-context-boundaries`, `principle-outcome-oriented-execution` | Clear goal, relevant code understanding, constraints, and an actionable plan when needed. |
| Design | [design.md](references/stages/design.md) | `architect`, `arena`, `interrogate` | `principle-foundational-thinking`, `principle-model-the-domain`, `principle-simplicity-first` | Chosen approach, data shape, and boundaries. |
| Build | [build.md](references/stages/build.md) | `tdd`, `language-best-practices`, `deslop`, `no-comments` | `principle-simplicity-first`, `principle-surgical-changes`, `principle-sequence-verifiable-units` | Scoped change with tests and a reviewable diff. |
| Test | [test.md](references/stages/test.md) | `code-review`, `blast-radius`, `interrogate`, `benchmark-checklist`, `create-verification-skill`, `swarm` | `principle-test-behavior`, `principle-prove-it-works`, `principle-explain-the-number` | Evidence the intended behavior works on the best available surface, plus limitations. |
| Deploy | [deploy.md](references/stages/deploy.md) | `make-pr-easy-to-review`, `raise-pr`, `babysit`, `get-pr-comments`, `fix-ci`, `fix-merge-conflicts` | `principle-make-operations-idempotent`, `principle-prove-it-works` | Requested delivery prepared within publishing and merge gates. |

Default routes:

- Read-only how/why questions: Plan, then stop without editing.
- Bug fixes and features: Plan, Design if data shape or interfaces change, Build, Test. Deploy only when requested.
- Refactors: Plan, Build, behavior-preserving Test. Add Design if structure choices are material.
- Performance: set target and baseline in Plan, then Build and comparable Test measurements.
- Existing PR, CI, comment, or conflict requests: start in Deploy. Do Build and Test first if code changes are needed.
- Plan-only, design-only, and verify-only requests stop at their requested stage.
- One-step tasks skip the lifecycle; say so.

In each active stage, load only the selected guidance needed by the current
owner for current work. Follow the selected workflow's references, and record
skipped guidance with a brief reason. If work is deferred to a later stage, pass
that stage's selected skills in its handoff rather than loading them early. Do
not paraphrase a skill from memory or claim it ran when it did not. When
delegating, name the stage and selected skills in the handoff and direct the
subagent to load them for its own scope.

Maintain is deferred. Lifecycle routing does not authorize publishing,
deployment, merging, or destructive actions. Shared skills and stage guidance
must remain runtime-agnostic; report when an important capability is unavailable
and choose a safe available alternative.

## Explicit sustained-autonomy mode

Only when the user explicitly asks for a sustained autonomous run, improvement
cycle, or continued work beyond the immediate bounded task, also follow
`references/playbooks/autopilot.md`. Confirm its goal, scope, completion
criteria, and stopping conditions. This does not authorize publishing, merging,
destructive actions, or other gated operations unless explicitly authorized by
the user under the applicable playbook.

## Playbooks

- [`autopilot`](references/playbooks/autopilot.md) — The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `autopilot` skill is the ordinary task router; do not apply this sustained-run procedure unless that authorization is explicit.
- [`babysit`](../babysit/SKILL.md) (skill) — The user asks to monitor or shepherd an existing PR/stack toward a reviewable, merge-ready state.
- [`bug-fix`](references/playbooks/bug-fix.md) — A coding defect has a concrete, observable failure.
- [`delegate`](../delegate/SKILL.md) (skill) — Multi-step work that can be split into independently scoped slices.
- [`diagnose-issues`](../diagnose-issues/SKILL.md) (skill) — Triage an unclear homelab or connected-infrastructure symptom before the owning subsystem is known; hand off to its specialist skill once identified.
- [`feature-work`](references/playbooks/feature-work.md) — Implementing a scoped feature or user-facing behavior; new feature work normally starts in an isolated worktree via [`feature-worktree`](../feature-worktree/SKILL.md).
- [`feature-worktree`](../feature-worktree/SKILL.md) (skill) — Start feature work in a dedicated worktree/local branch and route it through authorized PR creation, follow-up, and separately authorized cleanup.
- [`pause-safely`](references/playbooks/pause-safely.md) — The user asks to pause, context is about to be compacted, or the session is going offline during substantive in-flight work.
- [`performance`](references/playbooks/performance.md) — Investigating or changing performance, latency, throughput, or resource use.
- [`plan`](../plan/SKILL.md) (skill) — The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.
- [`project-context`](../project-context/SKILL.md) (skill) — Before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar.
- [`prototype`](references/playbooks/prototype.md) — An uncertainty can be settled faster by observation (behavior, layout, performance, output, or a design fork) than by analysis or source reading.
- [`raise-pr`](../raise-pr/SKILL.md) (skill) — The user explicitly asks to create a PR or requests PR creation as the final delivery step after implementation.
- [`refactoring`](references/playbooks/refactoring.md) — Changing code structure while intending to preserve externally observable behavior.
- [`research`](../research/SKILL.md) (skill) — A question needs investigation across multiple local or external sources, comparison, or evidence-backed synthesis.
- [`session-pickup`](references/playbooks/session-pickup.md) — Resuming substantive in-flight work from an earlier session, handoff, or compaction.
- [`visual-parity`](references/playbooks/visual-parity.md) — Matching an implementation to an authoritative screenshot or visual reference.
- [`worktree-cleanup`](references/playbooks/worktree-cleanup.md) — The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.

## Runtime integration

Use the current runtime's native mechanisms for skill invocation, task tracking,
subagents, and tools. Runtime-specific commands, schemas, and mappings do not
belong in this shared skill; consult the runtime's own configuration when needed.
Do not assume a tool or command name transfers between environments.
