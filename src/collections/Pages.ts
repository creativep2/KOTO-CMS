import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Content Management',
    description: 'Static pages with editable table content',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
    ...slugField('title', {
      slugOverrides: {
        admin: {
          description: 'URL-friendly version of the title. Auto-generated from title but can be edited manually.',
        },
      },
    }),
    {
      name: 'meta_title',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Meta title for SEO purposes',
      },
      localized: true,
    },
    {
      name: 'meta_description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Brief description for SEO purposes',
      },
      localized: true,
    },
    {
      name: 'meta_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Image for social media sharing',
      },
    },
    {
      name: 'status',
      type: 'select',
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
        description: 'Current status of the page',
      },
    },
    {
      name: 'content',
      type: 'group',
      admin: {
        description: 'Editable table content',
      },
      localized: true,
      fields: [
        {
          name: 'headers',
          type: 'array',
          admin: {
            description: 'Table column headers',
          },
          fields: [
            {
              name: 'header',
              type: 'text',
              admin: {
                description: 'Column header text',
              },
            },
          ],
        },
        {
          name: 'rows',
          type: 'array',
          admin: {
            description: 'Table data rows',
          },
          fields: [
            {
              name: 'row',
              type: 'text',
              admin: {
                description: 'Row data (pipe-separated values)',
              },
            },
          ],
        },
      ],
      defaultValue: {
        headers: [],
        rows: []
      },
    },
  ],
  timestamps: true,
} 