import { join } from 'path'
import { cp, rm, mkdir } from 'fs/promises'
import { skillNameToShortName } from '../utils/project.js'
import type { InstalledSkill } from './installer.js'

interface SyncerOptions {
  symlink?: boolean
}

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true })
}

export async function syncSkillsToClaudeDir(
  projectRoot: string,
  installed: InstalledSkill[],
  options?: SyncerOptions
): Promise<void> {
  const claudeSkillsDir = join(projectRoot, '.claude', 'skills')
  await ensureDir(claudeSkillsDir)

  for (const skill of installed) {
    const shortName = skillNameToShortName(skill.skillName)
    const claudeSkillDir = join(claudeSkillsDir, shortName)

    if (options?.symlink) {
      await syncWithSymlink(skill.skillDir, claudeSkillDir)
    } else {
      await syncWithCopy(skill.skillDir, claudeSkillDir)
    }
  }
}

export async function removeSyncedSkill(projectRoot: string, skillName: string): Promise<void> {
  const shortName = skillNameToShortName(skillName)
  const claudeSkillDir = join(projectRoot, '.claude', 'skills', shortName)
  await rm(claudeSkillDir, { recursive: true, force: true })
}

export async function cleanSyncedDir(projectRoot: string): Promise<void> {
  const claudeSkillsDir = join(projectRoot, '.claude', 'skills')
  await rm(claudeSkillsDir, { recursive: true, force: true })
}

async function syncWithCopy(sourceDir: string, destDir: string): Promise<void> {
  // Recursively copy entire skill directory to .claude/skills/{skillName}
  await cp(sourceDir, destDir, { recursive: true, force: true })
}

async function syncWithSymlink(sourceDir: string, destDir: string): Promise<void> {
  // Symlink not supported in our simplified version for now
  // Fall back to copy
  await syncWithCopy(sourceDir, destDir)
}
