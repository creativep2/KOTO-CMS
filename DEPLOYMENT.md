# Vercel Deployment Guide

## Fixing 404 Error on Vercel

If you're getting a 404 error when accessing `/admin` on your deployed Vercel app, follow these steps:

### Step 1: Configure Environment Variables

Go to your Vercel project dashboard and add these environment variables:

#### Required Variables:
- `POSTGRES_URL` - Your PostgreSQL connection string (from Supabase)
- `PAYLOAD_SECRET` - A secure secret key (generate a random 32+ character string)
- `NEXT_PUBLIC_SERVER_URL` - Your Vercel app URL (e.g., `https://koto-cms.vercel.app`)

#### Optional Variables:
- `CRON_SECRET` - For scheduled jobs (generate a random string)
- `BLOB_READ_WRITE_TOKEN` - If using Vercel Blob Storage for file uploads

### Step 2: Database Connection

Make sure your `POSTGRES_URL` is correctly formatted:
```postgresql://user:password@host:port/database?sslmode=require
```

### Step 3: Redeploy

After adding all environment variables, redeploy your app:
1. Go to your Vercel dashboard
2. Click "Redeploy" on your latest deployment
3. Wait for the build to complete

### Step 4: Access Admin Panel

Once redeployed, you should be able to access:
- Admin Panel: `https://your-app.vercel.app/admin`
- API Endpoints: `https://your-app.vercel.app/api/blogs`

### Common Issues:

1. **Database Connection Error**: Verify your `POSTGRES_URL` is correct
2. **Build Fails**: Check that all dependencies are properly installed
3. **Still 404**: Ensure the `vercel.json` file is in your project root

### Environment Variables Template:

```bash
# Copy these to your Vercel project settings
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require
PAYLOAD_SECRET=your_very_secure_secret_key_here
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
CRON_SECRET=your_cron_secret_here
```

### Verification Steps:

1. Check build logs in Vercel for any errors
2. Verify database connection works
3. Test API endpoints: `/api/blogs`, `/api/media`, `/api/users`
4. Access admin panel: `/admin`

### Package Manager Issues:

If you encounter pnpm version compatibility issues (like "ERR_PNPM_UNSUPPORTED_ENGINE"), the project has been configured to use npm instead of pnpm for Vercel deployments. This is handled automatically by the vercel.json configuration.

### Build Configuration:

The project is configured to use npm for Vercel deployments:
- `installCommand`: `npm install`
- `buildCommand`: `npm run build`
- `devCommand`: `npm run dev`

If you continue experiencing issues, check the Vercel function logs for specific error messages. 