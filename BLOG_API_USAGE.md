# Blog API Usage Guide

This document explains how to use the new blog API endpoints that sort blogs by published date with the latest first.

## Available Endpoints

### 1. List All Blogs (Sorted by Published Date)
**Endpoint:** `GET /api/blogs`

**Description:** Returns a paginated list of blogs sorted by published date (latest first).

**Query Parameters:**
- `limit` (optional): Number of blogs per page (default: 10)
- `page` (optional): Page number (default: 1)
- `depth` (optional): Depth of populated relationships (default: 0)
- `status` (optional): Filter by status (default: 'published')
- `category` (optional): Filter by category
- `featured` (optional): Filter by featured status ('true' or 'false')

**Example Usage:**
```bash
# Get latest 10 published blogs
GET /api/blogs

# Get latest 5 blogs with populated author and header_image
GET /api/blogs?limit=5&depth=1

# Get latest blogs from a specific category
GET /api/blogs?category=taste-the-story&limit=10

# Get only featured blogs
GET /api/blogs?featured=true

# Get blogs with pagination
GET /api/blogs?page=2&limit=5
```

**Response Format:**
```json
{
  "docs": [
    {
      "id": "blog-id",
      "title": "Blog Title",
      "slug": "blog-slug",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "category": "taste-the-story",
      "featured": true,
      "author": {
        "id": "user-id",
        "name": "Author Name"
      },
      "header_image": {
        "id": "media-id",
        "url": "https://example.com/image.jpg"
      }
    }
  ],
  "totalDocs": 25,
  "totalPages": 3,
  "page": 1,
  "prevPage": null,
  "nextPage": 2,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

### 2. Get Latest Blogs
**Endpoint:** `GET /api/blogs/latest`

**Description:** Returns the most recent published blogs (optimized for getting latest content).

**Query Parameters:**
- `limit` (optional): Number of blogs to return (default: 5)
- `depth` (optional): Depth of populated relationships (default: 1)
- `category` (optional): Filter by category
- `featured` (optional): Filter by featured status ('true' or 'false')
- `excludeId` (optional): Exclude a specific blog ID (useful for related posts)

**Example Usage:**
```bash
# Get 5 latest published blogs
GET /api/blogs/latest

# Get 3 latest blogs from a specific category
GET /api/blogs/latest?limit=3&category=behind-the-bar

# Get latest blogs excluding current blog (for related posts)
GET /api/blogs/latest?excludeId=current-blog-id&limit=3

# Get latest featured blogs
GET /api/blogs/latest?featured=true&limit=10
```

**Response Format:**
```json
{
  "docs": [
    {
      "id": "blog-id",
      "title": "Blog Title",
      "slug": "blog-slug",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "category": "taste-the-story",
      "featured": true,
      "author": {
        "id": "user-id",
        "name": "Author Name"
      },
      "header_image": {
        "id": "media-id",
        "url": "https://example.com/image.jpg"
      }
    }
  ],
  "totalDocs": 5
}
```

### 3. Get Blog by Slug
**Endpoint:** `GET /api/blogs/slug/[slug]`

**Description:** Returns a specific blog post by its slug.

**Example Usage:**
```bash
GET /api/blogs/slug/my-blog-post-slug?depth=1
```

## Available Categories

The following categories are available for filtering:

- `taste-the-story` - Taste the story
- `jimmys-letters` - Jimmy's letters
- `jimmys-bio` - Jimmy's bio
- `behind-the-bar` - Behind the bar
- `her-turn` - Her turn
- `koto-foundation` - KOTO Foundation

## JavaScript/TypeScript Examples

### Using fetch API
```javascript
// Get latest blogs
const getLatestBlogs = async () => {
  const response = await fetch('/api/blogs/latest?limit=5&depth=1');
  const data = await response.json();
  return data.docs;
};

// Get blogs with pagination
const getBlogsPage = async (page = 1, limit = 10) => {
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}&depth=1`);
  const data = await response.json();
  return data;
};

// Get blogs by category
const getBlogsByCategory = async (category) => {
  const response = await fetch(`/api/blogs?category=${category}&limit=10&depth=1`);
  const data = await response.json();
  return data.docs;
};
```

### Using React with useEffect
```jsx
import { useState, useEffect } from 'react';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs/latest?limit=10&depth=1');
        const data = await response.json();
        setBlogs(data.docs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>Published: {new Date(blog.publishedAt).toLocaleDateString()}</p>
          <p>Category: {blog.category}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing required parameters)
- `404` - Not Found (for slug endpoints)
- `500` - Internal Server Error

Error responses include an error message:
```json
{
  "error": "Error description"
}
```

## CORS Support

All endpoints include CORS headers and support preflight OPTIONS requests, making them suitable for cross-origin requests from frontend applications. 