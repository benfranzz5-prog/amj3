import type { GlobalConfig } from 'payload'

export const FreshoGlobal: GlobalConfig = {
  slug: 'fresho',
  label: 'Fresho Section',
  admin: { description: 'Online ordering via Fresho section.' },
  fields: [
    { name: 'sectionLabel', type: 'text',     defaultValue: 'Online Ordering' },
    { name: 'heading',      type: 'text',     defaultValue: 'Order Fresh Produce Through Fresho' },
    { name: 'body',         type: 'textarea', defaultValue: 'AMJ Produce is fully integrated with Fresho — the leading fresh produce ordering platform trusted by chefs and hospitality businesses across Australia. Browse our current stock, place orders, track deliveries and manage invoices all in one place.' },
    { name: 'buttonLabel',  type: 'text',     defaultValue: 'Order on Fresho' },
    { name: 'buttonUrl',    type: 'text',     defaultValue: 'https://www.fresho.com/au' },
  ],
}
