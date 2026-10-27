# Playbook index

Canonical workflow playbooks for the autopilot skill. Use this index to choose a workflow, then read its full file from this directory.

- [`autopilot`](autopilot.md) — The user explicitly authorizes a sustained autonomous engineering run or multi-PR improvement cycle with a goal and completion criteria. The `autopilot` skill is the ordinary task router; do not apply this sustained-run procedure unless that authorization is explicit.
- [`babysit`](babysit.md) — The user asks to monitor or shepherd an existing PR/stack toward a reviewable, merge-ready state.
- [`bug-fix`](bug-fix.md) — A coding defect has a concrete, observable failure.
- [`create-skill`](create-skill.md) — The user requests authoring, revising, or evaluating an agent skill.
- [`delegate`](delegate.md) — The user has authorized implementation and the work has independently scoped slices that benefit from subagents.
- [`diagnose-issues`](diagnose-issues.md) — Triage an unclear homelab or connected-infrastructure symptom before the owning subsystem is known; hand off to its specialist skill once identified.
- [`feature-work`](feature-work.md) — Implementing a scoped feature or user-facing behavior.
- [`pause-safely`](pause-safely.md) — Pause safely
- [`performance`](performance.md) — Investigating or changing performance, latency, throughput, or resource use.
- [`plan`](plan.md) — The user asks for a plan, or a nontrivial implementation needs an analysis phase before work begins.
- [`project-context`](project-context.md) — Before substantive implementation or planning when repository conventions, architecture, branch/PR state, or verification commands are unfamiliar or relevant.
- [`prototype`](prototype.md) — Prototype
- [`raise-pr`](raise-pr.md) — The user explicitly asks to create a PR or requests PR creation as the final delivery step after implementation.
- [`refactoring`](refactoring.md) — Changing code structure while intending to preserve externally observable behavior.
- [`research`](research.md) — A question needs investigation across multiple local or external sources, comparison, or evidence-backed synthesis.
- [`session-pickup`](session-pickup.md) — Session pickup
- [`visual-parity`](visual-parity.md) — Matching an implementation to an authoritative screenshot or visual reference.
- [`worktree-cleanup`](worktree-cleanup.md) — The user asks to reclaim disk or remove Git worktrees and related stale development artifacts.
