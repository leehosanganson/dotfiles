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
creating that PR without asking again. It does not authorize merging, deployment,
unrelated changes, or destructive actions.

## Ownership model

The main agent is a **router and coordinator**, not the default stage worker. It
classifies the request, identifies the active lifecycle stage and matching
playbook, selects only the stage skill and capabilities that stage needs, and delegates execution to a
subagent. The subagent owns the stage: it loads and applies the assigned playbook,
assigned `stage-*` skill and selected skills, and returns concise exit evidence
plus any handoff. The coordinator alone dispatches top-level lifecycle stage owners. A stage owner must never spawn or delegate to child agents; the owner performs applicable capability work inline or sequentially, or reports the limitation. For each dependent stage, dispatch a new owner after checking that the
prior stage's exit evidence is present. Do not do stage work inline merely to
avoid dispatch or because instructions say a capability is normally invoked
"inline"; that refers to how the stage owner applies it.

Keep the main context to the task summary, stage and owner, required user
decisions, concise handoffs, and final integration/verification results. Do not
load full stage skills into the main context when the stage is delegated; put
their names and required instructions in the handoff.
The main agent remains responsible for the overall sequence, clarifications,
approval gates, reconciling results, and final integrated verification. It may
inspect relevant diffs and run final checks, but should not redo delegated stage
work. If subagents are unavailable, report that limitation and ask before
replacing the requested delegated workflow with inline execution, unless the user
has already authorized that fallback.

1. **Classify the request.** Identify the desired outcome, scope, constraints,
   approval boundaries, and observable success criteria. Answer simple questions
   directly without routing them through a workflow.
2. **Route by playbook and stage.** Pick the matching entry from the Playbooks
   section below. Identify the active lifecycle stage using the goal and existing
   exit evidence. Check only the repository-specific workflow guidance needed to
   route safely. Select the playbook, assigned stage skill, and relevant capabilities and
   principles for the stage owner. Do not load the full stage skill into the
   main context when handing off; give the owner its exact path or name to load.
   Do not read unrelated playbooks, stage skills, capabilities, tools, or files.
3. **Keep execution context with the stage owner.** The coordinator loads only
   routing/coordination guidance and context needed to classify the task, identify
   blockers, and define the handoff. Delegate each active stage to a subagent.
   Pass the stage, matching playbook, selected skills and principles, relevant
   evidence, scope, acceptance criteria, constraints, and required exit evidence;
   instruct the owner to load and follow its guidance itself. The owner returns a
   concise result and next-stage handoff, not copied skill text. Never parallelize
   dependent stages. Do not move a stage inline as a convenience. If delegation is
   unavailable, stop at the boundary and ask whether to proceed inline unless
   fallback was authorized. Do not preload later-stage guidance.
4. **Make routing observable without copying the workflow.** Before dispatch,
   record the selected playbook, active stage, stage owner, required exit evidence,
   and next dependency in the harness's task/todo mechanism. Do not copy every
   numbered stage/playbook instruction into the main-context checklist; the
   delegated owner tracks and follows its own guidance. Mark stage completion only
   from returned exit evidence, not from activity or a handoff label. For simple
   questions and one-step tasks, skip this checklist when no workflow is selected.
5. **Plan and delegate stage ownership.** For nontrivial work, establish the
   plan and acceptance criteria through the Plan stage owner before implementation.
   Delegate every active stage, including Plan, Design, Build, Test, and Deploy
   when selected. A stage may be skipped only when its documented exit evidence
   already exists or the route says it is inapplicable; record why. Keep dependent
   stages sequential and pass verified exit evidence forward. The coordinator
   retains sequencing, unresolved user decisions, integration, and final
   verification, but does not perform the delegated stage's substantive work.
   For simple questions and one-step tasks with no lifecycle route, no stage
   delegation is required.
6. **Coordinate and verify.** The stage owner follows the selected guidance and
   returns evidence, checks run or skipped, and limitations. The coordinator
   checks the evidence against exit criteria, resolves user decisions and
   dependencies, then hands off to the next stage owner. At the end, independently
   verify the integrated outcome without repeating stage execution. Preserve
   scope and approval gates; never claim unverified success. If an unanticipated
   decision arises, make a bounded selection from fresh evidence rather than
   preloading the full skill/tool catalog.
7. **Stop at the boundary.** Stop when the requested outcome is verified, a
   blocker or approval gate is reached, or the next step exceeds authorization.
   Report outcomes and remaining decisions or work.

## Development lifecycle

Identify the current stage from the user's goal and repository evidence. The
coordinator records the active stage, brief routing evidence, and any stage
skipped or already complete, then dispatches that stage to its owner. Each owner loads and applies its assigned stage skill; the coordinator does not
load the stage skill when delegating. Run stages in order; start partway through
when earlier exit evidence already exists. A stage is complete only when its exit evidence is returned. Record inactive or already-complete stages with a brief reason when they would
otherwise be expected for the selected route.

| Stage | Stage skill | Invoke | Principles | Exit evidence |
|---|---|---|---|---|
| Plan | [`stage-plan`](../stage-plan/SKILL.md) | `project-context`, `how`, `why`, `teach`, `plan`, `research`, `figure-it-out`, `show-me-your-work` | `principle-read-before-writing`, `principle-context-boundaries`, `principle-outcome-oriented-execution` | Clear goal, relevant code understanding, constraints, and an actionable plan when needed. |
| Design | [`stage-design`](../stage-design/SKILL.md) | `architect`, `arena`, `interrogate` | `principle-foundational-thinking`, `principle-model-the-domain`, `principle-simplicity-first` | Chosen approach, data shape, and boundaries. |
| Build | [`stage-build`](../stage-build/SKILL.md) | `tdd`, `language-best-practices`, `deslop`, `no-comments` | `principle-simplicity-first`, `principle-surgical-changes`, `principle-sequence-verifiable-units` | Scoped change with tests and a reviewable diff. |
| Test | [`stage-test`](../stage-test/SKILL.md) | `code-review`, `blast-radius`, `interrogate`, `benchmark-checklist`, `create-verification-skill`, `swarm` | `principle-test-behavior`, `principle-prove-it-works`, `principle-explain-the-number` | Evidence the intended behavior works on the best available surface, plus limitations. |
| Deploy | [`stage-deploy`](../stage-deploy/SKILL.md) | `make-pr-easy-to-review`, `raise-pr`, `babysit`, `get-pr-comments`, `fix-ci`, `fix-merge-conflicts` | `principle-make-operations-idempotent`, `principle-prove-it-works` | Requested delivery prepared within publishing and merge gates. |

Default routes:

- Read-only how/why questions: Plan, then stop without editing.
- Bug fixes and features: Plan, Design if data shape or interfaces change, Build, Test. For explicit autopilot implementation requests, continue through Deploy to a reviewable PR: prepare and commit only the scoped change, then push and create its PR without asking again for authorization. Stop before merge or deployment.
- Refactors: Plan, Build, behavior-preserving Test. Add Design if structure choices are material. For explicit autopilot implementation requests, continue through Deploy and create a PR for the verified scoped refactor.
- Performance: set target and baseline in Plan, then Build and comparable Test measurements. For explicit autopilot implementation requests, continue through Deploy and create a PR for the verified scoped change.
- Existing PR, CI, comment, or conflict requests: start in Deploy. Do Build and Test first if code changes are needed.
- Plan-only, design-only, and verify-only requests stop at their requested stage.
- One-step tasks skip the lifecycle; say so.

Each stage owner loads the assigned `stage-*` skill and only the selected
guidance needed for its work. Follow the selected workflow's references, and
record skipped guidance with a brief reason. If work is deferred to a later stage,
pass that stage's selected skill names in its handoff rather than loading them early.
Do not paraphrase a skill from memory or claim it ran when it did not. Every active stage handoff names the
stage, playbook, selected skills and principles, scope, acceptance criteria,
constraints, and required exit evidence, and directs the subagent to load its own
guidance. If no subagent mechanism is available, ask before switching to inline
execution unless the user has already authorized that fallback.

Maintain is deferred. For an explicitly invoked autopilot implementation task,
scoped local commits and creating the task's PR are authorized delivery steps;
confirm the exact changed scope is limited to the task before publishing.
Lifecycle routing does not authorize merging, deployment, unrelated publication,
or destructive actions.
Shared skills and stage guidance must remain runtime-agnostic; report when an
important capability is unavailable and choose a safe available alternative.

## Explicit sustained-autonomy mode

Only when the user explicitly asks for a sustained autonomous run, improvement
cycle, or continued work beyond the immediate bounded task, also follow
`references/playbooks/autopilot.md`. Confirm its goal, scope, completion
criteria, and stopping conditions. An ordinary explicit autopilot invocation for
a bounded implementation already authorizes scoped commits and PR creation as the
delivery outcome. Sustained-autonomy authorization does not authorize unrelated
publishing, merging, destructive actions, or other gated operations unless
authorized by the user under the applicable playbook.

## Playbooks

- [`autopilot`](references/playbooks/autopilot.md) — The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `autopilot` skill is the ordinary task router; an explicit invocation for implementation authorizes scoped commits and PR creation, but not sustained work or merging.
- [`babysit`](../babysit/SKILL.md) (skill) — The user asks to monitor or shepherd an existing PR/stack toward a reviewable, merge-ready state.
- [`bug-fix`](references/playbooks/bug-fix.md) — A coding defect has a concrete, observable failure.
- [`delegate`](../delegate/SKILL.md) (skill) — Multi-step work that can be split into independently scoped slices.
- [`diagnose-issues`](../diagnose-issues/SKILL.md) (skill) — Triage an unclear homelab or connected-infrastructure symptom before the owning subsystem is known; hand off to its specialist skill once identified.
- [`feature-work`](references/playbooks/feature-work.md) — Implementing a scoped feature or user-facing behavior; new feature work normally starts in an isolated worktree via [`feature-worktree`](../feature-worktree/SKILL.md).
- [`feature-worktree`](../feature-worktree/SKILL.md) (skill) — Start feature work in a dedicated worktree/local branch and route it through scoped PR creation authorized by autopilot or the user's explicit request, follow-up, and separately gated merging.
- [`pause-safely`](references/playbooks/pause-safely.md) — The user asks to pause, context is about to be compacted, or the session is going offline during substantive in-flight work.
- [`performance`](references/playbooks/performance.md) — Investigating or changing performance, latency, throughput, or resource use.
- [`plan`](../plan/SKILL.md) (skill) — The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.
- [`project-context`](../project-context/SKILL.md) (skill) — Before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar.
- [`prototype`](references/playbooks/prototype.md) — An uncertainty can be settled faster by observation (behavior, layout, performance, output, or a design fork) than by analysis or source reading.
- [`raise-pr`](../raise-pr/SKILL.md) (skill) — Create the reviewable PR for autopilot implementation tasks after verification; do not ask again for commit/push/PR authorization when autopilot was explicitly invoked for that task.
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
