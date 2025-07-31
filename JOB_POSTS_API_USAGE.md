# Job Posts API Usage Guide

This document explains how to use the new job posts API endpoints that sort job postings by published date with the latest first.

## Available Endpoints

### 1. List All Job Posts (Sorted by Published Date)
**Endpoint:** `GET /api/job-posts`

**Description:** Returns a paginated list of job posts sorted by published date (latest first).

**Query Parameters:**
- `limit` (optional): Number of job posts per page (default: 10)
- `page` (optional): Page number (default: 1)
- `depth` (optional): Depth of populated relationships (default: 0)
- `status` (optional): Filter by status (default: 'published')
- `location` (optional): Filter by location (partial match)

**Example Usage:**
```bash
# Get latest 10 published job posts
GET /api/job-posts

# Get latest 5 job posts with populated header_image
GET /api/job-posts?limit=5&depth=1

# Get latest job posts from a specific location
GET /api/job-posts?location=Remote&limit=10

# Get job posts with pagination
GET /api/job-posts?page=2&limit=5

# Get all job posts (including drafts)
GET /api/job-posts?status=draft
```

**Response Format:**
```json
{
  "docs": [
    {
      "id": "job-post-id",
      "title": "Software Engineer",
      "slug": "software-engineer",
      "location": "Remote",
      "summary": "We are looking for a talented software engineer...",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "status": "published",
      "header_image": {
        "id": "media-id",
        "url": "https://example.com/image.jpg"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
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

### 2. Get Latest Job Posts
**Endpoint:** `GET /api/job-posts/latest`

**Description:** Returns the most recent published job posts (optimized for getting latest opportunities).

**Query Parameters:**
- `limit` (optional): Number of job posts to return (default: 5)
- `depth` (optional): Depth of populated relationships (default: 1)
- `location` (optional): Filter by location (partial match)
- `excludeId` (optional): Exclude a specific job post ID (useful for related posts)

**Example Usage:**
```bash
# Get 5 latest published job posts
GET /api/job-posts/latest

# Get 3 latest job posts from a specific location
GET /api/job-posts/latest?limit=3&location=New York

# Get latest job posts excluding current job post (for related posts)
GET /api/job-posts/latest?excludeId=current-job-id&limit=3

# Get latest remote job posts
GET /api/job-posts/latest?location=Remote&limit=10
```

**Response Format:**
```json
{
  "docs": [
    {
      "id": "job-post-id",
      "title": "Software Engineer",
      "slug": "software-engineer",
      "location": "Remote",
      "summary": "We are looking for a talented software engineer...",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "status": "published",
      "header_image": {
        "id": "media-id",
        "url": "https://example.com/image.jpg"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalDocs": 5
}
```

### 3. Get Job Post by Slug
**Endpoint:** `GET /api/job-posts/slug/[slug]`

**Description:** Returns a specific job post by its slug.

**Example Usage:**
```bash
GET /api/job-posts/slug/software-engineer?depth=1
```

## Job Post Fields

Each job post includes the following fields:

- `id`: Unique identifier
- `title`: Job title
- `slug`: URL-friendly version of the title
- `location`: Job location (e.g., "Remote", "New York, NY", "London, UK")
- `summary`: Brief summary for job listing display
- `description`: Detailed job description with rich content
- `publishedAt`: Date when the job post was published
- `status`: Current status ('draft' or 'published')
- `header_image`: Header image for the job post
- `createdAt`: Date when the job post was created
- `updatedAt`: Date when the job post was last updated

## JavaScript/TypeScript Examples

### Using fetch API
```javascript
// Get latest job posts
const getLatestJobPosts = async () => {
  const response = await fetch('/api/job-posts/latest?limit=5&depth=1');
  const data = await response.json();
  return data.docs;
};

// Get job posts with pagination
const getJobPostsPage = async (page = 1, limit = 10) => {
  const response = await fetch(`/api/job-posts?page=${page}&limit=${limit}&depth=1`);
  const data = await response.json();
  return data;
};

// Get job posts by location
const getJobPostsByLocation = async (location) => {
  const response = await fetch(`/api/job-posts?location=${location}&limit=10&depth=1`);
  const data = await response.json();
  return data.docs;
};

// Get a specific job post by slug
const getJobPostBySlug = async (slug) => {
  const response = await fetch(`/api/job-posts/slug/${slug}?depth=1`);
  const data = await response.json();
  return data;
};
```

### Using React with useEffect
```jsx
import { useState, useEffect } from 'react';

function JobPostsList() {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch('/api/job-posts/latest?limit=10&depth=1');
        const data = await response.json();
        setJobPosts(data.docs);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {jobPosts.map(jobPost => (
        <div key={jobPost.id}>
          <h2>{jobPost.title}</h2>
          <p>Location: {jobPost.location}</p>
          <p>Published: {new Date(jobPost.publishedAt).toLocaleDateString()}</p>
          <p>{jobPost.summary}</p>
        </div>
      ))}
    </div>
  );
}
```

### Job Search Component Example
```jsx
import { useState, useEffect } from 'react';

function JobSearch() {
  const [jobPosts, setJobPosts] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const searchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      params.append('limit', '20');
      params.append('depth', '1');

      const response = await fetch(`/api/job-posts?${params}`);
      const data = await response.json();
      setJobPosts(data.docs);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={searchJobs} disabled={loading}>
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>

      <div>
        {jobPosts.map(jobPost => (
          <div key={jobPost.id}>
            <h3>{jobPost.title}</h3>
            <p>{jobPost.location}</p>
            <p>{jobPost.summary}</p>
          </div>
        ))}
      </div>
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

## Use Cases

These API endpoints are perfect for:

1. **Job Board Homepage**: Display latest job opportunities
2. **Job Search**: Filter jobs by location
3. **Related Jobs**: Show similar job postings
4. **Job Alerts**: Get the most recent job postings
5. **Career Page**: Showcase current openings
6. **Job RSS Feeds**: Provide latest job postings in RSS format 