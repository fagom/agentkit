# AgentKit

A CLI package manager for Claude AI agent skills.

AgentKit lets you define, install, and manage AI agent skills using a manifest file (`agk.json`) similar to npm's `package.json`. Skills are downloaded from GitHub and automatically synced to `.claude/skills/` where Claude Code can use them.

## Installation

```bash
npm install -g agentkit
```

Or run directly:

```bash
npx agentkit <command>
```

## Quick Start

### 1. Initialize a project

```bash
agk init
```

This creates an `agk.json` file with your project name and version.

### 2. Add a skill

```bash
agk add @anthropics/web-search
```

This resolves the skill's latest version, downloads it, and updates `agk.json` and `agk-lock.json`.

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

Initialize a new `agk.json` in the current directory.

- `--yes` — skip prompts and use defaults

### `agk add <@scope/skill> [--symlink]`

Add a skill to the manifest and install it immediately.

- `--symlink` — use symbolic links instead of copying files

### `agk install [--frozen-lockfile] [--symlink]`

Install all skills from `agk.json` based on version ranges.

- `--frozen-lockfile` — fail if the lock file would change (useful in CI)
- `--symlink` — use symbolic links instead of copying

### `agk remove <@scope/skill>`

Remove a skill from the manifest, lock file, and installed directories.

### `agk update [--symlink]`

Re-resolve all skills to their latest compatible versions.

- `--symlink` — use symbolic links instead of copying

### `agk list`

Display all skills in the manifest with their version ranges and installed versions.

### `agk clean`

Delete the internal cache (`.agentkit/skills/`) and reinstall all skills from the lock file.

## Files

### `agk.json`

Manifest file defining your project and its skill dependencies.

```json
{
  "name": "my-agent-project",
  "version": "1.0.0",
  "skills": {
    "@anthropics/web-search": "^1.0.0",
    "@dev/code-review": "^2.1.0"
  }
}
```

### `agk-lock.json`

Lock file storing exact resolved versions for reproducible installs.

```json
{
  "lockfileVersion": 1,
  "skills": {
    "@anthropics/web-search": {
      "version": "1.0.2",
      "resolved": "github:anthropics/web-search#v1.0.2"
    }
  }
}
```

### `.agentkit/`

Internal cache directory where full skill repositories are extracted. Gitignore this directory.

### `.claude/skills/`

Directory where skill prompt files are synced. Claude Code reads from here.

```
.claude/skills/
├── web-search/
│   ├── SKILL.md         (the main skill prompt)
│   └── tools.js         (optional additional files)
└── code-review/
    └── SKILL.md
```

## Skill Repository Format

Each skill on GitHub must have an `agk.skill.json` manifest:

```json
{
  "name": "@anthropics/web-search",
  "version": "1.0.0",
  "entry": "SKILL.md",
  "tools": ["tools.js"],
  "description": "Web search skill for Claude"
}
```

The repository should contain:
- `agk.skill.json` — skill metadata (required)
- `SKILL.md` — the main skill prompt (required, referenced by `entry`)
- Any additional files listed in `tools` (optional)

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
agk add @scope/skill
```

Without a token, GitHub allows 60 requests per hour per IP address.

## License

MIT
