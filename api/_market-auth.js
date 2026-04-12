// Shared HMAC auth helper for market report sessions
import crypto from 'crypto'

const COOKIE = 'amj_market_session'
const MAX_AGE = 60 * 60 * 24 // 24 hours

function getSecret() {
  const s = process.env.ADMIN_PASSWORD
  if (!s) throw new Error('ADMIN_PASSWORD environment variable is required')
  return s + '_market'
}

function signMarketToken(ts) {
  return crypto.createHmac('sha256', getSecret()).update(String(ts)).digest('hex')
}

export function makeMarketSessionCookie() {
  const ts = Date.now()
  const sig = signMarketToken(ts)
  const token = `${ts}.${sig}`
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}; Path=/`
}

export function clearMarketSessionCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
}

export function verifyMarketRequest(req) {
  const cookieHeader = req.headers['cookie'] || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  const token = match ? match[1] : null
  if (!token) return false

  const [ts, sig] = token.split('.')
  if (!ts || !sig) return false
  if (Date.now() - Number(ts) > MAX_AGE * 1000) return false

  let expected
  try { expected = signMarketToken(ts) } catch { return false }

  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}
