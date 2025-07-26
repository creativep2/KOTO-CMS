import type { CollectionConfig } from 'payload'
import { authors } from '../access/authors'
import { editors } from '../access/editors'

export const YouTubeEmbeds: CollectionConfig = {
  slug: 'youtube-embeds',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'videoId', 'createdAt'],
    description: 'Create YouTube embeds that can be inserted into blog posts',
  },
  access: {
    read: () => true, // Public read access for frontend
    create: authors, // Authors and above can create
    update: authors, // Authors and above can update
    delete: editors, // Only editors and admins can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title for this YouTube embed (for identification in the admin)',
      },
    },
    {
      name: 'videoId',
      type: 'text',
      required: true,
      admin: {
        description:
          'YouTube video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return 'Video ID is required'

        // Basic validation for YouTube video ID format
        const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/
        if (!youtubeIdRegex.test(value)) {
          return 'Please enter a valid YouTube video ID (11 characters)'
        }

        return true
      },
    },
    {
      name: 'videoTitle',
      type: 'text',
      admin: {
        description: 'Optional title to display above the video',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for internal use',
      },
    },
  ],
  timestamps: true,
}
