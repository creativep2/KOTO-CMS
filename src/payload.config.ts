import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { vercelBlobAdapter } from 'payload-cloud-storage-vercel-adapter'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadComponent, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Blogs } from './collections/Blogs'
import { BookingForm } from './collections/BookingForm'
import { ContactForm } from './collections/ContactForm'
import { DonationForm } from './collections/DonationForm'
import { HeroBanner } from './collections/HeroBanner'
import { InKindSupportForm } from './collections/InKindSupportForm'
import { JobPosts } from './collections/JobPosts'
import { Media } from './collections/Media'
import { Merchandise } from './collections/Merchandise'
import { Partners } from './collections/Partners'
import { Users } from './collections/Users'
import { YouTubeEmbeds } from './collections/YouTubeEmbeds'
// Website-specific globals removed for API-only usage
// import { Footer } from './Footer/config'
// import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
// Removed IframeTabs import due to compatibility issues with Payload v3.45.0

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Storage configuration based on environment
const getStoragePlugin = () => {
  // Use Supabase if configured
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    return s3Storage({
      collections: {
        [Media.slug]: {
          prefix: 'media',
        },
      },
      bucket: process.env.SUPABASE_BUCKET || 'media',
      config: {
        endpoint: `${process.env.SUPABASE_URL}/storage/v1/s3`,
        credentials: {
          accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY || '',
        },
        region: process.env.SUPABASE_REGION || 'us-east-1',
        forcePathStyle: true,
      },
    })
  }

  // Use Vercel Blob if configured
  if (process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_STORE_ID) {
    return cloudStoragePlugin({
      collections: {
        [Media.slug]: {
          adapter: vercelBlobAdapter({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            storeId: process.env.BLOB_STORE_ID,
            uploadOptions: {
              access: 'public',
              addRandomSuffix: false,
              cacheControlMaxAge: 31536000, // 1 year
            },
          }),
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
      },
    })
  }

  // Fallback to no storage plugin (filesystem) for development
  return null
}

const storagePlugin = getStoragePlugin()

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    // livePreview: {
    //   url: 'https://p-c45b6377-8b02-41be-80f7-28aebb5f9f8d.apps.webstudio.is/?authToken=d6c754b0-cefc-40e3-9d13-3e95dca5d4ea&mode=content',
    // },
    // Removed website-specific components and live preview for API-only usage
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    // Disable push mode to prevent automatic schema changes and data loss
    push: false,
  }),
  collections: [
    Blogs,
    BookingForm,
    ContactForm,
    DonationForm,
    HeroBanner,
    InKindSupportForm,
    JobPosts,
    Media,
    Merchandise,
    Partners,
    Users,
    YouTubeEmbeds,
  ],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Vietnamese',
        code: 'vi',
      },
    ],
    defaultLocale: 'en', // required
    fallback: true, // defaults to true
  },
  cors: '*', // Temporary wildcard for testing - replace with specific domains later
  // globals: [Header, Footer], // Removed for API-only usage
  plugins: [...plugins, ...(storagePlugin ? [storagePlugin] : [])],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
