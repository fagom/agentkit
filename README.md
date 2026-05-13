# AgentKit

A CLI package manager for Claude AI agent skills.

AgentKit lets you define, install, and manage AI agent skills using a manifest file (`agentkit.json`) similar to npm's `package.json`. Skills are downloaded from GitHub and automatically synced to `.claude/skills/` where Claude Code can use them.

## Installation

```bash
npm install -g @fagom174/agentkit
```

Or run directly:

```bash
npx @fagom174/agentkit <command>
```

## Quick Start

### 1. Initialize a project

```bash
agk init
```

This creates an `agentkit.json` file with your project name and version.

### 2. Add a skill

```bash
agk add org/repo
```

This resolves the skill's latest version, downloads it from GitHub, and updates `agentkit.json` and `agentkit-lock.json`.

For multi-skill repositories, specify which skill to install:

```bash
agk add org/repo --skill foo
```

This installs the skill from `org/repo/skills/foo`.

### 3. Install all skills

```bash
agk install
```

Installs all skills from the manifest and ensures `.claude/skills/` is in sync.

### 4. List skills

```bash
agk list
```

Shows installed skills, their requested versions, and actual installed versions.

## Commands

### `agk init [--yes]`

Initialize a new `agentkit.json` in the current directory.

- `--yes` — skip prompts and use defaults

### `agk add <scope/repo> [--skill <name>]`

Add a skill to the manifest and install it immediately.

- `--skill <name>` — install a specific sub-skill from a multi-skill repository (automatically looks in the `skills/` subdirectory)

### `agk install [--frozen-lockfile]`

Install all skills from `agentkit.json` based on version ranges.

- `--frozen-lockfile` — fail if the lock file would change (useful in CI)

### `agk remove <scope/repo>`

Remove a skill from the manifest, lock file, and installed directories.

### `agk update`

Re-resolve all skills to their latest compatible versions.

### `agk list`

Display all skills in the manifest with their version ranges and installed versions.

### `agk clean`

Delete the internal cache (`.agentkit/skills/`) and reinstall all skills from the lock file.

## Files

### `agentkit.json`

Manifest file defining your project and its skill dependencies.

```json
{
  "name": "my-agent-project",
  "version": "1.0.0",
  "skills": {
    "anthropics/web-search": "*",
    "org/monorepo/skills/code-review": "^1.0.0"
  }
}
```

### `agentkit-lock.json`

Lock file storing exact resolved versions for reproducible installs.

```json
{
  "lockfileVersion": 1,
  "skills": {
    "anthropics/web-search": {
      "version": "1.0.2",
      "resolved": "github:anthropics/web-search#v1.0.2"
    },
    "org/monorepo/skills/code-review": {
      "version": "1.2.0",
      "resolved": "github:org/monorepo#main",
      "subdir": "skills/code-review"
    }
  }
}
```

### `.agentkit/`

Internal cache directory where skill repositories are downloaded and extracted. Automatically created and managed by AgentKit. Add to `.gitignore`.

### `.claude/skills/`

Directory where skills are synced for Claude Code to access. Claude Code reads skill prompts and tools from here.

```
.claude/skills/
├── web-search/
│   └── (skill files)
└── code-review/
    └── (skill files)
```

## Skill Repository Format

Skills are hosted on GitHub and can be in two formats:

### Single-skill repository

A simple repository containing a single skill. AgentKit will sync all files to `.claude/skills/{skillName}`.

```
repository/
├── README.md
├── SKILL.md        (skill definition/prompt)
└── tools.js        (optional: additional tools)
```

### Multi-skill repository

A repository containing multiple skills in subdirectories. Install specific skills using the `--skill` flag.

```
repository/
├── skills/
│   ├── web-search/
│   │   └── SKILL.md
│   └── code-review/
│       └── SKILL.md
└── README.md
```

To install a skill from this repo:

```bash
agk add org/repo --skill web-search
```

## Version Ranges

AgentKit supports semver version ranges:

- `1.0.0` — exact version
- `^1.0.0` — compatible with version 1.0.0 (up to <2.0.0)
- `~1.0.0` — approximately version 1.0.0 (up to <1.1.0)
- `*` — any version (used by `agk add` when not specified)

## Environment Variables

- `GITHUB_TOKEN` — GitHub personal access token for higher rate limits (optional)

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
agk add org/repo
```

Without a token, GitHub allows 60 requests per hour per IP address.

## License

MIT
