import type { GlobalConfig } from 'payload'

export const AboutGlobal: GlobalConfig = {
  slug: 'about',
  label: 'About Section',
  admin: { description: 'About AMJ section content, awards, and pillars.' },
  fields: [
    { name: 'sectionLabel',   type: 'text',     defaultValue: 'About Us' },
    { name: 'heading',        type: 'text',     defaultValue: "South Australia's Trusted Fresh Produce Partner" },
    { name: 'leadParagraph',  type: 'textarea', defaultValue: 'AMJ Produce Co, led by Chris and Margy Abbot, is a premium wholesale fresh produce supplier based in Pooraka, South Australia. We\'re dedicated to delivering the freshest, highest-quality produce to the region\'s finest kitchens.' },
    { name: 'body1',          type: 'textarea', defaultValue: 'AMJ Produce is an Award winning, well-established wholesale produce vendor and a strong supporter of South Australian Agriculture. Fresh fruits and vegetables are at the heart of healthy eating.' },
    { name: 'body2',          type: 'textarea', defaultValue: 'The driving force behind AMJ Produce is a proactive commitment to deliver fresh produce to the doorstep of our customers when they need them.' },
    { name: 'body3',          type: 'textarea', defaultValue: 'Our strong relationships with local growers and trusted importers mean we can consistently source what chefs and caterers need — from everyday staples to rare, hard-to-find specialty ingredients and exquisite edible flowers.' },
    {
      name: 'awards',
      type: 'array',
      label: 'Certification / Awards',
      fields: [{ name: 'text', type: 'text', required: true }],
      defaultValue: [
        { text: 'HACCP Certification #FSAU06/5769' },
        { text: "2010 Winner 'The Premiers Food Award' for service to the Industry" },
        { text: "2009 / 2011 / 2012 / 2014 / 2015 Finalist 'Restaurant & Catering Supplier of the year'" },
      ],
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Get in Touch' },
    {
      name: 'pillars',
      type: 'array',
      label: 'Pillars',
      fields: [
        { name: 'title',       type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
      defaultValue: [
        { title: 'Quality Products', description: 'Only the finest produce, carefully selected and quality-checked before delivery.' },
        { title: 'Fast Service',     description: "Reliable delivery schedules built around your kitchen's needs and timing." },
        { title: 'Fair Pricing',     description: 'Transparent, competitive wholesale pricing with no hidden fees or surprises.' },
        { title: 'SA Grown',         description: 'Championing South Australian growers and local seasonal produce first.' },
      ],
    },
  ],
}
