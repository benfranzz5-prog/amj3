import type { CollectionConfig } from 'payload'

export const Contact: CollectionConfig = {
  slug: 'contact',
  admin: { useAsTitle: 'heading', description: 'Contact section content.' },
  fields: [
    { name: 'sectionLabel',   type: 'text', defaultValue: 'Get in Touch' },
    { name: 'heading',        type: 'text', required: true, defaultValue: 'Contact AMJ Produce' },
    { name: 'subParagraph',   type: 'textarea' },
    { name: 'contactPersons', type: 'text', label: 'Contact persons', defaultValue: 'Chris & Margy Abbot' },
    { name: 'addressStreet',  type: 'text', defaultValue: '13 Burma Road' },
    { name: 'addressCity',    type: 'text', defaultValue: 'Pooraka SA 5095' },
    { name: 'addressGPO',     type: 'text', defaultValue: 'GPO Box 310, Adelaide SA 5000' },
    { name: 'phone',          type: 'text', defaultValue: '(08) 8349 5222' },
    { name: 'fax',            type: 'text', defaultValue: '(08) 8349 4390' },
    { name: 'email',          type: 'email', defaultValue: 'admin@amjproduce.com.au' },
    { name: 'formNote',       type: 'text', defaultValue: 'We typically respond within one business day.' },
  ],
}
