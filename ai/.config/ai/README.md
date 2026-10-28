# Shared AI Workflow Resources

This directory contains vendor-neutral agent guidance and reusable skills. Skills, agents, prompts, and playbooks describe goals, decisions, constraints, and expected outcomes—not a particular model provider or agent runtime's command syntax, tool names, metadata schema, or filesystem layout.

## Portability boundary

- Keep `AGENTS.md`, agent role instructions, skills, and autopilot playbooks runtime-agnostic. Refer to capabilities (for example, task tracking, repository inspection, or subagent dispatch) rather than hard-coded tool identifiers or vendor-specific prompt commands.
- Runtime integrations belong in that runtime's configuration package, outside this directory. Put model assignments, permissions, agent metadata, tool mappings, commands, setup scripts, and adapters there; connect shared guidance through the runtime's supported resource-loading mechanism.
- Domain-specific skills may name the external platform they operate (such as GitHub or Kubernetes), but should describe the goal and select among available equivalent interfaces where possible. This does not make the shared prompt framework vendor-bound.
- Preserve upstream licenses and attribution as legal metadata. They are not agent instructions and are exempt from prompt portability checks.

## Autopilot

The `skills/autopilot/` directory is the sole source of truth for shared engineering playbooks and working principles. It routes substantive work to the relevant workflow, applies only relevant principles, and coordinates context gathering, planning, tracking, delegation when useful, execution, and verification. Keep simple questions and one-step tasks lightweight.

Use the current runtime's native skill mechanism to activate the autopilot skill. Follow its matching playbook and relevant principles. Routing authorizes only the requested task; sustained autonomy and gated actions require explicit authorization under the applicable workflow.

## Other skills

Other directories under `skills/` provide focused capabilities such as planning, review, delegation, operations, research, and content workflows. Keep their trigger descriptions specific, state meaningful exclusions, remove non-directive filler, and keep `SKILL.md` concise. Put detailed guides and scripts in referenced resource files when they are needed.
