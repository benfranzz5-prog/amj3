import type { GlobalConfig } from 'payload'

export const CommitmentGlobal: GlobalConfig = {
  slug: 'commitment',
  label: 'Commitment Section',
  admin: { description: 'Our commitment to customers section.' },
  fields: [
    { name: 'heading', type: 'text',     defaultValue: 'Our Commitment to You' },
    { name: 'body1',   type: 'textarea', defaultValue: "We understand that in a professional kitchen, quality and consistency aren't optional — they're everything. That's why every order from AMJ Produce comes with our personal commitment to freshness, accuracy, and service excellence." },
    { name: 'body2',   type: 'textarea', defaultValue: "Whether you're a head chef at a fine-dining restaurant, a catering manager for a major event, or a corporate kitchen buyer, we treat every customer with the same dedication and care." },
    {
      name: 'valuePills',
      type: 'array',
      label: 'Value Pills',
      fields: [{ name: 'label', type: 'text', required: true }],
      defaultValue: [
        { label: 'Freshness Guaranteed' },
        { label: 'Accurate Orders, Every Time' },
        { label: 'Responsive Communication' },
        { label: 'Consistent Quality' },
        { label: 'Tailored to Your Needs' },
        { label: 'Seasonal Guidance' },
      ],
    },
  ],
}
