import { Command } from 'commander'
import { rm } from 'fs/promises'
import { readLockFile } from '../core/lockfile.js'
import { installAllSkills } from '../core/installer.js'
import { syncSkillsToClaudeDir, cleanSyncedDir } from '../core/syncer.js'
import { requireProjectRoot } from '../utils/project.js'
import { logger } from '../utils/logger.js'
import { AgentKitError } from '../utils/errors.js'
import { join } from 'path'

export const cleanCommand = new Command('clean')
  .description('Delete cached skills and reinstall from lock file')
  .action(async () => {
    try {
      const projectRoot = await requireProjectRoot()
      const lock = await readLockFile(projectRoot)

      if (!lock || Object.keys(lock.skills).length === 0) {
        logger.warn('No lock file or no skills to restore')
        return
      }

      logger.info('Cleaning cached skills...')

      const cacheDir = join(projectRoot, '.agentkit', 'skills')
      await rm(cacheDir, { recursive: true, force: true })
      await cleanSyncedDir(projectRoot)

      logger.info(`Reinstalling ${Object.keys(lock.skills).length} skill${Object.keys(lock.skills).length === 1 ? '' : 's'}...`)

      const resolved = Object.entries(lock.skills).map(([skillName, entry]) => ({
        skillName,
        resolvedVersion: entry.version,
        tarballUrl: '',
        githubRef: entry.resolved.split('#')[1] || `v${entry.version}`,
      }))

      for (const item of resolved) {
        const parts = item.skillName.split('/')
        const scope = parts[0].replace('@', '')
        const name = parts[1]
        item.tarballUrl = `https://github.com/${scope}/${name}/archive/${item.githubRef}.tar.gz`
      }

      const installed = await installAllSkills(projectRoot, resolved)
      await syncSkillsToClaudeDir(projectRoot, installed)

      logger.success(`Restored ${installed.length} skill${installed.length === 1 ? '' : 's'}`)
    } catch (err) {
      if (err instanceof AgentKitError) {
        throw err
      }
      throw new AgentKitError(`Clean failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  })
