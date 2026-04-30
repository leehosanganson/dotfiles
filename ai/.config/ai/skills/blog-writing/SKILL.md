---
name: blog-writing
description: Analyzes existing writing style and transforms drafts into polished Medium blog posts, then updates the Publishing tracker.
---

# Blog Writer

This skill guides an agent to take a user's draft — whether a rough outline or a fleshed-out article — and transform it into a polished Medium-ready blog post. The agent analyses past published Medium posts for voice, tone, and formatting patterns; structures the output for maximum readability (provocative title + subtitle, hook intro, scannable body with `##`/`###` headings, conclusion with CTA); embeds screenshots using Markdown image syntax with captions; preserves Obsidian wikilinks (`Drafted from: [[Draft Filename]]`); generates YAML frontmatter with `publish-target: medium` and an SEO description; presents the draft to the user for review before creating the final note via `obsidian create`; and finally updates the Publishing Tracker index under the **Blogs** section.

## When to Use this Skill
This skill is activated when the user asks to:

- Write or polish a blog post from a draft or outline
- Publish an article to Medium (or prepare one for Medium)
- Transform rough notes into a structured blog article
- Update the Publishing Tracker after finishing a blog post

## Instructions
When this skill is active, strictly follow these steps in order:

1. **[Locate and Read the Draft]**: Use `obsidian read` (via bash or the Obsidian CLI) to locate the user's draft file — either from the user-provided filename, by searching (`obsidian search`) for relevant keywords/tags, or by asking the user to confirm which note is the source draft. Read the full content of the draft.
   - *Command:* `obsidian read path="..."` or `obsidian search query="..."`

2. **[Analyse Past Published Posts]**: Use `obsidian search` and `obsidian read` to find previously published Medium posts in the vault (search for notes tagged `#medium`, `#published`, or with `publish-target: medium` in their frontmatter). Read at least 3–5 past posts and extract patterns in:
   - Voice and tone (e.g., conversational, opinionated, data-driven)
   - Heading structure (`##` vs `###` hierarchy)
   - Intro/hook style (provocative question, bold claim, anecdote)
   - Conclusion style (CTA phrasing, teaser about next project)
   - Use of screenshots and image captions

3. **[Extract Target Filename and Plan Structure]**: From the draft content and user input, determine the target filename for the polished post. Outline the article structure:
   - Provocative title + subtitle line
   - Hook introduction (1–2 paragraphs that grab attention)
   - Body sections with `##`/`###` headings for scannability
   - Conclusion with call-to-action + teaser about a next project

4. **[Expand and Rewrite Content]**: Transform the draft into the outlined structure. Preserve the author's voice as captured in Step 2. Expand outline points into full paragraphs where needed. Ensure:
   - The tone matches past published posts
   - Body is scannable — short paragraphs, clear headings
   - Screenshots are represented using standard Markdown image syntax with captions (e.g., `![Caption here](path/to/screenshot.png)`)
   - **NEVER use em dashes** — always use hyphens (`-`) instead

5. **[Generate YAML Frontmatter]**: Create frontmatter for the polished post containing:
   ```yaml
   ---
   publish-target: medium
   seo: [A concise, compelling one-sentence description optimized for search]
   ---
   ```
   The SEO description should capture the core argument or takeaway in 15–160 characters.

6. **[Add Draft Attribution]**: At the end of the post (or near the top, below frontmatter), include an Obsidian wikilink to show provenance:
   - `Drafted from: [[Draft Filename]]` — replace with the actual source filename in the vault.

7. **[Present the Draft for Review]**: Output the complete polished post (frontmatter + title + subtitle + body + conclusion) to the user and ask for approval. Do **NOT** create the note yet. Wait for explicit user confirmation ("Looks good", "Go ahead", etc.). Offer specific revision suggestions if the user requests changes.

8. **[Create the Final Note]**: Once approved, use `obsidian create` to write the polished post into the vault:
   - *Command:* `obsidian create path="path/to/Polished-Post.md" content="[full markdown with frontmatter]"`
   - Ensure the file is saved in the appropriate notes directory.

9. **[Update Publishing Tracker]**: Locate the Publishing Tracker note (search for notes tagged `#tracker`, `#publishing`, or named "Publishing Tracker"). Update the **Blogs** section by adding an entry for the newly created post:
   - Include the title, publish date, Medium URL (if available), and status.
   - Use `obsidian edit` or `obsidian create` as appropriate to append or modify the tracker entry.

## Critical Constraints (The "Guardrails")
- **NEVER** use em dashes (`—`) anywhere in the post — always replace with a hyphen (`-`)
- **NEVER** create the final note via `obsidian create` without first presenting the draft to the user for explicit review and approval
- **NEVER** assume the Publishing Tracker location — search for it rather than guessing the path
- **ALWAYS** include YAML frontmatter with `publish-target: medium` and a meaningful `seo:` field
- **ALWAYS** add the wikilink `Drafted from: [[Draft Filename]]` to show provenance
- **ALWAYS** match the voice, tone, and formatting patterns of previously published Medium posts
- ⚠️ **CHECK** that screenshots use standard Markdown image syntax with captions (not Obsidian embed syntax `![[ ]]`) when targeting Medium

## Examples

### Example 1: Transforming a Rough Outline into a Polished Post

> **User**: "Polish my draft about why React Server Components are overrated"
>
> 1. Search for the draft: `obsidian search query="React Server Components overrated"` → finds `Draft-2026-04-15.md`
> 2. Read the draft and 3 published Medium posts from the vault
> 3. Extract voice patterns: opinionated, data-backed, uses `##` headings, ends with a teaser about Next.js app router
> 4. Structure the post with provocative title ("React Server Components Are Overrated — And Here's What You Should Do Instead")
> 5. Rewrite the outline into full sections, replacing any em dashes with hyphens
> 6. Add frontmatter: `publish-target: medium` and SEO description "Why React Server Components don't deliver the performance gains most developers expect"
> 7. Add wikilink: `Drafted from: [[Draft-2026-04-15]]`
> 8. Present the full post to the user for review
> 9. On approval, create the note via `obsidian create path="RSC-Are-Overrated.md" content="[full markdown]"`
> 10. Update Publishing Tracker's Blogs section with entry

### Example 2: Expanding a Short Paragraph into a Full Medium Post

> **User**: "I have a few paragraphs about building a personal blog in Obsidian — turn this into a Medium article"
>
> 1. Locate the draft note containing the paragraphs
> 2. Analyse past Medium posts for tone and structure patterns
> 3. Expand the short content into scannable `##` sections: "Why Obsidian for Blogging", "The Setup You Need", "Writing Workflow", "Publishing to Medium"
> 4. Add a hook intro with a bold claim ("You don't need WordPress, Substack, or any CMS — your vault is already the best blog engine")
> 5. Structure body with `###` subsections for tips and steps
> 6. Include a screenshot placeholder: `![My Obsidian publishing workflow](/vault/images/publishing-flow.png)`
> 7. Generate frontmatter with SEO description "A complete guide to writing and publishing blog posts from an Obsidian vault"
> 8. Present the expanded article for user review
> 9. On approval, create the note and update the Publishing Tracker

### Example 3: Handling User Revision Requests During Review

> **User**: "The draft looks good but make the title punchier and add a screenshot about the frontmatter setup"
>
> 1. Revise the title to be more provocative (e.g., "Obsidian Is Your Secret Blogging Weapon")
> 2. Add a screenshot reference: `![Frontmatter example](/vault/images/frontmatter-example.png) — YAML frontmatter at a glance`
> 3. Re-present the updated draft for approval
> 4. On second approval, create the note and update the Publishing Tracker

---

## Available Tools Used by This Skill

| Tool | Purpose |
|------|---------|
| `bash` | Run Obsidian CLI commands (`obsidian search`, `obsidian read`, `obsidian create`, `obsidian edit`) |
| `read` | Read vault notes for draft content and published post analysis |
| `write` / `create` | Create the final polished note in the vault |
| `edit` | Update the Publishing Tracker with new blog entries |
| `grep` / `glob` | Search vault notes for published posts, trackers, and relevant files |
