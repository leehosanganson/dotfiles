# AI Workflow Configuration

This package shares one task workflow between Pi and Claude Code. **The portable `skills/autopilot/` directory is the sole source of truth for working principles and playbooks.** Do not maintain sibling copies under `rules/` or `playbooks/`.

## Autopilot skill

The skill routes substantive work to one or more matching workflows in `skills/autopilot/references/playbooks/`, applies relevant principles from `skills/autopilot/references/principles/`, and coordinates planning, task tracking, delegation when useful, execution, and verification. It keeps simple questions and one-step tasks lightweight.

Download or install `skills/autopilot/` by itself to get the complete router, playbooks, and principles. No sibling directories, generator, or sync step are required. To change workflow policy, edit the references inside that skill directory directly.

Invoking the router authorizes only the requested task. Sustained autonomous runs, publishing, merging, and other gated actions need explicit authorization under the applicable workflow.

## Harness integration

- **Claude Code:** Install the directory as `.claude/skills/autopilot/` in a project or `~/.claude/skills/autopilot/` for personal use. Claude Code exposes it as `/autopilot`.
- **Pi:** Install the same skill directory in Pi's skills location. Invoke it as `/skill:autopilot`. This dotfiles package also includes the optional `pi/.pi/agent/extensions/autopilot.ts` command, which adds `/autopilot` and expands the skill.

The shared entry point in `AGENTS.md` tells agents to use the skill for substantive work. Harness-specific commands and subagent tools belong in their adapters; the playbooks avoid assuming one runtime's tool names are available in another.

## Other capability skills

Other directories under `skills/` provide optional, focused capabilities such as planning, code review, delegation, operations, research, and content workflows. They may point to the corresponding canonical playbook inside `skills/autopilot/references/playbooks/`, but do not maintain a second copy of workflow policy.
