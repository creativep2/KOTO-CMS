import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { admins } from '../access/admins'
import { formUpdateAccess } from '../access/formUpdateAccess'
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
        description: 'Full name of the donor',
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      admin: {
        description: 'Email address of the donor',
        readOnly: true,
      },
    },
    {
      name: 'donationAmount',
      type: 'text',
      required: true,
      admin: {
        description: 'Donation amount in dollars',
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: true,
      admin: {
        description: 'Preferred payment method',
        readOnly: true,
      },
    },
    {
      name: 'howDidYouHearAboutUs',
      type: 'text',
      required: true,
      admin: {
        description: 'How did you hear about our cause?',
        readOnly: true,
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
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'text',
      admin: {
        description: 'Internal notes about this donation',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
