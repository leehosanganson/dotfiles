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

1. **Analyze Existing Content via Obsidian CLI:**
   - Use your `bash` tool to run Obsidian CLI commands to explore the user's notes.
   - Run `obsidian search query="path:./notes/Publishing"` to find existing published blogs.
   - Run `obsidian read path="[found_file_path]"` to analyze the content.
   - Study these past posts for sentence length, vocabulary, formatting habits, and overall tone. Adopt this exact voice for the new draft.

2. **Process the Draft & Extract Filename:**
   - Review the provided draft notes, bullet points, and screenshot references.
   - **Identify the target filename:** The user will include the desired filename for the final blog post inside the draft. Extract this filename.
   - Expand on the core thoughts logically, ensuring smooth transitions between paragraphs and concepts.
   - Fill in minor narrative gaps while staying strictly true to the user's core arguments.

3. **Metadata & YAML Frontmatter:**
   - Always include standard Markdown YAML frontmatter at the very top of the generated post.
   - Hardcode the property `publish-target: medium`.
   - Generate a concise, SEO-optimized description that summarizes the article and include it under the `seo:` property.
   - Example format:
     ```yaml
     ---
     publish-target: medium
     seo: Learn how I replaced GitHub Copilot's usage-based pricing with a powerful local LLM setup using llama.cpp, unsloth, and OpenCode on a single 16GB GPU. Discover the tools, models, and architecture that keep my agentic coding workflow alive without burning $200/month.
     ---
     ```

4. **Strict Punctuation & Style Rules:**
   - **NEVER use em dashes (`—`).** Always use a standard hyphen (`-`) instead, regardless of standard grammatical conventions for pauses, parenthetical statements, or breaks.

5. **Handle Screenshots and Visuals:**
   - Integrate the provided screenshots contextually.
   - Use standard Markdown image syntax: `![Descriptive Alt Text for Accessibility](path/to/screenshot.png)`
   - Add a brief, engaging caption directly below each image if it matches the user's past styling.

6. **Structure for Medium:**
   - **Provocative Title:** Suggest a title that is "hot," opinionated, and seeks attention. It should make the reader think, "Oh, interesting opinion!" Avoid cheap spammy clickbait, but lean into strong takes and compelling hooks. Include a subtitle. Output both as standard Markdown headers below the frontmatter.
   - **Introduction:** Hook the reader immediately and state the value proposition.
   - **Scannable Body:** Break up text with descriptive `##` and `###` headings.
   - **Conclusion:** Wrap up with a clear takeaway, a Call to Action (CTA), and **always include a teaser or promotional mention about what you (the author) are working on, writing, or releasing next.**

7. **Obsidian Linked Mentions:**
   - Either immediately after the frontmatter or at the very bottom of the generated post, always include a line linking back to the original draft file using standard text and an Obsidian wikilink.
   - Format exactly like this: `Drafted from: [[Draft Filename]]`

8. **Output directly to Obsidian:**
   - Always present the final draft to the user for review before executing the creation command.
   - Once the draft is approved, use the `bash` tool to create the new note directly in the vault using the Obsidian CLI and the filename you extracted from the draft.
   - Example: `obsidian create path="./notes/Publishing/[extracted_filename].md" content="[final draft content]"`

9. **Update the Publishing Tracker / Index:**
   - The user maintains a master index note in `./notes/Publishing` that tracks their workflow.
   - Find this index file using your `read` or `grep` tools.
   - Use your `edit` tool to insert a new bullet point containing the wikilink to the newly created blog post directly under the **Blogs** section of that file.
