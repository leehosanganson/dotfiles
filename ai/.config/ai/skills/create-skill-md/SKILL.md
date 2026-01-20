---
name: create-skill.md
description: Expertly authors new agent skills by following strict standardization and template guidelines.
---

# Create SKILL.md

This skill create high-quality, reliable, and safe `SKILL.md` files for agents. When a user asks you to "create a skill" or "teach the agent how to [X]," you must follow the procedure below.

## Instructions

1.  **Analyze Intent:** Determine the *Trigger* (when the skill runs) and the *Action* (what it actually does).
2.  **Identify Tools:** Determine which CLI commands or MCP tools the skill needs (e.g., `grep`, `npm test`, `git status`).
3.  **Define Constraints:** What should the agent *never* do? (e.g., "Never delete data," "Never commit to main").
4.  **Generate Output:** Output the full `SKILL.md` content inside a code block using the **Standard Template** below.
5.  **Name the File:** Give the directory a name that matches the *Trigger* and *Action* of the skill (e.g `grep-for-file`) and place the `SKILL.md` under that directory. 
6.  ** Place the Directory:** Place the directory in the `~/.dotfiles/ai/.config/ai/skills` directory.

### Template

Use this exact structure for all new skills.

```markdown
---
name: [skill-name-kebab-case]
description: [One sentence summary of what this skill achieves]
---

# [Skill Name]

[Brief Context: Explain what this skill should do]

## When to Use this Skill
This skill is activated when the user asks to:

- [Trigger 1]
- [Trigger 2]

## Instructions
When this skill is active, strictly follow these steps in order:

1.  **[Step Name]**: [Instruction]
    - *Command:* `[Optional CLI command to run]`
2.  **[Step Name]**: [Instruction]
3.  **[Step Name]**: [Instruction]

## Critical Constraints (The "Guardrails")
-   **NEVER** [Constraint 1]
-   **ALWAYS** [Constraint 2]
- ⚠️ **CHECK** [Constraint 3]

## Examples

### Example 1
[Example 1]

### Example 2
[Example 2]
```
