import type { GlobalConfig } from 'payload'

export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { description: 'Footer content, contact details and certifications.' },
  fields: [
    { name: 'companyName',            type: 'text',     defaultValue: 'AMJ Produce Co.' },
    { name: 'companySubtitle',        type: 'text',     defaultValue: 'Fruit & Vegetable Wholesalers' },
    { name: 'addressStreet',          type: 'text',     defaultValue: '13 Burma Road, Pooraka SA 5095' },
    { name: 'phone',                  type: 'text',     defaultValue: '(08) 8349 5222' },
    { name: 'fax',                    type: 'text',     defaultValue: '(08) 8349 4390' },
    { name: 'email',                  type: 'email',    defaultValue: 'admin@amjproduce.com.au' },
    { name: 'commitmentParagraph',    type: 'textarea', defaultValue: "AMJ Produce Co. aim to be South Australia's wholesale distributor of choice for fresh fruits and vegetables. Driven by the Guiding Principles: 'Quality Products, Fast Service and Fair Pricing.' and in all our business relationships by the basic values of integrity, honesty, trustworthiness and excellence in customer service." },
    {
      name: 'certItems',
      type: 'array',
      label: 'Certification / Award Items',
      fields: [{ name: 'text', type: 'text', required: true }],
      defaultValue: [
        { text: 'HACCP Certification #FSAU06/5769' },
        { text: "2010 Winner 'The Premiers Food Award' for service to the Industry" },
        { text: "2009 / 2011 / 2012 / 2014 / 2015 Finalist 'Restaurant & Catering Supplier of the year'" },
      ],
    },
    { name: 'designerLabel', type: 'text', defaultValue: 'Website by Shift Web Designs' },
    { name: 'designerUrl',   type: 'text', defaultValue: 'https://shiftwebdesigns.com.au' },
  ],
}
