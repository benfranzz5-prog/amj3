import type { CollectionConfig } from 'payload'

export const Environment: CollectionConfig = {
  slug: 'environment',
  admin: { useAsTitle: 'heading', description: 'Environment / Sustainability section.' },
  fields: [
    { name: 'sectionLabel',    type: 'text', defaultValue: 'Sustainability' },
    { name: 'heading',         type: 'text', required: true, defaultValue: 'Environment / Sustainability Policy' },
    { name: 'introParagraph',  type: 'textarea', required: true },
    {
      name: 'cards',
      type: 'array',
      label: 'Sustainability cards',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body',  type: 'textarea', required: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats bar',
      fields: [
        { name: 'number', type: 'text', required: true },
        { name: 'label',  type: 'text', required: true },
      ],
    },
    {
      name: 'policyDocs',
      type: 'array',
      label: 'Policy document links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url',   type: 'text', required: true },
      ],
    },
  ],
}
