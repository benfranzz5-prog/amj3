import type { CollectionConfig } from 'payload'

export const Fresho: CollectionConfig = {
  slug: 'fresho',
  admin: { useAsTitle: 'heading', description: 'Fresho ordering section.' },
  fields: [
    { name: 'sectionLabel', type: 'text', defaultValue: 'Order Online' },
    { name: 'heading',      type: 'text', required: true, defaultValue: 'Order via Fresho' },
    { name: 'body',         type: 'textarea' },
    { name: 'buttonLabel',  type: 'text', defaultValue: 'Order on Fresho' },
    { name: 'buttonUrl',    type: 'text', defaultValue: 'https://www.fresho.com/au' },
  ],
}
