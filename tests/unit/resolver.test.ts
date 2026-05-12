import { describe, it, expect, vi } from 'vitest'
import { resolveSkill } from '../../src/core/resolver.js'
import * as client from '../../src/github/client.js'
import { VersionResolutionError } from '../../src/utils/errors.js'

describe('resolver', () => {
  it('resolves exact version', async () => {
    vi.spyOn(client, 'fetchTags').mockResolvedValue([
      { name: 'v1.0.0', tarball_url: 'http://example.com/v1.0.0.tar.gz' },
      { name: 'v1.0.1', tarball_url: 'http://example.com/v1.0.1.tar.gz' },
    ])

    const result = await resolveSkill('dev/foo', '1.0.0')
    expect(result.resolvedVersion).toBe('1.0.0')
    expect(result.githubRef).toBe('v1.0.0')
  })

  it('resolves caret range', async () => {
    vi.spyOn(client, 'fetchTags').mockResolvedValue([
      { name: 'v1.0.0', tarball_url: 'http://example.com/v1.0.0.tar.gz' },
      { name: 'v1.0.1', tarball_url: 'http://example.com/v1.0.1.tar.gz' },
      { name: 'v1.1.0', tarball_url: 'http://example.com/v1.1.0.tar.gz' },
      { name: 'v2.0.0', tarball_url: 'http://example.com/v2.0.0.tar.gz' },
    ])

    const result = await resolveSkill('dev/foo', '^1.0.0')
    expect(result.resolvedVersion).toBe('1.1.0')
  })

  it('throws on no match', async () => {
    vi.spyOn(client, 'fetchTags').mockResolvedValue([
      { name: 'v1.0.0', tarball_url: 'http://example.com/v1.0.0.tar.gz' },
    ])

    expect(resolveSkill('dev/foo', '^2.0.0')).rejects.toThrow(VersionResolutionError)
  })

  it('handles versionless tag name', async () => {
    vi.spyOn(client, 'fetchTags').mockResolvedValue([
      { name: '1.0.0', tarball_url: 'http://example.com/1.0.0.tar.gz' },
    ])

    const result = await resolveSkill('dev/foo', '1.0.0')
    expect(result.resolvedVersion).toBe('1.0.0')
    expect(result.githubRef).toBe('1.0.0')
  })
})
