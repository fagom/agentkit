# Installation

## From npm

The easiest way to install AgentKit is from npm:

```bash
npm install -g @fagom174/agentkit
```

Then verify installation:

```bash
agk --version
```

## With npx

You can also run AgentKit without installing it globally using npx:

```bash
npx @fagom174/agentkit <command>
```

For example:

```bash
npx @fagom174/agentkit init
```

## Requirements

- **Node.js** 18.0.0 or later
- **npm** 6.0.0 or later

## Verify Installation

After installation, verify that AgentKit is working:

```bash
agk --help
```

You should see the help output with all available commands.

## Troubleshooting

### Command not found

If you get `command not found: agk`, try:

```bash
npm install -g @fagom174/agentkit
```

Or use npx:

```bash
npx @fagom174/agentkit init
```

### Permission errors

If you get permission errors during installation, you can:

1. Use `sudo` (not recommended):
```bash
sudo npm install -g @fagom174/agentkit
```

2. Or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @fagom174/agentkit
```

Then add `~/.npm-global/bin` to your PATH permanently in your shell profile.
