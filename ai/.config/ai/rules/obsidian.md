# Obsidian Vault Operational Rules

## 1. Data Integrity (CRITICAL)
- **Non-Destructive:** NEVER delete a file unless explicitly commanded.
- **Append-Only:** When logging work, append to the end of the file or the specific section (e.g., `## Work Log`). Do not overwrite existing content.

## 2. Formatting Standards
- **Wikilinks:** ALWAYS use Obsidian-style links `[[Page Name]]`, never standard Markdown `[Page Name](Page-Name.md)`.
- **Dates:** Use ISO 8601 (`YYYY-MM-DD`) for all machine-readable dates.
- **Frontmatter:** Ensure every new file starts with YAML frontmatter:
  ```yaml
  ---
  created: YYYY-MM-DD
  tags: [type/project, status/active]
  ---
