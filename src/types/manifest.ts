export interface AgentKitManifest {
  name: string
  version: string
  skills: Record<string, string>
}

export interface SkillEntry {
  skillName: string
  versionRange: string
}
