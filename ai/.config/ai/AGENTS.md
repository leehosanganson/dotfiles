# Shared AI workflow entry point

Keep this directory vendor-neutral: its skills, agents, prompts, and playbooks describe outcomes and workflows, not any particular model provider, agent harness, command syntax, tool name, frontmatter schema, or installation path. Put runtime-specific configuration and adapters in the corresponding runtime's configuration directory. Preserve upstream license and attribution files as legal metadata, not prompt guidance.

For substantive tasks, use the `autopilot` skill as the workflow entry point. It owns the canonical working principles and playbooks in its `references/` directory; do not depend on sibling `rules/` or `playbooks/` directories.

Keep the main thread focused. For substantive work, proactively delegate bounded, independent exploration or implementation slices when capable agents are available and delegation is likely to improve focus, throughput, or review quality. Keep tightly coupled decisions, integration, and final verification with the coordinator. Avoid delegating trivial tasks or adding coordination overhead without benefit.

Use the current runtime's native skill invocation to activate `autopilot`, then follow the matching playbook and relevant principles. Keep simple questions and one-step tasks lightweight. Routing does not authorize sustained autonomy or gated actions.
