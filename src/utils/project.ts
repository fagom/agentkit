import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { ManifestNotFoundError } from './errors.js'

export async function findProjectRoot(startDir: string): Promise<string | null> {
  let current = startDir

  while (current !== dirname(current)) {
    const manifestPath = join(current, 'agentkit.json')
    if (existsSync(manifestPath)) {
      return current
    }
    current = dirname(current)
  }

  return null
}

export async function requireProjectRoot(): Promise<string> {
  const root = await findProjectRoot(process.cwd())
  if (!root) {
    throw new ManifestNotFoundError()
  }
  return root
}

export function skillNameToShortName(skillName: string): string {
  const parts = skillName.split('/')
  return parts[parts.length - 1]
}
