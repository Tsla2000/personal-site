---
title: Agent Skills Installation Guide: How to Use SKILL.md with Coding Agents
description: Learn how to download, inspect, install, and verify Agent Skills across Codex, Claude Code, and other tools, including common discovery problems and safety checks.
keywords: Agent Skills installation, SKILL.md, Codex Skills, Claude Code Skills, AI agent workflows
aside: false
---

# Agent Skills Installation Guide: How to Use SKILL.md with Coding Agents

When getting started with Agent Skills, the confusing part is often not writing a skill. It is knowing where to put it, whether the tool can discover it, and why it sometimes fails to activate automatically.

One rule matters most: **SKILL.md is the instruction file, but discovery and loading behavior can differ between tools.** Do not assume one tool's directory convention applies everywhere.

## What is an Agent Skill?

A Skill is usually a folder containing a `SKILL.md` file, optionally accompanied by reference documents, scripts, templates, and other resources. Its YAML frontmatter commonly declares `name` and `description`, helping the agent understand what the skill does and when it applies.

A typical structure looks like this:

```text
my-skill/
├── SKILL.md
├── references/
│   └── checklist.md
├── scripts/
│   └── validate.py
└── assets/
    └── report-template.md
```

Not every skill needs scripts. A skill that provides a stable procedure, decision rules, and a delivery format can start with a well-written `SKILL.md`.

## The simplest workflow: download, inspect, and install

### 1. Download a skill bundle

Choose a task-focused skill from the [Skills Store](/en/skills/). You can copy the `SKILL.md` or download the complete ZIP.

If the skill includes `references/`, `scripts/`, or `assets/`, prefer the ZIP and preserve its directory structure. Copying only the main file may break links to templates or scripts.

### 2. Inspect the contents and permissions

Before running a skill, check that:

- Its `name` and `description` are specific.
- Instructions do not unexpectedly run shell commands, access the network, read sensitive files, or modify production data.
- Bundled scripts have a clear purpose and no unnecessary dependencies or permissions.
- Referenced relative paths actually exist in the ZIP.
- The source, license, and usage restrictions are clear.

A skill is a set of instructions and resources for an agent, not a security sandbox. Markdown files deserve review too.

### 3. Follow the official installation path for your tool

Skills support and directory conventions can change by product and version. Check the official documentation instead of assuming there is one universal command:

- **Codex:** Start with [OpenAI's Skills concepts](https://developers.openai.com/plugins/concepts/skills) and [Build Skills guide](https://developers.openai.com/plugins/build/skills). Codex also provides `$skill-creator` to help create skills.
- **Claude Code:** Consult the [official Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/overview) for the Skills directories and project-level versus personal configuration supported by your version.
- **OpenAI API:** API-based skill use differs from copying files into a local tool. Read the [API Skills guide](https://developers.openai.com/api/docs/guides/tools-skills) for packaging, versioning, and runtime requirements.
- **Other agents:** Check whether the tool supports the Agent Skills standard or requires a product-specific format or conversion.

### 4. Verify with a concrete task

After installation, do not rely only on asking “Did you load the skill?” Give the agent a task with observable outputs, for example:

```text
Use the website launch QA skill to inspect this project.
First state which files you can access and which checks you plan to run.
Report the checklist, actual results, checks not run, and issues found.
Do not claim that any command ran unless it actually did.
```

Check whether the output follows the skill's distinctive steps, delivery format, and constraints. If the result looks no different from an ordinary response, verify that the tool discovered the skill and that the description clearly states when it should trigger.

## Why did the skill not activate?

Four common causes:

1. **The tool did not discover it.** The file is in a directory the tool does not scan, or the current product version does not support that loading method.
2. **The description is vague.** “Helps with work” does not tell the model when the skill is relevant.
3. **The task does not match its trigger conditions.** Describe the concrete goal instead of asking a broad question.
4. **The skill has no verifiable procedure.** General principles without steps, decision branches, or output requirements make its impact difficult to assess.

## How to reduce context and token costs

A skill is not necessarily injected in full into every conversation; exact loading behavior depends on the tool. The skill design can still reduce waste:

- Keep trigger conditions, the core workflow, and acceptance criteria in the main file.
- Move long reference material into `references/` and read it when needed.
- Delegate repetitive deterministic calculations to scripts rather than repeated model reasoning.
- Avoid enabling multiple overlapping skills with conflicting rules.
- Break complex work into stages and pass only the context and artifacts needed for each stage.

Longer does not automatically mean more professional. A paid skill should earn its value by completing complex work reliably, preventing omissions, and producing verifiable results—not by consuming more tokens.

## Start with the Skills Store

Browse the [Skills Store](/en/skills/) and try a free skill on a low-risk task before applying it to a real project.

You can also read:

- [AI coding project delivery workflow](./ai-project-delivery-workflow)
- [Website launch checklist](./website-launch-checklist)
- [AI data analysis workflow](./ai-data-analysis-workflow)

## Official references

- [OpenAI: Skills concepts](https://developers.openai.com/plugins/concepts/skills)
- [OpenAI: Build Skills](https://developers.openai.com/plugins/build/skills)
- [OpenAI API: Skills guide](https://developers.openai.com/api/docs/guides/tools-skills)
- [Anthropic: Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
