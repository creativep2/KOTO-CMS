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
        description: 'Editable table content with column grouping - can be imported from CSV or edited directly',
      },
      localized: true,
      fields: [
        {
          name: 'groups',
          type: 'array',
          admin: {
            description: 'Column groups for organizing table structure',
          },
          fields: [
            {
              name: 'group_id',
              type: 'text',
              admin: {
                description: 'Unique identifier for the group',
              },
              required: true,
            },
            {
              name: 'group_name',
              type: 'text',
              admin: {
                description: 'Display name for the group',
              },
              required: true,
            },
            {
              name: 'group_description',
              type: 'textarea',
              admin: {
                description: 'Optional description of the group',
              },
            },
          ],
          defaultValue: [
            {
              group_id: 'default',
              group_name: 'Default Group',
              group_description: 'Default column group'
            }
          ],
        },
        {
          name: 'headers',
          type: 'array',
          admin: {
            description: 'Table column headers with grouping',
          },
          fields: [
            {
              name: 'header',
              type: 'text',
              admin: {
                description: 'Column header text',
              },
              required: true,
            },
            {
              name: 'group_id',
              type: 'text',
              admin: {
                description: 'Group this column belongs to',
              },
              required: true,
              defaultValue: 'default',
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
              required: true,
            },
          ],
        },
      ],
      defaultValue: {
        groups: [
          {
            group_id: 'default',
            group_name: 'Default Group',
            group_description: 'Default column group'
          }
        ],
        headers: [],
        rows: []
      },
    },
  ],
  timestamps: true,
} 