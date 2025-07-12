import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'upload_date', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access for frontend
    create: authors, // Authors and above can create
    update: ({ req: { user }, id: _id }) => {
      // Admins and editors can update any blog
      if (user?.role === 'admin' || user?.role === 'editor') return true

      // Authors can only update their own blogs
      if (user?.role === 'author') {
        return {
          author: { equals: user.id },
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
        description: 'The title of the blog post',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'Author of the blog post',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Technology',
          value: 'technology',
        },
        {
          label: 'Design',
          value: 'design',
        },
        {
          label: 'Business',
          value: 'business',
        },
        {
          label: 'Lifestyle',
          value: 'lifestyle',
        },
        {
          label: 'Travel',
          value: 'travel',
        },
        {
          label: 'Food',
          value: 'food',
        },
        {
          label: 'Health',
          value: 'health',
        },
        {
          label: 'Education',
          value: 'education',
        },
        {
          label: 'Entertainment',
          value: 'entertainment',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'Select the category for this blog post',
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
          label: 'In Review',
          value: 'review',
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
        description: 'Publication status of the blog post',
      },
      access: {
        update: ({ req: { user } }) => {
          // Only editors and admins can change status to published
          return user?.role === 'admin' || user?.role === 'editor'
        },
      },
    },
    {
      name: 'header_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Header image for the blog post',
      },
    },
    {
      name: 'paragraph',
      type: 'richText',
      required: true,
      admin: {
        description: 'The main content of the blog post',
      },
    },
    {
      name: 'upload_date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Date when the blog post was uploaded',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the title',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.title && !value) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'meta_description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Brief description for SEO purposes',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark this blog post as featured',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Tags for categorizing and searching',
      },
    },
  ],
  timestamps: true,
}
