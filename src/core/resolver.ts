import { maxSatisfying, validRange } from 'semver'
import { fetchTags, fetchDefaultBranch, fetchBranchSha } from '../github/client.js'
import { parseSkillRef } from '../github/parser.js'
import { VersionResolutionError } from '../utils/errors.js'

export interface ResolvedSkill {
  skillName: string
  resolvedVersion: string
  tarballUrl: string
  githubRef: string
  sha?: string
  subdir?: string
}

export async function resolveSkill(skillName: string, versionRange: string): Promise<ResolvedSkill> {
  const parsed = parseSkillRef(skillName)
  const githubRepo = parsed.githubRepo

  // If versionRange is not a valid semver range, treat it as a branch name
  if (!validRange(versionRange)) {
    return resolveBranch(skillName, versionRange, githubRepo, parsed.subdir)
  }

  // versionRange is a valid semver range, try to resolve via tags
  const tags = await fetchTags(githubRepo)

  if (tags.length === 0) {
    // No tags exist. If range is "*" or "latest", fall back to default branch
    if (versionRange === '*' || versionRange === 'latest') {
      const branch = await fetchDefaultBranch(githubRepo)
      return resolveBranch(skillName, branch, githubRepo, parsed.subdir)
    }

    // No tags and specific semver range requested
    throw new VersionResolutionError(skillName, versionRange, [])
  }

  // Tags exist, resolve via semver
  const versions = tags.map((tag) => tag.name.replace(/^v/, ''))
  const resolved = maxSatisfying(versions, versionRange)

  if (!resolved) {
    throw new VersionResolutionError(skillName, versionRange, versions.slice(0, 5))
  }

  const matchingTag = tags.find((tag) => tag.name.replace(/^v/, '') === resolved)
  if (!matchingTag) {
    throw new VersionResolutionError(skillName, versionRange, versions)
  }

  return {
    skillName,
    resolvedVersion: resolved,
    tarballUrl: matchingTag.tarball_url,
    githubRef: matchingTag.name,
    ...(parsed.subdir ? { subdir: parsed.subdir } : {}),
  }
}

async function resolveBranch(
  skillName: string,
  branch: string,
  githubRepo: string,
  subdir?: string
): Promise<ResolvedSkill> {
  const sha = await fetchBranchSha(githubRepo, branch)

  const tarballUrl = `https://github.com/${githubRepo}/archive/${branch}.tar.gz`

  return {
    skillName,
    resolvedVersion: branch,
    tarballUrl,
    githubRef: branch,
    sha,
    ...(subdir ? { subdir } : {}),
  }
}

export async function resolveAllSkills(skills: Record<string, string>): Promise<ResolvedSkill[]> {
  const promises = Object.entries(skills).map(([skillName, versionRange]) =>
    resolveSkill(skillName, versionRange)
  )
  return Promise.all(promises)
}
