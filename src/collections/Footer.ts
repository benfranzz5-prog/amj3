import type { CollectionConfig } from 'payload'

export const Footer: CollectionConfig = {
  slug: 'footer',
  admin: { useAsTitle: 'companyName', description: 'Footer content.' },
  fields: [
    { name: 'companyName',         type: 'text', defaultValue: 'AMJ Produce Co.' },
    { name: 'companySubtitle',     type: 'text', defaultValue: 'Fruit & Vegetable Wholesalers' },
    { name: 'addressStreet',       type: 'text', defaultValue: '13 Burma Road, Pooraka SA 5095' },
    { name: 'phone',               type: 'text', defaultValue: '(08) 8349 5222' },
    { name: 'fax',                 type: 'text', defaultValue: '(08) 8349 4390' },
    { name: 'email',               type: 'email', defaultValue: 'admin@amjproduce.com.au' },
    { name: 'commitmentParagraph', type: 'textarea', defaultValue: 'AMJ Produce Co. aim to be South Australia\'s wholesale distributor of choice for fresh fruits and vegetables.' },
    {
      name: 'certItems',
      type: 'array',
      label: 'Certification / Award items',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'designerLabel', type: 'text', defaultValue: 'Shift Web Designs' },
    { name: 'designerUrl',   type: 'text', defaultValue: 'https://shiftwebdesigns.com' },
  ],
}
