import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readManifest, writeManifest, validateManifest } from '../../src/core/manifest.js'
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { AgentKitError } from '../../src/utils/errors.js'

describe('manifest', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'agk-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true })
  })

  it('validates correct manifest', () => {
    const data = {
      name: 'my-project',
      version: '1.0.0',
      skills: { '@dev/foo': '^1.0.0' },
    }
    const result = validateManifest(data)
    expect(result.name).toBe('my-project')
    expect(result.version).toBe('1.0.0')
    expect(result.skills['@dev/foo']).toBe('^1.0.0')
  })

  it('throws on missing name', () => {
    expect(() =>
      validateManifest({
        version: '1.0.0',
        skills: {},
      })
    ).toThrow(AgentKitError)
  })

  it('throws on non-string version', () => {
    expect(() =>
      validateManifest({
        name: 'test',
        version: 123,
        skills: {},
      })
    ).toThrow(AgentKitError)
  })

  it('throws on invalid skills object', () => {
    expect(() =>
      validateManifest({
        name: 'test',
        version: '1.0.0',
        skills: ['not', 'an', 'object'],
      })
    ).toThrow(AgentKitError)
  })

  it('round-trips manifest', async () => {
    const original = {
      name: 'test-project',
      version: '1.2.3',
      skills: { '@org/skill1': '^1.0.0', '@org/skill2': '~2.0.0' },
    }

    await writeManifest(tempDir, original)
    const read = await readManifest(tempDir)

    expect(read).toEqual(original)
  })

  it('throws on non-existent manifest', async () => {
    expect(() => readManifest(tempDir)).rejects.toThrow()
  })
})
