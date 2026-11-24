---
name: documentation
description: >-
  Keep repository documentation and user-facing references in sync with code
  and configuration changes across projects, including changes to architecture,
  integrations, and user-visible behavior. Use during implementation and review
  of those changes; not for user-requested memory capture or standalone writing
  unrelated to a code or configuration change.
---

# Documentation

## When

Use when implementing or reviewing a code or configuration change that affects
repository documentation, such as system behavior, architecture, integrations,
or user-facing features. Do not use it to capture a user's requested memory; use
`/remember` for that. Do not require documentation edits when a change has no
meaningful documentation impact or for unrelated standalone writing tasks.

## Strict

- Treat documentation updates as part of the same change and PR, not follow-up
  work.
- Update only sources that are affected and authoritative. Do not make a
  diagram, README, or dashboard change just to satisfy a checklist when it would
  be inaccurate or irrelevant.
- Preserve the intended state: reflect removals as well as additions, and do
  not describe planned behavior as already deployed.
- Do not expose secrets, private endpoints, or sensitive operational details.

## Steps

1. Identify what changed: system behavior, configuration, architecture,
   integrations, and user-facing features.
2. Search the repository for the affected behavior, component, and references.
   Inspect relevant READMEs, docs, runbooks, catalogs, architecture diagrams,
   dashboards, and related configuration when present.
3. Decide which references are authoritative and actually impacted. Consider:
   - inventories and descriptions of components or features;
   - operational docs or runbooks affected by changed behavior; use
     /create-runbook to write or revise a procedure for a specific scenario
     with ordered steps and a verifiable outcome, not for general topic docs;
   - architecture diagrams and their source files as well as generated output,
     when applicable;
   - dashboard entries when the change affects a component represented there;
   - links, navigation, and indexes that would otherwise become stale.
4. Update the relevant documentation and references in the same change. Keep
   prose, links, diagram sources, generated diagrams, and dashboard entries
   consistent with the actual implementation and configuration. Follow
   repository-specific generation and validation workflows where they exist.
5. Review the diff for stale references to removed or renamed components,
   contradictory descriptions, broken relative links, and undocumented
   behavior within the change's scope.
6. In the PR description, summarize documentation/reference updates. If no
   documentation edit is warranted, state why and identify the references
   checked.

## Asks You?

Proceed when the affected references are clear. Ask only if the intended
behavior or public surface has materially different interpretations. Otherwise
make careful, scoped updates and note assumptions.

## Output

The PR contains the relevant documentation and reference updates alongside the
implementation, or its description explains why none are needed and what was
checked. Report the changed references and any validation performed.

## Best Size

Use for focused documentation impact analysis accompanying a code or
configuration PR. For a documentation-only project or large information
architecture redesign, route to the appropriate planning or writing workflow.

## Speed

Search for the changed service and behavior first, then inspect likely reference
files. Update only affected sources and run existing lightweight checks for
links, generated diagrams, or configuration when available.

## Edge

- If a diagram is generated, update its source and regenerate the checked-in
  artifact using the repository's established process; do not edit generated
  output alone.
- Update dashboards only when the changed component or behavior is represented
  there; do not add dashboard entries when they are not relevant.
- For removals, check both direct documentation and indexes/navigation for
  dangling references. Retain historical documentation only when its historical
  status is clear.
- If multiple PRs are needed for a change, keep docs with the PR that changes
  the referenced behavior, or explain the dependency explicitly.
- For user-requested durable memory, route to `/remember`; do not treat this
  cross-project documentation workflow as a memory-writing request.
