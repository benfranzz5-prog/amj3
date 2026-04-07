import { verifyRequest } from './_auth.js'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const SAFE_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
const MAX_B64 = 1.5 * 1024 * 1024 // ~1MB binary after decoding

async function githubPut(path, b64, sha, message) {
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  const body = { message, content: b64, branch, ...(sha ? { sha } : {}) }
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`)
  return res.json()
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

export const config = { api: { bodyParser: false } }

export default function handler(req, res) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  let raw = ''
  req.on('data', chunk => { raw += chunk })
  req.on('end', async () => {
    let mime, data
    try { ({ mime, data } = JSON.parse(raw)) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }

    if (!data || typeof data !== 'string') return res.status(400).json({ error: 'No image data' })
    if (!ALLOWED_MIME.includes(mime)) return res.status(400).json({ error: 'Invalid file type' })
    if (data.length > MAX_B64) return res.status(413).json({ error: 'Image must be under 1MB' })

    const ext = SAFE_EXT[mime]
    const ts = Date.now()
    const slug = `${ts}-${Math.random().toString(36).slice(2, 8)}`
    const imagePath = `public/images/gallery/${slug}.${ext}`

    try {
      await githubPut(imagePath, data, null, 'cms: upload gallery image')
      const galFile = await githubGet('public/_data/gallery.json')
      const gallery = galFile ? JSON.parse(Buffer.from(galFile.content, 'base64').toString()) : []
      gallery.push({ src: `images/gallery/${slug}.${ext}`, ts })
      await githubPut('public/_data/gallery.json', JSON.stringify(gallery, null, 2), galFile?.sha || null, 'cms: update gallery')
      res.status(200).json({ ok: true, src: `images/gallery/${slug}.${ext}` })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}
