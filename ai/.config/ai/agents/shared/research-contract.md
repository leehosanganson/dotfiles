---
title: Shared Agent Contract
description: Standardized contract between orchestrator sub-agents (research & deep-research). Both agents MUST follow these rules.
source-files: research.md, deep-research.md
---

# Shared Agent Contract

## 1. Session Directory Rules

| Rule | Detail |
|---|---|
| **Naming** | `~/Documents/research/YYYYMMDD_HHMMSS_<project-slug>/` |
| **Creation** | Orchestrator creates the directory at session start; sub-agents never create their own. |
| **Pass-down** | Directory path is passed via `-p/--project` flag. |
| **Verification** | Sub-agent MUST verify the supplied path begins with `~/Documents/research/`. |

## 2. Escalation Protocol

When a sub-agent cannot complete its assignment, it MUST:

1. Output YAML frontmatter with one of: `status: wall-hit` or `status: partial`.
2. Include an **escalation checklist** — address each item:
   - Source sufficiency
   - Question coverage
   - Source quality
   - Topic feasibility
3. Orchestrator receives the escalation and re-scopes: narrow scope, redirect topic, provide specific keywords, or deprioritize.
4. Every retry MUST use different research questions.

## 3. Output Contract

Every sub-agent deliverable MUST include:

- `## Summary` — brief overview of findings
- `## Key Findings` — detailed results and analysis
- `## Sources` — full list with links

All claims must cite using `[source](url)` syntax. Writers must use the `write-research-notes` skill with an explicit `--target` flag (never create their own session directories).
