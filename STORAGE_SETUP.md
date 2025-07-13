# Cloud Storage Setup Guide

This guide explains how to configure cloud storage for your Payload CMS project to work in production deployments.

## Why Cloud Storage?

Filesystem storage (storing files in `public/media/`) works in development but doesn't work in production deployments because:
- Files are not persisted between deployments
- Serverless functions are stateless
- Files uploaded to one server instance won't be available on others

## Option 1: Vercel Blob Storage (Recommended)

### Prerequisites
- Vercel account
- Project deployed on Vercel

### Setup Steps

1. **Create a Vercel Blob Store**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → Create → Blob
   - Create a new Blob store
   - Note down the store name

2. **Get Your Credentials**
   - In your Blob store settings, find:
     - `BLOB_READ_WRITE_TOKEN`
     - `BLOB_STORE_ID`

3. **Add Environment Variables**
   
   **For Local Development** (`.env.local`):
   ```bash
   BLOB_READ_WRITE_TOKEN=your_token_here
   BLOB_STORE_ID=your_store_id_here
   ```

   **For Production** (Vercel Project Settings):
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add both variables with their values

4. **Deploy**
   - The configuration is already set up in your `payload.config.ts`
   - Deploy your project and test media uploads

### Benefits
- Seamless integration with Vercel
- Automatic CDN distribution
- Pay-as-you-use pricing
- Easy setup

## Option 2: Supabase Storage

### Prerequisites
- Supabase account
- Supabase project with Storage enabled

### Setup Steps

1. **Enable Storage in Supabase**
   - Go to your [Supabase Dashboard](https://app.supabase.com/)
   - Navigate to Storage
   - Create a new bucket called `media` (or your preferred name)
   - Set the bucket to public if you want direct access

2. **Get S3 Credentials**
   - In your Supabase project, go to Settings → API
   - Note down your `Project URL`
   - Go to Settings → Database → Connection string
   - For S3 compatibility, you'll need to create access keys:
     - Go to Settings → API → Service Role Key
     - Use this as your secret access key
     - For access key ID, use your project reference ID

3. **Add Environment Variables**
   
   **For Local Development** (`.env.local`):
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_service_role_key
   SUPABASE_BUCKET=media
   SUPABASE_ACCESS_KEY_ID=your_project_ref
   SUPABASE_SECRET_ACCESS_KEY=your_service_role_key
   SUPABASE_REGION=us-east-1
   ```

   **For Production** (Vercel Project Settings):
   - Add all the above environment variables

4. **Configure Bucket Policies**
   - In Supabase Storage, set up proper bucket policies
   - For public access, create a policy allowing SELECT and INSERT for authenticated users

### Benefits
- Full-featured storage with database integration
- More control over access policies
- Potentially lower costs for large volumes
- Real-time subscriptions available

## Configuration Details

The project automatically detects which storage provider to use based on environment variables:

1. **Supabase**: If `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are present
2. **Vercel Blob**: If `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID` are present
3. **Filesystem**: Falls back to local storage for development

## Removing the File Route Handler

Once you have cloud storage configured, you can remove the filesystem route handler:

```bash
rm -rf src/app/\(payload\)/api/media/file
```

And update your `vercel.json` to remove the rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/admin/:path*",
      "destination": "/admin/:path*"
    }
    // Remove the media file rewrite rule
  ]
}
```

## Testing

1. **Upload a file** through the Payload admin panel
2. **Check the database** - the file URL should point to your cloud storage
3. **Access the file** - the URL should serve the file directly from cloud storage

## Troubleshooting

### Vercel Blob Issues
- Ensure your tokens are correct and have proper permissions
- Check that your store ID matches exactly
- Verify environment variables are set in both local and production

### Supabase Issues
- Ensure your bucket exists and has proper policies
- Check that the S3 endpoint URL is correct
- Verify your service role key has storage permissions

### General Issues
- Check the Payload admin logs for error messages
- Ensure your environment variables are properly set
- Test with a small file first

## Security Considerations

- **Access Control**: By default, Payload's access control is preserved
- **Public Access**: Set `disablePayloadAccessControl: true` only if your files should be publicly accessible
- **Environment Variables**: Never commit credentials to version control
- **Bucket Policies**: Configure proper read/write permissions in your storage provider

## Cost Considerations

### Vercel Blob
- Pay per GB stored and transferred
- Included in Pro plans up to certain limits
- Good for small to medium applications

### Supabase
- Generous free tier
- Pay-as-you-use beyond free tier
- More cost-effective for larger applications

Choose based on your expected usage and integration needs. 