# AgentKit

**A package manager for Claude AI skills.** Share and manage custom AI capabilities—without copy-paste.

## The Problem

Your team builds custom Claude skills: code reviewers, testing agents, documentation generators, etc. Right now, sharing these across projects is a mess:
- 🔄 Copy-paste the same skill into multiple projects
- 😅 Forget to update it everywhere
- 🤔 New team members don't know which version to use
- 🚨 Breaking changes break multiple projects at once

## The Solution

AgentKit is like **npm for Claude skills**. Define your skills once, share via GitHub, install anywhere.

```bash
# Team builds a code review skill
agk add your-org/code-review

# Everyone installs the same version
agk install

# Update one place, everyone gets the fix
agk update
```

That's it. Lock files ensure reproducibility. Semantic versioning prevents breaking changes.

## Why Use AgentKit

| Problem | AgentKit Solution |
|---------|-------------------|
| Skills scattered across projects | Single source of truth on GitHub |
| Manual version management | Semantic versioning + lock files |
| No way to share skills with teammates | One command: `agk add org/repo` |
| Uncertain what versions are used | Lock file pins exact versions |
| Hard to update skills safely | Update once, control versions carefully |

## Quick Start

### 1. Install AgentKit

```bash
npm install -g @fagom174/agentkit
```

Or use directly:

```bash
npx @fagom174/agentkit <command>
```

### 2. Initialize your project

```bash
agk init -y
```

Creates an `agentkit.json`:
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "skills": {}
}
```

### 3. Add a skill

```bash
agk add your-org/code-review
agk add your-org/testing-agent
```

AgentKit downloads the skills and creates `agentkit-lock.json` with exact versions.

### 4. Share with your team

Commit both files. Team members run:

```bash
agk install
```

Everyone gets the exact same versions in `.claude/skills/`. 🎉

## Real Example

Your team's code review skill lives at `github.com/your-org/code-review`:

```bash
# You: Build and publish the skill
git push your-org/code-review

# Teammate: Install in seconds
agk add your-org/code-review

# New team member: Get everything set up
agk install
```

No documentation needed. Everyone's in sync with Claude Code.

## Commands Reference

```bash
agk init                           # Start a new project
agk add <org/repo>                 # Add a skill
agk add <org/repo> --skill <name>  # Add from multi-skill repo
agk install                        # Install all skills
agk update                         # Update to latest versions
agk remove <org/repo>              # Remove a skill
agk list                           # Show installed skills
agk clean                          # Refresh cache
```

## How It Works

**agentkit.json** — Your manifest (like package.json)
```json
{
  "name": "my-project",
  "skills": {
    "your-org/code-review": "^1.2.0",
    "your-org/testing-agent": "^2.0.0"
  }
}
```

**agentkit-lock.json** — Exact versions (like package-lock.json)
```json
{
  "skills": {
    "your-org/code-review": {
      "version": "1.2.3",
      "resolved": "github:your-org/code-review#v1.2.3"
    }
  }
}
```

Skills are synced to `.claude/skills/` where Claude Code automatically discovers them.

## Publishing Your Own Skill

Create a GitHub repo with your skill:

```
my-code-review-skill/
├── README.md
├── SKILL.md          (skill prompt/definition)
└── tools.js          (optional: tools for the skill)
```

Push to GitHub. Done. Others can install with:

```bash
agk add your-org/my-code-review-skill
```

### Multi-skill repository

If you have multiple skills in one repo:

```
my-skills/
├── skills/
│   ├── code-review/
│   │   ├── SKILL.md
│   │   └── tools.js
│   └── testing-agent/
│       └── SKILL.md
└── README.md
```

Install specific skills:

```bash
agk add your-org/my-skills --skill code-review
agk add your-org/my-skills --skill testing-agent
```

## Version Management

AgentKit uses semantic versioning:

```json
{
  "skills": {
    "org/skill": "^1.0.0",  // Allow 1.x.x, not 2.x.x
    "org/skill": "~1.2.0",  // Allow 1.2.x, not 1.3.x
    "org/skill": "1.0.0",   // Exact version only
    "org/skill": "*"        // Any version
  }
}
```

Update safely:

```bash
agk update              # Updates to latest compatible versions
agk install             # Installs exactly what's in lock file
```

## GitHub Rate Limits

By default, AgentKit uses GitHub's public API (60 requests/hour per IP).

For higher limits, set a personal access token:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
agk add org/repo
```

## Skill Repository Format

### Single-skill repository

A simple repository containing one skill:

```
my-skill/
├── README.md
├── SKILL.md        (skill definition/prompt)
└── tools.js        (optional: tool definitions)
```

### Multi-skill repository

A repository with multiple skills in subdirectories:

```
my-skills/
├── skills/
│   ├── skill-1/
│   │   └── SKILL.md
│   └── skill-2/
│       └── SKILL.md
└── README.md
```

## License

MIT
