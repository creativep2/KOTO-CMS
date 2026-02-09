import type { CollectionConfig } from 'payload'

import { admins } from '../access/admins'
import { authors } from '../access/authors'
import { slugField } from '../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'createdAt', 'updatedAt'],
    group: 'Content Management',
    description: 'Pages with flexible JSON content structure supporting localization',
  },
  access: {
    read: () => true, // Public read access for frontend
    create: admins, // Authors and above can create
    update: ({ req: { user }, id: _id }) => {
      // Admins and editors can update any page
      if (user?.role === 'admin' || user?.role === 'editor') return true

      // Authors can only update pages they created
      if (user?.role === 'author') {
        return {
          createdBy: { equals: user.id },
        }
      }

      return false
    },
    delete: admins, // Only editors and admins can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the page',
      },
      localized: true,
    },
    {
      name: 'content',
      type: 'json',
      required: false,
      admin: {
        description: 'Flexible JSON content structure with localization support. Structure: { "en": any data, "vi": any data }',
        components: {
          Field: {
            path: '@/components/JSONEditor/index#JSONEditor',
          },
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Page status',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'User who created this page',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
    ...slugField('title', {
      slugOverrides: {
        unique: true,
        admin: {
          description:
            'URL-friendly version of the page title. Auto-generated from title but can be edited manually.',
        },
      },
    }),
  ],
  timestamps: true,
}
