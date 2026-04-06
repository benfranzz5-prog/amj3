import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { MetaGlobal }         from './src/globals/Meta'
import { NavigationGlobal }   from './src/globals/Navigation'
import { HeroGlobal }         from './src/globals/Hero'
import { AboutGlobal }        from './src/globals/About'
import { FreshoGlobal }       from './src/globals/Fresho'
import { DeliveryGlobal }     from './src/globals/Delivery'
import { MissionGlobal }      from './src/globals/Mission'
import { EnvironmentGlobal }  from './src/globals/Environment'
import { CommitmentGlobal }   from './src/globals/Commitment'
import { ContactGlobal }      from './src/globals/Contact'
import { FooterGlobal }       from './src/globals/Footer'
import { Testimonials }       from './src/collections/Testimonials'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-in-production',

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— AMJ Produce CMS',
    },
  },

  // ── Globals (single-instance editable sections) ──────────────────
  globals: [
    MetaGlobal,
    NavigationGlobal,
    HeroGlobal,
    AboutGlobal,
    FreshoGlobal,
    DeliveryGlobal,
    MissionGlobal,
    EnvironmentGlobal,
    CommitmentGlobal,
    ContactGlobal,
    FooterGlobal,
  ],

  // ── Collections ──────────────────────────────────────────────────
  collections: [
    Testimonials,

    // Admin users — email + password only, no GitHub token
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [],
    },
  ],

  typescript: {
    outputFile: path.resolve(__dirname, 'src/payload-types.ts'),
  },
})
