# Shared working principles

This file is the index and shared router policy for working principles. Each leaf principle is independently invokable at `ai/.config/ai/skills/principle-<name>/SKILL.md`; its contents are the canonical guidance. Keep harness-specific invocation in the skill adapter or configuration.

## Principles

The bullets below are short routing summaries only. When a principle applies, read its matching `principle-*` skill in full. Do not treat this index as a second canonical copy.

### Universal guardrails
Respect the user's stated scope and approval boundaries. Preserve user work. Do not invent evidence or silently override conflicts. Keep shared guidance portable. These guardrails apply across workflows; detailed decision methods live in relevant `principle-*` skills and task playbooks.

- Think before coding and read before writing: `principle-read-before-writing`.
- Simplicity and surgical scope: `principle-simplicity-first` and `principle-surgical-changes`.
- Goal-driven execution and task decomposition: `principle-outcome-oriented-execution` and `principle-sequence-verifiable-units`.
- Surface conflicts and respect context boundaries: `principle-surface-conflicts` and `principle-context-boundaries`.
- Parallelism: `principle-safe-concurrency`.
- Truth and evidence: `principle-prove-it-works`, `principle-explain-the-number`, and `principle-attack-the-premise` as applicable.
- Minimal documentation and reader load: `principle-minimize-reader-load`.
- Bounded autonomy and approval gates are universal Autopilot policy, not a subagent-overridable principle.
- Encode repeated evidence-backed corrections using `principle-encode-corrections`.

### Principle routing
Use `principle-foundational-thinking` for nontrivial state/data shape decisions, `principle-model-the-domain` for domain modeling, `principle-minimize-reader-load` for readability and simplicity, `principle-outcome-oriented-execution` for goals and scope, `principle-sequence-verifiable-units` for task decomposition, `principle-safe-concurrency` for parallel work, `principle-prove-it-works` for verification, `principle-web-search` for current external facts, `principle-attack-the-premise` for repeated failed assumptions, and `principle-encode-corrections` for recurring lessons. Invoke other principle skills by their trigger. Do not load the full catalog by default.

## Workflow router

The `autopilot` skill is the entry point for substantive work. It selects workflows from the playbooks listed in [`../../SKILL.md`](../../SKILL.md) and invokes the skills and `principle-*` skills named by the active stage and playbook. Keep simple questions and one-step tasks lightweight. Follow the selected workflow and report verification and blockers.

Use the current harness's task tracking and delegation mechanisms. For multi-step work, invoke the `delegate` skill; skip it for one-step work or work too tightly coupled to split. Give subagents the applicable playbook and skill names, and direct them to load relevant principle skills for their assigned scope. Shared guidance names capabilities, not runtime-specific invocation syntax.

## Principle skill index

The independently invokable `principle-*` skills are the canonical leaf guidance. Read only the matching skill when its trigger applies:

- [`principle-attack-the-premise`](../../../principle-attack-the-premise/SKILL.md) — test a shared assumption when repeated fixes fail.
- [`principle-context-boundaries`](../../../principle-context-boundaries/SKILL.md) — prefer relevant local evidence and retrieve external facts only when needed.
- [`principle-build-the-lever`](../../../principle-build-the-lever/SKILL.md) — consider reusable tools when recurring work justifies the cost.
- [`principle-encode-corrections`](../../../principle-encode-corrections/SKILL.md) — encode recurring corrections structurally.
- [`principle-explain-the-number`](../../../principle-explain-the-number/SKILL.md) — establish what quantitative results measure.
- [`principle-foundational-thinking`](../../../principle-foundational-thinking/SKILL.md) — settle data shapes, ownership, and state before nontrivial logic.
- [`principle-makefile-first`](../../../principle-makefile-first/SKILL.md) — prefer established Makefile targets.
- [`principle-make-operations-idempotent`](../../../principle-make-operations-idempotent/SKILL.md) — make retryable operations converge safely.
- [`principle-migrate-callers-then-delete-legacy-apis`](../../../principle-migrate-callers-then-delete-legacy-apis/SKILL.md) — migrate callers before deleting replaced interfaces.
- [`principle-minimize-reader-load`](../../../principle-minimize-reader-load/SKILL.md) — reduce unnecessary indirection and repeated context.
- [`principle-model-the-domain`](../../../principle-model-the-domain/SKILL.md) — represent domain concepts and invariants explicitly.
- [`principle-outcome-oriented-execution`](../../../principle-outcome-oriented-execution/SKILL.md) — prioritize observable outcomes over activity.
- [`principle-prove-it-works`](../../../principle-prove-it-works/SKILL.md) — verify the intended behavior on the real artifact.
- [`principle-read-before-writing`](../../../principle-read-before-writing/SKILL.md) — inspect the affected paths before changing them.
- [`principle-python-execution`](../../../principle-python-execution/SKILL.md) — follow project Python conventions and execution tools.
- [`principle-redesign-from-first-principles`](../../../principle-redesign-from-first-principles/SKILL.md) — revisit a design when repeated patches expose mismatch.
- [`principle-safe-concurrency`](../../../principle-safe-concurrency/SKILL.md) — isolate shared mutable state before parallel work.
- [`principle-scoped-attempts`](../../../principle-scoped-attempts/SKILL.md) — bound repeated failed approaches.
- [`principle-simplicity-first`](../../../principle-simplicity-first/SKILL.md) — prefer the smallest clear solution.
- [`principle-surgical-changes`](../../../principle-surgical-changes/SKILL.md) — keep edits within the requested outcome.
- [`principle-surface-conflicts`](../../../principle-surface-conflicts/SKILL.md) — resolve conflicting guidance visibly using evidence.
- [`principle-sequence-verifiable-units`](../../../principle-sequence-verifiable-units/SKILL.md) — order dependent work into independently verified units.
- [`principle-temp-files`](../../../principle-temp-files/SKILL.md) — keep temporary artifacts in approved scratch locations.
- [`principle-test-behavior`](../../../principle-test-behavior/SKILL.md) — test user-visible or system-level contracts.
- [`principle-type-and-boundary-discipline`](../../../principle-type-and-boundary-discipline/SKILL.md) — validate at boundaries and preserve internal invariants.
- [`principle-web-search`](../../../principle-web-search/SKILL.md) — use current external sources when needed.

## Runtime integration

Keep shared instructions and principles independent of any agent runtime. Consult the active runtime's own configuration for concrete tool operations, commands, and metadata; do not assume an interface exists elsewhere.
