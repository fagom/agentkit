import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readLockFile, writeLockFile, createEmptyLockFile } from '../../src/core/lockfile.js'
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

describe('lockfile', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'agk-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true })
  })

  it('returns null when lockfile does not exist', async () => {
    const result = await readLockFile(tempDir)
    expect(result).toBeNull()
  })

  it('creates empty lockfile', async () => {
    const empty = createEmptyLockFile()
    expect(empty.lockfileVersion).toBe(1)
    expect(empty.skills).toEqual({})
  })

  it('round-trips lockfile', async () => {
    const original = {
      lockfileVersion: 1,
      skills: {
        '@dev/foo': { version: '1.0.0', resolved: 'github:dev/foo#v1.0.0' },
        '@dev/bar': { version: '2.0.0', resolved: 'github:dev/bar#v2.0.0' },
      },
    }

    await writeLockFile(tempDir, original)
    const read = await readLockFile(tempDir)

    expect(read).toEqual(original)
  })

  it('sorts skills alphabetically when writing', async () => {
    const lock = {
      lockfileVersion: 1,
      skills: {
        '@z/zebra': { version: '1.0.0', resolved: 'github:z/zebra#v1.0.0' },
        '@a/apple': { version: '1.0.0', resolved: 'github:a/apple#v1.0.0' },
        '@m/mango': { version: '1.0.0', resolved: 'github:m/mango#v1.0.0' },
      },
    }

    await writeLockFile(tempDir, lock)
    const read = await readLockFile(tempDir)

    const keys = Object.keys(read!.skills)
    expect(keys).toEqual(['@a/apple', '@m/mango', '@z/zebra'])
  })
})
