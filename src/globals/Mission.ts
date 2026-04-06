import type { GlobalConfig } from 'payload'

export const MissionGlobal: GlobalConfig = {
  slug: 'mission',
  label: 'Mission & Vision Section',
  admin: { description: 'Mission, vision and guiding principles section.' },
  fields: [
    { name: 'missionHeading',  type: 'text',     defaultValue: 'What We Do Every Day' },
    { name: 'missionIntro',    type: 'textarea', defaultValue: 'AMJ Produce is committed to delivering the highest quality wholesale fresh produce to our customers. We achieve this through:' },
    {
      name: 'missionListItems',
      type: 'array',
      label: 'Mission List Items',
      fields: [{ name: 'text', type: 'text', required: true }],
      defaultValue: [
        { text: 'Sourcing the freshest, highest quality produce available' },
        { text: 'Building strong, lasting relationships with reputable local growers and trusted importers' },
        { text: 'Providing exceptional, personalised customer service' },
        { text: 'Offering competitive pricing through efficient operations' },
        { text: 'Maintaining strict quality control from farm to delivery' },
        { text: 'Continuously expanding our range to meet the evolving needs of our customers' },
        { text: 'Supporting and promoting South Australian produce' },
      ],
    },
    { name: 'visionHeading',   type: 'text',     defaultValue: "Where We're Headed" },
    { name: 'visionBody',      type: 'textarea', defaultValue: "To be South Australia's most trusted and preferred wholesale fresh produce supplier, renowned for uncompromising quality, reliability, and our deep commitment to supporting local growers and sustainable practices." },
    {
      name: 'guidingPrinciples',
      type: 'array',
      label: 'Guiding Principles',
      fields: [{ name: 'label', type: 'text', required: true }],
      defaultValue: [
        { label: 'Quality First' },
        { label: 'Local Pride' },
        { label: 'Integrity' },
        { label: 'Partnership' },
        { label: 'Sustainability' },
        { label: 'Innovation' },
        { label: 'Reliability' },
        { label: 'Excellence' },
      ],
    },
  ],
}
