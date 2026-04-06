import type { CollectionConfig } from 'payload'

export const Mission: CollectionConfig = {
  slug: 'mission',
  admin: { useAsTitle: 'missionHeading', description: 'Mission & Vision section.' },
  fields: [
    { name: 'missionHeading',    type: 'text', defaultValue: 'What We Do Every Day' },
    { name: 'missionIntro',      type: 'textarea', defaultValue: 'AMJ Produce is committed to delivering the highest quality wholesale fresh produce to our customers.' },
    { name: 'missionListItems',  type: 'array', label: 'Mission bullet points', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'visionHeading',     type: 'text', defaultValue: "Where We're Headed" },
    { name: 'visionBody',        type: 'textarea', defaultValue: "To be South Australia's most trusted and preferred wholesale fresh produce supplier." },
    { name: 'guidingPrinciples', type: 'array', label: 'Guiding principle pills', fields: [{ name: 'label', type: 'text', required: true }] },
  ],
}
