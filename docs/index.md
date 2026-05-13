# AgentKit

**A CLI package manager for Claude AI agent skills**

AgentKit lets you install and manage AI agent skills from GitHub with a simple manifest file—similar to npm for Node.js.

## Features

- **📦 Easy Installation** - Install skills from GitHub with a single command
- **🔄 Automatic Syncing** - Skills are synced to `.claude/skills/` for Claude Code
- **📝 Lock Files** - Reproducible installs with `agentkit-lock.json`
- **🔗 Multi-skill Repos** - Support both single and multi-skill repositories
- **⚡ Version Management** - Semantic versioning for skills

## Quick Start

```bash
# Install AgentKit
npm install -g @fagom174/agentkit

# Initialize your project
agk init

# Add a skill
agk add owner/repo

# Install all skills
agk install

# See what's installed
agk list
```

## Why AgentKit?

Managing Claude AI skills manually is error-prone. AgentKit provides:

| Feature | Benefit |
|---------|---------|
| Manifest file | Define all your skills in one place |
| Lock files | Ensure exact versions across machines |
| Version ranges | Use semver for flexible version management |
| Multi-skill repos | Install specific skills from monorepos |

## Next Steps

- **New to AgentKit?** → [Installation Guide](installation.md)
- **Ready to use it?** → [Quick Start](usage.md)
- **Want more details?** → [Commands Reference](commands.md)
- **Creating skills?** → [Skill Format](skill-format.md)

## Example Workflow

=== "Single-skill repo"
    ```bash
    # Install a single skill
    agk add anthropic/web-search
    agk install
    ```

=== "Multi-skill repo"
    ```bash
    # Install from a monorepo
    agk add myorg/tools --skill code-review
    agk install
    ```

=== "Pin versions"
    ```bash
    # Pin to specific versions
    agk add myorg/skill@1.2.3
    agk install --frozen-lockfile
    ```

## Need Help?

- 📚 Check the [documentation](./installation.md)
- 🐛 Report issues on [GitHub](https://github.com/fagom/agentkit/issues)
- 💬 Have questions? Open a [discussion](https://github.com/fagom/agentkit/discussions)
