---
sidebar_position: 3
title: Quick Start
---

# Quick Start

Get up and running with AgentKit in 5 minutes.

## Step 1: Install AgentKit

```bash
npm install -g @fagom174/agentkit
```

Verify installation:

```bash
agk --version
```

## Step 2: Initialize Your Project

Create a new project directory and initialize it:

```bash
mkdir my-agent-project
cd my-agent-project
agk init
```

This creates an `agentkit.json` file with your project details.

## Step 3: Add Your First Skill

Add a skill from a GitHub repository:

```bash
agk add owner/repo
```

This:
- Resolves the latest version
- Downloads the skill from GitHub
- Updates `agentkit.json`
- Syncs the skill to `.claude/skills/`

### Multi-skill Repositories

If a repository contains multiple skills, use the `--skill` flag:

```bash
agk add owner/monorepo --skill myskill
```

This automatically looks in the `skills/` subdirectory.

## Step 4: Install All Skills

Install all skills defined in your manifest:

```bash
agk install
```

Your skills are now ready in `.claude/skills/` for Claude Code to use!

## Step 5: Check What's Installed

See all your installed skills:

```bash
agk list
```

Output shows skill names, requested versions, and installed versions.

## Commit to Version Control

Commit your manifest files to git:

```bash
git init
git add agentkit.json agentkit-lock.json
git commit -m "Initial skill setup"
```

Add these to `.gitignore`:

```
.agentkit/
.claude/skills/
node_modules/
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `agk add <repo>` | Add a skill |
| `agk install` | Install all skills |
| `agk list` | Show installed skills |
| `agk remove <repo>` | Remove a skill |
| `agk update` | Update to latest versions |
| `agk clean` | Clear cache and reinstall |

## Example Workflow

```bash
# Create project
mkdir my-skills
cd my-skills

# Initialize
agk init --yes

# Add skills
agk add anthropic/web-search
agk add myorg/tools --skill code-review

# Install
agk install

# Commit
git init
git add agentkit.json agentkit-lock.json
git commit -m "Add skills"
```

## What's Next?

- 📖 Read the [Commands Reference](commands.md)
- ⚙️ Learn about [Configuration](configuration.md)
- 🎨 [Create your own skills](skill-format.md)
- 🔗 Check [Version Ranges](version-ranges.md)

## Need Help?

- Check the [full documentation](.)
- Report issues on [GitHub](https://github.com/fagom/agentkit/issues)
- Ask questions in [Discussions](https://github.com/fagom/agentkit/discussions)
