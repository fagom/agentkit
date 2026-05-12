import { join } from 'path'
import { rm, mkdir, cp } from 'fs/promises'
import { randomBytes } from 'crypto'
import { downloadTarball } from '../github/client.js'
import { skillNameToShortName } from '../utils/project.js'
import type { ResolvedSkill } from './resolver.js'

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true })
}

export interface InstalledSkill {
  skillName: string
  skillDir: string
  resolvedVersion: string
}

export async function installSkill(projectRoot: string, resolved: ResolvedSkill): Promise<InstalledSkill> {
  const shortName = skillNameToShortName(resolved.skillName)
  const skillDir = join(projectRoot, '.agentkit', 'skills', shortName)

  try {
    if (resolved.subdir) {
      // Multi-skill repo: download to temp, copy only subdir
      const tempDir = join(projectRoot, '.agentkit', '.tmp', `temp-${randomBytes(8).toString('hex')}`)
      await ensureDir(projectRoot + '/.agentkit/.tmp')
      try {
        await downloadTarball(resolved.tarballUrl, tempDir)
        const subdirPath = join(tempDir, resolved.subdir)
        await cp(subdirPath, skillDir, { recursive: true, force: true })
      } finally {
        await rm(tempDir, { recursive: true, force: true }).catch(() => {})
      }
    } else {
      // Single skill: download directly
      await downloadTarball(resolved.tarballUrl, skillDir)
    }

    return {
      skillName: resolved.skillName,
      skillDir,
      resolvedVersion: resolved.resolvedVersion,
    }
  } catch (err) {
    await rm(skillDir, { recursive: true, force: true }).catch(() => {})
    throw err
  }
}

export async function installAllSkills(
  projectRoot: string,
  resolved: ResolvedSkill[]
): Promise<InstalledSkill[]> {
  return Promise.all(resolved.map((r) => installSkill(projectRoot, r)))
}

export async function removeInstalledSkill(projectRoot: string, skillName: string): Promise<void> {
  const shortName = skillNameToShortName(skillName)
  const skillDir = join(projectRoot, '.agentkit', 'skills', shortName)
  await rm(skillDir, { recursive: true, force: true })
}
