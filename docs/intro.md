---
sidebar_position: 1
title: Introduction
---

# AgentKit

**A CLI package manager for Claude AI agent skills**

AgentKit simplifies managing Claude AI agent skills by letting you install and organize skills from GitHub with a simple manifest file—similar to npm for Node.js.

## What is AgentKit?

AgentKit provides:

- **📦 Easy Installation** - Install skills from GitHub with a single command
- **🔄 Automatic Syncing** - Skills are synced to `.claude/skills/` for Claude Code to use
- **📝 Lock Files** - Reproducible installs with `agentkit-lock.json` for consistency across machines
- **🔗 Multi-skill Repos** - Support both single and multi-skill repositories
- **⚡ Version Management** - Semantic versioning for flexible skill version management

## Why AgentKit?

Managing Claude AI skills manually is tedious and error-prone. AgentKit provides:

| Feature | Benefit |
|---------|---------|
| **Manifest file** | Define all your skills in one place with `agentkit.json` |
| **Lock files** | Ensure exact versions across machines and CI/CD pipelines |
| **Version ranges** | Use semver for flexible, predictable version management |
| **Multi-skill repos** | Install specific skills from monorepos effortlessly |

## Quick Example

```bash
# Install AgentKit globally
npm install -g @fagom174/agentkit

# Initialize your project
agk init

# Add a skill from GitHub
agk add owner/repo

# Install all skills
agk install

# See what's installed
agk list
```

## How It Works

1. **Define** - Specify your skills in `agentkit.json`
2. **Install** - AgentKit downloads them from GitHub and syncs to `.claude/skills/`
3. **Use** - Claude Code automatically finds your skills
4. **Update** - Keep skills in sync with version management

## Next Steps

- **New to AgentKit?** → [Installation](installation.md)
- **Ready to dive in?** → [Quick Start](quick-start.md)
- **Learn all commands** → [Commands Reference](commands.md)
- **Create your own skills** → [Skill Format](skill-format.md)

## Get Help

- 📚 Check the [documentation](.)
- 🐛 Report issues on [GitHub Issues](https://github.com/fagom/agentkit/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/fagom/agentkit/discussions)
- 📦 View on [npm](https://www.npmjs.com/package/@fagom174/agentkit)
