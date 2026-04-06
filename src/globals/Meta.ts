import type { GlobalConfig } from 'payload'

export const MetaGlobal: GlobalConfig = {
  slug: 'meta',
  label: 'Site Meta (SEO)',
  admin: { description: 'Page title and meta description shown in search engines.' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'AMJ Produce | Premium Wholesale Fresh Produce – South Australia',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Premium wholesale fresh produce supplier based in South Australia. Supplying chefs, restaurants, and caterers with the finest local and specialty produce.',
    },
  ],
}
