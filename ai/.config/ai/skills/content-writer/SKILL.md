---
name: content-writer
description: >-
  Draft LinkedIn posts and Medium articles from the user's ideas, and publish
  only after explicit approval. Use for creating or revising social-platform
  posts and articles; don't use for general essays, reports, or content that
  isn't intended for LinkedIn or Medium.
---

## Workflow

Create one session directory per topic:

```text
~/Documents/content/YYYY-MM-DD_<slug>/
```

Ask for missing essentials before drafting: topic and takeaway, tone, audience,
key points or examples, and call to action. Don't invent a personal story. Draft
both platform versions by default; if the user specifies only one, write only
that version.

Write the requested platform versions as Markdown:

- `linkedin.md`: about 100–200 words, readable line breaks, a strong opening,
  and one clear call to action.
- `medium.md`: about 400–800 words, organized with useful headings and examples,
  and a closing call to action.

Keep the core idea consistent while adapting structure and voice to each
platform. Add title, date, or tags as useful. Keep claims factual and link sources
for externally verifiable claims.

## Publishing

Drafting does not authorize publishing. After drafting:

1. Show the files and summarize what would be published.
2. Obtain the user's explicit approval and confirm the platform(s).
3. Confirm the relevant publishing tool is available and authenticated. If not,
   provide manual copy-and-paste instructions; never attempt to authenticate for
   the user.
4. Publish only the approved content and record each published URL in
   `published.md` in the session directory.

Never publish or schedule without explicit approval. Reuse the existing session
directory for the same topic rather than creating duplicates.
