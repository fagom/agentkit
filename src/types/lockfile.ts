export interface LockedSkill {
  version: string
  resolved: string
  sha?: string
  subdir?: string
}

export interface LockFile {
  lockfileVersion: number
  skills: Record<string, LockedSkill>
}
