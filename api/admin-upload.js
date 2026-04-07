import { verifyRequest } from './_auth.js'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 1 * 1024 * 1024 // 1 MB
const SAFE_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

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

  const chunks = []
  let size = 0
  req.on('data', chunk => {
    size += chunk.length
    if (size > MAX_BYTES) { res.status(413).json({ error: 'Image must be under 1MB' }); req.destroy() }
    else chunks.push(chunk)
  })
  req.on('end', async () => {
    const buf = Buffer.concat(chunks)

  // Parse multipart
    const boundary = (req.headers['content-type'] || '').match(/boundary=(.+)/)?.[1]
    if (!boundary) return res.status(400).json({ error: 'No boundary' })

    const parts = parseParts(buf, boundary)
    const filePart = parts.find(p => p.filename)
    if (!filePart) return res.status(400).json({ error: 'No file' })

    const mime = filePart.mime || 'application/octet-stream'
    if (!ALLOWED_MIME.includes(mime)) return res.status(400).json({ error: 'Invalid file type' })

    const ext = SAFE_EXT[mime]
    const ts = Date.now()
    const slug = `${ts}-${Math.random().toString(36).slice(2, 8)}`
    const imagePath = `public/images/gallery/${slug}.${ext}`

    try {
      await githubPut(imagePath, filePart.data.toString('base64'), null, `cms: upload gallery image`)
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

function parseParts(buf, boundary) {
  const sep = Buffer.from(`--${boundary}`)
  const parts = []
  let pos = 0
  while (pos < buf.length) {
    const start = indexOf(buf, sep, pos)
    if (start === -1) break
    pos = start + sep.length
    if (buf[pos] === 45 && buf[pos + 1] === 45) break // --
    if (buf[pos] === 13) pos += 2 // \r\n
    const headerEnd = indexOf(buf, Buffer.from('\r\n\r\n'), pos)
    if (headerEnd === -1) break
    const headerStr = buf.slice(pos, headerEnd).toString()
    pos = headerEnd + 4
    const nextSep = indexOf(buf, sep, pos)
    const dataEnd = nextSep === -1 ? buf.length : nextSep - 2
    const data = buf.slice(pos, dataEnd)
    const nameMatch = headerStr.match(/name="([^"]+)"/)
    const filenameMatch = headerStr.match(/filename="([^"]+)"/)
    const mimeMatch = headerStr.match(/Content-Type:\s*(\S+)/i)
    parts.push({
      name: nameMatch?.[1],
      filename: filenameMatch?.[1],
      mime: mimeMatch?.[1],
      data,
    })
    pos = nextSep === -1 ? buf.length : nextSep
  }
  return parts
}

function indexOf(buf, search, start = 0) {
  for (let i = start; i <= buf.length - search.length; i++) {
    let found = true
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) { found = false; break }
    }
    if (found) return i
  }
  return -1
}
