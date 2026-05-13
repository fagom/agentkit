---
sidebar_position: 6
title: Version Ranges
---

# Version Ranges

AgentKit uses semantic versioning (semver) for skill versions. This page explains how to specify version ranges.

## Semver Basics

Semantic versioning uses three numbers: `MAJOR.MINOR.PATCH`

- **MAJOR** - Breaking changes
- **MINOR** - New features (backwards compatible)
- **PATCH** - Bug fixes

Example: `1.2.3`
- MAJOR version: 1
- MINOR version: 2
- PATCH version: 3

## Version Range Syntax

| Syntax | Meaning | Example |
|--------|---------|---------|
| `1.0.0` | Exact version | Only installs 1.0.0 |
| `^1.0.0` | Compatible | Allows 1.x.x (up to <2.0.0) |
| `~1.2.0` | Approximate | Allows 1.2.x (up to <1.3.0) |
| `*` | Any version | Installs latest |
| `latest` | Latest version | Installs the latest |

## Caret (^)

**Caret** allows changes that do not modify the left-most non-zero digit.

```bash
agk add org/skill@^1.0.0    # Allows 1.0.0 to <2.0.0
agk add org/skill@^0.2.3    # Allows 0.2.3 to <0.3.0
agk add org/skill@^0.0.3    # Only 0.0.3
```

Use when you want **automatic minor and patch updates**.

## Tilde (~)

**Tilde** allows patch-level changes if a minor version is specified.

```bash
agk add org/skill@~1.2.0    # Allows 1.2.x (1.2.0 to <1.3.0)
agk add org/skill@~1.2      # Allows 1.2.x
agk add org/skill@~1        # Allows 1.x (equivalent to ^1)
```

Use when you want **only patch updates**.

## Exact Versions

Pin to exact versions for stability:

```bash
agk add org/skill@1.2.3
```

Use when you need **guaranteed reproducibility**.

## Latest/Any

Install the latest available version:

```bash
agk add org/skill              # Uses * (latest)
agk add org/skill@*            # Explicitly any version
agk add org/skill@latest       # Latest version
```

## Examples

### Conservative Approach
```bash
# Only allow patch updates
agk add org/skill@~1.2.0
```

### Flexible Approach
```bash
# Allow minor updates
agk add org/skill@^1.0.0
```

### Pinned Approach
```bash
# No updates, exact version
agk add org/skill@1.2.3
```

## Lock Files

The `agentkit-lock.json` file stores the **exact versions** installed, regardless of what's in `agentkit.json`.

Example `agentkit.json`:
```json
{
  "skills": {
    "org/skill": "^1.0.0"
  }
}
```

Example `agentkit-lock.json`:
```json
{
  "skills": {
    "org/skill": {
      "version": "1.2.3",
      "resolved": "github:org/skill#v1.2.3"
    }
  }
}
```

This ensures **reproducible installs** across machines!

## Updating

Update all skills to their latest compatible versions:

```bash
agk update
```

This respects the version ranges in `agentkit.json` and updates the lock file.

## CI/CD Best Practices

In CI/CD pipelines, use `--frozen-lockfile` to ensure exact versions:

```bash
agk install --frozen-lockfile
```

This fails if the lock file would change, ensuring consistency.

## Tips

- ✅ **Use caret (^)** for normal development
- ✅ **Use tilde (~)** for stability
- ✅ **Pin exact versions** for critical production systems
- ✅ **Commit lock files** to version control
- ✅ **Use --frozen-lockfile** in CI/CD
