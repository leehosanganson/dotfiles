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
2. **Select and load guidance.** Pick the matching entry from the Playbooks
   section below. Read the selected playbook or workflow skill in full before
   acting on it. Identify the active lifecycle stage and read its stage guide in
   full. Check repository-specific workflow guidance. Do not read unrelated
   playbooks, stage guides, or skills.
3. **Make guidance use observable.** Before substantive execution, put the
   selected playbook's numbered steps into the harness's native task/todo
   mechanism verbatim and in order. Add checklist items for the selected
   playbook, active stage guide, and each applicable skill or principle they
   reference. Mark a reference loaded only after invoking its skill through the
   runtime's native mechanism or reading its full guidance. Keep conditional
   items visible; mark a skipped item with a brief reason. If no task tracker is
   available, use an equivalent checklist in working notes or the response.
   Do not begin execution until the required guidance is loaded and the
   checklist is recorded. For simple questions and one-step tasks, skip this
   checklist when no workflow is selected.
4. **Plan and delegate.** For multi-step work, invoke `plan` before
   implementation, then invoke `delegate`. Skip both for one-step work or work
   too tightly coupled to split. Do not parallelize dependent or overlapping
   changes. Integrate and independently verify delegated results.
5. **Execute and verify.** Follow the selected guidance, preserve the user's
   scope and approval gates, and verify the stated success criteria. Report
   checks run or skipped; do not claim unverified success.
6. **Stop at the boundary.** Stop when the requested outcome is verified, a
   blocker or approval gate is reached, or the next step exceeds authorization.
   Report outcomes and remaining decisions or work.

## Development lifecycle

Identify the current stage from the user's goal and repository evidence. State the active stage, evidence, and any stage skipped or already complete. Run stages in order; start partway through when earlier exit evidence already exists. A stage is complete when its exit evidence is present. Read the full guide for each active stage; do not rely on the summary table alone. Record inactive or already-complete stages with a brief reason when they would otherwise be expected for the selected route.

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

In each active stage, invoke every listed skill whose trigger matches the task, through the runtime's skill mechanism. Follow the selected playbook's references as well: invoke each applicable capability skill and read each applicable principle skill in full. If a reference does not apply, record why rather than silently omitting it. Do not paraphrase a skill from memory. Never claim a skill ran when it did not. When delegating, name the stage and its skills in the handoff so subagents invoke them for their own scope.

Maintain is deferred. Lifecycle routing does not authorize publishing, deployment, merging, or destructive actions. Shared skills and stage guidance must remain runtime-agnostic; report when an important capability is unavailable and choose a safe available alternative.

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
- [`feature-work`](references/playbooks/feature-work.md) — Implementing a scoped feature or user-facing behavior.
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
