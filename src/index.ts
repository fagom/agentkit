import { Command } from 'commander'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { initCommand } from './commands/init.js'
import { installCommand } from './commands/install.js'
import { addCommand } from './commands/add.js'
import { removeCommand } from './commands/remove.js'
import { updateCommand } from './commands/update.js'
import { listCommand } from './commands/list.js'
import { cleanCommand } from './commands/clean.js'
import { AgentKitError } from './utils/errors.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let pkg: { version: string }
try {
  pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'))
} catch {
  pkg = { version: '0.1.0' }
}

const program = new Command()
  .name('agk')
  .description('Package manager for Claude AI agent skills')
  .version(pkg.version)

program.addCommand(initCommand)
program.addCommand(installCommand)
program.addCommand(addCommand)
program.addCommand(removeCommand)
program.addCommand(updateCommand)
program.addCommand(listCommand)
program.addCommand(cleanCommand)

program.exitOverride()

try {
  await program.parseAsync(process.argv)
} catch (err: unknown) {
  if (err instanceof AgentKitError) {
    console.error(chalk.red('Error:'), err.message)
    process.exit(1)
  }

  const code = (err as { code?: string }).code
  if (code === 'commander.helpDisplayed' || code === 'commander.version') {
    process.exit(0)
  }

  console.error(chalk.red('Unexpected error:'), err)
  process.exit(1)
}
