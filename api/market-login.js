import crypto from 'crypto'
import { makeMarketSessionCookie } from './_market-auth.js'

const BODY_LIMIT = 1024

// Rate limiter for market login
const loginAttempts = new Map()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function checkRateLimit(ip) {
  const now = Date.now()
  const attempts = (loginAttempts.get(ip) || []).filter(t => now - t < WINDOW_MS)
  if (attempts.length >= MAX_ATTEMPTS) return false
  attempts.push(now)
  loginAttempts.set(ip, attempts)
  return true
}

function getClientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress || 'unknown'
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' })
  }

  const expectedEmail = process.env.MARKET_EMAIL
  const expectedPassword = process.env.MARKET_PASSWORD
  if (!expectedEmail || !expectedPassword) {
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk
    if (body.length > BODY_LIMIT) {
      res.status(413).json({ error: 'Request too large' })
      req.destroy()
    }
  })
  req.on('end', () => {
    if (res.writableEnded) return
    let email, password
    try { ({ email, password } = JSON.parse(body)) } catch { return res.status(400).json({ error: 'Invalid JSON' }) }

    const emailOk = safeEqual(String(email || ''), expectedEmail)
    const passOk = safeEqual(String(password || ''), expectedPassword)

    if (!emailOk || !passOk) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.setHeader('Set-Cookie', makeMarketSessionCookie())
    res.status(200).json({ ok: true })
  })
}
