import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '../../../../payload.config'
import { importMap } from '../importMap.js'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({ config })
}

const Page = RootPage({ config, importMap })
export default Page
