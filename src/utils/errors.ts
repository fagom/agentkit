export class AgentKitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AgentKitError'
  }
}

export class ManifestNotFoundError extends AgentKitError {
  constructor(projectRoot?: string) {
    super(`agentkit.json not found${projectRoot ? ` in ${projectRoot}` : ''}. Run 'agk init' to create one.`)
    this.name = 'ManifestNotFoundError'
  }
}

export class SkillNotFoundError extends AgentKitError {
  constructor(skillName: string) {
    super(`Skill ${skillName} not found in manifest`)
    this.name = 'SkillNotFoundError'
  }
}

export class VersionResolutionError extends AgentKitError {
  constructor(skillName: string, versionRange: string, availableVersions: string[]) {
    const versions = availableVersions.length > 0 ? `Available: ${availableVersions.join(', ')}` : 'No versions available'
    super(`Could not resolve ${skillName}@${versionRange}. ${versions}`)
    this.name = 'VersionResolutionError'
  }
}

export class DownloadError extends AgentKitError {
  constructor(url: string, reason: string) {
    super(`Failed to download ${url}: ${reason}`)
    this.name = 'DownloadError'
  }
}

export class InvalidSkillError extends AgentKitError {
  constructor(skillName: string, reason: string) {
    super(`Invalid skill ${skillName}: ${reason}`)
    this.name = 'InvalidSkillError'
  }
}

export class RateLimitError extends AgentKitError {
  constructor() {
    super('GitHub API rate limit exceeded. Set GITHUB_TOKEN environment variable to increase limit.')
    this.name = 'RateLimitError'
  }
}

export class InvalidSkillRefError extends AgentKitError {
  constructor(input: string) {
    super(`Invalid skill reference: ${input}. Expected format: scope/name or scope/name/skill`)
    this.name = 'InvalidSkillRefError'
  }
}
