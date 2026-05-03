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
2. **Is this runbook-level procedural guidance, incident response, or step-by-step operational playbook?** → Tier 2 → check `{project-root}/docs/runbooks/` directory (see Routing table below)
3. **Is this about the codebase/project structure, architecture, tech stack details, or project conventions?** → Tier 2 → check `{project-root}/docs/context/` directory (see Semantic Discovery section above)
4. **If unsure**, default to `docs/runbooks/` for procedural guidance or `docs/context/` for structural/architectural context

### Routing to Specific docs/ Files

When routing to Tier 2, use these rules:

- **Project-scoped context, architecture notes, codebase overview, tech stack specifics** → `docs/context/<type>-<topic>.md` files (discover via semantic matching; fallback to `docs/context/README.md`)
- **Runbooks, step-by-step operational procedures, incident response playbooks** → `docs/runbooks/<type>-<verb/noun>-<verb/noun>.md` files (discover via `docs/runbooks/README.md`)

> **Note:** Runbooks and context use directory-based routing with README entry points. See the Save Flow and SOP Discovery sections below for details.

---

## Load Flow (proactive, silent)

Run this automatically at session start and before answering questions where stored context may apply.

### Phase 1 — Always Load (Primary Context)

1. **Detect project root** using the Project Root Detection steps above
2. **Check for `AGENTS.md`** at the project root
3. If present → read it silently
4. If absent → do nothing (no bootstrap on load; bootstrap happens only on first save)
5. **Discover runbooks** (silent, no narration):
    - Check for `runbook.md` at project root → if found, read silently
    - If not found, check for `docs/runbooks/README.md` → if found, read silently (entry point listing all runbooks)
    - If neither exists, glob for `*.runbook.md` files → read any found silently

### Phase 1 — Always Load (Context Discovery)

- **Discover context** (semantic search):
    - Check canonical path `docs/context/README.md` → if found, read silently
    - If not found, run the Semantic Discovery logic above to find context-like directories/files
    - Read any discovered files silently

When canonical paths are not found, apply semantic matching to discover the relevant directory or files. Apply this logic independently to context and runbooks.

#### Context Discovery

1. **Check canonical path first** — look for `docs/context/README.md`
2. **If not found, search for context-like directories/files**:
    - Glob for any directory named `context`, `contexts`, or `context-docs` under `docs/`
    - If a matching directory exists → use it as the context directory (read its `README.md`)
    - If no matching directory but individual context files exist (glob for `*context*.md` or `*architecture*.md` at `docs/` root) → read them and treat them as an ad-hoc context collection
3. **If still not found, search by content keywords**:
    - Glob for files in `docs/` that contain headings about "Architecture", "Codebase Overview", "Project Context", or "Tech Stack Deep Dive"
    - Read those files silently and treat them as discovered context

#### Runbook Discovery

1. **Check canonical path** — look for `docs/runbooks/README.md`
2. **If not found, glob for directory variants** under `docs/`: `runbooks`, `playbooks`, or `ops`
3. **If no matching directory but individual runbook files exist** (glob for `*runbook*.md` or `*playbook*.md`) → read them and treat as an ad-hoc runbook collection

### Phase 2 — Conditional Load (Supporting Context)

After loading `AGENTS.md`, optionally load relevant `docs/*.md` files based on conversation context:

- Conversation mentions **context, architecture, codebase structure, tech stack details** → trigger semantic discovery for `docs/context/` directory and read relevant files (see Semantic Directory & File Discovery above)
- Conversation mentions **incident, outage, incident response, operational procedure** → read `docs/runbooks/README.md` (or specific scenario file) if it exists

> **Do NOT narrate** the read to the user — load silently in both phases.
> **NEVER** ask the user to re-explain anything already stored.

### SOP Discovery & Follow

When discovering runbooks or context files for saving:

1. **Check README files first** — check `docs/runbooks/README.md` for runbooks
2. **Check expected canonical path first** (e.g., `docs/runbooks/` directory for operational runbooks)
3. **If a scenario file exists at that path with relevant content** → follow it instead of appending duplicate entries; update existing entry in place per the Update/Merge Flow
4. **If no scenario file exists or the relevant section is empty** → proceed with normal save flow (bootstrap + create new scenario file)
5. **If an existing SOP uses a different naming convention** (e.g., `RUNBOOK.md`, `deploy.md`) → still follow it; do not create duplicates at the canonical path

---

## Save Flow (classify → route → create or append)

1. **Classify** the information using the Memory Classification Rules above
2. **Detect project root** using the Project Root Detection steps above
3. **If Tier 1 (Essential):**
    - Target file: `AGENTS.md` at project root
    - If `AGENTS.md` does not exist → bootstrap from `assets/agents.template.md`
    - If it exists → run the Update/Merge Flow for AGENTS.md
4. **If Tier 2 — Runbooks:**
    - Route to appropriate file under `{project-root}/docs/runbooks/` (see Routing table above)
    - Ensure `{project-root}/docs/runbooks/` directory exists — create it if missing
    - If `README.md` doesn't exist → bootstrap from `assets/docs-runbooks-readme.template.md`, creating a table of contents
    - Route to appropriate `<type>-<verb/noun>-<verb/noun>.md` file (or create new one if the scenario isn't covered)
    - Update `README.md` to include link to the new/updated scenario file
5. **If Tier 2 — Context:**
    - Discover context directory using Semantic Discovery logic above
    - If canonical path exists (`docs/context/`) → ensure it exists, create if missing
    - Route to appropriate `<type>-<topic>.md` file (or create new one following naming convention)
    - Bootstrap from `assets/docs-context-scenario.template.md` if the scenario file doesn't exist
    - If `README.md` doesn't exist → bootstrap from `assets/docs-context-readme.template.md`, creating a table of contents
    - Update `README.md` to include link to the new/updated context file
    - If no canonical directory but ad-hoc context files found → append to the most relevant existing file; otherwise bootstrap a new `docs/context/README.md` and create the first scenario file
6. **Confirm to user**: `"Saved to {target_file} under ## {Section}."`

---

## Update/Merge Flow (no duplication)

### For AGENTS.md

1. **Read** `AGENTS.md` in full
2. **Search** for an existing entry matching the same topic under the relevant H2 section
3. **If a match is found** → edit the entry in place; append `<!-- updated YYYY-MM-DD -->` with today's date
4. **If no match is found** → append a new bullet under the relevant H2 section:
    `- **Topic**: value <!-- added YYYY-MM-DD -->`
5. **Re-read** the file after writing to verify the change was persisted

### For docs/context/*.md (context files)

1. **Read** the target context file in full
2. **Search** for an existing entry matching the same topic under the relevant H2 section
3. **If a match is found** → edit the entry in place; append `<!-- updated YYYY-MM-DD -->` with today's date
4. **If no match is found** → append a new bullet under the relevant H2 section:
    `- **Topic**: value <!-- added YYYY-MM-DD -->`
5. **Re-read** the file after writing to verify the change was persisted
6. **Update README.md** — if adding a new context file, add an entry to `docs/context/README.md` (or equivalent discovered context directory)

### For docs/runbooks/*.md (scenario files)

1. **Read** the target scenario file in full
2. **Search** for an existing entry matching the same topic under the relevant H2 section
3. **If a match is found** → edit the entry in place; append `<!-- updated YYYY-MM-DD -->` with today's date
4. **If no match is found** → append a new bullet under the relevant H2 section:
    `- **Topic**: value <!-- added YYYY-MM-DD -->`
5. **Re-read** the file after writing to verify the change was persisted
6. **Update README.md** — if adding a new scenario file, add an entry to `docs/runbooks/README.md`

---

## File Format Conventions

All memory files follow these conventions:

- **H1** = file title (e.g., `# AGENTS.md`, `# Project Context`)
- **H2** = sections within the file (e.g., `## Tech Stack`, `## Deployment`)
- **Entries** are bullets with bold topic prefix: `- **Topic**: value`
- **Date stamps**: `<!-- added YYYY-MM-DD -->` on new entries, `<!-- updated YYYY-MM-DD -->` on edits
- **Cross-references**: AGENTS.md may include links to `docs/` files using relative paths (e.g., `[see monorepo structure](./docs/context/monorepo-structure.md)`) for deep dives
- **Encoding**: UTF-8
- **Spacing**: Single blank line between sections
- **AGENTS.md** should remain concise — avoid long prose; use structured bullets
- **docs/*.md** files may include longer-form content (prose, code blocks, procedural steps) where appropriate
- **docs/context/README.md** and **docs/runbooks/README.md** act as directory entry points with tables of contents linking to their respective files

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
- **ALWAYS** apply semantic discovery for context and runbooks when the canonical path is not found — never assume no context exists just because the expected directory name doesn't match

---

## Examples

### 0. Runbook Discovery Flow (Phase 1 — Session Start)

> **Context**: Session starts in a project that has `docs/runbooks/README.md` with an existing incident response playbook listed.

1. Detect project root → e.g., `/projects/my-app`
2. Check for `AGENTS.md` → found, read silently
3. Discover runbooks:
    - Check for `runbook.md` at project root → not found
    - Check for `docs/runbooks/README.md` → **found**, read silently (entry point)
    - (No need to glob — README file provides the directory listing)
4. No narration to user; memory loaded and ready

---

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

### 2. Saving project architecture context (Tier 2 → docs/context/)

> **User**: "document our monorepo structure: apps/, packages/ui/, packages/shared/"

1. Classify → Tier 2 — codebase/project structure, project conventions → `docs/context/` directory
2. Detect project root → e.g., `/projects/my-app`
3. Discover context directory using Semantic Discovery logic:
    - Check canonical path `docs/context/README.md` → **not found**
    - Context directory doesn't exist yet → create it
4. Bootstrap `README.md` from `assets/docs-context-readme.template.md`
5. Route to `monorepo-structure.md` (following `<type>-<topic>.md` convention)
6. Bootstrap from `assets/docs-context-scenario.template.md` if file doesn't exist
7. Append structure details under relevant H2 section:
    `- **Workspace Layout**: apps/ contains all application workspaces, packages/ui/ is the shared component library, packages/shared/ holds utility modules <!-- added 2026-05-01 -->`
8. Update `docs/context/README.md` to include link to new context file under "Architecture & Structure"
9. Confirm: `"Saved to docs/context/monorepo-structure.md under ## Key Components / Files."`

---

### 3. Updating and cross-referencing (AGENTS.md + docs/)

> **User**: "add a note in AGENTS.md that we use pnpm, and save the full install procedure to runbooks"

1. **First piece** — "use pnpm":
    - Classify → Tier 1 → `AGENTS.md` under `## Conventions & Style`
    - Append: `- **Package Manager**: pnpm <!-- added 2026-05-01 -->`
    - Confirm: `"Saved to AGENTS.md under ## Conventions & Style."`

2. **Second piece** — "full install procedure":
    - Classify → Tier 2 → `docs/runbooks/` directory (install procedure)
    - Ensure `/projects/my-app/docs/runbooks/` exists — create if missing
    - If `README.md` doesn't exist → bootstrap from `assets/docs-runbooks-readme.template.md`
    - Route to `install-dependencies.md` (or create new scenario file following naming convention)
    - Bootstrap from `assets/docs-runbooks-scenario.template.md` if file doesn't exist
    - Append procedure under appropriate H2 section:
        `- **Install Dependencies**: Run \`pnpm install\` in root, then \`pnpm install\` in each workspace <!-- added 2026-05-01 -->`
    - Update `docs/runbooks/README.md` to include link to new scenario file
    - Confirm: `"Saved to docs/runbooks/install-dependencies.md under ## Steps."`

---

### 4. SOP-follow behavior (existing runbook found, no duplicate created)

> **User**: "document the production database migration procedure"

1. Classify → Tier 2 — runbook-level procedural guidance → `docs/runbooks/` directory
2. Detect project root → e.g., `/projects/my-app`
3. Check README file → `docs/runbooks/README.md` exists with relevant content
4. **SOP-follow**: An existing scenario file covers database operations; check individual files rather than appending to README
5. Check expected canonical path → `docs/runbooks/incident-response-database.md` exists with relevant content
6. Run Update/Merge Flow: no existing entry for "Database Migration" → append under appropriate section:
    `- **Database Migration Procedure**: Run \`rake db:migrate\` on primary, verify with checksums <!-- added 2026-05-01 -->`
7. Confirm: `"Saved to docs/runbooks/incident-response-database.md under ## Step-by-Step Procedure."`

---

## Asset Templates

When bootstrapping a new memory file, copy the corresponding template from `assets/`:

| Bootstrapped File | Template file |
|---|---|
| `AGENTS.md` (project root) | `assets/agents.template.md` |
| `docs/runbooks/README.md` | `assets/docs-runbooks-readme.template.md` |
| `docs/runbooks/<scenario>.md` | `assets/docs-runbooks-scenario.template.md` |
| `docs/context/README.md` | `assets/docs-context-readme.template.md` |
| `docs/context/<scenario>.md` | `assets/docs-context-scenario.template.md` |

---

## Migration from Previous Version

If you have existing bucket files (`user-preference.md`, `project-context.md`) from the previous version, they are **not** automatically migrated. You may:

- Manually move relevant entries into the new structure (AGENTS.md for essentials, docs/*.md for reference)
- Leave old files in place — the skill will ignore them and create new files as needed
- Move any existing `docs/runbooks.md` content into the `docs/runbooks/` directory following the naming conventions described above

### README Naming Convention

Directory entry points are now named `README.md` instead of `index.md`. If you have existing `docs/runbooks/index.md` or `docs/context/index.md`, rename them to `docs/runbooks/README.md` and `docs/context/README.md` respectively. The content remains identical — only the filename changes.

### Context Migration Guidance

If you have existing single-file context documents that could be restructured:

- If existing single-file `docs/project-context.md` exists → its content should be considered as ad-hoc context; consider moving relevant entries into `docs/context/` directory with proper `<type>-<topic>.md` naming convention
- Existing files named like `architecture.md`, `tech-stack.md`, or `codebase-overview.md` in `docs/` can be treated as discovered context files (via semantic discovery) without migration — they will be read silently during session start
