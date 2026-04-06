import type { CollectionConfig } from 'payload'

export const Hero: CollectionConfig = {
  slug: 'hero',
  admin: { useAsTitle: 'titleLine1', description: 'Hero section — top of the homepage.' },
  fields: [
    { name: 'eyebrow',        type: 'text', required: true, label: 'Eyebrow label', defaultValue: "South Australia's Premium Wholesaler" },
    { name: 'titleLine1',     type: 'text', required: true, label: 'Heading line 1', defaultValue: 'Premium Wholesale' },
    { name: 'titleLine2',     type: 'text', required: true, label: 'Heading line 2 (green italic)', defaultValue: 'Fresh Produce' },
    { name: 'subParagraph',   type: 'textarea', required: true, label: 'Sub-paragraph', defaultValue: 'Delivering the finest local and specialty produce to chefs, restaurants, caterers, and corporate kitchens across South Australia.' },
    { name: 'ctaPrimaryLabel', type: 'text', label: 'Primary button label', defaultValue: 'View Our Produce' },
    { name: 'ctaOutlineLabel', type: 'text', label: 'Secondary button label', defaultValue: 'Enquire Now' },
  ],
}
