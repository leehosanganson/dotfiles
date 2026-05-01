---
name: manage-project-memory
description: >-
  Manage project-scoped memory using AGENTS.md at the project root as the primary
  entrypoint, with supporting reference material in docs/*.md. Enables persistent,
  structured knowledge across sessions so agents never lose important context.
---

# Manage Project Memory

This skill enables persistent, project-scoped memory across sessions. All memory is stored in a two-tier structure:

- **`AGENTS.md`** at the project root — the primary entrypoint containing concise, critical facts any agent must know before working in this repository (project overview, tech stack, core conventions, essential decisions).
- **`docs/*.md`** files — supporting reference material with detailed architecture notes, service dependencies, environment configuration, step-by-step SOPs, and project-scoped user preferences.

This separation ensures agents always have essential context loaded first, with optional deep-dives as needed.

---

## When to Use this Skill

Activate this skill whenever:

- The user shares information to remember ("remember this", "note that", "going forward…")
- The user asks to recall something previously discussed
- **At the start of every session** — proactively load `AGENTS.md` and, if relevant, specific `docs/*.md` files
- Before answering any question where stored context may be relevant
- After completing a task that produced new decisions, conventions, or workflow steps

---

## Project Root Detection

Used by all flows. Attempt in order:

- **A**: Use the workspace root from the environment if available (e.g., `WORKSPACE_ROOT` or equivalent)
- **B**: Otherwise run `git rev-parse --show-toplevel` to detect the root
- **C**: If both fail, ask the user once; store the answer for the remainder of the session

---

## Memory Classification Rules

Classify each piece of information into exactly ONE tier:

| Tier | Target file | What belongs here |
|---|---|---|
| **Tier 1 — Essential** | `AGENTS.md` | Concise, critical facts any agent must know before working in this repo: project overview, tech stack summary, core conventions, essential key decisions |
| **Tier 2 — Reference** | `docs/*.md` | Detailed supporting material: full architecture notes, service dependency details, environment configuration specifics, step-by-step SOPs, procedural workflows, project-scoped user preferences |

### Classification Decision Tree

1. **Is this information critical for any agent working in this project?** → Tier 1 → `AGENTS.md`
2. **Is this detailed reference material that supports the essentials?** → Tier 2 → appropriate `docs/*.md` file
3. **If unsure**, default to `docs/project-context.md` (it is the most general-purpose reference file)

### Routing to Specific docs/ Files

When routing to Tier 2, use these rules:

- Architecture, stack details, service dependencies, env config, key decisions with rationale → `docs/project-context.md`
- Recurring processes, step sequences, deployment procedures, conventions → `docs/workflows.md`
- User style, tool choices, communication preferences scoped to this project → `docs/user-preferences.md`

---

## Load Flow (proactive, silent)

Run this automatically at session start and before answering questions where stored context may apply.

### Phase 1 — Always Load (Primary Context)

1. **Detect project root** using the Project Root Detection steps above
2. **Check for `AGENTS.md`** at the project root
3. If present → read it silently
4. If absent → do nothing (no bootstrap on load; bootstrap happens only on first save)

### Phase 2 — Conditional Load (Supporting Context)

After loading `AGENTS.md`, optionally load relevant `docs/*.md` files based on conversation context:

- Conversation mentions **architecture, services, tech stack, environment** → read `docs/project-context.md` if it exists
- Conversation mentions **deploy, test, run, build, workflow** → read `docs/workflows.md` if it exists
- Conversation mentions **style, formatting, tool, communication** → read `docs/user-preferences.md` if it exists

> **Do NOT narrate** the read to the user — load silently in both phases.
> **NEVER** ask the user to re-explain anything already stored.

---

## Save Flow (classify → route → create or append)

1. **Classify** the information using the Memory Classification Rules above
2. **Detect project root** using the Project Root Detection steps above
3. **If Tier 1 (Essential):**
   - Target file: `AGENTS.md` at project root
   - If `AGENTS.md` does not exist → bootstrap from `assets/agents.template.md`
   - If it exists → run the Update/Merge Flow for AGENTS.md
4. **If Tier 2 (Reference):**
   - Route to appropriate file under `{project-root}/docs/` (see Routing table above)
   - Ensure `{project-root}/docs/` directory exists — create it if missing
   - If the target file does not exist → bootstrap from the corresponding template in `assets/`
   - If it exists → run the Update/Merge Flow for docs files
5. **Confirm to user**: `"Saved to {target_file} under ## {Section}."`

---

## Update/Merge Flow (no duplication)

### For AGENTS.md

1. **Read** `AGENTS.md` in full
2. **Search** for an existing entry matching the same topic under the relevant H2 section
3. **If a match is found** → edit the entry in place; append `<!-- updated YYYY-MM-DD -->` with today's date
4. **If no match is found** → append a new bullet under the relevant H2 section:
   `- **Topic**: value <!-- added YYYY-MM-DD -->`
5. **Re-read** the file after writing to verify the change was persisted

### For docs/*.md files

1. **Read** the target `docs/` file in full
2. **Search** for an existing entry matching the same topic under the relevant H2 section
3. **If a match is found** → edit the entry in place; append `<!-- updated YYYY-MM-DD -->` with today's date
4. **If no match is found** → append a new bullet under the relevant H2 section:
   `- **Topic**: value <!-- added YYYY-MM-DD -->`
5. **Re-read** the file after writing to verify the change was persisted

> Both flows use the same deduplication logic but operate on different files. The key difference is the target path and template used for bootstrapping.

---

## File Format Conventions

All memory files follow these conventions:

- **H1** = file title (e.g., `# AGENTS.md`, `# Project Context`)
- **H2** = sections within the file (e.g., `## Tech Stack`, `## Deployment`)
- **Entries** are bullets with bold topic prefix: `- **Topic**: value`
- **Date stamps**: `<!-- added YYYY-MM-DD -->` on new entries, `<!-- updated YYYY-MM-DD -->` on edits
- **Cross-references**: AGENTS.md may include links to `docs/` files using relative paths (e.g., `[see project-context](./docs/project-context.md)`) for deep dives
- **Encoding**: UTF-8
- **Spacing**: Single blank line between sections
- **AGENTS.md** should remain concise — avoid long prose; use structured bullets
- **docs/*.md** files may include longer-form content (prose, code blocks, procedural steps) where appropriate

---

## Recall Guarantee

- **Silently check** `AGENTS.md` (and relevant `docs/*.md`) before responding to any question where stored context may be relevant
- **Use stored info directly** — do not ask the user to repeat themselves
- **If the user corrects stored info** → immediately run the Update/Merge Flow for the appropriate file to overwrite the outdated entry

---

## Critical Constraints / Guardrails

- **NEVER** store memory outside `{project-root}/AGENTS.md` and `{project-root}/docs/`
- **NEVER** ask the user to re-explain something already stored
- **NEVER** create duplicate entries — always run Update/Merge Flow before appending
- **ALWAYS** detect project root before any read or write operation
- **ALWAYS** create missing files from templates before writing (bootstrap on first save only)
- **ALWAYS** confirm saves with a one-line acknowledgment: `"Saved to {file} under ## {Section}."`
- **CHECK** that the file was written by re-reading after every save
- **NOTE**: No file locking — re-read before every write to minimize conflicts
- **DO NOT** auto-bootstrap `docs/*.md` files on session start; only bootstrap when saving for the first time
- **NEVER** mix Tier 1 and Tier 2 content in the same file — respect separation of concerns

---

## Examples

### 1. Saving a critical project decision (Tier 1 → AGENTS.md)

> **User**: "we're using Next.js 15 with Turborepo for this monorepo"

1. Classify → Tier 1 (Essential) — core tech stack fact any agent needs → `AGENTS.md`
2. Detect project root → e.g., `/projects/my-app`
3. If `AGENTS.md` doesn't exist → bootstrap from `assets/agents.template.md`
4. Run Update/Merge Flow: no existing entry for "Tech Stack" → append under `## Tech Stack`:
   `- **Framework**: Next.js 15 <!-- added 2026-05-01 -->`
   `- **Build Tool**: Turborepo monorepo setup <!-- added 2026-05-01 -->`
5. Confirm: `"Saved to AGENTS.md under ## Tech Stack."`

---

### 2. Saving detailed service dependency info (Tier 2 → docs/project-context.md)

> **User**: "the auth service runs on port 3001 and depends on Redis at localhost:6379"

1. Classify → Tier 2 (Reference) — detailed service configuration → `docs/project-context.md`
2. Detect project root → e.g., `/projects/my-app`
3. Ensure `/projects/my-app/docs/` exists — create if missing
4. If `project-context.md` doesn't exist → bootstrap from `assets/docs-project-context.template.md`
5. Run Update/Merge Flow: no existing entry for "Auth Service" → append under `## Service Dependencies`:
   `- **Auth Service**: Runs on port 3001, depends on Redis at localhost:6379 <!-- added 2026-05-01 -->`
6. Confirm: `"Saved to docs/project-context.md under ## Service Dependencies."`

---

### 3. Updating and cross-referencing (AGENTS.md + docs/)

> **User**: "add a note in AGENTS.md that we use pnpm, and save the full install procedure to workflows"

1. **First piece** — "use pnpm":
   - Classify → Tier 1 → `AGENTS.md` under `## Conventions & Style`
   - Append: `- **Package Manager**: pnpm <!-- added 2026-05-01 -->`
   - Confirm: `"Saved to AGENTS.md under ## Conventions & Style."`

2. **Second piece** — "full install procedure":
   - Classify → Tier 2 → `docs/workflows.md` under `## Step Sequences`
   - Append: `- **Install Dependencies**: Run \`pnpm install\` in root, then \`pnpm install\` in each workspace <!-- added 2026-05-01 -->`
   - Confirm: `"Saved to docs/workflows.md under ## Step Sequences."`

---

## Asset Templates

When bootstrapping a new memory file, copy the corresponding template from `assets/`:

| Bootstrapped File | Template file |
|---|---|
| `AGENTS.md` (project root) | `assets/agents.template.md` |
| `docs/project-context.md` | `assets/docs-project-context.template.md` |
| `docs/workflows.md` | `assets/docs-workflows.template.md` |
| `docs/user-preferences.md` | `assets/docs-user-preferences.template.md` |

---

## Migration from Previous Version

If you have existing bucket files (`user-preference.md`, `project-context.md`, `workflow.md`) from the previous version, they are **not** automatically migrated. You may:

- Manually move relevant entries into the new structure (AGENTS.md for essentials, docs/*.md for reference)
- Leave old files in place — the skill will ignore them and create new files as needed
