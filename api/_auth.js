// Shared HMAC auth helper
import crypto from 'crypto'

const SECRET = process.env.ADMIN_PASSWORD
if (!SECRET) throw new Error('ADMIN_PASSWORD environment variable is required')

const COOKIE = 'amj_session'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export function signToken(ts) {
  return crypto.createHmac('sha256', SECRET).update(String(ts)).digest('hex')
}

export function makeSessionCookie() {
  const ts = Date.now()
  const sig = signToken(ts)
  const token = `${ts}.${sig}`
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}; Path=/`
}

export function clearSessionCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
}

export function verifyRequest(req) {
  // Node.js req.headers is a plain object (lowercase keys)
  const cookieHeader = req.headers['cookie'] || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  const token = match ? match[1] : null

  // Authorization header fallback
  const authHeader = req.headers['authorization'] || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  const raw = token || bearerToken
  if (!raw) return false

  const [ts, sig] = raw.split('.')
  if (!ts || !sig) return false
  if (Date.now() - Number(ts) > MAX_AGE * 1000) return false
  const expected = signToken(ts)
  return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
}
