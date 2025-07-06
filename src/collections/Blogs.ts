import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'upload_date', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access for frontend
    create: ({ req: { user } }) => !!user, // Only logged-in users can create
    update: ({ req: { user } }) => !!user, // Only logged-in users can update
    delete: ({ req: { user } }) => !!user, // Only logged-in users can delete
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
  ],
  timestamps: true,
}
