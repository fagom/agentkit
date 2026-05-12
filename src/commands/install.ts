import { Command } from 'commander'
import ora from 'ora'
import { readManifest } from '../core/manifest.js'
import { readLockFile, writeLockFile, createEmptyLockFile } from '../core/lockfile.js'
import { resolveAllSkills } from '../core/resolver.js'
import { installAllSkills } from '../core/installer.js'
import { syncSkillsToClaudeDir } from '../core/syncer.js'
import { requireProjectRoot } from '../utils/project.js'
import { logger } from '../utils/logger.js'
import { AgentKitError } from '../utils/errors.js'

export const installCommand = new Command('install')
  .description('Install all skills from agentkit.json')
  .option('--frozen-lockfile', 'fail if lock file would change')
  .option('--symlink', 'use symlinks instead of copying')
  .action(
    async (options: {
      frozenLockfile?: boolean
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

        const spinner = ora(`Resolving ${skills.length} skill${skills.length === 1 ? '' : 's'}...`).start()
        try {
          let resolved = await resolveAllSkills(manifest.skills)
          spinner.succeed(`Resolved ${resolved.length} skill${resolved.length === 1 ? '' : 's'}`)

          const downloadSpinner = ora('Downloading and extracting skills...').start()
          const installed = await installAllSkills(projectRoot, resolved)
          downloadSpinner.succeed('Downloaded all skills')

          const syncSpinner = ora('Syncing to .claude/skills/...').start()
          await syncSkillsToClaudeDir(projectRoot, installed, { symlink: options.symlink })
          syncSpinner.succeed('Synced skills')

          const lockSpinner = ora('Updating lock file...').start()
          const lock = createEmptyLockFile()
          for (const skill of installed) {
            const resEntry = resolved.find((r) => r.skillName === skill.skillName)
            lock.skills[skill.skillName] = {
              version: skill.resolvedVersion,
              resolved: `github:${skill.skillName}#${resEntry?.githubRef || 'unknown'}`,
              ...(resEntry?.sha ? { sha: resEntry.sha } : {}),
              ...(resEntry?.subdir ? { subdir: resEntry.subdir } : {}),
            }
          }

          await writeLockFile(projectRoot, lock)
          lockSpinner.succeed('Updated lock file')

          logger.success(`Installation complete!`)
          logger.info(`Installed ${installed.length} skill${installed.length === 1 ? '' : 's'}:`)
          for (const skill of installed) {
            logger.dim(`  ${skill.skillName}@${skill.resolvedVersion}`)
          }
        } catch (err) {
          spinner.fail()
          throw err
        }
      } catch (err) {
        if (err instanceof AgentKitError) {
          throw err
        }
        throw new AgentKitError(`Install failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  )
