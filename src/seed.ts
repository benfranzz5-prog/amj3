/**
 * seed.ts — Creates the initial Payload admin user.
 *
 * Usage:
 *   npm run seed
 *
 * Required env vars:
 *   ADMIN_EMAIL    — email for the admin account
 *   ADMIN_PASSWORD — password for the admin account
 *   DATABASE_URL   — Postgres connection string
 *   PAYLOAD_SECRET — Payload encryption secret
 */

import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  const email    = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('❌  ADMIN_EMAIL and ADMIN_PASSWORD env vars are required.')
    process.exit(1)
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
  })

  if (existing.totalDocs > 0) {
    console.log(`ℹ️  Admin user already exists: ${email}`)
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: { email, password },
  })

  console.log(`✅  Admin user created: ${email}`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
