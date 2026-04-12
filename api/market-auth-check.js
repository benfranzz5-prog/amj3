import { verifyMarketRequest } from './_market-auth.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  if (!verifyMarketRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  res.status(200).json({ ok: true })
}
