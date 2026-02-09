import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authors } from '../access/authors'
import { editors } from '../access/editors'
import { blogsEditor } from '../access/blogsEditor'
import { jobPostsEditor } from '../access/jobPostsEditor'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media & Assets',
    description: 'Images, videos, and other media files',
  },
  access: {
    create: ({ req: { user } }) => {
      return Boolean(
        user &&
        (
          user.role === 'admin' ||
          user.role === 'editor' ||
          user.role === 'blogs-editor' ||
          user.role === 'job-posts-editor' ||
          user.role === 'author'
        )
      )
    }, // Authors, blogs-editors, editors, and admins can create
    delete: ({ req: { user } }) => {
      // Only admins, editors, blogs-editors, and job-posts-editors can delete
      return Boolean(user && ['admin', 'editor', 'blogs-editor', 'job-posts-editor'].includes(user.role as string))
    },
    read: ({ req: { user } }) => {
      // Public read access for frontend API, but restrict admin UI access
      if (!user) return true // Public API access
      // Admins, editors, blogs-editors, job-posts-editors, and authors can see in admin UI
      return Boolean(user && ['admin', 'editor', 'blogs-editor', 'job-posts-editor', 'author'].includes(user.role as string))
    },
    update: ({ req: { user }, id: _id }) => {
      // Admins, editors, blogs-editors, and job-posts-editors can update any media
      if (user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor' || user?.role === 'job-posts-editor') return true

      // Authors can only update their own uploads
      if (user?.role === 'author') {
        return {
          uploadedBy: { equals: user.id },
        }
      }

      return false
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      admin: {
        description: 'Caption or description for the media',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        description: 'User who uploaded this media',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor' || user?.role === 'job-posts-editor',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Blog Images',
          value: 'blog-images',
        },
        {
          label: 'Profile Pictures',
          value: 'profiles',
        },
        {
          label: 'Marketing Assets',
          value: 'marketing',
        },
        {
          label: 'Documents',
          value: 'documents',
        },
        {
          label: 'Other',
          value: 'other',
        },
        {
          label: 'Hero Banner Images',
          value: 'hero-banners',
        },
      ],
      admin: {
        description: 'Category to help organize media files',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this media is publicly accessible',
        condition: (_, { user }) => user?.role === 'admin' || user?.role === 'editor' || user?.role === 'blogs-editor' || user?.role === 'job-posts-editor',
      },
    },
    // Preserve existing database columns to prevent data loss
    {
      name: 'folder',
      type: 'text',
      admin: {
        description: 'Folder path for organizing media files',
        condition: () => false, // Hide from admin but preserve in schema
      },
    },
    // Preserve folders_id relationship if it exists in the database
    {
      name: 'folders_id',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Parent folder relationship (preserved for compatibility)',
        condition: () => false, // Hide from admin but preserve in schema
      },
    },
    {
      name: 'metadata_photographer',
      type: 'text',
      admin: {
        description: 'Photographer metadata',
        condition: () => false,
      },
    },
    {
      name: 'metadata_copyright',
      type: 'text',
      admin: {
        description: 'Copyright metadata',
        condition: () => false,
      },
    },
    {
      name: 'metadata_license',
      type: 'text',
      admin: {
        description: 'License metadata',
        condition: () => false,
      },
    },
    {
      name: 'sizes_hero_url',
      type: 'text',
      admin: {
        description: 'Hero size URL',
        condition: () => false,
      },
    },
    {
      name: 'sizes_hero_width',
      type: 'number',
      admin: {
        description: 'Hero size width',
        condition: () => false,
      },
    },
    {
      name: 'sizes_hero_height',
      type: 'number',
      admin: {
        description: 'Hero size height',
        condition: () => false,
      },
    },
    {
      name: 'sizes_hero_mime_type',
      type: 'text',
      admin: {
        description: 'Hero size MIME type',
        condition: () => false,
      },
    },
    {
      name: 'sizes_hero_filesize',
      type: 'number',
      admin: {
        description: 'Hero size file size',
        condition: () => false,
      },
    },
    {
      name: 'sizes_hero_filename',
      type: 'text',
      admin: {
        description: 'Hero size filename',
        condition: () => false,
      },
    },
  ],
  upload: {
    // Fallback to filesystem for development when no cloud storage is configured
    staticDir: 'public/media',
    adminThumbnail: 'url',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
