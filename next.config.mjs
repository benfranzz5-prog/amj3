import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CMS is deployed as a separate Vercel project under /admin
}

export default withPayload(nextConfig)
