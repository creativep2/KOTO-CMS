import type { CollectionConfig } from 'payload'

import { restrictFieldUpdates } from '../hooks/formFieldAccess'

export const InKindSupportForm: CollectionConfig = {
  slug: 'in-kind-support-forms',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: [
      'fullName',
      'email',
      'phoneNumber',
      'deliveryPreference',
      'status',
      'createdAt',
    ],
    group: 'Forms & Submissions',
    description: 'In-kind support and donation offers',
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
        description: 'Full name of the person offering in-kind support',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      admin: {
        description: 'Email address of the person offering in-kind support',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number for contact',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'deliveryPreference',
      type: 'text',
      required: true,
      admin: {
        description: 'Preferred delivery or pickup method',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        description: 'Details about the in-kind support being offered',
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
          label: 'Contacted',
          value: 'contacted',
        },
        {
          label: 'Arranged',
          value: 'arranged',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Declined',
          value: 'declined',
        },
      ],
      admin: {
        description: 'Status of the in-kind support request',
        // Status field is editable by all authenticated users
      },
    },
    {
      name: 'itemType',
      type: 'text',
      admin: {
        description: 'Type of item or service being offered',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'estimatedValue',
      type: 'text',
      admin: {
        description: 'Estimated value of the in-kind donation (if applicable)',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes about this in-kind support request',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
  ],
  timestamps: true,
}
