---
name: research-workflow
description: >-
  Perform deep research and save findings in a structured session. Load this skill when the user asks for an investigation, comparison, literature review, or fact-finding task that goes beyond a single search. It uses subagents, web search, and source verification, and writes a notes file and sources file in a single session directory.
---

## Overview

Answer complex questions with evidence. Create one session per research query, gather information systematically, verify claims, and produce a durable artifact. Report partial status or walls-hit honestly; do not invent sources or conclusions.

## Session Setup

Create exactly one directory per query:

```text
~/Documents/research/YYYYMMDD_HHMMSS_<slug>/
```

Use the current date/time and a short hyphenated slug derived from the query. Do not create multiple directories for the same query.

Inside the directory create:

- `notes.md` — synthesized findings
- `sources.md` — list of consulted sources with URLs and reliability notes

## Research Loop

1. **Plan** — break the question into sub-questions or topics.
2. **Search** — use `explore`, relevant subagents, `searxng_*` search, and `webfetch` to gather sources.
3. **Verify** — cross-check key claims across at least two independent sources when possible. Prefer primary sources, official docs, and reputable publications.
4. **Synthesize** — distill findings into bullets, comparisons, or a narrative.
5. **Cite** — attach a source link to every claim: `[source](url)`.

If sources are insufficient after a reasonable effort, stop and report the gap rather than padding the answer.

## Output

Write `notes.md` with:

- Research question
- Key findings (with citations)
- Uncertainties or caveats
- Follow-up questions

Write `sources.md` with:

- URL
- Title/author/publisher (if known)
- Date accessed
- Brief reliability note

Keep files in the session directory. Do not scatter outputs across multiple locations.

## Escalation

Report to the user when:

- Sources are contradictory, paywalled, or missing.
- A claim is widely reported but not independently verifiable.
- You hit a rate limit, bot block, or dead end.
- The query requires specialist expertise or credentials.

Return a clear partial status and describe what is known, unknown, and what would resolve the gap.
