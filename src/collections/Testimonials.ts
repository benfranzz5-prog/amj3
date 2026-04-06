import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'author', description: 'Customer Google Reviews / testimonials.' },
  fields: [
    { name: 'author',   type: 'text', required: true },
    { name: 'quote',    type: 'textarea', required: true },
    { name: 'stars',    type: 'number', min: 1, max: 5, defaultValue: 5, required: true },
    { name: 'order',    type: 'number', label: 'Display order (lower = first)', defaultValue: 0 },
  ],
}
