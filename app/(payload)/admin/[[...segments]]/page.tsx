import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '../../../../payload.config'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({ config })
}

const Page = RootPage({ config })
export default Page
