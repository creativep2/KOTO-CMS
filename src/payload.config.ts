import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'

// Import collections
import { Blogs } from './collections/Blogs'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

export default buildConfig({
  // Database adapter
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    },
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // Collections
  collections: [
    Blogs,
    Media,
    Users,
  ],

  // Globals (site-wide settings)
  globals: [
    // Add global settings here if needed
  ],

  // Admin configuration
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - KOTO CMS',
    },
  },

  // Server configuration
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  // Security
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  // CORS configuration
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:3000',
  ],

  // File upload configuration
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  // Storage plugins
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})