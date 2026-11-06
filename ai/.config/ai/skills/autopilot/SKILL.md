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
task workflows, and the `stage-*` skills hold lifecycle procedures. Task-specific
skills and the `principle-*` skills hold the canonical procedures; invoke them
rather than restating them. Invoking autopilot for a bounded engineering task
means the user wants that task carried through its applicable stages to a
reviewable PR-ready result. It authorizes scoped local commits and, when PR
creation is the requested or agreed delivery, pushing the task branch and
creating that PR without asking again. After PR creation, inspect its required
checks and monitor them until all pass or a concrete blocker exists. For safe,
in-scope CI failures, invoke `/fix-ci`, push authorized task-scoped fixes, and
recheck the updated PR without asking for separate `/fix-ci`, `/babysit`, or
`/raise-pr` commands or redundant approval. If check status is unavailable or
monitoring makes no meaningful progress, report the current status and stop;
do not poll indefinitely. This does not authorize merging, deployment,
unrelated changes, weakening or bypassing checks, or destructive actions.

## When

Use for substantive multi-step engineering work or when the user invokes autopilot. Do not use for simple questions, one-step edits, or non-engineering tasks covered by other skills.

## Strict

The main agent is the **Lead** and owns the lifecycle and active stage. It
clarifies the user's goal and decisions, selects the playbook and current stage,
and performs the stage work. The Lead retains sequencing, acceptance criteria,
approval gates, integration and reconciliation, and final verification. Delegate
only bounded, useful tasks when they reduce effort or add independent evidence.
Contributors receive a clear brief with relevant playbook and skill names,
context, exact scope and exclusions, dependencies, acceptance criteria,
verification, and permitted actions. They load applicable guidance, return
concise findings or work with evidence, and do not need to spawn or delegate to
other contributors. Do not hand off a whole stage or its ownership. The Lead
reviews contributions and accepts them only against the task's criteria.

Keep the main context focused on the task, active stage, decisions, todos, and
brief completion evidence. Track concrete work in the current harness's native
todo mechanism, using items in this form:
`- [ ] (Task Name) - Stage (Plan/Implement/Test/...): (Description)`. Keep each
todo focused on a useful, observable outcome; mark it complete only when its
acceptance evidence exists. After compaction, resume from the task list and
reconcile it with live state. The main agent also owns user-facing clarification
and session-pickup coordination: rebuild the task from session evidence and live
state, reconcile completed and pending work, blockers, and active processes,
resolve conflicts using current evidence, and choose or confirm the next step.

1. **Classify the request.** Identify the desired outcome, scope, constraints,
   approval boundaries, and observable success criteria. Answer simple questions
   directly without routing them through a workflow.
2. **Route by playbook and stage.** Pick the matching entry from the Playbooks
   section below. Identify the active lifecycle stage using the goal and existing
   exit evidence. Check only the repository-specific workflow guidance needed to
   route safely. Select the playbook, stage guidance, and relevant capabilities
   and principles for the main agent's work. Do not read unrelated playbooks,
   stage skills, capabilities, tools, or files.
3. **Own stage work; delegate bounded contributions.** The main agent loads
   relevant guidance and performs each active stage. Delegate only bounded tasks
   that are useful and proportionate to their coordination cost. Give each
   contributor the relevant playbook and skill names, evidence, exact scope and
   exclusions, dependencies, acceptance criteria, constraints, permitted actions,
   and requested evidence; instruct them to load their own guidance. Do not hand
   off an entire stage. Contributors do not need to delegate. Never parallelize
   dependent stages; parallelize only independent contributions with separate
   scopes. Do not preload later-stage guidance.
4. **Track concrete work.** For each substantive task with a lifecycle, use the
   harness's native todo mechanism to record concrete work in this form:
   `- [ ] (Task Name) - Stage (Plan/Implement/Test/...): (Description)`. Include
   the active stage's outcomes, acceptance criteria, and relevant dependencies;
   keep enough evidence to resume after compaction. Do not copy the entire
   playbook into the todo list. Mark an item complete only when its acceptance
   evidence is checked. Skip lifecycle todos for simple questions and genuine
   one-step tasks.
5. **Own and sequence the lifecycle.** The main agent establishes the plan and
   acceptance criteria, then performs the applicable Plan, Design, Build, Test,
   and Deploy work in order. A stage may be skipped only when its exit evidence
   already exists or the route says it is inapplicable; record why. Keep dependent
   stages sequential and carry verified evidence forward. The main agent retains
   unresolved decisions, integration, and final verification. Contributions may
   support a stage but do not take stage ownership. For simple questions and
   one-step tasks, no stage checklist is required.
6. **Reconcile and verify.** Review contributed work and evidence against the
   todo's acceptance criteria; resolve scope conflicts and dependencies before
   accepting it. Verify the integrated outcome at the end, preserve approval
   gates, and never claim unverified success. If an unanticipated decision arises,
   make a bounded selection from fresh evidence rather than preloading the full
   skill/tool catalog.
7. **Stop at the boundary.** Stop when the requested outcome is verified, a
   blocker or approval gate is reached, or the next step exceeds authorization.
   Report outcomes and remaining decisions or work.

## Steps

Identify the current stage from the user's goal and repository evidence. The
main agent records concrete, observable todos and any stage skipped or already
complete, then owns and performs the active stage using its relevant guidance.
Run stages in order; start partway through when earlier exit evidence already
exists. A stage is complete only when its acceptance evidence is verified.
Record inactive or already-complete stages with a brief reason when they would
otherwise be expected for the selected route. Use bounded contributor tasks only
when useful; they support, but do not replace, the main agent's ownership.

| Stage  | Possible bounded contributor roles | Stage skill                                 | Invoke                                                                                                          | Principles                                                                                                 | Exit evidence                                                                             |
| ------ | ---------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Plan   | `explorer`                         | [`/stage-plan`](../stage-plan/SKILL.md)     | `/project-context`, `/how`, `/why`, `/teach`, `/plan`, `/research`, `/figure-it-out`, `/show-me-your-work`      | `/principle-read-before-writing`, `/principle-context-boundaries`, `/principle-outcome-oriented-execution` | Clear goal, relevant code understanding, constraints, and an actionable plan when needed. |
| Design | `explorer`                         | [`/stage-design`](../stage-design/SKILL.md) | `/architect`, `/arena`, `/interrogate`                                                                          | `/principle-foundational-thinking`, `/principle-model-the-domain`, `/principle-simplicity-first`           | Chosen approach, data shape, and boundaries.                                              |
| Build  | `worker`, `evaluator`              | [`/stage-build`](../stage-build/SKILL.md)   | `/tdd`, `/language-best-practices`, `/deslop`, `/no-comments`                                                   | `/principle-simplicity-first`, `/principle-surgical-changes`, `/principle-sequence-verifiable-units`       | Scoped change with tests and a reviewable diff.                                           |
| Test   | `evaluator`                        | [`/stage-test`](../stage-test/SKILL.md)     | `/code-review`, `/blast-radius`, `/interrogate`, `/benchmark-checklist`, `/create-verification-skill`, `/swarm` | `/principle-test-behavior`, `/principle-prove-it-works`, `/principle-explain-the-number`                   | Evidence the intended behavior works on the best available surface, plus limitations.     |
| Deploy | `worker`                           | [`/stage-deploy`](../stage-deploy/SKILL.md) | `/make-pr-easy-to-review`, `/raise-pr`, `/babysit`, `/get-pr-comments`, `/fix-ci`, `/fix-merge-conflicts`       | `/principle-make-operations-idempotent`, `/principle-prove-it-works`                                       | Requested delivery prepared within publishing and merge gates.                            |

The main agent owns the stage and follows its guidance. Use the listed contributor
roles only for bounded tasks that support, but do not replace, that ownership; do
not dispatch a whole stage.

Default routes:

- Read-only how/why questions: Plan, then stop without editing.
- Bug fixes and features: Plan, Design if data shape or interfaces change, Build,
  Test. For explicit autopilot implementation requests, continue through Deploy
  to a reviewable PR: prepare and commit only the scoped change, then push and
  create its PR without asking again for authorization. Inspect and monitor
  required PR checks after creation; invoke `/fix-ci` for safe, in-scope failures,
  push authorized task-scoped fixes, and recheck. Do not ask for separate
  delivery/CI commands or redundant approval. Finish when all required checks
  pass or a concrete blocker exists; report unavailable status or no meaningful
  progress and stop rather than polling indefinitely. Never weaken or bypass
  checks. Stop before merge or deployment.
- Refactors: Plan, Build, behavior-preserving Test. Add Design if structure
  choices are material. For explicit autopilot implementation requests, continue
  through Deploy and create a PR for the verified scoped refactor.
- Performance: set target and baseline in Plan, then Build and comparable Test
  measurements. For explicit autopilot implementation requests, continue through
  Deploy and create a PR for the verified scoped change.
- Existing PR, CI, comment, or conflict requests: start in Deploy. Do Build and
  Test first if code changes are needed.
- Plan-only, design-only, and verify-only requests stop at their requested stage.
- One-step tasks skip the lifecycle; say so.

For each stage, the main agent loads only the selected guidance needed for its
work and follows its references; record relevant guidance skipped and why. If
work is deferred to a later stage, defer its guidance until then. Do not paraphrase
a skill from memory or claim it ran when it did not. Contributor briefs name the
relevant playbook, selected skills and principles, scope, acceptance criteria,
constraints, and requested evidence, and direct contributors to load their own
guidance. If contributor dispatch is unavailable or not useful, continue stage
work directly and record any material limitation.

Maintain is deferred. For an explicitly invoked autopilot implementation task,
scoped local commits and creating the task's PR are authorized delivery steps;
confirm the exact changed scope is limited to the task before publishing.
Lifecycle routing does not authorize merging, deployment, unrelated publication,
or destructive actions.
Shared skills and stage guidance must remain runtime-agnostic; report when an
important capability is unavailable and choose a safe available alternative.

### Explicit sustained-autonomy mode

Only when the user explicitly asks for a sustained autonomous run, improvement
cycle, or continued work beyond the immediate bounded task, also follow
`references/playbooks/autopilot.md`. Confirm its goal, scope, completion
criteria, and stopping conditions. An ordinary explicit autopilot invocation for
a bounded implementation already authorizes scoped commits and PR creation as
the delivery outcome. Sustained-autonomy authorization does not authorize
unrelated publishing, merging, destructive actions, or other gated operations
unless authorized by the user under the applicable playbook.

### Playbooks

- Playbook: [`/autopilot`](references/playbooks/autopilot.md) — The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `/autopilot` skill is the ordinary task router; an explicit invocation for implementation authorizes scoped commits and PR creation, but not sustained work or merging.
- `/babysit` ([skill](../babysit/SKILL.md)) — The user asks to monitor or shepherd an existing PR/stack toward a reviewable, merge-ready state.
- Playbook: `bug-fix` ([playbook](references/playbooks/bug-fix.md)) — A coding defect has a concrete, observable failure.
- `/delegate` ([skill](../delegate/SKILL.md)) — Multi-step work where bounded contributor tasks can help; the main agent retains lifecycle and stage ownership.
- `/diagnose-issues` ([skill](../diagnose-issues/SKILL.md)) — Triage an unclear homelab or connected-infrastructure symptom before the owning subsystem is known; hand off to its specialist skill once identified.
- Playbook: [`feature-work`](references/playbooks/feature-work.md) — Implementing a scoped feature or user-facing behavior; new feature work normally starts in an isolated worktree via `/feature-worktree` ([skill](../feature-worktree/SKILL.md)).
- `/feature-worktree` ([skill](../feature-worktree/SKILL.md)) — Start feature work in a dedicated worktree/local branch and route the branch through scoped PR creation authorized by autopilot or the user's explicit request, follow-up, and separately gated merging.
- Playbook: `pause-safely` ([playbook](references/playbooks/pause-safely.md)) — The user asks to pause, context is about to be compacted, or the session is going offline during substantive in-flight work.
- Playbook: `performance` ([playbook](references/playbooks/performance.md)) — Investigating or changing performance, latency, throughput, or resource use.
- `/plan` ([skill](../plan/SKILL.md)) — The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.
- `/project-context` ([skill](../project-context/SKILL.md)) — Before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar.
- Playbook: `prototype` ([playbook](references/playbooks/prototype.md)) — An uncertainty can be settled faster by observation (behavior, layout, performance, output, or a design fork) than by analysis or source reading.
- `/raise-pr` ([skill](../raise-pr/SKILL.md)) — Create the reviewable PR for autopilot implementation tasks after verification; do not ask again for commit/push/PR authorization when autopilot was explicitly invoked for that task.
- Playbook: `refactoring` ([playbook](references/playbooks/refactoring.md)) — Changing code structure while intending to preserve externally observable behavior.
- `/research` ([skill](../research/SKILL.md)) — A question needs investigation across multiple local or external sources, comparison, or evidence-backed synthesis.
- Playbook: `session-pickup` ([playbook](references/playbooks/session-pickup.md)) — Resuming substantive in-flight work from an earlier session, handoff, or compaction.
- Playbook: `visual-parity` ([playbook](references/playbooks/visual-parity.md)) — Matching an implementation to an authoritative screenshot or visual reference.
- Playbook: `worktree-cleanup` ([playbook](references/playbooks/worktree-cleanup.md)) — The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.

## Asks You?

Ask only when a missing user decision blocks safe progress or an approval gate is reached. Otherwise proceed within the selected workflow and report unresolved risks.

## Output

Report the verified outcome, relevant evidence, checks and limitations, decisions, and remaining work or risks. For explicit autopilot implementation, include PR-ready delivery evidence or the exact blocker.

## Best Size

Use for substantive multi-step engineering work with a lifecycle. Keep simple questions and one-step tasks lightweight.

## Speed

Load only the routing and stage guidance needed now. Use bounded contributors only when they add useful independent work or evidence; avoid excess delegation and indefinite polling.

## Edge

Use the current runtime's native mechanisms for skill invocation, task tracking, contributors, and tools. Runtime-specific commands, schemas, and mappings do not belong in this shared skill; consult the runtime's own configuration when needed. Do not assume a tool or command name transfers between environments. Preserve all approval boundaries, including the limits on merging, deployment, unrelated changes, and destructive actions.
