import { InvalidSkillRefError } from '../utils/errors.js'

export interface ParsedSkillRef {
  scope: string
  repoName: string
  subdir?: string
  fullName: string
  githubRepo: string
  githubUrl: string
}

export function parseSkillRef(input: string): ParsedSkillRef {
  // Matches scope/name or scope/name/subdir... (no @ prefix)
  // Regex groups: 1 = scope, 2 = repoName, 3 = optional rest of path
  const match = input.match(/^([a-z0-9_-]+)\/([a-z0-9_-]+)(?:\/(.+))?$/i)
  if (!match) {
    throw new InvalidSkillRefError(input)
  }

  const scope = match[1]
  const repoName = match[2]
  const subdir = match[3]
  const githubRepo = `${scope}/${repoName}`
  const fullName = subdir ? `${githubRepo}/${subdir}` : githubRepo
  const githubUrl = `https://github.com/${githubRepo}`

  return { scope, repoName, subdir, fullName, githubRepo, githubUrl }
}

export function parseSkillArg(input: string): { skillRef: ParsedSkillRef; versionSpec: string | null } {
  // Regex: ^([^@]+)(?:@(.+))?$
  // Matches scope/name or scope/name@version or scope/name/subdir or scope/name/subdir@version
  // The last @ (if present) separates the skill ref from the version spec
  const match = input.match(/^([^@]+)(?:@(.+))?$/)
  if (!match) {
    throw new InvalidSkillRefError(input)
  }

  const skillRefPart = match[1]
  const versionSpec = match[2] || null

  const skillRef = parseSkillRef(skillRefPart)
  return { skillRef, versionSpec }
}
