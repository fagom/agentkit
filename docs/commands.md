# Commands Reference

Complete reference for all AgentKit commands.

## agk init

Initialize a new `agentkit.json` manifest.

```bash
agk init [--yes]
```

**Options:**
- `--yes` — Skip prompts and use defaults

**What it does:**
- Creates `agentkit.json` with your project name and version
- Prompts for project details (unless `--yes` is used)

**Example:**
```bash
agk init
agk init --yes
```

---

## agk add

Add and install a skill immediately.

```bash
agk add <scope/repo> [--skill <name>]
```

**Arguments:**
- `<scope/repo>` — GitHub repository in format `owner/repo`

**Options:**
- `--skill <name>` — Install a specific sub-skill from a multi-skill repository

**What it does:**
- Resolves the skill's latest version from GitHub
- Downloads the skill repository
- Updates `agentkit.json` with the skill
- Updates `agentkit-lock.json` with exact version
- Syncs the skill to `.claude/skills/`

**Examples:**
```bash
# Single-skill repository
agk add myorg/myskill

# Multi-skill repository
agk add myorg/monorepo --skill web-search

# Specific version
agk add myorg/myskill@1.2.0

# Version range
agk add myorg/myskill@^1.0.0
```

---

## agk install

Install all skills from `agentkit.json`.

```bash
agk install [--frozen-lockfile]
```

**Options:**
- `--frozen-lockfile` — Fail if lock file would change (useful in CI)

**What it does:**
- Reads `agentkit.json` for skill definitions
- Uses `agentkit-lock.json` for exact versions
- Downloads any missing skills
- Syncs all skills to `.claude/skills/`

**Examples:**
```bash
# Normal install
agk install

# Ensure versions don't change (CI/CD)
agk install --frozen-lockfile
```

---

## agk remove

Remove a skill from the project.

```bash
agk remove <scope/repo>
```

**Arguments:**
- `<scope/repo>` — Skill identifier

**What it does:**
- Removes skill from `agentkit.json`
- Removes entry from `agentkit-lock.json`
- Removes files from `.agentkit/skills/`
- Removes synced files from `.claude/skills/`

**Example:**
```bash
agk remove myorg/myskill
```

---

## agk update

Re-resolve all skills to their latest compatible versions.

```bash
agk update
```

**What it does:**
- Checks each skill for new versions
- Updates `agentkit-lock.json` with new versions
- Re-downloads updated skills
- Syncs to `.claude/skills/`

**Example:**
```bash
agk update
```

---

## agk list

Display all installed skills.

```bash
agk list
```

**What it does:**
- Shows all skills in `agentkit.json`
- Displays requested version range
- Shows installed version

**Output:**
```
Skill                           Requested  Installed
───────────────────────────────────────────────────
myorg/web-search                *          1.2.3
myorg/monorepo/skills/review    ^1.0.0     1.4.2
```

**Example:**
```bash
agk list
```

---

## agk clean

Delete the internal cache and reinitialize.

```bash
agk clean
```

**What it does:**
- Removes `.agentkit/skills/` directory
- Removes `.claude/skills/` directory
- Next `agk install` will re-download everything

**When to use:**
- To reset the installation
- To free up disk space
- To resolve download issues

**Example:**
```bash
agk clean
agk install
```

---

## Global Options

### --help

Show help for any command:

```bash
agk --help
agk add --help
agk install --help
```

### --version

Show the installed version:

```bash
agk --version
```

---

## Version Ranges

AgentKit uses semantic versioning for skills.

| Range | Meaning | Examples |
|-------|---------|----------|
| `1.0.0` | Exact version | `agk add org/repo@1.0.0` |
| `^1.0.0` | Compatible with 1.0.0 (up to <2.0.0) | `agk add org/repo@^1.0.0` |
| `~1.0.0` | Approximately 1.0.0 (up to <1.1.0) | `agk add org/repo@~1.0.0` |
| `*` | Any version (latest) | `agk add org/repo@*` or `agk add org/repo` |

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid argument or usage |

---

## Common Workflows

### Fresh Install

```bash
agk init
agk add org/skill1
agk add org/skill2
agk install
```

### Update All Skills

```bash
agk update
```

### Reset Everything

```bash
agk clean
agk install
```

### Pin to Specific Versions

```bash
agk add org/repo@1.2.3
agk install --frozen-lockfile
```
