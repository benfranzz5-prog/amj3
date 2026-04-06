import type { GlobalConfig } from 'payload'

export const ContactGlobal: GlobalConfig = {
  slug: 'contact',
  label: 'Contact Section',
  admin: { description: 'Contact section content and business details.' },
  fields: [
    { name: 'sectionLabel',   type: 'text',     defaultValue: 'Get in Touch' },
    { name: 'heading',        type: 'text',     defaultValue: 'Start Your Order Today' },
    { name: 'subParagraph',   type: 'textarea', defaultValue: "Ready to experience premium wholesale produce? Reach out to the AMJ Produce team and we'll take care of the rest." },
    { name: 'contactPersons', type: 'text',     defaultValue: 'Chris & Margy Abbot' },
    { name: 'addressStreet',  type: 'text',     defaultValue: '13 Burma Road, Pooraka SA 5095' },
    { name: 'addressCity',    type: 'text',     defaultValue: 'Pooraka, South Australia' },
    { name: 'addressGPO',     type: 'text',     defaultValue: 'GPO Box 310, Adelaide SA 5000' },
    { name: 'phone',          type: 'text',     defaultValue: '(08) 8349 5222' },
    { name: 'fax',            type: 'text',     defaultValue: '(08) 8349 4390' },
    { name: 'email',          type: 'email',    defaultValue: 'admin@amjproduce.com.au' },
    { name: 'formNote',       type: 'text',     defaultValue: 'We typically respond within one business day.' },
  ],
}
