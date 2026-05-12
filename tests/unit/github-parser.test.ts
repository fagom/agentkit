import { describe, it, expect } from 'vitest'
import { parseSkillRef } from '../../src/github/parser.js'
import { InvalidSkillRefError } from '../../src/utils/errors.js'

describe('github parser', () => {
  it('parses valid skill ref', () => {
    const result = parseSkillRef('dev/smart-commit')
    expect(result.scope).toBe('dev')
    expect(result.repoName).toBe('smart-commit')
    expect(result.fullName).toBe('dev/smart-commit')
    expect(result.githubRepo).toBe('dev/smart-commit')
    expect(result.githubUrl).toBe('https://github.com/dev/smart-commit')
  })

  it('parses with underscores and numbers', () => {
    const result = parseSkillRef('my_scope/skill_2')
    expect(result.scope).toBe('my_scope')
    expect(result.repoName).toBe('skill_2')
  })

  it('parses multi-skill repo', () => {
    const result = parseSkillRef('dev/foo/bar')
    expect(result.scope).toBe('dev')
    expect(result.repoName).toBe('foo')
    expect(result.subdir).toBe('bar')
    expect(result.fullName).toBe('dev/foo/bar')
    expect(result.githubRepo).toBe('dev/foo')
  })

  it('throws on missing slash', () => {
    expect(() => parseSkillRef('dev')).toThrow(InvalidSkillRefError)
  })

  it('supports nested subdirectories', () => {
    const result = parseSkillRef('dev/foo/bar/baz')
    expect(result.scope).toBe('dev')
    expect(result.repoName).toBe('foo')
    expect(result.subdir).toBe('bar/baz')
    expect(result.fullName).toBe('dev/foo/bar/baz')
  })

  it('throws on empty name', () => {
    expect(() => parseSkillRef('dev/')).toThrow(InvalidSkillRefError)
  })
})
