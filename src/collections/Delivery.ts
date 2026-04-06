import type { CollectionConfig } from 'payload'

export const Delivery: CollectionConfig = {
  slug: 'delivery',
  admin: { useAsTitle: 'heading', description: 'Logistics / Delivery section.' },
  fields: [
    { name: 'sectionLabel',  type: 'text', defaultValue: 'Logistics' },
    { name: 'heading',       type: 'text', required: true, defaultValue: 'From Our Hands to Your Kitchen' },
    { name: 'leadParagraph', type: 'textarea', required: true, defaultValue: 'We understand that timing is everything in a professional kitchen. AMJ Produce is committed to reliable, early-morning delivery so your team has what they need before service begins.' },
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Bullet points',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
