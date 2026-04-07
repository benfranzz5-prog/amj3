import { verifyRequest } from './_auth.js'

async function blobDelete(blobUrl) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not configured')
  const res = await fetch('https://blob.vercel-storage.com/delete', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-version': '7',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ urls: [blobUrl] }),
  })
  if (!res.ok && res.status !== 404) throw new Error(`Blob delete failed: ${res.status}`)
}

async function githubGet(path) {
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.json()
}

async function githubPut(path, content, sha, message) {
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: Buffer.from(content).toString('base64'), branch, sha }),
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`)
}

export default async function handler(req, res) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  let body = ''
  req.on('data', c => { body += c })
  req.on('end', async () => {
    let src
    try { ({ src } = JSON.parse(body)) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }

    if (!src) return res.status(400).json({ error: 'Missing src' })

    // src is either a full blob URL or a legacy relative path
    const isBlobUrl = src.startsWith('https://') && src.includes('blob.vercel-storage.com')
    const isLegacyPath = /^images\/gallery\/[a-zA-Z0-9._-]+$/.test(src)

    if (!isBlobUrl && !isLegacyPath) {
      return res.status(400).json({ error: 'Invalid src' })
    }

    try {
      // Remove from gallery.json (match by src or blobUrl)
      const galFile = await githubGet('public/_data/gallery.json')
      if (galFile) {
        const gallery = JSON.parse(Buffer.from(galFile.content, 'base64').toString())
        const filtered = gallery.filter(item => item.src !== src && item.blobUrl !== src)
        await githubPut('public/_data/gallery.json', JSON.stringify(filtered, null, 2), galFile.sha, 'cms: delete gallery photo')
      }

      // Delete from Vercel Blob (blob URLs only — legacy GitHub files are left as-is)
      if (isBlobUrl) {
        await blobDelete(src)
      }

      res.status(200).json({ ok: true })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}
