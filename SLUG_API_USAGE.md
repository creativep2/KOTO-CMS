# Blog Slug-Based API Usage

## Overview

Blog posts can now be retrieved using their slug instead of ID. This provides SEO-friendly URLs and better user experience.

## API Endpoints

### Fetch Blog by Slug
- **URL**: `/api/blogs/slug/{slug}`
- **Method**: `GET`
- **Parameters**:
  - `slug` (required): The URL-friendly slug of the blog post
  - `depth` (optional): Query parameter to control relationship depth (default: 0)

### Example Requests

#### Basic Request
```
GET /api/blogs/slug/koto-trainees-journey-of-discovery-and-compassion-to-mai-chau
```

#### With Depth Parameter
```
GET /api/blogs/slug/koto-trainees-journey-of-discovery-and-compassion-to-mai-chau?depth=1
```

### Example Response
```json
{
  "id": 14,
  "title": "KOTO Trainees and an Inspiring Journey of Discovery and Compassion to Mai Chau",
  "slug": "koto-trainees-journey-of-discovery-and-compassion-to-mai-chau",
  "meta": {
    "title": "KOTO Trainees & an Inspiring Journey of Discovery and Compassion to Mai Chau",
    "description": "On September 16th and 17th, 2024, KOTO trainees..."
  },
  "meta_description": "On September 16th and 17th, 2024, KOTO trainees...",
  "status": "published",
  "publishedAt": "2024-09-26T17:00:00.000Z",
  "createdAt": "2025-07-27T12:36:18.949Z",
  "updatedAt": "2025-07-27T12:36:19.061Z"
}
```

## Usage in Frontend Applications

### Webstudio Integration
Update your dynamic blog URLs from:
```
https://koto-cms.vercel.app/api/blogs/"+system.params.id
```

To:
```
https://koto-cms.vercel.app/api/blogs/slug/"+system.params.slug
```

### JavaScript/TypeScript Example
```javascript
// Fetch blog by slug
async function fetchBlogBySlug(slug) {
  try {
    const response = await fetch(`/api/blogs/slug/${slug}?depth=1`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Blog post not found');
      }
      throw new Error('Failed to fetch blog post');
    }
    
    const blog = await response.json();
    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
}

// Usage
fetchBlogBySlug('koto-trainees-journey-of-discovery-and-compassion-to-mai-chau')
  .then(blog => {
    console.log('Blog title:', blog.title);
    console.log('SEO description:', blog.meta_description);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## SEO Benefits

### Path Structure
Your blog URLs can now follow this SEO-friendly pattern:
- Path: `/blog/{slug}`
- Title: Automatically populated from `blog.title`
- Description: Automatically populated from `blog.meta_description`

### Meta Tags Integration
```html
<title>{blog.meta.title || blog.title}</title>
<meta name="description" content="{blog.meta_description}" />
```

## Slug Generation

### Automatic Generation
- Slugs are automatically generated from the blog title
- Special characters are removed
- Spaces are converted to hyphens
- Text is converted to lowercase

### Manual Editing
- Content creators can manually edit slugs in the CMS
- Slugs are enforced to be unique across all blog posts
- Real-time validation prevents duplicate slugs

### Example Transformations
| Title | Generated Slug |
|-------|---------------|
| "KOTO Trainees Journey" | `koto-trainees-journey` |
| "UNESCO - UNEVOC honors KOTO" | `unesco-unevoc-honors-koto` |
| "Jimmy's Letters: New Chapter!" | `jimmys-letters-new-chapter` |

## Error Handling

### Common Error Responses

#### Blog Not Found (404)
```json
{
  "error": "Blog post not found"
}
```

#### Invalid Slug (400)
```json
{
  "error": "Slug is required"
}
```

#### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Migration Guide

If you're currently using ID-based blog fetching, follow these steps:

1. **Update API Calls**: Replace `/api/blogs/{id}` with `/api/blogs/slug/{slug}`
2. **Update URL Parameters**: Change from `system.params.id` to `system.params.slug`
3. **Update Routing**: Ensure your frontend routes use slugs instead of IDs
4. **Test Thoroughly**: Verify all blog links work with the new slug-based system

## Notes

- All existing blogs will have slugs auto-generated from their titles
- Slugs are unique and indexed for optimal query performance
- The old ID-based API (`/api/blogs/{id}`) continues to work for backward compatibility
- New blogs will automatically generate slugs when created 