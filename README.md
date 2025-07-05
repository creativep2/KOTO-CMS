# KOTO CMS - Blog Content Management System

A Payload CMS project for managing blog content with a clean, modern interface. This CMS is designed to power your blog frontend with a robust API and intuitive admin panel.

## Features

- **Blog Management**: Create, edit, and manage blog posts with rich text content
- **Media Management**: Upload and manage images with automatic resizing via Vercel Blob Storage
- **User Authentication**: Secure user management with role-based access
- **Categories**: Organize blog posts with predefined categories
- **SEO Friendly**: Built-in slug generation and meta descriptions
- **Featured Posts**: Mark important posts as featured
- **Rich Text Editor**: Lexical editor for creating rich content
- **API Ready**: RESTful API for frontend integration
- **Vercel Optimized**: Ready for deployment on Vercel with PostgreSQL and Blob Storage
- **Scalable Storage**: Automatic image optimization and CDN delivery

## Blog Content Model

Each blog post includes the following fields:

- **ID**: Auto-generated unique identifier
- **Title**: Blog post title
- **Category**: Categorization (Technology, Design, Business, etc.)
- **Header Image**: Featured image for the blog post
- **Paragraph**: Rich text content (main blog content)
- **Upload Date**: Date when the post was created/uploaded
- **Slug**: URL-friendly identifier (auto-generated from title)
- **Meta Description**: SEO description
- **Featured**: Mark as featured post

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local installation or cloud provider like Neon)
- **Vercel account** (for deployment and Blob Storage)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd KOTO-CMS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   # Database (Vercel Postgres)
   POSTGRES_URL=your-postgres-connection-string-here
   DATABASE_URL=your-postgres-connection-string-here
   
   # Payload
   PAYLOAD_SECRET=your-secure-secret-key-here
   PAYLOAD_CONFIG_PATH=src/payload.config.ts
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Admin
   PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
   
   # Vercel-specific (for cron jobs and preview)
   CRON_SECRET=your-cron-secret-here
   PREVIEW_SECRET=your-preview-secret-here
   
   # Frontend (optional)
   FRONTEND_URL=http://localhost:3001
   ```

4. **Generate TypeScript types**:
   ```bash
   npm run generate:types
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

## First Setup

1. **Create your first admin user**:
   - Navigate to http://localhost:3000/admin
   - Fill in the user registration form
   - This will be your admin account

2. **Start creating content**:
   - Go to the "Blogs" collection to create your first blog post
   - Upload images in the "Media" collection
   - Manage users in the "Users" collection

## API Endpoints

Your frontend can connect to these endpoints:

### Blog Posts
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get a specific blog post
- `GET /api/blogs?category=technology` - Get posts by category
- `GET /api/blogs?featured=true` - Get featured posts

### Media
- `GET /api/media` - Get all media files
- `GET /api/media/:id` - Get a specific media file

### Example API Response
```json
{
  "docs": [
    {
      "id": "64f5a2b3c1d2e3f4g5h6i7j8",
      "title": "Getting Started with Payload CMS",
      "category": "technology",
      "header_image": {
        "url": "/media/header-image.jpg",
        "alt": "Header image"
      },
      "paragraph": "Rich text content here...",
      "upload_date": "2024-01-15T10:30:00.000Z",
      "slug": "getting-started-with-payload-cms",
      "featured": true
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "page": 1
}
```

## Frontend Integration

To connect your frontend application:

1. **Install axios or fetch** for API calls
2. **Use the API endpoints** listed above
3. **Handle authentication** if needed for protected routes

Example frontend code:
```javascript
// Fetch all blog posts
const fetchBlogs = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/blogs');
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};

// Fetch a specific blog post
const fetchBlog = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/blogs/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
};
```

## Vercel Deployment

This project is optimized for deployment on Vercel with PostgreSQL and Blob Storage.

### One-Click Deployment

1. **Deploy to Vercel**:
   - Click the "Deploy" button in the [official Payload template](https://vercel.com/templates/next.js/payload-website-starter)
   - Or connect your GitHub repository to Vercel

2. **Add Required Services**:
   - **Neon Database**: Add PostgreSQL database integration
   - **Vercel Blob Storage**: Add for file uploads and media storage

3. **Set Environment Variables**:
   ```bash
   POSTGRES_URL=your-neon-database-url
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   PAYLOAD_SECRET=your-secure-random-string
   CRON_SECRET=your-cron-secret
   PREVIEW_SECRET=your-preview-secret
   ```

4. **Deploy**:
   - Vercel will automatically build and deploy your project
   - Visit your app at the generated URL
   - Access admin panel at `your-app-url/admin`

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

## Local Development with Production Database

If you want to use your production Vercel database locally:

1. **Get connection string** from your Vercel dashboard
2. **Add to `.env`**:
   ```env
   POSTGRES_URL=your-production-database-url
   DATABASE_URL=your-production-database-url
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

## Production Deployment (Non-Vercel)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run start
   ```

3. **Environment variables**: Make sure to set production values in your `.env` file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Start production server
- `npm run generate:types` - Generate TypeScript types
- `npm run generate:graphQLSchema` - Generate GraphQL schema

## Folder Structure

```
src/
├── collections/
│   ├── Blogs.ts         # Blog posts collection
│   ├── Media.ts         # Media uploads collection
│   └── Users.ts         # User authentication collection
├── payload.config.ts    # Main Payload configuration
└── server.ts           # Express server setup
```

## Vercel Stack Benefits

### Database: PostgreSQL (Neon)
- **Faster queries**: PostgreSQL is optimized for complex queries
- **Better performance**: Lower latency than MongoDB for most operations
- **ACID compliance**: Reliable transactions and data consistency
- **Automatic backups**: Built-in backup and recovery with Neon

### Storage: Vercel Blob Storage
- **Global CDN**: Images served from edge locations worldwide
- **Automatic optimization**: Images are automatically optimized and resized
- **Cost-effective**: Pay only for what you use
- **Seamless integration**: Works perfectly with Vercel deployment

### Deployment: Vercel Platform
- **Zero configuration**: Deploy with one click
- **Automatic scaling**: Handles traffic spikes automatically
- **Edge functions**: Fast response times globally
- **Preview deployments**: Test changes before going live

## Support

For issues and questions:
1. Check the [Payload CMS documentation](https://payloadcms.com/docs)
2. Review the [Vercel Payload template](https://vercel.com/templates/next.js/payload-website-starter)
3. Review the configuration files
4. Ensure your environment variables are correctly set

## License

This project is licensed under the MIT License. 