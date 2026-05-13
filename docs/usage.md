# Usage Guide

## Basic Workflow

### 1. Initialize a Project

Start by initializing a new AgentKit project:

```bash
agk init
```

This creates an `agentkit.json` file with your project details. You'll be prompted to enter:
- Project name
- Project version

Use `--yes` to skip prompts and use defaults:

```bash
agk init --yes
```

### 2. Add a Skill

Add a skill from a GitHub repository:

```bash
agk add org/repo
```

This will:
1. Resolve the latest version from GitHub
2. Download the skill
3. Update `agentkit.json`
4. Update `agentkit-lock.json`

### Multi-skill Repositories

If a repository contains multiple skills, use the `--skill` flag:

```bash
agk add org/repo --skill myskill
```

This automatically looks in the `skills/` subdirectory.

### 3. Install All Skills

Install all skills defined in your manifest:

```bash
agk install
```

This uses `agentkit-lock.json` to install exact versions.

### 4. List Skills

See what skills are installed:

```bash
agk list
```

Output shows:
- Skill name
- Requested version range
- Installed version

## Commands Reference

### `agk init [--yes]`

Initialize a new `agentkit.json` manifest.

**Options:**
- `--yes` — Skip prompts and use defaults

**Example:**
```bash
agk init --yes
```

### `agk add <scope/repo> [--skill <name>]`

Add and install a skill immediately.

**Arguments:**
- `<scope/repo>` — GitHub repository in format `owner/repo`

**Options:**
- `--skill <name>` — Install a specific sub-skill from a multi-skill repository

**Examples:**
```bash
# Install from a single-skill repo
agk add myorg/myskill

# Install from a multi-skill repo
agk add myorg/monorepo --skill web-search

# Install a specific version
agk add myorg/myskill@1.2.0
```

### `agk install [--frozen-lockfile]`

Install all skills from `agentkit.json`.

**Options:**
- `--frozen-lockfile` — Fail if versions would change (useful in CI)

**Example:**
```bash
agk install --frozen-lockfile
```

### `agk remove <scope/repo>`

Remove a skill from manifest, lock file, and installation.

**Example:**
```bash
agk remove myorg/myskill
```

### `agk update`

Re-resolve all skills to their latest compatible versions.

**Example:**
```bash
agk update
```

### `agk list`

Display all installed skills with their versions.

**Example:**
```bash
agk list
```

### `agk clean`

Delete the internal cache and reinstall all skills.

**Example:**
```bash
agk clean
agk install
```

## Version Ranges

AgentKit supports semantic versioning ranges:

| Range | Meaning |
|-------|---------|
| `1.0.0` | Exact version |
| `^1.0.0` | Compatible with 1.0.0 (up to <2.0.0) |
| `~1.0.0` | Approximately 1.0.0 (up to <1.1.0) |
| `*` | Any version (default) |

**Examples:**
```bash
agk add org/repo@1.0.0      # Exact version
agk add org/repo@^1.0.0     # Any 1.x version
agk add org/repo@~1.2.0     # Any 1.2.x version
agk add org/repo@*          # Latest version
```

## Example Workflow

```bash
# Create a new project
agk init

# Add skills
agk add anthropic/web-search
agk add myorg/tools --skill code-review

# See what's installed
agk list

# Commit to git
git add agentkit.json agentkit-lock.json
git commit -m "Add skills"

# Later, update to latest versions
agk update

# Or clean and reinstall
agk clean
agk install
```

## Files Created

After running these commands, you'll have:

- `agentkit.json` — Your skill manifest
- `agentkit-lock.json` — Locked versions for reproducibility
- `.agentkit/` — Internal cache (add to `.gitignore`)
- `.claude/skills/` — Skills synced for Claude Code
