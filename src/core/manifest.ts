import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { AgentKitError } from '../utils/errors.js'
import type { AgentKitManifest } from '../types/manifest.js'

export async function readManifest(projectRoot: string): Promise<AgentKitManifest> {
  const path = join(projectRoot, 'agentkit.json')
  const content = await readFile(path, 'utf-8')
  const data = JSON.parse(content)
  return validateManifest(data)
}

export async function writeManifest(projectRoot: string, manifest: AgentKitManifest): Promise<void> {
  const path = join(projectRoot, 'agentkit.json')
  await writeFile(path, JSON.stringify(manifest, null, 2))
}

export function validateManifest(data: unknown): AgentKitManifest {
  if (typeof data !== 'object' || data === null) {
    throw new AgentKitError('Invalid manifest: must be an object')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.name !== 'string' || !obj.name) {
    throw new AgentKitError('Invalid manifest: name must be a non-empty string')
  }

  if (typeof obj.version !== 'string' || !obj.version) {
    throw new AgentKitError('Invalid manifest: version must be a non-empty string')
  }

  if (typeof obj.skills !== 'object' || obj.skills === null || Array.isArray(obj.skills)) {
    throw new AgentKitError('Invalid manifest: skills must be an object')
  }

  const skills = obj.skills as Record<string, unknown>
  for (const [key, value] of Object.entries(skills)) {
    if (typeof value !== 'string') {
      throw new AgentKitError(`Invalid manifest: skill ${key} version must be a string`)
    }
  }

  return {
    name: obj.name,
    version: obj.version,
    skills,
  }
}
