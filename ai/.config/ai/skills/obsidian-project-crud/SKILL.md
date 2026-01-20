---
name: obsidian-project-crud
description: Create, Read, Update and Delete a project link in Obsidian
---

# Obsidian Project CRUD

This skill uses the links (e.g. [[<project>]]) in the `projects` directory to manipulate the project links in Obsidian.

## When to Use this Skill

- list all types of work in Obsidian.
- create a new project link.
- update a project link.

## Instructions

1. Go to the `projects.md` file in the `projects` Obisidan vault.
2. Read the `projects.md` file and capture the project links.
3. Find the project link in the `projects.md` file.
4. If the intent is to create a project link,
    - if project link is not found, create a new project link.
    - if not, search the project link in the vault and read the brief description of the project.
5. If the intent is to update a project link,
    - if project link is not found, ask the user to create a new project link.
    - if not, update the filename of the project link.
6. If the intent is to delete a project link,
    - try to merge the existing project link with other project links.
7. If the intent is to list all project links,
    - list all project links in the `projects.md` file.

## Example

EXAMPLE 1 `AGENT: I need to find the project link for the project "Project 1".`
EXAMPLE 2 `AGENT: I need to create a new project link for the project "Project 2".`
EXAMPLE 3 `AGENT: I need to update the project link for the project "Project 3".`
EXAMPLE 4 `AGENT: I need to delete the project link for the project "Project 4".`
EXAMPLE 5 `AGENT: I need to list all project links.`
