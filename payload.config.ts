import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

import { Hero }         from './src/collections/Hero'
import { Navigation }   from './src/collections/Navigation'
import { About }        from './src/collections/About'
import { Fresho }       from './src/collections/Fresho'
import { Delivery }     from './src/collections/Delivery'
import { Mission }      from './src/collections/Mission'
import { Testimonials } from './src/collections/Testimonials'
import { Environment }  from './src/collections/Environment'
import { Commitment }   from './src/collections/Commitment'
import { Contact }      from './src/collections/Contact'
import { Footer }       from './src/collections/Footer'
import { githubTokenBeforeLogin } from './src/hooks/githubTokenAuth'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-in-env',

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

  collections: [
    // ── Site content ──────────────────────────────────────────────
    Hero,
    Navigation,
    About,
    Fresho,
    Delivery,
    Mission,
    Testimonials,
    Environment,
    Commitment,
    Contact,
    Footer,

    // ── Admin users (password + GitHub token auth) ────────────────
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      hooks: {
        beforeLogin: [githubTokenBeforeLogin],
      },
      fields: [
        {
          name: 'githubToken',
          type: 'text',
          required: true,
          label: 'GitHub Personal Access Token',
          admin: {
            description:
              'A valid GitHub PAT is required for every login. Revoking the token on GitHub immediately blocks access to this CMS.',
          },
        },
      ],
    },
  ],

  typescript: {
    outputFile: path.resolve(__dirname, 'src/payload-types.ts'),
  },
})
