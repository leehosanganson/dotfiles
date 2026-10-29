---
name: autopilot
description: >-
  Route nontrivial engineering work (bug fix, feature, refactor, performance,
  plan, research, PR, worktree cleanup, session pickup) to the matching
  playbook and principles, then coordinate execution and verification. Use
  when the user asks for multi-step engineering work or invokes autopilot.
  Not for simple questions, single-line edits, or non-engineering tasks
  covered by other skills.
---

# Autopilot

Autopilot is the task router for substantive work. The complete skill directory
is self-contained and portable: `references/playbooks/` and
`references/principles/` are the single source of truth for the workflows and
working principles used by this router. Do not expect sibling `rules/` or
`playbooks/` directories. Installing this skill authorizes only the task the
user requests—not a sustained autonomous campaign or any action beyond scope.

1. **Classify the request.** Identify the desired outcome, scope, constraints,
   approval boundaries, and observable success criteria. Answer simple questions
directly without routing them through a workflow.
2. **Select guidance.** Pick the matching workflow from the Playbooks
   section below, then read its complete file in `references/playbooks/`.
   Read the core policy in `references/principles/AGENTS.md` and only the
   additional principle files relevant to this task. For implementation, use
   `project-context.md` when context is unfamiliar or materially relevant and
   `plan.md` before nontrivial changes. Load an installed specialist skill when
   it adds needed domain or harness capability, and check for repository-
   specific workflow guidance. Do not read unrelated playbooks.
3. **Track execution proportionately.** Use the harness's native task/todo
   mechanism for multi-step work when available. Keep simple or one-step work
   lightweight; do not mechanically copy playbook steps or create skipped-step
   entries when they add no tracking value. Otherwise keep progress visible in
   the response or handoff.
4. **Plan and delegate proportionately.** Keep one-step tasks lightweight. For
   nontrivial work, plan before implementation. Follow the `delegate` playbook
   and use native subagents when independently scoped work benefits from it.
   Give each worker the applicable instructions, scope, exclusions, and checks.
   Do not parallelize dependent or overlapping changes. Integrate and
   independently verify delegated results.
5. **Execute and verify.** Follow the selected guidance, preserve the user's
   scope and approval gates, and verify the stated success criteria. Report
   checks run or skipped; do not claim unverified success.
6. **Stop at the boundary.** Stop when the requested outcome is verified, a
   blocker or approval gate is reached, or the next step exceeds authorization.
   Report outcomes and remaining decisions or work.

## Explicit sustained-autonomy mode

Only when the user explicitly asks for a sustained autonomous run, improvement
cycle, or continued work beyond the immediate bounded task, also follow
`references/playbooks/autopilot.md`. Confirm its goal, scope, completion
criteria, and stopping conditions. This does not authorize publishing, merging,
destructive actions, or other gated operations unless explicitly authorized by
the user under the applicable playbook.

## Playbooks

- [`autopilot`](references/playbooks/autopilot.md) — The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `autopilot` skill is the ordinary task router; do not apply this sustained-run procedure unless that authorization is explicit.
- [`babysit`](references/playbooks/babysit.md) — The user asks to monitor or shepherd an existing PR/stack toward a reviewable, merge-ready state.
- [`bug-fix`](references/playbooks/bug-fix.md) — A coding defect has a concrete, observable failure.
- [`delegate`](references/playbooks/delegate.md) — The user has authorized implementation and the work has independently scoped slices that benefit from subagents.
- [`diagnose-issues`](references/playbooks/diagnose-issues.md) — Triage an unclear homelab or connected-infrastructure symptom before the owning subsystem is known; hand off to its specialist skill once identified.
- [`feature-work`](references/playbooks/feature-work.md) — Implementing a scoped feature or user-facing behavior.
- [`pause-safely`](references/playbooks/pause-safely.md) — The user asks to pause, context is about to be compacted, or the session is going offline during substantive in-flight work.
- [`performance`](references/playbooks/performance.md) — Investigating or changing performance, latency, throughput, or resource use.
- [`plan`](references/playbooks/plan.md) — The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.
- [`project-context`](references/playbooks/project-context.md) — Before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar or relevant.
- [`prototype`](references/playbooks/prototype.md) — An uncertainty can be settled faster by observation (behavior, layout, performance, output, or a design fork) than by analysis or source reading.
- [`raise-pr`](references/playbooks/raise-pr.md) — The user explicitly asks to create a PR or requests PR creation as the final delivery step after implementation.
- [`refactoring`](references/playbooks/refactoring.md) — Changing code structure while intending to preserve externally observable behavior.
- [`research`](references/playbooks/research.md) — A question needs investigation across multiple local or external sources, comparison, or evidence-backed synthesis.
- [`session-pickup`](references/playbooks/session-pickup.md) — Resuming substantive in-flight work from an earlier session, handoff, or compaction.
- [`visual-parity`](references/playbooks/visual-parity.md) — Matching an implementation to an authoritative screenshot or visual reference.
- [`worktree-cleanup`](references/playbooks/worktree-cleanup.md) — The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.

## Runtime integration

Use the current runtime's native mechanisms for skill invocation, task tracking,
subagents, and tools. Runtime-specific commands, schemas, and mappings do not
belong in this shared skill; consult the runtime's own configuration when needed.
Do not assume a tool or command name transfers between environments.
