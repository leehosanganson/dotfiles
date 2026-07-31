---
name: content-writer
description: >-
  Produce and optionally publish LinkedIn and Medium posts. Load this skill when the user asks for a post, article, or content draft for social platforms. It gathers intent, drafts platform-specific versions, saves them as markdown, and asks for approval before any publish step. It never auto-publishes.
---

## Overview

Turn the user's ideas into polished, platform-appropriate content. Create one session per topic, draft both a short LinkedIn version and a longer Medium version, and save them as files. Publishing happens only after the user explicitly approves the drafts and confirms the relevant accounts/tools are authenticated.

## Input Gathering

Before drafting, confirm:

1. **Topic and angle** — what is the post about? What is the main takeaway?
2. **Tone** — personal/reflective, educational, promotional, opinionated
3. **Audience** — peers, hiring managers, customers, general tech audience
4. **Key points or examples** — stories, data, code snippets, lessons learned
5. **Call to action** — what should the reader do next?
6. **Platforms** — LinkedIn, Medium, or both

If the request is vague, ask clarifying questions. Do not assume a personal story unless the user provides one.

## Drafting

Create a session directory:

```text
~/Documents/content/YYYY-MM-DD_<slug>/
```

Name the slug from the topic (lowercase, hyphenated). Inside the directory, write:

- `linkedin.md` — short (≈ 100–200 words), personal, line breaks for readability, strong hook, one clear CTA
- `medium.md` — longer (≈ 400–800 words), structured with headings, subheadings, examples, and a closing CTA

Both versions should share the same core idea but be adapted to their platform's style. Save them as markdown with frontmatter if useful (title, date, tags).

## Publishing

Only publish after the user explicitly approves the drafts.

1. Show both files and summarize the planned post(s).
2. Ask for approval and confirm which platform(s) to publish to.
3. Check that the relevant tool is authenticated (`github_*`, `linkedin_*`, `medium_*` MCP tools, or a manual flow).
4. Publish using the authenticated tool, or provide manual copy-paste instructions if no tool is available.
5. Record the published URL in the session directory (e.g., `published.md`).

Never schedule or publish content without the user's explicit approval.

## Constraints

- Do not auto-publish.
- Do not create multiple session directories for the same topic or query.
- Respect platform limits and style norms.
- If credentials or tools are missing, stop and ask the user rather than attempting to authenticate on their behalf.
- Keep drafts factual; cite external claims with a source link.
