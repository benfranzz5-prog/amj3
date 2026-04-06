import type { GlobalConfig } from 'payload'

export const HeroGlobal: GlobalConfig = {
  slug: 'hero',
  label: 'Hero Section',
  admin: { description: 'The top hero section of the homepage.' },
  fields: [
    { name: 'eyebrow',        type: 'text',     defaultValue: "South Australia's Premium Wholesaler" },
    { name: 'titleLine1',     type: 'text',     defaultValue: 'Premium Wholesale' },
    { name: 'titleLine2',     type: 'text',     defaultValue: 'Fresh Produce' },
    { name: 'subParagraph',   type: 'textarea', defaultValue: 'Delivering the finest local and specialty produce to chefs, restaurants, caterers, and corporate kitchens across South Australia.' },
    { name: 'ctaPrimaryLabel', type: 'text',    defaultValue: 'View Our Produce' },
    { name: 'ctaOutlineLabel', type: 'text',    defaultValue: 'Enquire Now' },
  ],
}
