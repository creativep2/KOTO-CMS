import type { CollectionConfig } from 'payload'

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
    read: ({ req: { user } }) => {
      // Allow editors, authors, and admins to read
      return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'author'
    },
    create: () => true, // Public can submit forms
    update: ({ req: { user } }) => {
      // Allow editors, authors, and admins to update (but hook will restrict what they can edit)
      return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'author'
    },
    delete: ({ req: { user } }) => {
      // Only editors and admins can delete
      return user?.role === 'admin' || user?.role === 'editor'
    },
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
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      admin: {
        description: 'Email address of the person submitting the form',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        description: 'Message content from the contact form',
        readOnly: true, // Read-only for all users - only admin can edit via hook
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
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
  ],
  timestamps: true,
}
