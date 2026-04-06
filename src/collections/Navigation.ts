import type { CollectionConfig } from 'payload'

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  admin: { useAsTitle: 'wholesaleLabel', description: 'Navigation bar link labels.' },
  fields: [
    { name: 'wholesaleLabel',    type: 'text', defaultValue: 'Wholesale' },
    { name: 'aboutLabel',        type: 'text', defaultValue: 'About AMJ' },
    { name: 'productsLabel',     type: 'text', defaultValue: 'Products' },
    { name: 'mediaLabel',        type: 'text', defaultValue: 'Media' },
    { name: 'environmentLabel',  type: 'text', defaultValue: 'Environment' },
    { name: 'contactLabel',      type: 'text', defaultValue: 'Contact' },
    { name: 'marketReportLabel', type: 'text', defaultValue: 'Market Report' },
  ],
}
