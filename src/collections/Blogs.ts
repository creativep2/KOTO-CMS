import type { CollectionConfig } from 'payload'

import { editors } from '../access/editors'
import { authors } from '../access/authors'
import { blogsEditor } from '../access/blogsEditor'
import { blogsLexical } from '../fields/blogsLexical'
import { populateYouTubeEmbeds } from '../hooks/populateYouTubeEmbeds'
import { slugField } from '../fields/slug'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status', 'publishedAt', 'updatedAt'],
    group: 'Content Management',
    description: 'Blog posts and articles for the website',
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
      // Admins, editors, and blogs-editors can update any blog
      if (user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor') return true

      // Authors can only update their own blogs
      if (user?.role === 'author') {
        return {
          author: { equals: user.id },
        }
      }

      return false
    },
    delete: blogsEditor, // Only editors, admins, and blogs-editors can delete
  },
  hooks: {
    afterRead: [populateYouTubeEmbeds],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the blog post',
      },
      localized: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'Author of the blog post',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor',
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
          // Only editors, admins, and blogs-editors can change status to published
          return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor'
        },
      },
    },
    {
      name: 'header_image',
      type: 'upload',
      relationTo: 'media',
      //required: true,
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
      localized: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      admin: {
        description: 'Add a gallery of images to display with the blog post',
      },
      fields: [
        {
          name: 'images',
          type: 'array',
          label: 'Gallery Images',
          minRows: 1,
          maxRows: 20,
          labels: {
            singular: 'Image',
            plural: 'Images',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Select an image for the gallery',
              },
            },
            {
              name: 'caption',
              type: 'text',
              admin: {
                description: 'Optional caption for this image',
              },
            },
            {
              name: 'alt',
              type: 'text',
              admin: {
                description: 'Alt text for accessibility',
              },
            },
          ],
          admin: {
            description: 'Gallery images with captions and alt text',
          },
        },
        {
          name: 'layout',
          type: 'select',
          label: 'Gallery Layout',
          defaultValue: 'grid',
          options: [
            {
              label: 'Grid',
              value: 'grid',
            },
            {
              label: 'Masonry',
              value: 'masonry',
            },
            {
              label: 'Carousel',
              value: 'carousel',
            },
          ],
          admin: {
            description: 'Choose how the gallery images should be displayed',
          },
        },
        {
          name: 'columns',
          type: 'select',
          label: 'Number of Columns',
          defaultValue: '3',
          options: [
            {
              label: '2 Columns',
              value: '2',
            },
            {
              label: '3 Columns',
              value: '3',
            },
            {
              label: '4 Columns',
              value: '4',
            },
            {
              label: '5 Columns',
              value: '5',
            },
          ],
          admin: {
            description: 'Number of columns for grid layout',
            condition: (data: any) => data?.layout === 'grid',
          },
        },
        {
          name: 'showCaptions',
          type: 'checkbox',
          label: 'Show Image Captions',
          defaultValue: true,
          admin: {
            description: 'Display captions below images',
          },
        },
        {
          name: 'enableLightbox',
          type: 'checkbox',
          label: 'Enable Lightbox',
          defaultValue: true,
          admin: {
            description: 'Allow clicking images to view in lightbox',
          },
        },
      ],
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
    ...slugField('title', {
      slugOverrides: {
        unique: true,
        admin: {
          description:
            'URL-friendly version of the title. Auto-generated from title but can be edited manually.',
        },
      },
    }),
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
      name: 'meta_title',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Meta title for SEO purposes',
      },
      localized: true,
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
