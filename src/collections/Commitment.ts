import type { CollectionConfig } from 'payload'

export const Commitment: CollectionConfig = {
  slug: 'commitment',
  admin: { useAsTitle: 'heading', description: 'Customer commitment section.' },
  fields: [
    { name: 'heading', type: 'text', required: true, defaultValue: 'Our Commitment to You' },
    { name: 'body1',   type: 'textarea', defaultValue: "We understand that in a professional kitchen, quality and consistency aren't optional — they're everything." },
    { name: 'body2',   type: 'textarea', defaultValue: 'Whether you\'re a head chef at a fine-dining restaurant, a catering manager for a major event, or a corporate kitchen buyer, we treat every customer with the same dedication and care.' },
    {
      name: 'valuePills',
      type: 'array',
      label: 'Value pills',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
  ],
}
