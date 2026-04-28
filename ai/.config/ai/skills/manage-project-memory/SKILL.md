---
name: manage-project-memory
description: Reliably save, load, and update project-scoped memory across sessions using structured Markdown files under {project-root}/docs/.
---

# Manage Project Memory

This skill enables persistent, project-scoped memory across sessions. All memory is stored in structured Markdown files under `{project-root}/docs/` — one file per "bucket" (user preferences, project context, and workflows). It exists so that you never lose important decisions, preferences, or process knowledge between conversations.

---

## When to Use this Skill

Activate this skill whenever:

- The user shares information to remember ("remember this", "note that", "going forward…")
- The user asks to recall something previously discussed
- **At the start of every session** — proactively load all three bucket files if they exist
- Before answering any question where stored context may be relevant
- After completing a task that produced new decisions or workflow steps

---

## Project Root Detection

Used by all flows. Attempt in order:

- **A**: Use the workspace root from the environment if available (e.g., `WORKSPACE_ROOT` or equivalent)
- **B**: Otherwise run `git rev-parse --show-toplevel` to detect the root
- **C**: If both fail, ask the user once; store the answer for the remainder of the session

---

## Bucket Classification Rules

Classify each piece of information into exactly one (or more) of these buckets:

| Bucket file | What belongs here |
|---|---|
| `user-preference.md` | Personal style, formatting preferences, tool choices, communication style |
| `project-context.md` | Repo facts, architecture decisions, service dependencies, env vars, constraints |
| `workflow.md` | Recurring processes, deploy steps, test commands, PR conventions |

> If information fits multiple buckets, split it into separate entries in each relevant file.

---

## Load Flow (proactive, silent)

Run this automatically at session start and before answering questions where stored context may apply.

1. **Detect project root** using the Project Root Detection steps above
2. **Check existence** of each bucket file (`docs/user-preference.md`, `docs/project-context.md`, `docs/workflow.md`); read each file that is present
3. **Do NOT narrate** the read to the user — load silently
4. **Proceed** using the loaded context in all subsequent responses

> **NEVER** ask the user to re-explain anything already stored in a file.

---

## Save Flow (classify → pick bucket → create or append)

1. **Classify** the information using the Bucket Classification Rules above
2. **Detect project root** using the Project Root Detection steps above
3. **Ensure `docs/` directory exists** — create it if missing
4. **If the bucket file does not exist** → bootstrap it from the corresponding template in `assets/` (see Asset Templates below)
5. **If the bucket file exists** → run the Update/Merge Flow
6. **Confirm to user**: `"Saved to docs/{bucket}.md under ## {Section}."`

---

## Update/Merge Flow (no duplication)

1. **Read** the existing bucket file in full
2. **Search** for an existing entry on the same topic
3. **If a match is found** → edit the entry in place; append `<!-- updated YYYY-MM-DD -->` with today's date
   **If no match is found** → append a new bullet under the relevant H2 section:
   `- **Topic**: value <!-- added YYYY-MM-DD -->`
4. **Re-read** the file after writing to verify the change was persisted

---

## File Format Conventions

- **H1** = bucket title (e.g., `# User Preferences`)
- **H2** = sections within the bucket (e.g., `## Tool Choices`)
- **Entries** are bullets: `- **Topic**: value`
- **Date stamps**: `<!-- added YYYY-MM-DD -->` on new entries, `<!-- updated YYYY-MM-DD -->` on edits
- No freeform prose — structured bullets only
- Encoding: UTF-8
- Single blank line between sections

---

## Recall Guarantee

- **Silently check** bucket files before responding to any question where stored context may be relevant
- **Use stored info directly** — do not ask the user to repeat themselves
- **If the user corrects stored info** → immediately run the Update/Merge Flow to overwrite the outdated entry

---

## Critical Constraints / Guardrails

- **NEVER** store files outside `{project-root}/docs/`
- **NEVER** ask the user to re-explain something already stored
- **NEVER** create duplicate entries
- **ALWAYS** detect project root before any read or write operation
- **ALWAYS** create `docs/` and the template file if missing before writing
- **ALWAYS** confirm saves with a one-line acknowledgment
- **CHECK** that the file was written by re-reading after every save
- **NOTE**: No file locking — re-read before every write to minimize conflicts

---

## Examples

### 1. Saving a preference

> **User**: "always use pnpm not npm"

1. Classify → `user-preference.md`, section `## Tool Choices`
2. Detect project root → e.g., `/projects/my-app`
3. Ensure `/projects/my-app/docs/` exists
4. If `user-preference.md` doesn't exist → bootstrap from `assets/user-preference.template.md`
5. Run Update/Merge Flow: no existing entry for "package manager" → append:
   `- **Package Manager**: Use pnpm, not npm <!-- added 2026-04-26 -->`
6. Confirm: `"Saved to docs/user-preference.md under ## Tool Choices."`

---

### 2. Session start (silent load)

> Agent starts a new session in a project.

1. Detect project root → `/projects/my-app`
2. Check for `docs/user-preference.md`, `docs/project-context.md`, `docs/workflow.md`
3. All three exist → read each silently
4. User asks: "How do I run tests?" → Agent answers using the stored workflow steps without asking the user to repeat them

---

### 3. Updating an existing entry

> **User**: "we switched from Postgres to MySQL"

1. Classify → `project-context.md`, section `## Service Dependencies`
2. Detect project root
3. Run Update/Merge Flow:
   - Read `project-context.md`
   - Find existing entry: `- **Database**: PostgreSQL <!-- added 2026-01-10 -->`
   - Edit in place: `- **Database**: MySQL <!-- updated 2026-04-26 -->`
4. Re-read to verify
5. Confirm: `"Saved to docs/project-context.md under ## Service Dependencies."`

---

## Asset Templates

When bootstrapping a new bucket file, copy the corresponding template from `assets/`:

| Bucket | Template file |
|---|---|
| `user-preference.md` | `assets/user-preference.template.md` |
| `project-context.md` | `assets/project-context.template.md` |
| `workflow.md` | `assets/workflow.template.md` |
