import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'

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
    update: editors, // Only editors and admins can update
    delete: editors, // Only editors and admins can delete
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the donor',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the donor',
      },
    },
    {
      name: 'donationAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Donation amount in dollars',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Credit Card',
          value: 'credit-card',
        },
        {
          label: 'PayPal',
          value: 'paypal',
        },
        {
          label: 'Bank Transfer',
          value: 'bank-transfer',
        },
        {
          label: 'Check',
          value: 'check',
        },
        {
          label: 'Cash',
          value: 'cash',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'Preferred payment method',
      },
    },
    {
      name: 'howDidYouHearAboutUs',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Social Media',
          value: 'social-media',
        },
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'Friend/Family',
          value: 'friend-family',
        },
        {
          label: 'Search Engine',
          value: 'search-engine',
        },
        {
          label: 'Advertisement',
          value: 'advertisement',
        },
        {
          label: 'Event',
          value: 'event',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'How did you hear about our cause?',
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
      },
    },
    {
      name: 'transactionId',
      type: 'text',
      admin: {
        description: 'Payment transaction ID (if applicable)',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this donation',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
  ],
  timestamps: true,
}
