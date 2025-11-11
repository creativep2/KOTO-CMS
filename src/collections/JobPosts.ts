import type { CollectionConfig } from 'payload'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { populateYouTubeEmbeds } from '../hooks/populateYouTubeEmbeds'
import { slugField } from '../fields/slug'

export const JobPosts: CollectionConfig = {
  slug: 'job-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'status', 'publishedAt', 'updatedAt'],
    group: 'Content Management',
    description: 'Job postings and career opportunities',
  },
  access: {
    read: () => true, // Public read access for frontend
    create: ({ req: { user } }) => {
      // Only authenticated users can create
      return Boolean(user)
    },
    update: ({ req: { user } }) => {
      // Only authenticated users can update
      return Boolean(user)
    },
    delete: ({ req: { user } }) => {
      // Only authenticated users can delete
      return Boolean(user)
    },
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterRead: [populateYouTubeEmbeds],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title',
      },
      localized: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Job location (e.g., "Remote", "New York, NY", "London, UK")',
      },
      localized: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief summary for job listing display',
        rows: 3,
      },
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed job description with rich content (requirements, benefits, etc.)',
      },
      localized: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date when the job post was published to the public',
        date: {
          pickerAppearance: 'dayAndTime',
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
      ],
      admin: {
        position: 'sidebar',
        description: 'Current status of the job post',
      },
    },

    {
      name: 'header_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Header image for the job post',
      },
    },
    ...slugField('title', {
      slugOverrides: {
        unique: true,
        admin: {
          description:
            'URL-friendly version of the job title. Auto-generated from title but can be edited manually.',
        },
      },
    }),
  ],
  timestamps: true,
}
