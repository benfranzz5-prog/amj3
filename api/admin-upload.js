import { verifyRequest } from './_auth.js'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const SAFE_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
const MAX_B64 = 1.5 * 1024 * 1024 // ~1MB binary after decoding

function validateMagicBytes(buf, mime) {
  if (mime === 'image/jpeg') return buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF
  if (mime === 'image/png')  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47
  if (mime === 'image/gif')  return buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38
  if (mime === 'image/webp') return buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
                                    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  return false
}

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

    const buf = Buffer.from(data, 'base64')
    if (!validateMagicBytes(buf, mime)) return res.status(400).json({ error: 'Invalid file type' })

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
      console.error('[admin-upload] error:', e.message)
      res.status(500).json({ error: 'Failed to upload image. Please try again.' })
    }
  })
}
