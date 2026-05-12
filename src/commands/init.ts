import { Command } from 'commander'
import { existsSync } from 'fs'
import { join } from 'path'
import { basename } from 'path'
import inquirer from 'inquirer'
import { writeManifest } from '../core/manifest.js'
import { logger } from '../utils/logger.js'
import { AgentKitError } from '../utils/errors.js'

export const initCommand = new Command('init')
  .description('Initialize a new agentkit.json')
  .option('--yes', 'skip prompts and use defaults')
  .action(async (options: { yes?: boolean }) => {
    const projectDir = process.cwd()
    const manifestPath = join(projectDir, 'agentkit.json')

    if (existsSync(manifestPath)) {
      logger.warn('agentkit.json already exists in this directory')
      return
    }

    let name: string
    let version: string

    if (options.yes) {
      name = basename(projectDir)
      version = '1.0.0'
    } else {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          default: basename(projectDir),
        },
        {
          type: 'input',
          name: 'version',
          message: 'Version:',
          default: '1.0.0',
        },
      ])
      name = answers.name
      version = answers.version
    }

    try {
      await writeManifest(projectDir, {
        name,
        version,
        skills: {},
      })

      logger.success(`Created agentkit.json`)
      logger.dim(`Next: agk add scope/name`)
    } catch (err) {
      if (err instanceof AgentKitError) {
        throw err
      }
      throw new AgentKitError(`Failed to initialize: ${err instanceof Error ? err.message : String(err)}`)
    }
  })
