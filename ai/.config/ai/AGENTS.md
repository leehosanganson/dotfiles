# Shared AI workflow entry point

Keep this directory vendor-neutral: its skills, agents, prompts, and playbooks describe outcomes and workflows, not any particular model provider, agent harness, command syntax, tool name, frontmatter schema, or installation path. Put runtime-specific configuration and adapters in the corresponding runtime's configuration directory. Preserve upstream license and attribution files as legal metadata, not prompt guidance.

For substantive tasks, use the `autopilot` skill as the workflow entry point. It selects the task playbook; playbooks sequence capability skills and identify relevant `principle-*` skills. The leaf skills are the canonical actionable guidance and can be used by delegated agents. Autopilot's references hold workflow routing and indexes, not duplicate copies of leaf skill content.

Keep the main thread focused. For substantive work, proactively delegate bounded, independent exploration or implementation slices when capable agents are available and delegation is likely to improve focus, throughput, or review quality. Keep tightly coupled decisions, integration, and final verification with the coordinator. Avoid delegating trivial tasks or adding coordination overhead without benefit.

Use the current runtime's native skill invocation to activate `autopilot`, then follow the matching playbook. Load only relevant capability and principle skills. When delegating, pass the assigned workflow and capability skills plus the relevant `principle-*` skill names, and direct the subagent to consult them for its scope. Keep simple questions and one-step tasks lightweight. Routing does not authorize sustained autonomy or gated actions.
