import { Command } from 'commander'
import { readManifest, writeManifest } from '../core/manifest.js'
import { readLockFile, writeLockFile } from '../core/lockfile.js'
import { resolveAllSkills } from '../core/resolver.js'
import { installAllSkills } from '../core/installer.js'
import { syncSkillsToClaudeDir } from '../core/syncer.js'
import { requireProjectRoot } from '../utils/project.js'
import { logger } from '../utils/logger.js'
import { AgentKitError } from '../utils/errors.js'

export const updateCommand = new Command('update')
  .description('Update all skills to latest compatible versions')
  .option('--symlink', 'use symlinks instead of copying')
  .action(
    async (options: {
      symlink?: boolean
    }) => {
      try {
        const projectRoot = await requireProjectRoot()
        const manifest = await readManifest(projectRoot)

        const skills = Object.entries(manifest.skills)
        if (skills.length === 0) {
          logger.warn('No skills in agentkit.json')
          return
        }

        logger.info(`Updating ${skills.length} skill${skills.length === 1 ? '' : 's'}...`)

        const resolved = await resolveAllSkills(manifest.skills)
        const installed = await installAllSkills(projectRoot, resolved)

        await syncSkillsToClaudeDir(projectRoot, installed, { symlink: options.symlink })

        const lock = await readLockFile(projectRoot) || { lockfileVersion: 1, skills: {} }
        for (const skill of installed) {
          const range = manifest.skills[skill.skillName]
          const resEntry = resolved.find((r) => r.skillName === skill.skillName)
          lock.skills[skill.skillName] = {
            version: skill.meta.version,
            resolved: `github:${skill.skillName.replace('@', '').replace('/', '/')}#${resEntry?.githubRef || 'unknown'}`,
          }
        }

        await writeLockFile(projectRoot, lock)

        logger.success(`Updated ${installed.length} skill${installed.length === 1 ? '' : 's'}`)
        for (const skill of installed) {
          logger.dim(`  ${skill.skillName}@${skill.meta.version}`)
        }
      } catch (err) {
        if (err instanceof AgentKitError) {
          throw err
        }
        throw new AgentKitError(`Update failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  )
