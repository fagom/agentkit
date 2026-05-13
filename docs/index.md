# AgentKit

A CLI package manager for Claude AI agent skills.

AgentKit lets you define, install, and manage AI agent skills using a manifest file (`agentkit.json`) similar to npm's `package.json`. Skills are downloaded from GitHub and automatically synced to `.claude/skills/` where Claude Code can use them.

## Quick Links

- **[Installation](./installation.md)** - Get started
- **[Usage Guide](./usage.md)** - Learn the commands
- **[Skill Repository Format](./skill-format.md)** - Create your own skills
- **[Configuration](./configuration.md)** - Environment variables and options

## What is AgentKit?

AgentKit simplifies managing Claude AI agent skills by providing a centralized package manager. Instead of manually managing skill files across projects, AgentKit:

- ✨ Installs skills from GitHub repositories
- 🔄 Keeps skills synced to `.claude/skills/`
- 📦 Manages versions with lock files for reproducibility
- 🔗 Supports both single-skill and multi-skill repositories

## Installation

```bash
npm install -g @fagom174/agentkit
agk --help
```

## Example

```bash
# Initialize a project
agk init

# Add a skill
agk add org/repo --skill myskill

# Install all skills
agk install

# List installed skills
agk list
```

## Why AgentKit?

Managing skills manually is tedious and error-prone. AgentKit provides:

- **Reproducibility** — Lock files ensure exact versions across machines
- **Simplicity** — One command to manage all your skills
- **Flexibility** — Support for both single and multi-skill repositories
- **Version Control** — Semver support for skill versions

## Community

Found an issue? Have a feature request? Visit the [GitHub repository](https://github.com/fagom/agentkit).
