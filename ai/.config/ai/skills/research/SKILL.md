---
name: research
description: >-
  Investigate complex questions using local materials and external sources,
  verify material claims, and synthesize cited findings. Use for multi-source
  research, comparisons, literature reviews, or evidence-based investigations;
  don't use for a simple lookup, routine repository exploration, or writing a
  report from already-synthesized findings.
---

## Workflow

Create exactly one session directory for the query at
`~/Documents/research/YYYYMMDD_<slug>/`. The orchestrator owns final artifacts;
subagents return evidence and must not create competing session files.

1. Break the question into focused sub-questions and decide which need local
   exploration or external research.
2. Use `/delegate` for bounded research tasks when useful. Ask local researchers
   for repository paths and external researchers for source URLs; neither should
   produce the final artifacts.
3. Verify source relevance and support material claims with citations. Prefer
   primary sources, official documentation, and reputable publications. Cross-
   check important claims against two independent sources when practical, and
   separate evidence from interpretation.
4. Reconcile findings and conflicts. Link every material claim to a source or
   repository path; report gaps rather than inventing or padding conclusions.
5. Write the final `notes.md` and `sources.md`. Use `/write-notes` for the
   synthesized notes and `/write-report` for `report.html`, passing each an
   explicit path in the session directory. The orchestrator owns and verifies
   all final files.

`notes.md` should state the research question, cited findings, synthesis,
implications, and uncertainties or follow-up questions. `sources.md` should
list each URL or repository path, title/author/publisher when known, access date
for external sources, supported claims, and a brief reliability note.

Report contradictory, paywalled, missing, or unverifiable sources and research
blockers to the user with a clear account of what is known and what remains
unknown.
