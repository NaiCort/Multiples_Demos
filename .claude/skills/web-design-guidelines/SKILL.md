---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Read the guidelines from `guidelines.md` in this skill's folder
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Local adaptation for Multiples_Demos: the rules are read from the pinned
snapshot `guidelines.md` next to this file, instead of being fetched from the
internet on every run, so a review always uses rules that were reviewed before
being committed. The snapshot comes from:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

To refresh it, download that file again, review the diff and commit it on its own.

## Usage

When a user provides a file or pattern argument:
1. Read `guidelines.md`
2. Read the specified files
3. Apply all rules from the guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
