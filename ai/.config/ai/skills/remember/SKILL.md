---
name: remember
description: >-
  Capture a user's explicitly requested durable memory in the active project
  repository. Use for project decisions, requirements, and context to preserve;
  not for research or study notes, or routine documentation updates caused by
  code and configuration changes.
---

# Remember

## When

Use primarily when the user asks to remember or preserve information for this
project. Use `/documentation` for cross-project repository-doc updates caused
by code or configuration changes, and `/write-notes` for research, experiment,
or study notes.

## Strict

- Choose the destination by scope: broadly reusable information belongs in
  this skill's `assets/` directory; project-specific information belongs in
  the relevant directory in the active project repository.
- Honor an explicit target path. If it conflicts with the requested scope or
  cannot be safely updated, clarify before writing.
- Preserve the user's meaning, scope, and caveats. Do not turn guesses into
  facts or add sensitive information that is not needed.
- Do not overwrite existing content without inspecting it and preserving
  unrelated material.

## Steps

1. Identify what the user wants preserved, whether it is broadly reusable or
   specific to this project, and any limits or conditions. Use the user's
   wording when precision matters.
2. For broadly reusable information, use this skill's `assets/` directory,
   creating it if needed. For project-specific information, inspect repository
   guidance and existing documentation to find the relevant authoritative
   location; use a user-specified directory when given.
3. If no project-specific destination was given, suggest the most relevant
   existing document based on the search. Create a new one only if repository
   conventions support it.
4. If the content or destination has a material ambiguity, ask the user before
   writing. When intent and location are clear, write without asking about
   routine wording or formatting.
5. Make the smallest useful edit. Check that the result is accurate, not
   duplicated, and consistent with nearby documentation.

## Asks You?

Ask before writing only when an unresolved choice could materially change what
is remembered, whether it is broadly reusable or project-specific, or where it
is recorded. Do not ask the user to approve clear content, an obvious existing
location, or ordinary phrasing. If no suitable project location is clear,
suggest one and ask before creating or editing a potentially surprising
destination.

## Output

Record the requested memory in the agreed or evident project location. Report
the path and briefly summarize what was preserved; mention any ambiguity that
remains.

## Best Size

Use for a focused memory or small set of related project facts. For research,
experiments, or study findings, use `/write-notes`, which has a separate notes
destination and workflow.

## Speed

Search likely authoritative documents first. Avoid broad documentation audits
and do not restructure unrelated files.

## Edge

- If the user specifies an exact target, use that path rather than substituting
  a preferred file; clarify only if it conflicts with the requested scope or
  safe handling.
- Keep generic `assets/` entries broadly reusable and independent of project
  assumptions; do not put project-specific facts there.
- If the memory duplicates existing guidance, update that source instead of
  adding a second copy.
- Keep time-sensitive facts, assumptions, and conditions explicit so later
  readers do not mistake them for permanent rules.
