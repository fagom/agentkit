import { Command } from 'commander'
import { readManifest, writeManifest } from '../core/manifest.js'
import { readLockFile, writeLockFile } from '../core/lockfile.js'
import { removeInstalledSkill } from '../core/installer.js'
import { removeSyncedSkill } from '../core/syncer.js'
import { requireProjectRoot } from '../utils/project.js'
import { logger } from '../utils/logger.js'
import { AgentKitError, SkillNotFoundError } from '../utils/errors.js'

export const removeCommand = new Command('remove')
  .description('Remove a skill')
  .argument('<skill>', 'skill in @scope/name format')
  .action(async (skillArg: string) => {
    try {
      const projectRoot = await requireProjectRoot()
      const manifest = await readManifest(projectRoot)

      if (!manifest.skills[skillArg]) {
        throw new SkillNotFoundError(skillArg)
      }

      delete manifest.skills[skillArg]

      await removeInstalledSkill(projectRoot, skillArg)
      await removeSyncedSkill(projectRoot, skillArg)

      const lock = await readLockFile(projectRoot)
      if (lock) {
        delete lock.skills[skillArg]
        await writeLockFile(projectRoot, lock)
      }

      await writeManifest(projectRoot, manifest)

      logger.success(`Removed ${skillArg}`)
    } catch (err) {
      if (err instanceof AgentKitError) {
        throw err
      }
      throw new AgentKitError(`Remove failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  })
