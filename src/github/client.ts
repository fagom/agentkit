import fetch from 'node-fetch'
import { createGunzip } from 'zlib'
import { extract } from 'tar'
import { mkdir } from 'fs/promises'
import { DownloadError, RateLimitError } from '../utils/errors.js'

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true })
}

export interface GitHubTag {
  name: string
  tarball_url: string
}

export async function fetchTags(githubRepo: string): Promise<GitHubTag[]> {
  const url = `https://api.github.com/repos/${githubRepo}/tags`
  const headers: Record<string, string> = { 'User-Agent': 'agentkit' }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const res = await fetch(url, { headers })

  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    if (remaining === '0') {
      throw new RateLimitError()
    }
  }

  if (!res.ok) {
    throw new DownloadError(url, `HTTP ${res.status}`)
  }

  const data = (await res.json()) as GitHubTag[]
  return data.filter((tag) => /^v?\d+\.\d+\.\d+/.test(tag.name))
}

export async function downloadTarball(tarballUrl: string, destDir: string): Promise<void> {
  await ensureDir(destDir)

  const res = await fetch(tarballUrl)
  if (!res.ok) {
    throw new DownloadError(tarballUrl, `HTTP ${res.status}`)
  }

  if (!res.body) {
    throw new DownloadError(tarballUrl, 'No response body')
  }

  return new Promise((resolve, reject) => {
    res.body!
      .pipe(createGunzip())
      .pipe(
        extract({
          cwd: destDir,
          strip: 1,
        })
      )
      .on('finish', () => resolve())
      .on('error', (err) => reject(new DownloadError(tarballUrl, String(err))))
  })
}

export async function fetchDefaultBranch(githubRepo: string): Promise<string> {
  const url = `https://api.github.com/repos/${githubRepo}`
  const headers: Record<string, string> = { 'User-Agent': 'agentkit' }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new DownloadError(url, `HTTP ${res.status}`)
  }

  const data = (await res.json()) as Record<string, unknown>
  const branch = data.default_branch
  if (typeof branch !== 'string') {
    throw new DownloadError(url, 'Could not determine default branch')
  }

  return branch
}

export async function fetchBranchSha(githubRepo: string, branch: string): Promise<string> {
  const url = `https://api.github.com/repos/${githubRepo}/branches/${branch}`
  const headers: Record<string, string> = { 'User-Agent': 'agentkit' }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new DownloadError(url, `HTTP ${res.status} (branch not found: ${branch})`)
  }

  const data = (await res.json()) as Record<string, Record<string, unknown>>
  const sha = data.commit?.sha
  if (typeof sha !== 'string') {
    throw new DownloadError(url, 'Could not determine branch SHA')
  }

  return sha
}
