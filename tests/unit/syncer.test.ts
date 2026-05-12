import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { syncSkillsToClaudeDir, removeSyncedSkill, cleanSyncedDir } from '../../src/core/syncer.js'
import { mkdtemp, rm, writeFile, mkdir, readFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import type { InstalledSkill } from '../../src/core/installer.js'

describe('syncer', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'agk-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true })
  })

  it('syncs skills to claude directory', async () => {
    const skillDir = join(tempDir, 'skill-src')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), '# Test Skill')
    await writeFile(join(skillDir, 'tools.js'), 'console.log("test")')

    const installed: InstalledSkill[] = [
      {
        skillName: '@dev/test-skill',
        skillDir,
        meta: {
          name: '@dev/test-skill',
          version: '1.0.0',
          entry: 'SKILL.md',
        },
      },
    ]

    await syncSkillsToClaudeDir(tempDir, installed, { symlink: false })

    const claudePath = join(tempDir, '.claude', 'skills', 'test-skill')
    const skillMd = await readFile(join(claudePath, 'SKILL.md'), 'utf-8')
    expect(skillMd).toBe('# Test Skill')

    const toolsJs = await readFile(join(claudePath, 'tools.js'), 'utf-8')
    expect(toolsJs).toBe('console.log("test")')
  })

  it('removes synced skill directory', async () => {
    const skillDir = join(tempDir, '.claude', 'skills', 'test-skill')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), '# Test')

    await removeSyncedSkill(tempDir, '@dev/test-skill')

    const exists = await readFile(join(skillDir, 'SKILL.md')).catch(() => null)
    expect(exists).toBeNull()
  })

  it('cleans entire synced directory', async () => {
    const skillDir = join(tempDir, '.claude', 'skills', 'test-skill')
    await mkdir(skillDir, { recursive: true })
    await writeFile(join(skillDir, 'SKILL.md'), '# Test')

    await cleanSyncedDir(tempDir)

    const claudeDir = join(tempDir, '.claude', 'skills')
    const files = await readFile(claudeDir).catch(() => null)
    expect(files).toBeNull()
  })
})
