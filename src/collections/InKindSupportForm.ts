import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'

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
        description: 'Full name of the person offering in-kind support',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the person offering in-kind support',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number for contact',
      },
    },
    {
      name: 'deliveryPreference',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Delivery',
          value: 'delivery',
        },
        {
          label: 'Pickup',
          value: 'pickup',
        },
        {
          label: 'Either',
          value: 'either',
        },
      ],
      admin: {
        description: 'Preferred delivery or pickup method',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Details about the in-kind support being offered',
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
      },
    },
    {
      name: 'itemType',
      type: 'text',
      admin: {
        description: 'Type of item or service being offered',
      },
    },
    {
      name: 'estimatedValue',
      type: 'number',
      min: 0,
      admin: {
        description: 'Estimated value of the in-kind donation (if applicable)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this in-kind support request',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
  ],
  timestamps: true,
}
