import { verifyRequest } from './_auth.js'

const ALLOWED = /^[a-zA-Z0-9_-]+$/

async function githubGet(path) {
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  const token = process.env.GITHUB_TOKEN
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.json()
}

export default async function handler(req, res) {
  if (!verifyRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'GET') return res.status(405).end()

  const { section } = req.query
  if (!section || !ALLOWED.test(section)) return res.status(400).json({ error: 'Invalid section' })

  try {
    const file = await githubGet(`public/_data/${section}.json`)
    const content = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
    res.status(200).json({ content, sha: file.sha })
  } catch (e) {
    console.error('[admin-content] error:', e.message)
    res.status(500).json({ error: 'Failed to load content. Please try again.' })
  }
}
