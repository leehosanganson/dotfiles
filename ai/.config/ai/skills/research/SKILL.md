---
name: research
description: >-
  Coordinate deep research across local repository materials and external sources. Use when an investigation, comparison, literature review, or fact-finding task needs more than a single search. Delegate focused research via /delegate, verify sources, and synthesize the final session artifacts in the orchestrator.
---

## Overview

Answer complex questions with evidence. The orchestrator coordinates one research session per query, gathers findings from local and external materials, verifies important claims, and produces the final artifacts. Report partial status or research blockers honestly; never invent sources or conclusions.

## Session Setup

The orchestrator determines the date and a short hyphenated slug from the research question, then creates exactly one session directory:

```text
~/Documents/research/YYYYMMDD_<slug>/
```

The session contains:

- `notes.md` — synthesized findings and conclusions
- `sources.md` — consulted sources, citations, and reliability notes
- `report.html` — final styled report

Do not create another session directory for the same query.

## Research Workflow

1. **Plan** — break the question into focused sub-questions and identify which require local exploration versus external research.
2. **Delegate and explore** — use `/delegate` to assign bounded research tasks across local and external materials. Local researchers explore repository files and project documentation. External researchers use web search and page fetching to find primary sources, official documentation, and reputable reporting. Give each assignment the question, scope, and requirement to return findings with source paths or URLs, not final artifacts.
3. **Verify** — the orchestrator checks source relevance and supports key claims with citations. Cross-check important claims against at least two independent sources when possible; prefer primary sources, official documentation, and reputable publications. Distinguish direct evidence from interpretation.
4. **Synthesize** — the orchestrator reconciles delegated findings, resolves or reports conflicts, and writes the complete final `notes.md` and `sources.md`. Subagents must not create competing final notes, reports, or session artifacts.
5. **Render** — use `/write-notes` to generate `notes.md` and `/write-report` to generate `report.html`. Pass each skill the explicit target path inside the orchestrator-created session directory. Do not rely on default output paths. The orchestrator owns and verifies all final artifacts, including `sources.md`.

Attach a source link or repository path to each material claim. If sources are insufficient after a reasonable effort, report the gap rather than padding the answer.

## Final Artifacts

`notes.md` should include:

- Research question
- Key findings with citations
- Synthesis and implications
- Uncertainties, caveats, or conflicting evidence
- Follow-up questions, if any

`sources.md` should include for each consulted source:

- URL or local repository path
- Title, author, or publisher (if known)
- Date accessed for external sources
- The claims it supports and a brief reliability note

`report.html` should communicate the synthesized findings clearly and include citations/links. Keep all three files in the session directory; do not scatter outputs elsewhere.

## Escalation

Report to the user when sources are contradictory, paywalled, missing, or not independently verifiable; when a rate limit, bot block, or dead end prevents research; or when the question requires specialist expertise or credentials. Return a clear partial status describing what is known, unknown, and what would resolve the gap.
