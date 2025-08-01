import type { CollectionConfig } from 'payload'

import { restrictFieldUpdates } from '../hooks/formFieldAccess'

export const DonationForm: CollectionConfig = {
  slug: 'donation-forms',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'donationAmount', 'paymentMethod', 'status', 'createdAt'],
    group: 'Forms & Submissions',
    description: 'Donation form submissions and payment tracking',
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
        description: 'Full name of the donor',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      admin: {
        description: 'Email address of the donor',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'donationAmount',
      type: 'text',
      required: true,
      admin: {
        description: 'Donation amount in dollars',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: true,
      admin: {
        description: 'Preferred payment method',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'howDidYouHearAboutUs',
      type: 'text',
      required: true,
      admin: {
        description: 'How did you hear about our cause?',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Status of the donation',
        // Status field is editable by all authenticated users
      },
    },
    {
      name: 'transactionId',
      type: 'text',
      admin: {
        description: 'Payment transaction ID (if applicable)',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes about this donation',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true, // Read-only for all users - only admin can edit via hook
      },
    },
  ],
  timestamps: true,
}
