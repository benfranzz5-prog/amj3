import type { GlobalConfig } from 'payload'

export const EnvironmentGlobal: GlobalConfig = {
  slug: 'environment',
  label: 'Environment / Sustainability Section',
  admin: { description: 'Environmental commitment section content, stats, and policy links.' },
  fields: [
    { name: 'sectionLabel',    type: 'text',     defaultValue: 'Sustainability Matters' },
    { name: 'heading',         type: 'text',     defaultValue: 'Our Environmental Commitment' },
    { name: 'introParagraph',  type: 'textarea', defaultValue: "We're committed to minimising our ecological footprint while supporting the local produce industry. Our warehouse incorporates sustainable practices from energy efficiency to waste management." },
    {
      name: 'cards',
      type: 'array',
      label: 'Environment Cards',
      fields: [
        { name: 'title', type: 'text',     required: true },
        { name: 'body',  type: 'textarea' },
      ],
      defaultValue: [
        { title: 'Water Supply',       body: '100% fully self-sufficient water supply – 2 x 22,000 Ltr capacity water tanks have been operational since 2008.' },
        { title: 'Waste & Recycling',  body: 'All green off cuts & shrinkage is collected by a farmer in the Adelaide Hills for stock feed. We recycle all cardboard & plastic — clients are encouraged to retain boxes which are collected by AMJ Produce to recycle/reuse for packing purposes.' },
        { title: 'Energy Efficiency',  body: 'Engaged the services of an energy consultant to manage lighting efficiency within the warehouse — including installation of skylights for natural lighting, energy efficient lights, and an employee policy for turning off lights when not in use.' },
        { title: 'Local Sourcing',     body: '80% of produce comes within a 50km radius of the warehouse — supporting the local economy and reducing fleet mileage, subsequently reducing carbon emissions.' },
        { title: 'Fleet Management',   body: 'A mechanic is on 24-hour call responsible for maintenance of all company vehicles, ensuring employee and customer safety while guaranteeing optimal efficiency which reduces pollution/emissions.' },
        { title: 'HACCP & Clean Practices', body: 'HACCP accredited wholesalers must use HACCP accredited growers who supply spray sheets to obtain accreditation. We use biodegradable chemicals for cleaning and sustainable wooden pallets in storage areas.' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      fields: [
        { name: 'number', type: 'text', required: true },
        { name: 'label',  type: 'text', required: true },
      ],
      defaultValue: [
        { number: '80%',  label: 'Produce within 50km' },
        { number: '100%', label: 'Self-Sufficient Water Supply' },
        { number: '2008', label: 'Sustainable Warehouse Built' },
      ],
    },
    {
      name: 'policyDocs',
      type: 'array',
      label: 'Policy / Certificate Downloads',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url',   type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Environmental Policy 2012', url: '#' },
        { label: 'Environmental Certificate', url: '#' },
        { label: 'HACCP Certificate',         url: '#' },
      ],
    },
  ],
}
