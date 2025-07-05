# Vercel Deployment Guide

This guide will help you deploy your KOTO CMS to Vercel with PostgreSQL and Blob Storage.

## 🚀 Quick Deploy (Recommended)

The fastest way to get started is using the official Payload template:

1. **Click Deploy**: Visit the [Payload Website Starter](https://vercel.com/templates/next.js/payload-website-starter) on Vercel
2. **Connect GitHub**: Connect your GitHub account and create a new repository
3. **Add Services**: Vercel will prompt you to add required services
4. **Deploy**: Your app will be built and deployed automatically

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Clone your repository
git clone your-repo-url
cd KOTO-CMS

# Install dependencies
npm install

# Build the project locally (optional test)
npm run build
```

### 2. Connect to Vercel

**Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: GitHub Integration**
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure as shown below

### 3. Add Required Services

Vercel will prompt you to add these services:

#### 🗄️ Neon Database (PostgreSQL)
- Click "Add" next to Neon Database
- This creates a PostgreSQL database for your CMS
- Connection string will be automatically added to your environment

#### 📁 Vercel Blob Storage
- Click "Add" next to Vercel Blob Storage
- This handles file uploads and media storage
- Blob token will be automatically added to your environment

### 4. Set Environment Variables

In your Vercel dashboard, add these environment variables:

```env
# Required - Add these manually
PAYLOAD_SECRET=your-super-secret-key-here
CRON_SECRET=your-cron-secret-here
PREVIEW_SECRET=your-preview-secret-here

# Optional - Frontend URL if you have a separate frontend
FRONTEND_URL=https://your-frontend-url.vercel.app

# Automatic - These are set by Vercel services
POSTGRES_URL=postgres://...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

### 5. Deploy

Click "Deploy" and Vercel will:
- Build your project
- Set up the database
- Configure blob storage
- Deploy to a global CDN

## 🔧 Configuration Details

### Database Configuration

Your `src/payload.config.ts` uses:
```typescript
db: vercelPostgresAdapter({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
}),
```

### Storage Configuration

Media uploads are handled by:
```typescript
plugins: [
  vercelBlobStorage({
    enabled: true,
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
],
```

## 📊 After Deployment

### 1. Access Your Admin Panel
- Visit `https://your-app-url.vercel.app/admin`
- Create your first admin user
- Start adding blog content!

### 2. Test Your API
- Blog API: `https://your-app-url.vercel.app/api/blogs`
- Media API: `https://your-app-url.vercel.app/api/media`
- Admin API: `https://your-app-url.vercel.app/api/users`

### 3. Connect Your Frontend
```javascript
// Example: Fetching blog posts
const fetchBlogs = async () => {
  const response = await fetch('https://your-app-url.vercel.app/api/blogs');
  const data = await response.json();
  return data.docs;
};
```

## 🛠️ Local Development with Production Database

To develop locally using your production database:

1. **Get Database URL**:
   - Go to your Vercel dashboard
   - Navigate to your project → Settings → Environment Variables
   - Copy the `POSTGRES_URL` value

2. **Update Local Environment**:
   ```env
   # .env
   POSTGRES_URL=your-production-database-url
   BLOB_READ_WRITE_TOKEN=your-production-blob-token
   PAYLOAD_SECRET=your-production-secret
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🔍 Troubleshooting

### Common Issues

**Build Errors**:
- Check that all environment variables are set
- Ensure `PAYLOAD_SECRET` is a strong, random string
- Verify database connection string is correct

**Database Issues**:
- Make sure Neon Database is connected in Vercel
- Check that `POSTGRES_URL` is available in environment
- Verify database has proper permissions

**Storage Issues**:
- Ensure Vercel Blob Storage is enabled
- Check `BLOB_READ_WRITE_TOKEN` is set
- Verify blob storage permissions

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View logs
vercel logs

# Redeploy
vercel --prod --force
```

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Database connection is working
- [ ] Blob storage is configured
- [ ] Admin user is created
- [ ] Sample content is added
- [ ] API endpoints are responding
- [ ] Frontend integration is tested
- [ ] Domain is configured (if custom)

## 📈 Performance Optimization

### Database
- Neon provides automatic connection pooling
- Queries are optimized for PostgreSQL
- Automatic backups included

### Storage
- Images are automatically optimized
- Global CDN delivery
- WebP conversion when supported

### Deployment
- Automatic scaling based on traffic
- Edge functions for fast response
- Preview deployments for testing

## 🆘 Support

If you encounter issues:

1. **Check Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Payload CMS Docs**: [payloadcms.com/docs](https://payloadcms.com/docs)
3. **Community**: Join the Payload Discord
4. **GitHub Issues**: Report bugs on the project repository

## 🔄 Updates and Maintenance

### Automatic Updates
- Dependencies: Use Renovate or Dependabot
- Database: Neon handles maintenance
- Storage: Vercel manages automatically

### Manual Updates
```bash
# Update dependencies
npm update

# Rebuild and deploy
npm run build
vercel --prod
```

Your KOTO CMS is now ready for production on Vercel! 🎉 