import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { LockFile } from '../types/lockfile.js'

export async function readLockFile(projectRoot: string): Promise<LockFile | null> {
  const path = join(projectRoot, 'agentkit-lock.json')
  try {
    const content = await readFile(path, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

export async function writeLockFile(projectRoot: string, lock: LockFile): Promise<void> {
  const path = join(projectRoot, 'agentkit-lock.json')
  const sorted: LockFile = {
    lockfileVersion: lock.lockfileVersion,
    skills: Object.keys(lock.skills)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = lock.skills[key]
          return acc
        },
        {} as Record<string, (typeof lock.skills)[string]>
      ),
  }
  await writeFile(path, JSON.stringify(sorted, null, 2))
}

export function createEmptyLockFile(): LockFile {
  return { lockfileVersion: 1, skills: {} }
}
