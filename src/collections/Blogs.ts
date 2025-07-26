import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { blogsLexical } from '../fields/blogsLexical'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status', 'publishedAt', 'updatedAt'],
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
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Check if this is a request that wants populated YouTube embeds
        const shouldPopulate =
          req.query?.populate === 'true' ||
          req.query?.depth === '1' ||
          req.query?.depth === 1 ||
          // Only populate for API calls that specifically request it
          req.headers.get('accept')?.includes('application/json')

        if (!shouldPopulate) {
          return doc // Don't populate by default
        }

        // Auto-populate YouTube embeds in rich text
        if (doc.paragraph?.root?.children) {
          const updatedChildren = await Promise.all(
            doc.paragraph.root.children.map(async (child: any) => {
              if (child.type === 'relationship' && child.relationTo === 'youtube-embeds') {
                if (typeof child.value === 'number' || typeof child.value === 'string') {
                  try {
                    // Fetch the YouTube embed data
                    const youtubeEmbed = await req.payload.findByID({
                      collection: 'youtube-embeds',
                      id: child.value,
                    })
                    child.value = youtubeEmbed
                  } catch (error) {
                    console.error('Failed to populate YouTube embed:', error)
                  }
                }
              }
              return child
            }),
          )
          doc.paragraph.root.children = updatedChildren
        }
        return doc
      },
    ],
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
          label: 'Taste the story',
          value: 'taste-the-story',
        },
        {
          label: "Jimmy's letters",
          value: 'jimmys-letters',
        },
        {
          label: "Jimmy's bio",
          value: 'jimmys-bio',
        },
        {
          label: 'Behind the bar',
          value: 'behind-the-bar',
        },
        {
          label: 'Her turn',
          value: 'her-turn',
        },
        {
          label: 'KOTO Foundation',
          value: 'koto-foundation',
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
      editor: blogsLexical,
      required: true,
      admin: {
        description:
          'The main content of the blog post. Use the + button to add images and the relationship button to insert YouTube videos at any position.',
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date when the blog post was published to the public',
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
