import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { slugField } from '../fields/slug'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'createdAt', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access for frontend
    create: authors, // Authors and above can create
    update: ({ req: { user }, id: _id }) => {
      // Admins and editors can update any partner
      if (user?.role === 'admin' || user?.role === 'editor') return true

      // Authors can only update partners they created
      if (user?.role === 'author') {
        return {
          createdBy: { equals: user.id },
        }
      }

      return false
    },
    delete: editors, // Only editors and admins can delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the partner organization',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Partner logo image',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Partner website URL (optional)',
      },
      validate: (val: unknown) => {
        if (typeof val === 'string' && val && !/^https?:\/\/.+/.test(val)) {
          return 'Please enter a valid URL starting with http:// or https://'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the partner (optional)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      admin: {
        description: 'Partner status',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'User who created this partner entry',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this partner on the website',
      },
    },
    ...slugField('name', {
      slugOverrides: {
        unique: true,
        admin: {
          description:
            'URL-friendly version of the partner name. Auto-generated from name but can be edited manually.',
        },
      },
    }),
  ],
  timestamps: true,
}
