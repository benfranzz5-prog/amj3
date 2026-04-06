import type { GlobalConfig } from 'payload'

export const DeliveryGlobal: GlobalConfig = {
  slug: 'delivery',
  label: 'Delivery / Logistics Section',
  admin: { description: 'Logistics and delivery section content.' },
  fields: [
    { name: 'sectionLabel',   type: 'text',     defaultValue: 'Logistics' },
    { name: 'heading',        type: 'text',     defaultValue: 'From Our Hands to Your Kitchen' },
    { name: 'leadParagraph',  type: 'textarea', defaultValue: 'We understand that timing is everything in a professional kitchen. AMJ Produce is committed to reliable, early-morning delivery so your team has what they need before service begins.' },
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Bullet Points',
      fields: [{ name: 'text', type: 'text', required: true }],
      defaultValue: [
        { text: 'Early-morning dispatch — delivered before your kitchen opens' },
        { text: 'Temperature-controlled vehicles maintaining peak freshness' },
        { text: 'Consistent, scheduled runs across metropolitan Adelaide' },
        { text: 'Direct contact with our team for last-minute orders and substitutions' },
        { text: 'Carefully packed to protect delicate specialty and edible flower items' },
      ],
    },
  ],
}
