# KOTO CMS - Content Management System

This is a custom Content Management System built with [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org) for KOTO, featuring a comprehensive admin panel, API-first architecture, and specialized content management capabilities.

## 🎯 Project Overview

KOTO CMS is designed for managing a restaurant/foundation website with the following core capabilities:

- **Content Management**: Blog posts, job listings, hero banners, and media
- **Form Management**: Contact, donation, booking, and in-kind support forms
- **User Management**: Role-based access control with admin, editor, author, and viewer roles
- **API-First Architecture**: RESTful APIs for frontend integration
- **CSV Export**: Comprehensive data export capabilities
- **Media Management**: Image and video handling with cloud storage support

## 🚀 Quick Start

### Prerequisites

- Node.js 18.20.2 or >=20.9.0
- PostgreSQL database (Vercel Postgres recommended)
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KOTO-CMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following required environment variables:
   ```env
   POSTGRES_URL=your_postgres_connection_string
   PAYLOAD_SECRET=your_payload_secret
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   BLOB_STORE_ID=your_vercel_blob_store_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the admin panel**
   - Open `http://localhost:3000/admin`
   - Create your first admin user
   - Start managing content!

## 📁 Project Structure

### Core Collections

#### Content Management
- **Blogs** (`/admin/blogs`) - Blog posts with categories, authors, and rich content
  - **Categories**: Taste the story, Jimmy's letters, Jimmy's bio, Behind the bar, Her turn, KOTO Foundation
  - **Features**: Rich text editor, image galleries, YouTube embeds, SEO fields, featured posts
  - **Status Workflow**: Draft → In Review → Published → Archived
  - **Access Control**: Authors can edit their own posts, editors can manage all

- **Job Posts** (`/admin/job-posts`) - Career opportunities and job listings
  - **Fields**: Title, location, summary, detailed description, header image
  - **Status**: Draft → Published
  - **API**: Public read access with filtering and pagination

- **Hero Banners** (`/admin/hero-banners`) - Homepage and landing page banners
  - **Features**: Title, tagline, description, call-to-action button, background image
  - **Status**: Active → Inactive → Draft
  - **Ordering**: Display order control for multiple banners

- **YouTube Embeds** (`/admin/youtube-embeds`) - Video content management
  - **Features**: Video ID validation, optional titles and descriptions
  - **Integration**: Auto-populated in blog rich text fields
  - **Validation**: YouTube video ID format checking

#### Forms & Submissions
- **Contact Forms** (`/admin/contact-forms`) - "Send us a message" submissions
  - **Fields**: Full name, email, message
  - **Status Workflow**: New → In Progress → Replied → Closed
  - **Security**: Field restrictions prevent unauthorized modifications

- **Donation Forms** (`/admin/donation-forms`) - "Support our cause" donations
  - **Fields**: Full name, email, donation amount, payment method, source tracking
  - **Status Workflow**: Pending → Processing → Completed → Failed → Refunded
  - **Tracking**: Transaction ID and internal notes for admins

- **Booking Forms** (`/admin/booking-forms`) - Restaurant reservation bookings
  - **Fields**: Full name, email, phone, nationality, restaurant, date/time, guests, special requests
  - **Status Workflow**: Pending → Confirmed → Seated → Completed → Cancelled → No Show
  - **Features**: Special occasion tracking, confirmation numbers

- **In-Kind Support Forms** (`/admin/in-kind-support-forms`) - Support offers
  - **Fields**: Full name, email, phone, delivery preference, message, item type, estimated value
  - **Status Workflow**: New → Contacted → Arranged → Completed → Declined
  - **Features**: Item categorization and value estimation

#### Media & Assets
- **Media** (`/admin/media`) - Images, videos, and file management
  - **Categories**: Blog images, profiles, marketing assets, documents, hero banners
  - **Features**: Alt text, captions, focal points, cloud storage integration
  - **Access Control**: Authors can upload, editors can manage all

- **Partners** (`/admin/partners`) - Partner organizations
  - **Categories**: Strategic, Key, Education, Tourism and Hospitality
  - **Features**: Logo upload, website links, descriptions, featured status
  - **SEO**: Auto-generated slugs for URL-friendly names

- **Merchandise** (`/admin/merchandise`) - Product catalog
  - **Features**: Product images, pricing in VND, availability status
  - **Organization**: Grouped by organization name
  - **Status**: Available → Out of stock → Discontinued

#### System
- **Users** (`/admin/users`) - User accounts and role management
  - **Roles**: Super Admin, Editor, Author, Viewer
  - **Features**: Active/inactive status, role-based permissions
  - **Security**: Only admins can create/delete users

## 📂 Folder Structure

```
KOTO-CMS/
├── 📁 src/                          # Main source code
│   ├── 📁 access/                   # Access control functions
│   │   ├── admins.ts               # Admin-only access
│   │   ├── authors.ts              # Author and above access
│   │   ├── editors.ts              # Editor and above access
│   │   ├── authenticated.ts        # Authenticated user access
│   │   ├── authenticatedOrPublished.ts # Published content access
│   │   ├── anyone.ts               # Public access
│   │   ├── fieldAccess.ts          # Field-level access control
│   │   └── formUpdateAccess.ts     # Form update restrictions
│   │
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 api/                  # API routes
│   │   │   ├── 📁 blogs/           # Blog API endpoints
│   │   │   │   ├── route.ts        # GET/POST blogs
│   │   │   │   ├── latest/         # Latest blogs
│   │   │   │   └── slug/[slug]/    # Blog by slug
│   │   │   ├── 📁 job-posts/       # Job posts API
│   │   │   │   ├── route.ts        # GET/POST job posts
│   │   │   │   ├── latest/         # Latest job posts
│   │   │   │   └── slug/[slug]/    # Job post by slug
│   │   │   ├── 📁 forms/           # Form submission APIs
│   │   │   │   ├── contact/        # Contact form
│   │   │   │   ├── donation/       # Donation form
│   │   │   │   ├── booking/        # Booking form
│   │   │   │   └── in-kind-support/ # In-kind support form
│   │   │   └── 📁 export/          # Export functionality
│   │   │       └── csv/            # CSV export API
│   │   │
│   │   ├── 📁 (payload)/           # Payload CMS integration
│   │   │   ├── 📁 admin/           # Admin panel pages
│   │   │   │   ├── export/         # Main export center
│   │   │   │   ├── csv/            # Simple CSV export
│   │   │   │   ├── forms-export/   # Advanced form export
│   │   │   │   ├── csv-export/     # CSV export dashboard
│   │   │   │   ├── media-library/  # Media management
│   │   │   │   └── [[...segments]]/ # Dynamic admin routes
│   │   │   ├── 📁 api/             # Payload API routes
│   │   │   │   ├── [...slug]/      # Dynamic API routes
│   │   │   │   ├── graphql/        # GraphQL endpoint
│   │   │   │   ├── graphql-playground/ # GraphQL playground
│   │   │   │   └── media/          # Media API
│   │   │   ├── layout.tsx          # Payload layout
│   │   │   └── custom.scss         # Admin panel styles
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   │
│   ├── 📁 collections/             # Payload collections
│   │   ├── 📁 Users/               # User collection
│   │   │   └── index.ts           # User configuration
│   │   ├── Blogs.ts               # Blog posts collection
│   │   ├── JobPosts.ts            # Job posts collection
│   │   ├── HeroBanner.ts          # Hero banners collection
│   │   ├── YouTubeEmbeds.ts       # YouTube embeds collection
│   │   ├── ContactForm.ts         # Contact forms collection
│   │   ├── DonationForm.ts        # Donation forms collection
│   │   ├── BookingForm.ts         # Booking forms collection
│   │   ├── InKindSupportForm.ts   # In-kind support forms
│   │   ├── Media.ts               # Media collection
│   │   ├── Partners.ts            # Partners collection
│   │   ├── Merchandise.ts         # Merchandise collection
│   │   └── Categories.ts          # Categories collection
│   │
│   ├── 📁 components/              # React components
│   │   ├── 📁 ui/                  # Reusable UI components
│   │   │   ├── button.tsx         # Button component
│   │   │   ├── card.tsx           # Card component
│   │   │   ├── input.tsx          # Input component
│   │   │   ├── label.tsx          # Label component
│   │   │   ├── pagination.tsx     # Pagination component
│   │   │   ├── select.tsx         # Select component
│   │   │   ├── tabs.tsx           # Tabs component
│   │   │   ├── textarea.tsx       # Textarea component
│   │   │   └── checkbox.tsx       # Checkbox component
│   │   │
│   │   ├── 📁 AdminCSVExport/     # CSV export components
│   │   ├── 📁 AdminDashboard/     # Admin dashboard components
│   │   ├── 📁 AdminExportButton/  # Export button components
│   │   ├── 📁 AdminNavigation/    # Admin navigation
│   │   ├── 📁 BeforeDashboard/    # Pre-dashboard components
│   │   ├── 📁 BeforeLogin/        # Pre-login components
│   │   ├── 📁 blocks/             # Content blocks
│   │   │   └── 📁 YouTubeBlock/   # YouTube block component
│   │   ├── 📁 BulkUpload/         # Bulk upload components
│   │   ├── 📁 Card/               # Card components
│   │   ├── 📁 CollectionExportButton/ # Collection export buttons
│   │   ├── 📁 CSVExport/          # CSV export components
│   │   ├── 📁 CSVExportButton/    # CSV export buttons
│   │   ├── 📁 CSVExportLink/      # CSV export links
│   │   ├── 📁 FloatingExportButton/ # Floating export button
│   │   ├── 📁 Gallery/            # Gallery components
│   │   ├── 📁 Link/               # Link components
│   │   ├── 📁 Logo/               # Logo components
│   │   ├── 📁 Media/              # Media components
│   │   │   ├── 📁 ImageMedia/     # Image media component
│   │   │   └── 📁 VideoMedia/     # Video media component
│   │   ├── 📁 MediaGrid/          # Media grid components
│   │   ├── 📁 RichText/           # Rich text components
│   │   ├── 📁 YouTube/            # YouTube components
│   │   └── 📁 YouTubeEmbed/       # YouTube embed components
│   │
│   ├── 📁 fields/                  # Custom field configurations
│   │   ├── 📁 slug/               # Slug field configuration
│   │   │   ├── index.ts           # Slug field setup
│   │   │   ├── index.scss         # Slug field styles
│   │   │   └── SlugComponent.tsx  # Slug component
│   │   ├── blogsLexical.ts        # Blog-specific Lexical editor
│   │   ├── defaultLexical.ts      # Default Lexical editor
│   │   ├── link.ts                # Link field configuration
│   │   └── linkGroup.ts           # Link group field
│   │
│   ├── 📁 hooks/                   # Custom hooks and utilities
│   │   ├── formatSlug.ts          # Slug formatting hook
│   │   ├── formFieldAccess.ts     # Form field access control
│   │   ├── populatePublishedAt.ts # Published date population
│   │   └── populateYouTubeEmbeds.ts # YouTube embed population
│   │
│   ├── 📁 migrations/              # Database migrations
│   │   └── index.ts               # Migration configuration
│   │
│   ├── 📁 plugins/                 # Payload plugins
│   │   └── index.ts               # Plugin configuration
│   │
│   ├── 📁 providers/               # React providers
│   │   ├── 📁 HeaderTheme/        # Header theme provider
│   │   ├── 📁 Theme/              # Theme provider
│   │   │   ├── 📁 InitTheme/      # Theme initialization
│   │   │   ├── 📁 ThemeSelector/  # Theme selector
│   │   │   └── shared.ts          # Shared theme utilities
│   │   └── index.tsx              # Provider configuration
│   │
│   ├── 📁 utilities/               # Utility functions
│   │   ├── canUseDOM.ts           # DOM availability check
│   │   ├── csvExport.ts           # CSV export utilities
│   │   ├── csvExport.test.ts      # CSV export tests
│   │   ├── deepMerge.ts           # Deep merge utility
│   │   ├── formatDateTime.ts      # Date/time formatting
│   │   ├── generateMeta.ts        # Meta tag generation
│   │   ├── getDocument.ts         # Document retrieval
│   │   ├── getGlobals.ts          # Global data retrieval
│   │   ├── getMediaUrl.ts         # Media URL generation
│   │   ├── getMeUser.ts           # Current user retrieval
│   │   ├── getURL.ts              # URL generation
│   │   ├── mergeOpenGraph.ts      # Open Graph merging
│   │   ├── toKebabCase.ts         # Kebab case conversion
│   │   ├── ui.ts                  # UI utilities
│   │   ├── useClickableCard.ts    # Clickable card hook
│   │   └── useDebounce.ts         # Debounce hook
│   │
│   ├── cssVariables.js            # CSS variables configuration
│   ├── environment.d.ts           # Environment type definitions
│   ├── payload-types.ts           # Generated Payload types
│   └── payload.config.ts          # Main Payload configuration
│
├── 📁 public/                      # Static assets
│   ├── 📁 css/                    # CSS files
│   │   └── admin-export.css       # Admin export styles
│   ├── 📁 js/                     # JavaScript files
│   │   ├── admin-export-button.js # Admin export button script
│   │   └── media-url-fix.js       # Media URL fix script
│   ├── 📁 media/                  # Media files
│   ├── csv-export.html            # Standalone CSV export page
│   ├── favicon.ico                # Favicon
│   ├── favicon.svg                # SVG favicon
│   ├── robots.txt                 # Robots file
│   ├── sitemap.xml                # Sitemap
│   └── website-template-OG.webp   # Open Graph image
│
├── 📁 tests/                       # Test files
│   ├── 📁 e2e/                    # End-to-end tests
│   │   └── frontend.e2e.spec.ts   # Frontend E2E tests
│   └── 📁 int/                    # Integration tests
│       └── api.int.spec.ts        # API integration tests
│
├── 📁 scraped-data/               # Scraped data (if any)
│   └── 📁 images/                 # Scraped images
│
├── 📁 scripts/                    # Build and utility scripts
├── 📁 test-results/               # Test results output
├── 📁 playwright-report/          # Playwright test reports
│
├── 📄 Configuration Files
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── .editorconfig                  # Editor configuration
├── .npmrc                         # NPM configuration
├── .prettierignore                # Prettier ignore rules
├── .prettierrc.json               # Prettier configuration
├── components.json                # shadcn/ui components config
├── docker-compose.yml             # Docker Compose configuration
├── Dockerfile                     # Docker configuration
├── eslint.config.mjs              # ESLint configuration
├── next-env.d.ts                  # Next.js environment types
├── next-sitemap.config.cjs        # Sitemap configuration
├── next.config.js                 # Next.js configuration
├── package.json                   # Package dependencies
├── playwright.config.ts           # Playwright configuration
├── postcss.config.js              # PostCSS configuration
├── redirects.js                   # Redirect configuration
├── tailwind.config.mjs            # Tailwind CSS configuration
├── test.env                       # Test environment variables
├── tsconfig.json                  # TypeScript configuration
├── vercel.json                    # Vercel deployment configuration
├── vitest.config.mts              # Vitest configuration
└── vitest.setup.ts                # Vitest setup
```

### 📋 Key Directory Purposes

#### **`src/access/`** - Access Control
- Contains role-based access control functions
- Defines who can read, create, update, delete content
- Implements field-level security restrictions

#### **`src/collections/`** - Content Models
- Defines all Payload CMS collections
- Contains field configurations and validation rules
- Implements business logic and relationships

#### **`src/components/`** - React Components
- Reusable UI components for admin panel
- Export functionality components
- Media and content display components

#### **`src/hooks/`** - Custom Hooks
- Form field access control hooks
- YouTube embed population logic
- Published date management

#### **`src/utilities/`** - Helper Functions
- CSV export functionality
- Media URL generation
- Date formatting and data processing

#### **`src/app/api/`** - API Endpoints
- RESTful API routes for frontend integration
- Form submission endpoints
- Data export APIs

#### **`src/app/(payload)/admin/`** - Admin Panel
- Custom admin panel pages
- Export interfaces and dashboards
- Media library management

#### **`public/`** - Static Assets
- CSS and JavaScript files
- Standalone export pages
- Media files and images

#### **`tests/`** - Testing
- End-to-end tests with Playwright
- Integration tests for API endpoints
- Unit tests for utilities

### 🔍 Finding What You Need

- **Looking for a collection?** → `src/collections/`
- **Need to modify access control?** → `src/access/`
- **Adding new API endpoints?** → `src/app/api/`
- **Creating admin components?** → `src/components/`
- **Adding utility functions?** → `src/utilities/`
- **Configuring Payload?** → `src/payload.config.ts`
- **Setting up tests?** → `tests/`
- **Adding static assets?** → `public/`

### API Endpoints

#### Content APIs
- `GET /api/blogs` - Fetch blog posts with filtering and pagination
  - **Query Parameters**: `category`, `status`, `featured`, `limit`, `page`, `depth`
  - **Response**: Paginated results with metadata
  - **Example**: `/api/blogs?category=taste-the-story&status=published&limit=5`

- `GET /api/blogs/latest` - Get latest blog posts
- `GET /api/blogs/slug/[slug]` - Get blog by slug
- `GET /api/job-posts` - Fetch job posts
- `GET /api/job-posts/latest` - Get latest job posts
- `GET /api/job-posts/slug/[slug]` - Get job post by slug

#### Form APIs
- `POST /api/forms/contact` - Submit contact form
  - **Validation**: Required fields, email format
  - **Security**: CORS enabled, field restrictions
  - **Response**: Success confirmation with submission ID

- `POST /api/forms/donation` - Submit donation form
- `POST /api/forms/booking` - Submit booking form
- `POST /api/forms/in-kind-support` - Submit in-kind support form

#### Export APIs
- `POST /api/export/csv` - Export form data to CSV
  - **Features**: Field selection, filtering, custom date formats
  - **Collections**: All form types supported
  - **Security**: Admin-only access

## 👥 User Roles & Access Control

### Role Hierarchy
1. **Super Admin** - Full system access, user management, all field modifications
2. **Editor** - Content management, form moderation, status updates
3. **Author** - Create and edit own content, limited field access
4. **Viewer** - Read-only access to admin panel

### Access Control Features
- **Blog Management**: Authors can create/edit their own posts, editors can manage all
- **Form Moderation**: Editors and admins can update form status and add notes
- **Field Restrictions**: Non-admin users can only modify status fields via hooks
- **Media Management**: Authors can upload, editors can manage all
- **API Access**: Public read access for content, authenticated access for forms

### Security Implementation
- **Field-Level Security**: `restrictFieldUpdates` hook prevents unauthorized modifications
- **Role-Based Validation**: Access control functions in `/src/access/`
- **Form Protection**: Read-only fields for non-admin users
- **API Validation**: Input validation and CORS protection

## 🎨 Admin Panel Features

### CSV Export System
Multiple interfaces for data export:

1. **Main Export Center** (`/admin/export`) - Beautiful UI with collection cards
   - Visual collection selection
   - Field mapping and filtering
   - Real-time preview

2. **Floating Action Button** - Quick access from any admin page
   - Download icon in bottom-right corner
   - One-click exports

3. **Advanced Export** (`/admin/forms-export`) - Filtering and field selection
   - Status-based filtering
   - Custom field selection
   - Date range filtering

4. **Simple Dashboard** (`/admin/csv`) - Quick export buttons
   - Collection-specific export cards
   - Basic filtering options

5. **Standalone Page** (`/csv-export.html`) - External access
   - No authentication required
   - Independent interface

### Form Management
- **Status Tracking**: Comprehensive workflows for each form type
- **Internal Notes**: Staff communication and follow-up tracking
- **Field Restrictions**: Prevents unauthorized field modifications via hooks
- **Validation**: Email format and required field validation
- **Audit Trail**: Timestamps and user tracking

### Content Features
- **Rich Text Editor**: Lexical editor with media embedding
- **YouTube Integration**: Auto-population of video embeds in blog content
- **Image Galleries**: Configurable layouts (grid, masonry, carousel)
- **SEO Integration**: Meta tags, titles, and URL generation
- **Media Management**: Image optimization, focal points, cloud storage
- **Publication Workflow**: Draft → Published states with review process

## 🔧 Technical Features

### Database & Storage
- **PostgreSQL**: Primary database with Vercel Postgres adapter
  - **Development**: Push mode for automatic schema updates
  - **Production**: Migration-based schema management
- **Cloud Storage**: Vercel Blob storage for media files
  - **Features**: Public access, cache control, no random suffixes
  - **Fallback**: Local filesystem for development
- **Supabase Support**: Alternative S3-compatible storage option

### Development Tools
- **TypeScript**: Full type safety with generated payload types
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Vitest**: Unit testing with React Testing Library
- **Playwright**: End-to-end testing
- **Cross-env**: Cross-platform environment variable handling

### Build & Deployment
- **Next.js 15**: App Router with API routes
- **Payload CMS 3.45**: Headless CMS with admin panel
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **Sharp**: Image processing and optimization

### Hooks & Utilities
- **YouTube Embed Population**: Auto-populates video content in rich text
- **Field Access Control**: Restricts field modifications based on user role
- **Published Date Population**: Automatic timestamp management
- **CSV Export Utilities**: Comprehensive data export functionality
- **Slug Generation**: URL-friendly field generation

## 📚 Additional Documentation

- [CSV Export Guide](./CSV_EXPORT_GUIDE.md) - Complete export functionality documentation
- [Admin Organization](./ADMIN_ORGANIZATION.md) - Admin panel structure and navigation
- [Form Integration Guide](./FORM_INTEGRATION_GUIDE.md) - How to integrate forms
- [Blog API Usage](./BLOG_API_USAGE.md) - Blog API endpoints and usage
- [Job Posts API Usage](./JOB_POSTS_API_USAGE.md) - Job posts API documentation
- [Roles and Permissions](./ROLES_AND_PERMISSIONS.md) - Detailed access control
- [Testing Guide](./TESTING_GUIDE.md) - Testing strategies and examples
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Storage Setup](./STORAGE_SETUP.md) - Media storage configuration

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
POSTGRES_URL=your_production_postgres_url
PAYLOAD_SECRET=your_production_secret
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
BLOB_STORE_ID=your_vercel_blob_store_id
NODE_ENV=production
CRON_SECRET=your_cron_secret_for_scheduled_tasks
```

### Build Commands
```bash
npm run build    # Build the application
npm run start    # Start production server
npm run generate:types  # Generate TypeScript types
npm run generate:importmap  # Generate import map for admin
```

## 🧪 Testing

```bash
npm run test        # Run all tests
npm run test:int    # Run integration tests
npm run test:e2e    # Run end-to-end tests
```

### Testing Strategy
- **Unit Tests**: Vitest with React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for full user workflows
- **Test Coverage**: Focus on critical business logic

## 🔄 Development Workflow

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit validation

### Database Management
- **Development**: Push mode for rapid iteration
- **Production**: Migration-based schema changes
- **Backup**: Regular database backups recommended

### Content Workflow
- **Draft System**: All content starts as drafts
- **Review Process**: In-review status for editorial workflow
- **Publication**: Editors control final publication
- **Archiving**: Old content can be archived

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed
5. Follow the established access control patterns
6. Use meaningful commit messages
7. Test thoroughly before submitting changes

## 📞 Support

For questions or issues:
- Check the documentation files in the project root
- Review the API usage guides
- Contact the development team
- Check the testing guide for troubleshooting

## 🔒 Security Considerations

- **Field-Level Security**: Hooks prevent unauthorized field modifications
- **Role-Based Access**: Granular permissions based on user roles
- **API Protection**: CORS and validation on all endpoints
- **Data Validation**: Input sanitization and format checking
- **Audit Logging**: User actions tracked for security monitoring

---

**Built with ❤️ using Payload CMS and Next.js**

*This documentation follows [Google's documentation best practices](https://google.github.io/styleguide/docguide/best_practices.html) and [Chromium's documentation guidelines](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/documentation_best_practices.md) for clarity and maintainability.*
