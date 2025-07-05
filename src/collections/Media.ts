import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access for frontend
    create: ({ req: { user } }) => !!user, // Only logged-in users can upload
    update: ({ req: { user } }) => !!user, // Only logged-in users can update
    delete: ({ req: { user } }) => !!user, // Only logged-in users can delete
  },
  upload: {
    // Local file storage (will be replaced with Vercel Blob Storage later)
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'medium',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1200,
        height: 900,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
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
      type: 'text',
      admin: {
        description: 'Caption for the image',
      },
    },
  ],
  timestamps: true,
} 