# Configuration

This guide covers configuration options for AgentKit.

## Environment Variables

### GITHUB_TOKEN

GitHub personal access token for higher rate limits.

**Default:** None (60 requests/hour per IP)

**With token:** 5000 requests/hour

**How to set:**

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
agk add org/repo
```

Or permanently in your shell profile:

```bash
# Add to ~/.bashrc or ~/.zshrc
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

**How to create a token:**

1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `public_repo` (for public repos only)
4. Copy the token
5. Set as environment variable

## Project Files

### agentkit.json

The manifest file defining your project and skills.

**Location:** Project root

**Format:**

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "skills": {
    "owner/repo": "*",
    "owner/monorepo/skills/myskill": "^1.0.0"
  }
}
```

**Fields:**

- `name` — Project name
- `version` — Project version (semantic versioning)
- `skills` — Object mapping skill names to version ranges

### agentkit-lock.json

Lock file for reproducible installs. **Commit this to version control.**

**Location:** Project root

**Format:**

```json
{
  "lockfileVersion": 1,
  "skills": {
    "owner/repo": {
      "version": "1.2.3",
      "resolved": "github:owner/repo#v1.2.3"
    },
    "owner/monorepo/skills/myskill": {
      "version": "1.5.0",
      "resolved": "github:owner/monorepo#main",
      "subdir": "skills/myskill"
    }
  }
}
```

**Fields:**

- `lockfileVersion` — File format version (currently 1)
- `skills` — Object with resolved skill information
  - `version` — Exact installed version
  - `resolved` — GitHub reference (repo + ref)
  - `subdir` — Subdirectory for multi-skill repos (optional)
  - `sha` — Commit SHA (optional)

## Directories

### .agentkit/

**Purpose:** Internal cache for downloaded skills

**Location:** Project root

**Should be committed?** NO — add to `.gitignore`

**Contents:**
- Downloaded skill repositories
- Extracted files

**Cleanup:**
```bash
agk clean
```

### .claude/skills/

**Purpose:** Synced skills for Claude Code to access

**Location:** Project root

**Should be committed?** NO — add to `.gitignore`

**Contents:**
- Copies or symlinks of installed skills
- Organized by skill short name

**Example:**
```
.claude/skills/
├── web-search/
│   ├── SKILL.md
│   └── tools.js
└── code-review/
    └── SKILL.md
```

## .gitignore

Add the following to your `.gitignore`:

```
.agentkit/
.claude/skills/
node_modules/
.env
```

## Best Practices

1. **Commit agentkit.json and agentkit-lock.json** — These should be in version control for reproducibility

2. **Ignore .agentkit/ and .claude/skills/** — These are generated and should not be committed

3. **Use GITHUB_TOKEN in CI/CD** — Set it as a secret in your CI system if you need higher rate limits

4. **Pin versions** — Consider pinning skill versions for stability:
   ```json
   {
     "skills": {
       "owner/repo": "1.2.3"
     }
   }
   ```

5. **Use lock file in CI** — Use `--frozen-lockfile` to ensure exact versions:
   ```bash
   agk install --frozen-lockfile
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Setup Skills

on: [push, pull_request]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install AgentKit
        run: npm install -g @fagom174/agentkit
      
      - name: Install skills
        run: agk install --frozen-lockfile
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting

### Rate Limiting

If you see "API rate limit exceeded":

1. Set `GITHUB_TOKEN` environment variable
2. Create a personal access token at https://github.com/settings/tokens
3. Ensure token has `public_repo` scope

### Permission Issues

If you get "permission denied" errors:

- Check that `.agentkit/` is writable
- Ensure you have read access to GitHub repositories

### Skills Not Syncing

If `.claude/skills/` is empty:

1. Run `agk install` again
2. Check that skill repositories are accessible
3. Verify network connectivity to GitHub
