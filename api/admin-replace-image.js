import { verifyRequest } from './_auth.js'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 1 * 1024 * 1024 // 1 MB
const SAFE_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
const SLOT_RE = /^[a-zA-Z0-9_]+$/

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

    const boundary = (req.headers['content-type'] || '').match(/boundary=(.+)/)?.[1]
    if (!boundary) return res.status(400).json({ error: 'No boundary' })

    const parts = parseParts(buf, boundary)
    const filePart = parts.find(p => p.filename)
    const slotPart = parts.find(p => p.name === 'slot')
    const labelPart = parts.find(p => p.name === 'label')

    if (!filePart) return res.status(400).json({ error: 'No file' })
    if (!slotPart) return res.status(400).json({ error: 'No slot' })

    const slot = slotPart.data.toString().trim()
    if (!SLOT_RE.test(slot)) return res.status(400).json({ error: 'Invalid slot name' })

    const mime = filePart.mime || 'application/octet-stream'
    if (!ALLOWED_MIME.includes(mime)) return res.status(400).json({ error: 'Invalid file type' })

    const ext = SAFE_EXT[mime]
    const ts = Date.now()
    const imagePath = `public/images/managed/${ts}-${slot}.${ext}`

    try {
      await githubPut(imagePath, filePart.data.toString('base64'), null, `cms: replace image slot ${slot}`)
      const imgFile = await githubGet('public/_data/images.json')
      const images = imgFile ? JSON.parse(Buffer.from(imgFile.content, 'base64').toString()) : {}
      images[slot] = {
        src: `images/managed/${ts}-${slot}.${ext}`,
        label: labelPart ? labelPart.data.toString().trim() : slot,
      }
      await githubPut('public/_data/images.json', JSON.stringify(images, null, 2), imgFile?.sha || null, `cms: update images slot ${slot}`)
      res.status(200).json({ ok: true, src: `images/managed/${ts}-${slot}.${ext}` })
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
    if (buf[pos] === 45 && buf[pos + 1] === 45) break
    if (buf[pos] === 13) pos += 2
    const headerEnd = indexOf(buf, Buffer.from('\r\n\r\n'), pos)
    if (headerEnd === -1) break
    const headerStr = buf.slice(pos, headerEnd).toString()
    pos = headerEnd + 4
    const nextSep = indexOf(buf, sep, pos)
    const dataEnd = nextSep === -1 ? buf.length : nextSep - 2
    parts.push({
      name: headerStr.match(/name="([^"]+)"/)?.[1],
      filename: headerStr.match(/filename="([^"]+)"/)?.[1],
      mime: headerStr.match(/Content-Type:\s*(\S+)/i)?.[1],
      data: buf.slice(pos, dataEnd),
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
