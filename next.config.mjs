import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve large video files from public/ without size warnings
  experimental: {
    largePageDataBytes: 128 * 1024,
  },
}

export default withPayload(nextConfig)
