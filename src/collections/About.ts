import type { CollectionConfig } from 'payload'

export const About: CollectionConfig = {
  slug: 'about',
  admin: { useAsTitle: 'heading', description: 'About AMJ section content.' },
  fields: [
    { name: 'sectionLabel',  type: 'text', defaultValue: 'About Us' },
    { name: 'heading',       type: 'text', required: true, defaultValue: "South Australia's Trusted Fresh Produce Partner" },
    { name: 'leadParagraph', type: 'textarea', required: true, defaultValue: 'AMJ Produce Co, led by Chris and Margy Abbot, is a premium wholesale fresh produce supplier based in Pooraka, South Australia.' },
    { name: 'body1',         type: 'textarea', label: 'Body paragraph 1', defaultValue: 'AMJ Produce is an Award winning, well-established wholesale produce vendor and a strong supporter of South Australian Agriculture.' },
    { name: 'body2',         type: 'textarea', label: 'Body paragraph 2', defaultValue: 'The driving force behind AMJ Produce is a proactive commitment to deliver fresh produce to the doorstep of our customers when they need them.' },
    { name: 'body3',         type: 'textarea', label: 'Body paragraph 3', defaultValue: 'Our strong relationships with local growers and trusted importers mean we can consistently source what chefs and caterers need.' },
    {
      name: 'awards',
      type: 'array',
      label: 'Certifications / Awards',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'pillars',
      type: 'array',
      label: 'Value pillars',
      fields: [
        { name: 'title',       type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
