import { Command } from 'commander'
import ora from 'ora'
import { readManifest, writeManifest } from '../core/manifest.js'
import { readLockFile, writeLockFile } from '../core/lockfile.js'
import { resolveSkill } from '../core/resolver.js'
import { installSkill } from '../core/installer.js'
import { syncSkillsToClaudeDir } from '../core/syncer.js'
import { requireProjectRoot } from '../utils/project.js'
import { logger } from '../utils/logger.js'
import { AgentKitError } from '../utils/errors.js'
import { parseSkillArg } from '../github/parser.js'
import inquirer from 'inquirer'

export const addCommand = new Command('add')
  .description('Add and install a skill')
  .argument('<skill>', 'skill in scope/name or scope/name@version format')
  .option('--symlink', 'use symlinks instead of copying')
  .option('--skill <name>', 'install a specific sub-skill from a multi-skill repo')
  .action(
    async (
      skillArg: string,
      options: {
        symlink?: boolean
        skill?: string
      }
    ) => {
      try {
        // If --skill is provided, construct the full skill reference with skills/ prefix
        const fullSkillArg = options.skill ? `${skillArg}/skills/${options.skill}` : skillArg
        const { skillRef, versionSpec } = parseSkillArg(fullSkillArg)
        const skillName = skillRef.fullName
        const versionRange = versionSpec || '*'

        const projectRoot = await requireProjectRoot()
        const manifest = await readManifest(projectRoot)

        if (manifest.skills[skillName]) {
          const { confirm } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: `${skillName} already in manifest. Overwrite?`,
              default: false,
            },
          ])
          if (!confirm) {
            logger.info('Cancelled')
            return
          }
        }

        const spinner = ora(`Resolving ${skillName}...`).start()
        try {
          const resolved = await resolveSkill(skillName, versionRange)
          spinner.succeed(`Resolved ${skillName}@${resolved.resolvedVersion}`)

          // Store version range in manifest (for future updates)
          // Use versionRange (which is versionSpec || '*')
          manifest.skills[skillName] = versionRange

          const dlSpinner = ora('Installing skill...').start()
          const installed = await installSkill(projectRoot, resolved)
          dlSpinner.succeed('Installed')

          const syncSpinner = ora('Syncing to .claude/skills/...').start()
          await syncSkillsToClaudeDir(projectRoot, [installed], { symlink: options.symlink })
          syncSpinner.succeed('Synced')

          const lock = await readLockFile(projectRoot)
          const newLock = lock || { lockfileVersion: 1, skills: {} }
          newLock.skills[skillName] = {
            version: resolved.resolvedVersion,
            resolved: `github:${skillRef.githubRepo}#${resolved.githubRef}`,
            ...(resolved.sha ? { sha: resolved.sha } : {}),
            ...(resolved.subdir ? { subdir: resolved.subdir } : {}),
          }

          await writeManifest(projectRoot, manifest)
          await writeLockFile(projectRoot, newLock)

          logger.success(`Added ${skillName}@${resolved.resolvedVersion}`)
        } catch (err) {
          spinner.fail()
          throw err
        }
      } catch (err) {
        if (err instanceof AgentKitError) {
          throw err
        }
        throw new AgentKitError(`Add failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  )
