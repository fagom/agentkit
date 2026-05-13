# Skill Repository Format

This guide explains how to structure your skill repositories so they work well with AgentKit.

## Single-Skill Repository

A single-skill repository contains one skill. All files in the repository are part of the skill.

### Structure

```
my-skill/
├── README.md
├── SKILL.md          (required - the skill definition)
├── tools.js          (optional - additional tools)
├── utils.js          (optional - helper functions)
└── package.json      (optional - dependencies)
```

### Files

**SKILL.md** (required)
The main skill definition/prompt that Claude Code will use. This file contains:
- Skill description
- Instructions for the agent
- Any prompt engineering

**Other files** (optional)
Any additional files you want included with your skill:
- Tool definitions
- Helper functions
- Supporting documentation
- Configuration files

### Installation

Users install single-skill repos with:

```bash
agk add owner/repo
```

All files are synced to `.claude/skills/{skillName}/`

### Example: Web Search Skill

```
web-search/
├── README.md
├── SKILL.md
├── search.js
└── tools.json
```

## Multi-Skill Repository

A multi-skill repository contains multiple skills in a `skills/` subdirectory.

### Structure

```
my-monorepo/
├── skills/
│   ├── web-search/
│   │   ├── SKILL.md
│   │   └── tools.js
│   ├── code-review/
│   │   ├── SKILL.md
│   │   └── checklist.md
│   └── documentation/
│       └── SKILL.md
├── README.md
├── LICENSE
└── package.json
```

### Installation

Users install specific skills with the `--skill` flag:

```bash
agk add owner/monorepo --skill web-search
agk add owner/monorepo --skill code-review
```

Each skill is synced to its own directory in `.claude/skills/`

### Best Practices

1. **Consistent structure** — Each skill should have similar organization
2. **Self-contained** — Each skill should work independently
3. **Clear naming** — Use descriptive skill directory names
4. **Documentation** — Include a README explaining each skill

## File Guidelines

### SKILL.md

The main skill definition. Include:

```markdown
# Skill Name

## Description
What this skill does.

## Instructions
How Claude should use this skill.

## Usage
Examples of how to invoke this skill.

## Tools
What tools or functions are available.
```

### README.md

Document your repository:

```markdown
# My Skills

Description of the repository and the skills it contains.

## Skills

- **web-search** — Search the web
- **code-review** — Review code changes

## Installation

```bash
agk add owner/repo --skill web-search
```

## License

MIT
```

### Supporting Files

Include any files your skill needs:

- **tools.js** — JavaScript functions or tool definitions
- **utils.py** — Python utilities
- **config.json** — Configuration files
- **examples.md** — Usage examples
- **LICENSE** — License file

## Version Control

Your skill repository should be a proper Git repository with:

- Semantic versioning tags (v1.0.0, v1.1.0, etc.)
- A proper README
- A LICENSE file
- Regular releases/tags

### Creating Releases

Tag your releases with semantic versions:

```bash
git tag v1.0.0
git push origin v1.0.0
```

AgentKit uses these tags to resolve version ranges.

## Sharing Your Skills

To make your skill discoverable:

1. Push your repo to GitHub
2. Tag releases with semantic versions
3. Include a good README and SKILL.md
4. Share the repository link with others

Users can then install with:

```bash
agk add your-username/your-skill
```

## Example Skills

### Single-skill: Web Search

```
web-search/
├── README.md
├── SKILL.md
│   └── Instructions for web search
├── search.js
│   └── Search implementation
└── LICENSE
```

### Multi-skill: Code Tools

```
code-tools/
├── skills/
│   ├── code-review/
│   │   ├── SKILL.md
│   │   └── review-checklist.json
│   ├── refactor/
│   │   ├── SKILL.md
│   │   └── patterns.json
│   └── test-gen/
│       └── SKILL.md
├── README.md
└── LICENSE
```
