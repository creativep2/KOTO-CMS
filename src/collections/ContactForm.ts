import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { admins } from '../access/admins'
import { formUpdateAccess } from '../access/formUpdateAccess'
import { restrictFieldUpdates } from '../hooks/formFieldAccess'

export const ContactForm: CollectionConfig = {
  slug: 'contact-forms',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'status', 'createdAt'],
    group: 'Forms & Submissions',
    description: 'Contact form submissions from website visitors',
  },
  access: {
    read: editors, // Only editors and admins can read submissions
    create: () => true, // Public can submit forms
    update: formUpdateAccess, // All authenticated users can update (but only status field due to readOnly constraints)
    delete: editors, // Only editors and admins can delete
  },
  hooks: {
    beforeChange: [restrictFieldUpdates],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the person submitting the form',
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      admin: {
        description: 'Email address of the person submitting the form',
        readOnly: true,
      },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        description: 'Message content from the contact form',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Replied',
          value: 'replied',
        },
        {
          label: 'Closed',
          value: 'closed',
        },
      ],
      admin: {
        description: 'Status of the contact form submission',
        // Status field is editable by all authenticated users
      },
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes about this submission',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
