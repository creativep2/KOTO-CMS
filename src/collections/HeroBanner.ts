import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'

export const HeroBanner: CollectionConfig = {
  slug: 'hero-banners',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tagline', 'status', 'createdAt', 'updatedAt'],
    group: 'Content Management',
    description: 'Hero banner content for website homepage and landing pages',
  },
  access: {
    read: () => true, // Public read access for frontend
    create: authors, // Authors and above can create
    update: ({ req: { user }, id: _id }) => {
      // Admins and editors can update any hero banner
      if (user?.role === 'admin' || user?.role === 'editor') return true

      // Authors can only update hero banners they created
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of the hero banner',
      },
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'A short tagline or subtitle for the hero banner',
      },
      localized: true,
    },
    {
      name: 'taglineColor',
      type: 'select',
      options: [
        {
          label: 'Blue',
          value: 'color-blue',
        },
        {
          label: 'Red',
          value: 'color-red',
        },
        {
          label: 'Green',
          value: 'color-green',
        },
        {
          label: 'Yellow',
          value: 'color-yellow',
        },
        {
          label: 'Orange',
          value: 'color-orange',
        },
      ],
      admin: {
        description: 'Color for the tagline text',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 255,
      admin: {
        description: 'Detailed description or content for the hero banner',
      },
      localized: true,
    },
    {
      name: 'button',
      type: 'text',
      maxLength: 50,
      admin: {
        description: 'Button text (e.g., Apply, Register, Learn More)',
      },
      localized: true,
    },
    {
      name: 'buttonColor',
      type: 'select',
      options: [
        {
          label: 'Blue',
          value: 'color-blue',
        },
        {
          label: 'Red',
          value: 'color-red',
        },
        {
          label: 'Green',
          value: 'color-green',
        },
        {
          label: 'Yellow',
          value: 'color-yellow',
        },
        {
          label: 'Orange',
          value: 'color-orange',
        },
      ],
      admin: {
        description: 'Color for the button',
      },
    },
    {
      name: 'buttonLink',
      type: 'text',
      admin: {
        description: 'URL for the button link',
      },
      validate: (val: unknown) => {
        if (typeof val === 'string' && val && !/^https?:\/\/.+/.test(val)) {
          return 'Please enter a valid URL starting with http:// or https://'
        }
        return true
      },
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hero banner background image',
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
        {
          label: 'Draft',
          value: 'draft',
        },
      ],
      admin: {
        description: 'Hero banner status',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'User who created this hero banner',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this hero banner prominently',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
  timestamps: true,
}
