import { Command } from 'commander'
import { readManifest } from '../core/manifest.js'
import { readLockFile } from '../core/lockfile.js'
import { requireProjectRoot } from '../utils/project.js'
import { logger } from '../utils/logger.js'
import { AgentKitError } from '../utils/errors.js'

export const listCommand = new Command('list')
  .description('List installed skills')
  .action(async () => {
    try {
      const projectRoot = await requireProjectRoot()
      const manifest = await readManifest(projectRoot)
      const lock = await readLockFile(projectRoot)

      const skills = Object.entries(manifest.skills)
      if (skills.length === 0) {
        logger.info('No skills installed')
        return
      }

      logger.info(`\nSkills in ${manifest.name}@${manifest.version}:\n`)

      for (const [skillName, range] of skills) {
        const locked = lock?.skills[skillName]
        const version = locked?.version || '(not installed)'
        console.log(`  ${skillName.padEnd(30)} ${range.padEnd(12)} → ${version}`)
      }

      console.log('')
    } catch (err) {
      if (err instanceof AgentKitError) {
        throw err
      }
      throw new AgentKitError(`List failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  })
