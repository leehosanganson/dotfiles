---
name: obsidian-wins-journal
description: Create jorunal for the wins based on the day
---

# Obsidian Wins Journal

This skill creates multiple .md documents called `wins` in the `brag-documents` based on a given day.

## When to Use this Skill

- When being asked to summarise the wins of the day.

## Instructions

1. Locate the daily journal .md in the `daily-journal` directory.
2. Read the daily journal and capture the wins worth celebrating.
3. Locate the current PI and SPR number and find the corresponding directory in the `brag-documents` directory.
4. Create a new file in the directory using the format `PI<PI-NUMBER>SPR<SPR-NUMBER>-<WIN-NAME>.md` using the templater plugin.
5. Add the win details to the file.

## Example

EXAMPLE 1 `USER: Create the wins for yesterday.`
EXAMPLE 2 `USER: Summarise the wins for today.`
EXAMPLE 3 `USER: Create the wins for last week.`
