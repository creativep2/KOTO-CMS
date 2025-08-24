# Hero Banners API Usage Guide

This document describes how to use the Hero Banners API endpoint for fetching hero banner content with ordering and filtering capabilities.

## Base URL

```
GET /api/hero-banners
```

## Query Parameters

### Pagination
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `depth` (optional): Depth of relationship population (default: 2)
  - Use `depth=2` to get complete image data including all sizes and metadata
  - Use `depth=1` for basic image information
  - Use `depth=0` for minimal data (image IDs only)

### Filtering
- `status` (optional): Filter by status (default: 'active')
  - Values: 'active', 'inactive', 'draft'
- `featured` (optional): Filter by featured status
  - Values: 'true', 'false'
- `locale` (optional): Language locale (default: 'en')
  - Values: 'en', 'vi', 'all'

### Sorting
- `sortBy` (optional): Field to sort by (default: 'order')
  - Values: 'order', 'createdAt', 'updatedAt'
- `sortOrder` (optional): Sort direction (default: 'asc')
  - Values: 'asc', 'desc'

## Examples

### Get all active hero banners ordered by order field (ascending) with complete image data
```
GET /api/hero-banners
```

### Get featured hero banners with custom pagination
```
GET /api/hero-banners?featured=true&page=1&limit=5
```

### Get hero banners ordered by order field in descending order
```
GET /api/hero-banners?sortBy=order&sortOrder=desc
```

### Get hero banners with custom sorting and filtering
```
GET /api/hero-banners?status=active&featured=true&sortBy=order&sortOrder=asc&limit=20&page=1
```

### Get hero banners in Vietnamese locale
```
GET /api/hero-banners?locale=vi&sortBy=order&sortOrder=asc
```

### Get hero banners with minimal image data (IDs only)
```
GET /api/hero-banners?depth=0
```

### Get hero banners with basic image information
```
GET /api/hero-banners?depth=1
```

### Get hero banners with complete image data (default)
```
GET /api/hero-banners?depth=2
```

## Response Format

The API returns a JSON response with the following structure:

```json
{
  "docs": [
    {
      "id": "string",
      "title": "string",
      "tagline": "string",
      "description": "string",
      "button": "string",
      "buttonLink": "string",
      "image": "object",
      "status": "string",
      "featured": "boolean",
      "order": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalDocs": "number",
  "totalPages": "number",
  "page": "number",
  "prevPage": "number | null",
  "nextPage": "number | null",
  "hasPrevPage": "boolean",
  "hasNextPage": "boolean"
}
```

## Image Data Population

The API automatically populates complete image data when using the default `depth=2`:

### Complete Image Fields Available:
- `id`: Unique identifier
- `alt`: Alternative text for accessibility
- `caption`: Rich text caption
- `url`: Original image URL
- `filename`: Original filename
- `mimeType`: File MIME type
- `filesize`: File size in bytes
- `width`: Original image width
- `height`: Original image height
- `sizes`: Generated image sizes (thumbnail, small, medium, large, xlarge, og)
- `focalPoint`: Focal point coordinates for cropping
- `category`: Media category
- `isPublic`: Public accessibility flag
- `uploadedBy`: User who uploaded the media
- `createdAt`: Upload timestamp
- `updatedAt`: Last update timestamp

### Image Sizes Available:
- `thumbnail`: 300px width
- `square`: 500x500px
- `small`: 600px width
- `medium`: 900px width
- `large`: 1400px width
- `xlarge`: 1920px width
- `og`: 1200x630px (Open Graph)

## Order Field Behavior

The `order` field is used to control the display sequence of hero banners:
- Lower numbers appear first (ascending order)
- Higher numbers appear last
- Default value is 0
- Can be set to any integer value

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request
- `500`: Internal server error

Error responses include an error message:
```json
{
  "error": "Error description"
}
```

## CORS Support

The API includes CORS headers and supports preflight OPTIONS requests for cross-origin access.

## Usage Notes

1. **Default Sorting**: By default, hero banners are sorted by the `order` field in ascending order
2. **Status Filtering**: Only active hero banners are returned by default
3. **Featured Filtering**: Use the `featured` parameter to get only featured hero banners
4. **Localization**: Use the `locale` parameter to get content in specific languages
5. **Pagination**: Use `page` and `limit` parameters for large datasets
6. **Relationship Depth**: Use `depth` parameter to control how deeply related fields are populated 