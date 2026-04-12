import { verifyRequest } from './_auth.js'

const ALLOWED = /^[a-zA-Z0-9_-]+$/

async function githubPut(path, content, sha, message) {
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  const url = `https://api.github.com/repos/${repo}/contents/${path}`
  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
    ...(sha ? { sha } : {}),
  }
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub ${res.status}: ${err}`)
  }
  return res.json()
}

async function githubGetSha(path) {
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`
  const res = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  const data = await res.json()
  return data.sha
}

export default async function handler(req, res) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const BODY_LIMIT = 512 * 1024 // 512KB max for JSON content
  let body = ''
  req.on('data', c => {
    body += c
    if (body.length > BODY_LIMIT) {
      res.status(413).json({ error: 'Request too large' })
      req.destroy()
    }
  })
  req.on('end', async () => {
    if (res.writableEnded) return
    let section, content
    try { ({ section, content } = JSON.parse(body)) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }

    if (!section || !ALLOWED.test(section)) return res.status(400).json({ error: 'Invalid section' })
    if (!content || typeof content !== 'object') return res.status(400).json({ error: 'Invalid content' })

    const filePath = `public/_data/${section}.json`
    try {
      const sha = await githubGetSha(filePath)
      await githubPut(filePath, JSON.stringify(content, null, 2), sha, `cms: update ${section}`)
      res.status(200).json({ ok: true })
    } catch (e) {
      console.error('[admin-save] error:', e.message)
      res.status(500).json({ error: 'Failed to save content. Please try again.' })
    }
  })
}
