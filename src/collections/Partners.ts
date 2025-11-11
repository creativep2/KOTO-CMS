import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { blogsEditor } from '../access/blogsEditor'
import { slugField } from '../fields/slug'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'createdAt', 'updatedAt'],
    group: 'Business & Partnerships',
    description: 'Partner organizations and collaborations',
  },
  access: {
    read: ({ req: { user } }) => {
      // Public read access for frontend API, but restrict admin UI access
      if (!user) return true // Public API access
      // Only admins, editors, and blogs-editors can see in admin UI
      return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor' || user?.role === 'author'
    },
    create: authors, // Authors and above can create
    update: ({ req: { user }, id: _id }) => {
      // Admins, editors, and blogs-editors can update any partner
      if (user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor') return true

      // Authors can only update partners they created
      if (user?.role === 'author') {
        return {
          createdBy: { equals: user.id },
        }
      }

      return false
    },
    delete: blogsEditor, // Only editors, admins, and blogs-editors can delete
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Strategic Partners',
          value: 'strategic',
        },
        {
          label: 'Key Partners',
          value: 'key',
        },
        {
          label: 'Education Partners',
          value: 'education',
        },
        {
          label: 'Tourism and Hospitality Partners',
          value: 'tourism-hospitality',
        },
      ],
      admin: {
        description: 'Category of the partner organization',
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
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor',
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
